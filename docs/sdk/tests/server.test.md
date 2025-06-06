# server.test

Tests for server.test functionality in the Artinet SDK.

## Test Suites

- A2AServer
- Agent Card
- tasks/send
- tasks/get
- tasks/cancel
- Method not found

## Source Code

```typescript
import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";
import {
  A2AServer,
  InMemoryTaskStore,
  TaskContext,
  TaskYieldUpdate,
  TaskStore,
  configureLogger,
} from "../src/index.js";

// Set a reasonable timeout for all tests
jest.setTimeout(10000);
configureLogger({ level: "silent" });

// Define test task handler
async function* basicTaskHandler(
  context: TaskContext
): AsyncGenerator<TaskYieldUpdate, void, unknown> {
  // Check if task already has status, if not, use "working"
  yield {
    state: "working",
    message: {
      role: "agent",
      parts: [{ type: "text", text: "Working on it..." }],
    },
  };

  // Simulate some work
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Check for cancellation
  if (context.isCancelled()) {
    yield { state: "canceled" };
    return;
  }

  // Generate a result artifact
  yield {
    name: "result.txt",
    parts: [
      { type: "text", text: `Task ${context.task.id} completed successfully.` },
    ],
  };

  // Final completion status
  yield {
    state: "completed",
    message: {
      role: "agent",
      parts: [{ type: "text", text: "Task completed successfully!" }],
    },
  };
}

describe("A2AServer", () => {
  let server: A2AServer;
  let app: express.Express;
  let taskStore: TaskStore;
  // Track any pending requests for cleanup
  let pendingRequests: request.Test[] = [];

  beforeEach(() => {
    taskStore = new InMemoryTaskStore();
    server = new A2AServer({
      handler: basicTaskHandler,
      taskStore,
      port: 0, // Don't actually listen
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

  describe("Agent Card", () => {
    it("serves agent card at /.well-known/agent.json", async () => {
      const response = await trackRequest(
        request(app).get("/.well-known/agent.json")
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("capabilities");
    });

    it("serves agent card at /agent-card", async () => {
      const response = await trackRequest(request(app).get("/agent-card"));
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("name");
      expect(response.body).toHaveProperty("capabilities");
    });
  });

  describe("tasks/send", () => {
    it("handles a valid task send request", async () => {
      const requestBody = {
        jsonrpc: "2.0",
        id: "test-request-1",
        method: "tasks/send",
        params: {
          id: "test-task-1",
          message: {
            role: "user",
            parts: [{ type: "text", text: "Hello, world!" }],
          },
        },
      };

      const response = await trackRequest(
        request(app).post("/").send(requestBody)
      );

      expect(response.status).toBe(200);
      expect(response.body.jsonrpc).toBe("2.0");
      expect(response.body.id).toBe("test-request-1");
      expect(response.body.result).toBeDefined();
      expect(response.body.result.id).toBe("test-task-1");
      expect(response.body.result.status.state).toBe("completed");
      expect(response.body.result.artifacts).toHaveLength(1);
      expect(response.body.result.artifacts[0].name).toBe("result.txt");
    });

    it("returns an error for invalid request format", async () => {
      const invalidRequest = {
        // Missing required jsonrpc field
        id: "invalid-req",
        method: "tasks/send",
        params: {
          id: "task-id",
          message: {
            role: "user",
            parts: [{ type: "text", text: "Test" }],
          },
        },
      };

      const response = await trackRequest(
        request(app).post("/").send(invalidRequest)
      );

      expect(response.status).toBe(200);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(-32600); // Invalid request error
      expect(response.body.error.message).toBe("Invalid request"); //todo expected "Request payload validation error" but may be caused by the jsonrpc middleware
    });

    it("returns an error for missing task ID", async () => {
      const requestWithoutId = {
        jsonrpc: "2.0",
        id: "missing-id-req",
        method: "tasks/send",
        params: {
          // Missing id field
          message: {
            role: "user",
            parts: [{ type: "text", text: "Test" }],
          },
        },
      };

      const response = await trackRequest(
        request(app).post("/").send(requestWithoutId)
      );

      expect(response.status).toBe(200);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(-32602);
      expect(response.body.error.message).toBe("Invalid parameters");
    });
  });

  describe("tasks/get", () => {
    it("retrieves a task after it has been created", async () => {
      // First create a task
      const createRequest = {
        jsonrpc: "2.0",
        id: "create-req",
        method: "tasks/send",
        params: {
          id: "retrieve-task",
          message: {
            role: "user",
            parts: [{ type: "text", text: "Task to retrieve" }],
          },
        },
      };

      await trackRequest(request(app).post("/").send(createRequest));

      // Now try to retrieve it
      const getRequest = {
        jsonrpc: "2.0",
        id: "get-req",
        method: "tasks/get",
        params: {
          id: "retrieve-task",
        },
      };

      const response = await trackRequest(
        request(app).post("/").send(getRequest)
      );

      expect(response.status).toBe(200);
      expect(response.body.result).toBeDefined();
      expect(response.body.result.id).toBe("retrieve-task");
      expect(response.body.result.status.state).toBe("completed");
    });

    it("returns an error for non-existent task", async () => {
      const getRequest = {
        jsonrpc: "2.0",
        id: "nonexistent-req",
        method: "tasks/get",
        params: {
          id: "nonexistent-task",
        },
      };

      const response = await trackRequest(
        request(app).post("/").send(getRequest)
      );

      expect(response.status).toBe(200);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(-32001);
      expect(response.body.error.message).toBe("Task not found");
    });
  });

  describe("tasks/cancel", () => {
    it("successfully cancels a task", async () => {
      // First create a task
      const createRequest = {
        jsonrpc: "2.0",
        id: "create-cancel-req",
        method: "tasks/send",
        params: {
          id: "cancel-task",
          message: {
            role: "user",
            parts: [{ type: "text", text: "Task to cancel" }],
          },
        },
      };

      await trackRequest(request(app).post("/").send(createRequest));

      // Now try to cancel it (note: the task may complete before cancellation in this test)
      const cancelRequest = {
        jsonrpc: "2.0",
        id: "cancel-req",
        method: "tasks/cancel",
        params: {
          id: "cancel-task",
        },
      };

      const response = await trackRequest(
        request(app).post("/").send(cancelRequest)
      );

      // It's possible the task completes before we can cancel it,
      // in which case we'll get a "task not cancelable" error,
      // but that's also a valid test result
      if (response.body.error) {
        expect(response.body.error.code).toBe(-32002);
        expect(response.body.error.message).toBe("Task cannot be canceled");
      } else {
        expect(response.status).toBe(200);
        expect(response.body.result).toBeDefined();
        expect(response.body.result.id).toBe("cancel-task");
        expect(response.body.result.status.state).toBe("canceled");
      }
    });
  });

  describe("Method not found", () => {
    it("returns a method not found error for unknown methods", async () => {
      const unknownMethodRequest = {
        jsonrpc: "2.0",
        id: "unknown-method-req",
        method: "unknown/method",
        params: {},
      };

      const response = await trackRequest(
        request(app).post("/").send(unknownMethodRequest)
      );

      expect(response.status).toBe(200);
      expect(response.body.error).toBeDefined();
      expect(response.body.error.code).toBe(-32601);
      expect(response.body.error.message).toBe("Method not found");
    });
  });
});

```

## Running the Tests

To run these tests:

1. Clone the Artinet SDK repository
2. Install dependencies with `npm install`
3. Run the tests with `npm test` or specifically with `npx jest server.test.ts`

## Coverage

<!-- Test coverage information will be filled in after running tests with coverage -->

