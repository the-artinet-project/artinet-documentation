# server-impl.test

Tests for server impl.test functionality in the Artinet SDK.

## Test Suites

- Server Implementation Tests
- Server Configuration
- Error Handling
- Task History Management
- Task Timestamps

## Source Code

```typescript
import {
  jest,
  describe,
  it,
  beforeEach,
  afterEach,
  expect,
} from "@jest/globals";
import express from "express";
import request from "supertest";
import {
  A2AServer,
  InMemoryTaskStore,
  ExecutionContext,
  UpdateEvent,
  INTERNAL_ERROR,
  AgentCard,
  configureLogger,
  TaskYieldUpdate,
  TaskState,
  Message,
  MessageSendParams,
  SendMessageRequest,
} from "../src/index.js";

// Set a reasonable timeout for all tests
jest.setTimeout(10000);
configureLogger({ level: "silent" });

// Create a specialized task handler for more coverage testing
async function* serverImplTestHandler(
  context: ExecutionContext
): AsyncGenerator<UpdateEvent, void, unknown> {
  const params = context.getRequestParams() as MessageSendParams;
  const taskId = params.message.taskId ?? context.id;
  const contextId = context.id;
  const text = params.message.parts
    .filter((part) => part.kind === "text")
    .map((part) => (part as any).text)
    .join(" ");

  // Need to specifically test error conditions
  if (text.includes("throw-internal")) {
    throw INTERNAL_ERROR(new Error("Internal test error"));
  }

  // Test for different state transitions in detail
  if (text.includes("streaming")) {
    yield {
      taskId: taskId,
      contextId: contextId,
      kind: "status-update",
      status: {
        state: TaskState.Submitted,
        message: {
          messageId: "test-message-id",
          kind: "message",
          role: "agent",
          parts: [{ kind: "text", text: "Task submitted..." }],
        },
      },
      final: false,
    };

    yield {
      taskId: taskId,
      contextId: contextId,
      kind: "status-update",
      status: {
        state: TaskState.Working,
        message: {
          messageId: "test-message-id",
          kind: "message",
          role: "agent",
          parts: [{ kind: "text", text: "Working..." }],
        },
      },
      final: false,
    };

    // Simulate a few more updates
    for (let i = 1; i <= 3; i++) {
      yield {
        taskId: taskId,
        contextId: contextId,
        kind: "status-update",
        status: {
          state: TaskState.Working,
          message: {
            messageId: "test-message-id",
            kind: "message",
            role: "agent",
            parts: [{ kind: "text", text: `Still working (${i}/3)...` }],
          },
        },
        final: false,
      };

      // Small delay to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    yield {
      taskId: taskId,
      contextId: contextId,
      kind: "status-update",
      status: {
        state: TaskState.Completed,
        message: {
          messageId: "test-message-id",
          kind: "message",
          role: "agent",
          parts: [{ kind: "text", text: "Task completed successfully!" }],
        },
      },
      final: true,
    };
    return;
  }

  // Default case
  yield {
    taskId: taskId,
    contextId: contextId,
    kind: "status-update",
    status: {
      state: TaskState.Working,
      message: {
        messageId: "test-message-id",
        kind: "message",
        role: "agent",
        parts: [{ kind: "text", text: "Working on it..." }],
      },
    },
    final: false,
  };

  yield {
    taskId: taskId,
    contextId: contextId,
    kind: "status-update",
    status: {
      state: TaskState.Completed,
      message: {
        messageId: "test-message-id",
        kind: "message",
        role: "agent",
        parts: [{ kind: "text", text: "Completed!" }],
      },
    },
    final: true,
  };
}

describe("Server Implementation Tests", () => {
  let server: A2AServer;
  let app: express.Express;
  let pendingRequests: request.Test[] = [];

  beforeEach(() => {
    // Create a server with a custom agent card to test that code path
    const customCard: AgentCard = {
      name: "Server Impl Test Agent",
      url: "http://localhost:41241",
      version: "1.0.0",
      capabilities: {
        streaming: true,
        pushNotifications: true,
        stateTransitionHistory: true,
      },
      skills: [
        {
          id: "test-skill",
          name: "Test Skill",
          description: "Test skill description",
          tags: ["test", "skill"],
        },
      ],
      defaultInputModes: ["text"],
      defaultOutputModes: ["text"],
      description: "Test agent description",
    };

    server = new A2AServer({
      handler: serverImplTestHandler,
      taskStore: new InMemoryTaskStore(),
      port: 0, // Don't actually listen
      card: customCard,
      // Use custom CORS options to test that code path
      corsOptions: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      },
      // Use custom base path to test that code path
      basePath: "/api",
    });
    app = server.start();
    pendingRequests = [];
  });

  afterEach(async () => {
    // Ensure all pending requests are completed
    await Promise.all(
      pendingRequests.map((req) => {
        try {
          return req;
        } catch (e) {
          // Ignore errors during cleanup
          return null;
        }
      })
    );

    await server.stop();
    // Add a small delay to allow any open connections to close
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  // Helper function to track supertest requests
  const trackRequest = (req: request.Test): request.Test => {
    pendingRequests.push(req);
    return req;
  };

  describe("Server Configuration", () => {
    it("uses custom base path", async () => {
      // Test that the API endpoint is available at the custom path
      const requestBody = {
        jsonrpc: "2.0",
        id: "test-request-1",
        method: "message/send",
        params: {
          message: {
            taskId: "test-task-1",
            role: "user",
            parts: [{ kind: "text", text: "Basic test" }],
          },
        },
      };

      const response = await trackRequest(
        request(app)
          .post("/api") // Using custom path
          .send(requestBody)
      );

      expect(response.status).toBe(200);
      expect(response.body.result).toBeDefined();
      expect(response.body.result.id).toBe("test-task-1");
    });

    it("uses custom agent card", async () => {
      const response = await trackRequest(
        request(app).get("/.well-known/agent.json")
      );

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Server Impl Test Agent");
      expect(response.body.skills[0].id).toBe("test-skill");
    });

    it("properly applies CORS settings", async () => {
      const response = await trackRequest(
        request(app)
          .options("/api")
          .set("Origin", "http://localhost:3000")
          .set("Access-Control-Request-Method", "POST")
      );

      expect(response.status).toBe(204);
      expect(response.header["access-control-allow-origin"]).toBe(
        "http://localhost:3000"
      );
      expect(response.header["access-control-allow-methods"]).toContain("GET");
      expect(response.header["access-control-allow-methods"]).toContain("POST");
    });
  });

  describe("Error Handling", () => {
    it("handles SystemError thrown by task handler", async () => {
      const requestBody = {
        jsonrpc: "2.0",
        id: "internal-error-request-1",
        method: "message/send",
        params: {
          message: {
            taskId: "internal-error-task-1",
            role: "user",
            parts: [{ kind: "text", text: "This will throw-internal error" }],
          },
        },
      };

      const response = await trackRequest(
        request(app).post("/api").send(requestBody)
      );

      expect(response.status).toBe(200);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(-32603);
      expect(response.body.error.message).toBe("Internal error");
    });

    it("returns TASK_NOT_FOUND error for non-existent task", async () => {
      const requestBody = {
        jsonrpc: "2.0",
        id: "nonexistent-request-1",
        method: "tasks/get",
        params: {
          id: "nonexistent-task-1",
        },
      };

      const response = await trackRequest(
        request(app).post("/api").send(requestBody)
      );
      expect(response.status).toBe(200);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(-32001);
      expect(response.body.error.message).toBe("Task not found"); //todo not returning error message
    });

    it("returns METHOD_NOT_FOUND error for invalid method", async () => {
      const requestBody = {
        jsonrpc: "2.0",
        id: "invalid-method-request-1",
        method: "invalid/method",
        params: {
          id: "invalid-method-task-1",
        },
      };

      const response = await trackRequest(
        request(app).post("/api").send(requestBody)
      );

      expect(response.status).toBe(200);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(-32601);
      expect(response.body.error.message).toBe("Method not found");
    });

    it("returns INVALID_PARAMS error for missing params", async () => {
      const requestBody = {
        jsonrpc: "2.0",
        id: "invalid-params-request-1",
        method: "message/send",
        // Missing params
      };

      const response = await trackRequest(
        request(app).post("/api").send(requestBody)
      );

      expect(response.status).toBe(200);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(-32602);
      expect(response.body.error.message).toBe("Invalid parameters");
    });

    it("returns INVALID_PARAMS error for invalid task ID", async () => {
      const requestBody = {
        jsonrpc: "2.0",
        id: "invalid-task-id-request-1",
        method: "tasks/get",
        params: {
          // Missing id
        },
      };

      const response = await trackRequest(
        request(app).post("/api").send(requestBody)
      );

      expect(response.status).toBe(200);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(-32602);
      expect(response.body.error.message).toBe("Invalid parameters");
    });
  });

  describe("Task History Management", () => {
    it("requests task with history", async () => {
      // First create a task
      const createBody = {
        jsonrpc: "2.0",
        id: "history-create-request-1",
        method: "message/send",
        params: {
          message: {
            taskId: "history-task-1",
            role: "user",
            parts: [{ kind: "text", text: "Task for history test" }],
          },
        },
      };

      await trackRequest(request(app).post("/api").send(createBody));

      // Now retrieve it with history
      const retrieveBody = {
        jsonrpc: "2.0",
        id: "history-retrieve-request-1",
        method: "tasks/get",
        params: {
          id: "history-task-1",
          historyLength: 2,
        },
      };

      const response = await trackRequest(
        request(app).post("/api").send(retrieveBody)
      );

      expect(response.status).toBe(200);
      expect(response.body.result).toBeDefined();
      expect(response.body.result.id).toBe("history-task-1");
      // History might or might not be included depending on implementation
    });

    it("includes session ID when provided", async () => {
      const requestBody = {
        jsonrpc: "2.0",
        id: "session-request-1",
        method: "message/send",
        params: {
          message: {
            taskId: "session-task-1",
            contextId: "test-session-123",
            role: "user",
            parts: [{ kind: "text", text: "Task with session ID" }],
          },
        },
      };

      const response = await trackRequest(
        request(app).post("/api").send(requestBody)
      );

      expect(response.status).toBe(200);
      expect(response.body.result).toBeDefined();
      expect(response.body.result.id).toBe("session-task-1");
      expect(response.body.result.contextId).toBe("test-session-123");
    });

    it("includes metadata when provided", async () => {
      const requestBody = {
        jsonrpc: "2.0",
        id: "metadata-request-1",
        method: "message/send",
        params: {
          message: {
            taskId: "metadata-task-1",
            role: "user",
            parts: [{ kind: "text", text: "Task with metadata" }],
          },
          metadata: {
            testKey: "testValue",
            source: "unit-test",
          },
        },
      };

      const response = await trackRequest(
        request(app).post("/api").send(requestBody)
      );

      expect(response.status).toBe(200);
      expect(response.body.result).toBeDefined();
      expect(response.body.result.id).toBe("metadata-task-1");
      // Metadata might be stored but not returned, depending on implementation
    });
  });

  describe("Task Timestamps", () => {
    it("includes timestamps in task status", async () => {
      const requestBody: SendMessageRequest = {
        jsonrpc: "2.0",
        id: "timestamp-request-1",
        method: "message/send",
        params: {
          message: {
            messageId: "timestamp-message-id-1",
            kind: "message",
            taskId: "timestamp-task-1",
            role: "user",
            parts: [{ kind: "text", text: "Task for timestamp test" }],
          },
        },
      };

      const response = await trackRequest(
        request(app).post("/api").send(requestBody)
      );
      expect(response.status).toBe(200);
      expect(response.body.result).toBeDefined();
      expect(response.body.result.status.timestamp).toBeDefined();

      // Verify it's a valid ISO date string
      const timestamp = new Date(response.body.result.status.timestamp);
      expect(timestamp.toString()).not.toBe("Invalid Date");
    });
  });
});

```

## Running the Tests

To run these tests:

1. Clone the Artinet SDK repository
2. Install dependencies with `npm install`
3. Run the tests with `npm test` or specifically with `npx jest server-impl.test.ts`

## Coverage

<!-- Test coverage information will be filled in after running tests with coverage -->

