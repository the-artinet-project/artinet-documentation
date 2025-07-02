# Quick Start Guide: Artinet SDK

This guide will help you get your first A2A-compliant agent up and running and show you how to interact with it.

## Installation

First, you need to install the Artinet SDK into your project. If you're using Node.js and npm, you can install it with the following command in your terminal:

```bash
npm install @artinet/sdk
```
If you're using Yarn, you can use:

```bash
yarn add @artinet/sdk
```
## 1. Creating Your First Agent (Server-Side)
An A2A-compliant agent is essentially a server that can perform tasks. Here's how to create a simple agent that echoes back any text it receives:

```typescript
import {
  A2AServer,
  TaskContext,
  TaskHandler,
  InMemoryTaskStore,
} from "@artinet/sdk";

// Define the logic for your agent
// This function is a 'TaskHandler'. It processes incoming tasks.
const echoAgentLogic: TaskHandler = async function* (context: TaskContext) {
  // Extract text from the user's message
  // (Assuming the message part is text)
  const userInput =
    context.userMessage.parts[0]?.type === "text"
      ? context.userMessage.parts[0].text
      : "No text provided";

  // 1. Yield a 'working' state to indicate the task has started
  yield { state: "working" };

  // You could do more complex work here.
  // For long tasks, you might periodically check `context.isCancelled()`

  // 2. Yield a 'completed' state with the agent's response
  yield {
    state: "completed",
    message: { // This is the agent's reply
      role: "agent",
      parts: [{ type: "text", text: `Your agent says: You sent '${userInput}'` }],
    },
  };
};

// Configure and create the A2A Server instance
const server = new A2AServer({
  handler: echoAgentLogic,          // The logic our agent will use
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

### Key Concepts:

- **TaskHandler**: This is the heart of your agent - an asynchronous generator function that processes incoming tasks and yields status updates.
- **TaskContext**: Contains information about the task, including the user's message and methods like `isCancelled()`.
- **A2AServer**: Creates and manages your agent server, handling protocol details automatically.
- **AgentCard** (in `card` parameter): Describes your agent's capabilities and how to reach it.

## 2. Interacting with Your Agent (Client-Side)
Now that you have an agent server running, let's send it a task using the A2AClient:

```typescript
import { A2AClient, Message } from "@artinet/sdk";

async function talkToAgent() {
  // Create a client pointing to your running agent server
  const client = new A2AClient("http://localhost:4000/a2a");

  // Define the message you want to send to the agent
  const userMessage: Message = {
    role: "user", // Indicates the message is from a user
    parts: [{ type: "text", text: "Hello Artinet Agent!" }], // The content of the message
  };

  try {
    console.log("Sending message to agent...");

    // Send the task and wait for the final response
    // 'sendMessage' is good for tasks that have a single, final response.
const taskResponse = await client.sendMessage({
      id: "my-echo-task-01", // A unique ID for this task
      message: userMessage,
    });

    console.log("Agent responded successfully!");

    // The final message from the agent is in taskResponse.message
    if (taskResponse?.message && taskResponse.message.parts[0]?.type === "text") {
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

### Key Concepts:

- **A2AClient**: Connects to and interacts with A2A-compliant agent servers.
- **Message**: Structured format for communication, with a `role` and `parts` containing content.
- **sendMessage()**: Sends a one-time request and waits for the final response.

## 3. Receiving Streaming Updates

For long-running tasks or real-time updates, you can use the streaming API:

```typescript
import { A2AClient, TaskStatusUpdateEvent, TaskArtifactUpdateEvent } from "@artinet/sdk";

async function streamFromAgent() {
  const client = new A2AClient("http://localhost:4000/a2a");
  
  const userMessage = {
    role: "user",
    parts: [{ type: "text", text: "Process this data please" }],
  };
  
  try {
    // Use sendStreamingMessage to get a stream of updates
const stream = client.sendStreamingMessage({
      id: "streaming-task-01",
      message: userMessage,
    });
    
    // Process updates as they arrive
    for await (const update of stream) {
      if ("status" in update) {
        const statusUpdate = update as TaskStatusUpdateEvent;
        console.log(`Task status: ${statusUpdate.status.state}`);
        
        if (statusUpdate.message?.parts[0]?.type === "text") {
          console.log(`Agent says: ${statusUpdate.message.parts[0].text}`);
        }
      } else if ("artifact" in update) {
        // Handle artifact updates
        const artifactUpdate = update as TaskArtifactUpdateEvent;
        console.log(`Received artifact: ${artifactUpdate.artifact.name}`);
      }
    }
    
    console.log("Stream completed");
  } catch (error) {
    console.error("Error with streaming task:", error);
  }
}

streamFromAgent();
```

## 4. Running the Examples

To run these examples:

1. Save the server code as `myEchoAgent.ts`
2. Save the client code as `runClient.ts` or `streamClient.ts`
3. Run the server with `npx ts-node myEchoAgent.ts`
4. In another terminal, run the client with `npx ts-node runClient.ts`

## Next Steps

Now that you've built your first agent, you can:

- Explore more complex [examples](./examples/index.md)
- Learn about the [core components](./core.md) of the SDK
- Add authentication to your agent's endpoints
- Implement persistent storage with `FileStore`
- Create agents with advanced capabilities by integrating LLMs or other APIs

The Artinet SDK provides a solid foundation for building sophisticated A2A-compliant agents with minimal boilerplate!
