# SDK Examples

This page provides practical examples of using the Artinet SDK to create and interact with A2A-compliant agents. Each example demonstrates a key aspect of the SDK's functionality.

## Basic Agent Server

This example shows how to create a simple echo agent that responds with the text it receives.

```typescript
import {
  A2AServer,
  TaskContext,
  TaskHandler,
  InMemoryTaskStore,
} from "@artinet/sdk";

// Define the logic for your agent
const echoAgentLogic: TaskHandler = async function* (context: TaskContext) {
  // Extract text from the user's message
  const userInput =
    context.userMessage.parts[0]?.type === "text"
      ? context.userMessage.parts[0].text
      : "No text provided";

  // 1. Yield a 'working' state to indicate the task has started
  yield { state: "working" };

  // 2. Yield a 'completed' state with the agent's response
  yield {
    state: "completed",
    message: {
      role: "agent",
      parts: [{ type: "text", text: `Echo: ${userInput}` }],
    },
  };
};

// Configure and create the A2A Server instance
const server = new A2AServer({
  taskHandler: echoAgentLogic,          // The logic our agent will use
  taskStore: new InMemoryTaskStore(),   // Stores task information (in memory for this example)
  port: 4000,                           // The port your agent server will run on
  basePath: "/a2a",                     // The base API path for your agent

  // The 'card' provides metadata about your agent so others can discover it
  card: {
    name: "EchoAgent",
    url: "http://localhost:4000/a2a", // How to reach this agent
    version: "0.1.0",
    capabilities: { streaming: true }, // Indicates this agent supports streaming updates
    skills: [{ id: "echo", name: "Echo Skill" }], // Describes what the agent can do
  },
});

// Start the server
async function main() {
  try {
    await server.start(); // Start listening for requests
    console.log("EchoAgent server running at http://localhost:4000/a2a");
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

main();
```

## Basic Agent Client

This example demonstrates how to create a client that sends a message to an agent and receives a single response.

```typescript
import { A2AClient, Message } from "@artinet/sdk";

async function talkToAgent() {
  // Create a client pointing to your running agent server
  const client = new A2AClient("http://localhost:4000/a2a");

  // Define the message you want to send to the agent
  const userMessage: Message = {
    role: "user",
    parts: [{ type: "text", text: "Hello Agent!" }],
  };

  try {
    console.log("Sending message to agent...");

    // Send the task and wait for the final response
    const taskResponse = await client.sendTask({
      id: "my-echo-task-01", // A unique ID for this task
      message: userMessage,
    });

    console.log("Agent responded successfully!");

    // The final message from the agent is in taskResponse.message
    if (taskResponse.message && taskResponse.message.parts[0]?.type === "text") {
      console.log("Agent's final reply:", taskResponse.message.parts[0].text);
    } else {
      console.log("Agent's final response structure:", taskResponse);
    }

  } catch (error) {
    console.error("Error interacting with agent:", error);
  }
}

talkToAgent();
```

## Streaming Response Client

This example shows how to use the streaming API to receive real-time updates from an agent.

```typescript
import { A2AClient, TaskStatusUpdateEvent, TaskArtifactUpdateEvent } from "@artinet/sdk";

async function streamFromAgent() {
  // Create a client pointing to your running agent server
  const client = new A2AClient("http://localhost:4000/a2a");

  // Define the message you want to send to the agent
  const userMessage = {
    role: "user",
    parts: [{ type: "text", text: "Generate a detailed report" }],
  };

  try {
    console.log("Sending task with streaming...");

    // Use sendTaskSubscribe to get a stream of updates
    const stream = client.sendTaskSubscribe({
      id: "streaming-task-01",
      message: userMessage,
    });

    // Process updates as they arrive
    for await (const update of stream) {
      if ("status" in update) {
        const statusUpdate = update as TaskStatusUpdateEvent;
        console.log(`Task status: ${statusUpdate.status.state}`);
        
        // If there's a message with this status update, display it
        if (statusUpdate.message?.parts[0]?.type === "text") {
          console.log(`Agent says: ${statusUpdate.message.parts[0].text}`);
        }
      } else if ("artifact" in update) {
        const artifactUpdate = update as TaskArtifactUpdateEvent;
        console.log(`Received artifact: ${artifactUpdate.artifact.name}`);
        // Process the artifact content
        const artifactContent = artifactUpdate.artifact.parts[0]?.text || "[No content]";
        console.log(`Artifact content: ${artifactContent.substring(0, 100)}...`);
      }
    }

    console.log("Stream completed");

  } catch (error) {
    console.error("Error with streaming task:", error);
  }
}

streamFromAgent();
```

## Long-Running Agent Logic with Progress Updates

This example demonstrates how to create an agent that performs a long-running task with progress updates.

```typescript
import {
  A2AServer,
  TaskContext,
  TaskHandler,
  InMemoryTaskStore,
} from "@artinet/sdk";

// Simulates a time-consuming process with progress updates
const longRunningAgent: TaskHandler = async function* (context: TaskContext) {
  // Extract request from user message
  const userInput =
    context.userMessage.parts[0]?.type === "text"
      ? context.userMessage.parts[0].text
      : "No specific request";

  // Initial update - we're starting the work
  yield {
    state: "working",
    message: {
      role: "agent",
      parts: [{ type: "text", text: "Starting the requested task..." }],
    },
  };

  // Simulate first stage of work
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Check if task was cancelled during this time
  if (context.isCancelled()) {
    yield {
      state: "cancelled",
      message: {
        role: "agent",
        parts: [{ type: "text", text: "Task was cancelled." }],
      },
    };
    return;
  }

  // Progress update
  yield {
    state: "working",
    message: {
      role: "agent",
      parts: [{ type: "text", text: "25% complete - analyzing data..." }],
    },
  };

  // Simulate second stage of work
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (context.isCancelled()) {
    yield {
      state: "cancelled",
      message: {
        role: "agent",
        parts: [{ type: "text", text: "Task was cancelled." }],
      },
    };
    return;
  }

  // Another progress update
  yield {
    state: "working",
    message: {
      role: "agent",
      parts: [{ type: "text", text: "50% complete - generating results..." }],
    },
  };

  // Simulate third stage of work
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (context.isCancelled()) {
    yield {
      state: "cancelled",
      message: {
        role: "agent",
        parts: [{ type: "text", text: "Task was cancelled." }],
      },
    };
    return;
  }

  // Generate an artifact (like a report or document)
  yield {
    name: "results.txt",
    mimeType: "text/plain",
    parts: [{ 
      type: "text", 
      text: `Analysis results for: "${userInput}"\n\n1. Finding one\n2. Finding two\n3. Finding three` 
    }],
  };

  // Final progress update
  yield {
    state: "working",
    message: {
      role: "agent",
      parts: [{ type: "text", text: "75% complete - finalizing..." }],
    },
  };

  // Simulate final stage of work
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (context.isCancelled()) {
    yield {
      state: "cancelled",
      message: {
        role: "agent",
        parts: [{ type: "text", text: "Task was cancelled." }],
      },
    };
    return;
  }

  // Complete the task with final results
  yield {
    state: "completed",
    message: {
      role: "agent",
      parts: [{ 
        type: "text", 
        text: "Task completed successfully. Results have been generated and are available in the attached artifact." 
      }],
    },
  };
};

// Server setup
const server = new A2AServer({
  taskHandler: longRunningAgent,
  taskStore: new InMemoryTaskStore(),
  port: 4000,
  basePath: "/a2a",
  card: {
    name: "LongRunningAgent",
    url: "http://localhost:4000/a2a",
    version: "0.1.0",
    capabilities: { streaming: true },
    skills: [{ id: "analysis", name: "Data Analysis" }],
  },
});

server.start().then(() => {
  console.log("LongRunningAgent server running at http://localhost:4000/a2a");
}).catch(err => {
  console.error("Failed to start server:", err);
});
```

## Using Persistent Storage with FileStore

This example shows how to configure an agent with file-based storage for persistence across restarts.

```typescript
import {
  A2AServer,
  TaskContext,
  TaskHandler,
  FileStore,
} from "@artinet/sdk";
import path from "path";
import fs from "fs";

// Define your agent logic
const persistentAgent: TaskHandler = async function* (context: TaskContext) {
  // Basic echo agent logic
  const userInput =
    context.userMessage.parts[0]?.type === "text"
      ? context.userMessage.parts[0].text
      : "No text provided";

  yield { state: "working" };
  
  yield {
    state: "completed",
    message: {
      role: "agent",
      parts: [{ type: "text", text: `Received: ${userInput}` }],
    },
  };
};

// Set up the data directory for the FileStore
const dataDir = path.join(process.cwd(), "agent-data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Create a FileStore instance
const fileStore = new FileStore(dataDir);

// Configure and create the server with FileStore
const server = new A2AServer({
  taskHandler: persistentAgent,
  taskStore: fileStore,  // Using FileStore instead of InMemoryTaskStore
  port: 4000,
  basePath: "/a2a",
  card: {
    name: "PersistentAgent",
    url: "http://localhost:4000/a2a",
    version: "0.1.0",
    capabilities: { streaming: true },
    skills: [{ id: "persistence", name: "Persistent Conversations" }],
  },
});

// Start the server
server.start().then(() => {
  console.log("PersistentAgent server running at http://localhost:4000/a2a");
  console.log(`Task data will be stored in: ${dataDir}`);
}).catch(err => {
  console.error("Failed to start server:", err);
});
```

## Authenticated API Calls with Headers

This example demonstrates how to add authentication headers to API calls when using the A2AClient.

```typescript
import { A2AClient } from "@artinet/sdk";

async function authenticatedApiCall() {
  // Create a client
  const client = new A2AClient("https://api.example.com/a2a");
  
  // Add an authentication header
  client.addHeader("Authorization", "Bearer YOUR_API_TOKEN");
  
  // You can also add multiple headers at once
  client.setHeaders({
    "X-API-Key": "your-api-key",
    "User-Agent": "Artinet SDK Example",
    "Accept": "application/json"
  });
  
  // Now make the API call with authentication
  try {
    const taskResponse = await client.sendTask({
      id: "auth-task-01",
      message: {
        role: "user",
        parts: [{ type: "text", text: "Secure API request example" }]
      }
    });
    
    console.log("Authenticated API call succeeded:", taskResponse);
    
  } catch (error) {
    // Handle different error types
    if (error.code === 401) {
      console.error("Authentication failed. Check your API token.");
    } else if (error.code === 403) {
      console.error("Not authorized to perform this action.");
    } else {
      console.error("API call failed:", error);
    }
  }
}

authenticatedApiCall();
```

## Structured Logging

This example shows how to use the built-in logging utilities for better debugging and monitoring.

```typescript
import { 
  A2AServer, 
  logger, 
  configureLogger, 
  LogLevel,
  logDebug,
  logInfo,
  logWarn,
  logError
} from "@artinet/sdk";

// Configure logging level
configureLogger({ level: LogLevel.debug });

// Standard logger usage
logger.info("Application starting");
logger.debug({ module: "startup" }, "Initializing components");

// Use the helper functions with context
logInfo("UserService", { userId: "user-123" }, "User logged in");
logDebug("TaskProcessor", { taskId: "task-456" }, "Processing started");
logWarn("ApiClient", { endpoint: "/api/data" }, "Rate limit approaching");
logError("Database", { operation: "insert" }, "Connection failed", new Error("DB timeout"));

// Create a child logger with bound context
const taskLogger = logger.child({ taskId: "abc-789", sessionId: "session-321" });
taskLogger.info("Task received");
taskLogger.debug("Processing step 1");
taskLogger.info("Task completed");

// Example of integrating logging into an agent
const loggingAgent = async function* (context) {
  const taskId = context.taskId;
  const taskLogger = logger.child({ taskId });
  
  taskLogger.info("Received new task");
  yield { state: "working" };
  
  taskLogger.debug("Processing user message");
  // ... processing logic ...
  
  if (someErrorCondition) {
    taskLogger.error("Failed to process task", new Error("Processing error"));
    yield { 
      state: "error",
      message: { 
        role: "agent", 
        parts: [{ type: "text", text: "Sorry, an error occurred" }]
      }
    };
    return;
  }
  
  taskLogger.info("Task completed successfully");
  yield { 
    state: "completed",
    message: { 
      role: "agent", 
      parts: [{ type: "text", text: "Task complete!" }]
    }
  };
};
```

## Advanced: Custom JSONRPCServerFactory

This example shows how to create a custom JSON-RPC server implementation for advanced use cases.

```typescript
import {
  A2AServer,
  JSONRPCServerFactory,
  CreateJSONRPCServerParams,
  SendTaskMethod,
  defaultGetTaskMethod,
  defaultCancelTaskMethod,
  defaultSetTaskPushNotificationMethod,
  defaultGetTaskPushNotificationMethod,
  createJSONRPCMethod,
  TaskHandler,
  InMemoryTaskStore,
} from "@artinet/sdk";
import { JSONRPCServer } from "jayson/promise";

// Define our custom task/send method
const myCustomSendMethod: SendTaskMethod = (
  deps,
  requestParams,
  callback
) => {
  const { taskStore, taskHandler, createTaskContext } = deps;
  const taskId = requestParams.id;
  const { message, sessionId } = requestParams;
  
  console.log(`Custom handler processing task ${taskId}`);
  
  // Log incoming messages
  console.log(`Message from user: ${message.parts[0]?.text || "No text"}`);
  
  // Here you could add custom validation, preprocessing, or business logic
  // before delegating to the normal task handling flow
  
  // For this example, we'll just add a custom metadata field
  const enhancedParams = {
    ...requestParams,
    metadata: {
      ...(requestParams.metadata || {}),
      customField: "Added by custom handler",
      timestamp: new Date().toISOString()
    }
  };
  
  // Create and process the task using the standard pattern
  // (simplified - a real implementation would be more robust)
  taskStore.createTask(taskId, {
    id: taskId,
    message: enhancedParams.message,
    status: { state: "submitted" },
    sessionId: enhancedParams.sessionId,
    metadata: enhancedParams.metadata
  });
  
  // Start processing the task
  const task = taskStore.getTask(taskId);
  const context = createTaskContext(task);
  
  // Execute the TaskHandler (simplified)
  const taskIterator = taskHandler(context);
  
  // Process the first yield to update status
  taskIterator.next().then(result => {
    if (result.value) {
      // Update the task with the first yield result
      taskStore.updateTask(taskId, { status: { state: result.value.state } });
      
      // Return the updated task
      callback(null, taskStore.getTask(taskId));
    }
  }).catch(err => {
    callback(err);
  });
};

// Create the custom factory
const myCustomRPCServer: JSONRPCServerFactory = (
  params: CreateJSONRPCServerParams
) => {
  // Create methods using the dependency injection helper
  const taskSendMethod = createJSONRPCMethod(params, myCustomSendMethod, "tasks/send");
  const taskGetMethod = createJSONRPCMethod(params, defaultGetTaskMethod, "tasks/get");
  const taskCancelMethod = createJSONRPCMethod(params, defaultCancelTaskMethod, "tasks/cancel");
  const taskPushNotificationSetMethod = createJSONRPCMethod(
    params, 
    defaultSetTaskPushNotificationMethod, 
    "tasks/pushNotification/set"
  );
  const taskPushNotificationGetMethod = createJSONRPCMethod(
    params, 
    defaultGetTaskPushNotificationMethod, 
    "tasks/pushNotification/get"
  );
  
  // Create the JSON-RPC server with our methods
  const rpcServer = new JSONRPCServer({
    "tasks/send": taskSendMethod,
    "tasks/get": taskGetMethod,
    "tasks/cancel": taskCancelMethod,
    "tasks/pushNotification/set": taskPushNotificationSetMethod,
    "tasks/pushNotification/get": taskPushNotificationGetMethod,
  });
  
  return rpcServer;
};

// Define a simple agent
const simpleAgent: TaskHandler = async function* (context) {
  yield { state: "working" };
  yield {
    state: "completed",
    message: {
      role: "agent",
      parts: [{ type: "text", text: "Processed by custom RPC server!" }]
    }
  };
};

// Create the server with the custom factory
const server = new A2AServer({
  taskHandler: simpleAgent,
  taskStore: new InMemoryTaskStore(),
  port: 4000,
  basePath: "/a2a",
  card: {
    name: "CustomRPCAgent",
    url: "http://localhost:4000/a2a",
    version: "0.1.0",
    capabilities: { streaming: true },
    skills: [{ id: "custom", name: "Custom RPC Handling" }],
  },
  createJSONRPCServer: myCustomRPCServer
});

server.start().then(() => {
  console.log("Server with custom RPC handler running at http://localhost:4000/a2a");
}).catch(err => {
  console.error("Failed to start server:", err);
});
```

## Error Handling in TaskHandlers

This example demonstrates how to implement comprehensive error handling in your agent logic.

```typescript
import {
  A2AServer,
  TaskContext,
  TaskHandler,
  InMemoryTaskStore,
  logger
} from "@artinet/sdk";

// Agent with robust error handling
const robustAgent: TaskHandler = async function* (context: TaskContext) {
  try {
    // Initial state update
    yield { state: "working" };
    
    // Extract user input
    const userInput = 
      context.userMessage.parts[0]?.type === "text"
        ? context.userMessage.parts[0].text
        : "";
        
    // Validate input
    if (!userInput) {
      // Handle empty input gracefully
      yield {
        state: "completed",
        message: {
          role: "agent",
          parts: [{ type: "text", text: "I didn't receive any text to process. Please provide some text." }]
        }
      };
      return;
    }
    
    // Simulate potential error condition
    if (userInput.toLowerCase().includes("error")) {
      throw new Error("Simulated error for demonstration");
    }
    
    // Simulate async operation that might fail
    try {
      const result = await someAsyncOperation(userInput);
      
      // Check for cancellation after async operation
      if (context.isCancelled()) {
        yield {
          state: "cancelled",
          message: {
            role: "agent",
            parts: [{ type: "text", text: "Operation was cancelled by the user." }]
          }
        };
        return;
      }
      
      // Success path
      yield {
        state: "completed",
        message: {
          role: "agent",
          parts: [{ type: "text", text: `Successfully processed: ${result}` }]
        }
      };
    } catch (operationError) {
      // Handle operation-specific error
      logger.error({ taskId: context.taskId, error: operationError }, "Operation failed");
      
      yield {
        state: "error",
        message: {
          role: "agent",
          parts: [{ 
            type: "text", 
            text: `Sorry, I couldn't process your request due to an error with the operation: ${operationError.message}` 
          }]
        }
      };
    }
  } catch (error) {
    // Handle any unexpected errors
    logger.error({ taskId: context.taskId, error }, "Unexpected error in agent");
    
    yield {
      state: "error",
      message: {
        role: "agent",
        parts: [{ 
          type: "text", 
          text: "I encountered an unexpected error while processing your request. Please try again later." 
        }]
      }
    };
  }
};

// Simulate an async operation
async function someAsyncOperation(input: string): Promise<string> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate potential failure
  if (input.toLowerCase().includes("fail")) {
    throw new Error("Operation failed");
  }
  
  return `Processed: ${input.toUpperCase()}`;
}

// Create and start the server
const server = new A2AServer({
  taskHandler: robustAgent,
  taskStore: new InMemoryTaskStore(),
  port: 4000,
  basePath: "/a2a",
  card: {
    name: "RobustAgent",
    url: "http://localhost:4000/a2a",
    version: "0.1.0",
    capabilities: { streaming: true },
    skills: [{ id: "robust", name: "Error-Resilient Processing" }],
  },
});

server.start().then(() => {
  console.log("Robust agent running at http://localhost:4000/a2a");
}).catch(err => {
  console.error("Failed to start server:", err);
});
```

## Client-Side Error Handling and Retry Logic

This example shows how to implement robust error handling and retry logic in client applications.

```typescript
import { A2AClient, RpcError } from "@artinet/sdk";

// Configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const BACKOFF_FACTOR = 1.5;

async function robustClientRequest() {
  const client = new A2AClient("http://localhost:4000/a2a");
  
  const userMessage = {
    role: "user",
    parts: [{ type: "text", text: "Process this data please" }]
  };
  
  let retryCount = 0;
  let delay = RETRY_DELAY_MS;
  
  while (true) {
    try {
      console.log(`Attempt ${retryCount + 1} of ${MAX_RETRIES + 1}`);
      
      // Send the request
      const response = await client.sendTask({
        id: `task-${Date.now()}`, // Generate unique ID
        message: userMessage
      });
      
      // Success! Process the response
      console.log("Request succeeded:", response);
      
      if (response.message?.parts[0]?.type === "text") {
        console.log("Agent response:", response.message.parts[0].text);
      }
      
      return response; // Success, exit the loop
      
    } catch (error) {
      // Handle different error scenarios
      if (error instanceof RpcError) {
        const { code, message, data } = error;
        
        console.error(`RPC Error (${code}): ${message}`);
        
        // Check if we should retry based on error type
        if (
          // Retry on server errors (5xx)
          (code >= 500 && code < 600) ||
          // Retry on timeout
          code === 408 ||
          // Retry on rate limiting with backoff
          code === 429
        ) {
          if (retryCount < MAX_RETRIES) {
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Increase delay with backoff
            delay = Math.floor(delay * BACKOFF_FACTOR);
            retryCount++;
            continue; // Try again
          }
        }
        
        // Don't retry client errors (4xx) except those handled above
        if (code >= 400 && code < 500) {
          console.error("Client error, not retrying");
          throw error;
        }
      }
      
      // For network errors or other issues
      console.error("Request failed:", error);
      
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Increase delay with backoff
        delay = Math.floor(delay * BACKOFF_FACTOR);
        retryCount++;
      } else {
        console.error(`Maximum retries (${MAX_RETRIES}) exceeded`);
        throw error; // Bubble up the error after max retries
      }
    }
  }
}

// Run the robust client
robustClientRequest()
  .then(result => {
    console.log("Operation completed successfully");
  })
  .catch(error => {
    console.error("Operation failed after retries:", error);
  });
```

These examples provide a foundation for exploring the Artinet SDK's capabilities. They demonstrate common patterns and techniques for building robust, feature-rich A2A-compliant agents and client applications.