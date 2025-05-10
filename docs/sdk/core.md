# Core SDK Components

This page provides a brief overview of the main classes, types, and utilities available in the Artinet SDK. These are the fundamental building blocks you'll use to create and interact with A2A-compliant agents.

---

## A2AServer

* The primary class for instantiating and running an A2A agent server. It manages the agent's lifecycle, handles incoming requests, executes tasks via a `TaskHandler`, and uses a `TaskStore` for persistence. Built on Express.js, it automatically handles JSON-RPC complexity, routing, A2A protocol compliance, and Server-Sent Events (SSE) streaming.

---

## A2AClient

* The client class used to connect to an `A2AServer` instance. It allows you to send tasks (using `sendTask` for single responses or `sendTaskSubscribe` for streaming updates) and manage communication headers. Features refined error handling via `RpcError`, flexible header management for authentication, and clear separation of concerns.

---

## TaskHandler (Type)

* An asynchronous generator function (`async function*`) type that defines the core logic of an agent. It receives a `TaskContext` and yields `TaskYieldUpdate` objects to report progress and results. This is where you implement your agent's main functionality, processing user messages and generating responses.

---

## TaskContext (Interface/Type)

* An object passed as an argument to the `TaskHandler`. It provides task details such as `userMessage`, `taskId`, and methods like `isCancelled()` to check if a task should be aborted. Use this to access user inputs and manage the agent's execution flow.

---

## Message (Interface/Type)

* Defines the structure for messages exchanged between users and agents, or between agents. It includes a `role` (e.g., 'user', 'agent') and `parts` containing the content (e.g., text, images). This structure follows the A2A protocol specifications and ensures standardized communication.

---

## InMemoryTaskStore

* A simple implementation of the `TaskStore` interface that stores task state and history in memory. Suitable for development, testing, or agents that do not require persistent task data across restarts. Ideal for rapid prototyping and experimentation.

---

## FileStore

* An implementation of the `TaskStore` interface that persists task state and history to the local filesystem in a specified directory. Useful for agents that need to retain task data between server restarts. Ensures your agent can maintain conversation context and task state.

---

## TaskStatusUpdateEvent (Interface/Type)

* An event object yielded by a `TaskHandler` during streaming operations. It includes the current `state` of the task (e.g., 'working', 'completed', 'error') and can include an updated `message` from the agent. This allows real-time progress updates to be sent to clients.

---

## TaskArtifactUpdateEvent (Interface/Type)

* An event object yielded by a `TaskHandler` when an agent produces an artifact (like a file) during a task. It includes details about the `artifact` such as its name, mimeType, and content. This enables agents to share documents, files, or other complex outputs during task execution.

---

## logger / configureLogger / logDebug (Utilities)

* A set of logging utilities provided by the SDK. `logger` is the main logger instance based on the Pino library. `configureLogger` allows customization of log levels and output. `logDebug` and similar functions are helpers for common log levels, making it easier to add structured logging to your agent.

---

## JSONRPCServerFactory (Type)

* A function signature for providing custom JSON-RPC server creation logic to the A2AServer for advanced customization. This allows you to implement custom methods, integrate with existing Express apps, or fine-tune the API behavior to meet specific requirements.

---

## AgentCard (Interface/Type)

* Describes an agent's capabilities, metadata, skills, and endpoint URL. This information is exposed at the standard `/.well-known/agent.json` endpoint (and optional fallback paths) to enable discovery and interoperability with other A2A-compliant systems.