# Welcome to Artinet SDK

## What is the Artinet SDK?

The Artinet SDK is a robust implementation of the [Agent2Agent (A2A) Protocol](https://github.com/google/A2A) that enables developers to create and connect AI agents. Written in TypeScript, this SDK provides everything you need to build, deploy, and interact with A2A-compliant agents.

## Key Features

* **Production-Ready**: Built with a focus on developer experience, reliability, and comprehensive features.
* **Plug-and-Play Server**: Built on Express.js, the SDK handles JSON-RPC complexity, routing, protocol compliance, and streaming mechanics automatically.
* **Enhanced Client**: Features refined error handling, flexible header management for authentication, and clear separation of concerns.
* **TypeScript First**: Fully written in TypeScript with comprehensive type definitions for a robust developer experience.
* **Flexible Storage**: Choose between memory storage for development or file-based persistence for production.

## Getting Started

```bash
# Install the SDK
npm install @artinet/sdk
```

Create your first agent in just a few lines of code:

```typescript
import {
  A2AServer,
  TaskContext,
  TaskHandler,
  InMemoryTaskStore,
} from "@artinet/sdk";

// Define your agent logic
const myAgent: TaskHandler = async function* (context: TaskContext) {
  yield { state: "working" };
  yield {
    state: "completed",
    message: {
      role: "agent",
      parts: [{ type: "text", text: "Hello from Artinet!" }],
    },
  };
};

// Start your server
const server = new A2AServer({
  taskHandler: myAgent,
  taskStore: new InMemoryTaskStore(),
  port: 3000,
  basePath: "/a2a",
  card: {
    name: "My First Agent",
    url: "http://localhost:3000/a2a",
    version: "0.1.0",
    capabilities: { streaming: true },
    skills: [{ id: "greeting", name: "Greeting Skill" }],
  },
});

server.start();
console.log("Agent running at http://localhost:3000/a2a");
```

## Why Use Artinet SDK?

* **A2A Protocol Compliance**: Full implementation of the official A2A specification using the official JSON schema.
* **Robust Streaming**: Reliable Server-Sent Events (SSE) support for real-time communication.
* **Configurable Logging**: Integrated structured logging via `pino` with configurable levels.
* **Advanced Customization**: Fine-grained control over the JSON-RPC server, enabling integration with existing Express apps or adding custom methods.
* **Comprehensive Testing**: Includes a robust test suite to ensure reliability and maintainability.

## Next Steps

Ready to dive deeper? Check out these resources:

- [Quick Start Guide](./sdk/quickstart.md) - Get up and running with a complete agent example
- [Core Components](./sdk/core.md) - Understand the fundamental building blocks of the SDK
- [Examples](./sdk/examples.md) - Explore common usage patterns and scenarios
- [API Reference](./api_reference/index.md) - Detailed documentation of all classes and methods

