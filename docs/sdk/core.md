# Core SDK Components

This page provides a comprehensive overview of the main classes, types, and utilities available in the Artinet SDK. These are the fundamental building blocks you'll use to create and interact with A2A-compliant agents.

---

## A2AServer

* The primary class for instantiating and running an A2A agent server. It manages the agent's lifecycle, handles incoming requests, executes tasks via a `TaskHandler`, and uses a `TaskStore` for persistence. Built on Express.js, it automatically handles JSON-RPC complexity, routing, A2A protocol compliance, and Server-Sent Events (SSE) streaming.

```typescript
// Key methods
start(): express.Express;  // Starts the server and returns the Express app
stop(): Promise<void>;     // Stops the server and closes all connections
getExpressApp(): express.Express;  // Returns the underlying Express app for customization
registerServer(): Promise<string>; // Registers the server with the A2A registry
```

---

## A2AClient

* The client class used to connect to an `A2AServer` instance. It allows you to send messages (using `sendMessage` for single responses or `sendStreamingMessage` for streaming updates) and manage communication headers. Features refined error handling via `RpcError`, flexible header management for authentication, and clear separation of concerns.

```typescript
// Key methods
async sendMessage(params: MessageSendParams): Promise<Task | null>;
sendStreamingMessage(params: MessageSendParams): AsyncIterable<TaskStatusUpdateEvent | TaskArtifactUpdateEvent>;
async getTask(params: TaskQueryParams): Promise<Task | null>;
async cancelTask(params: TaskIdParams): Promise<Task | null>;
async supports(capability: "streaming" | "pushNotifications" | "stateTransitionHistory"): Promise<boolean>;
addHeader(name: string, value: string): void;
setHeaders(headers: Record<string, string>): void;
```

---

## TaskHandler (Type)

* An asynchronous generator function (`async function*`) type that defines the core logic of an agent. It receives a `TaskContext` and yields `TaskYieldUpdate` objects to report progress and results. This is where you implement your agent's main functionality, processing user messages and generating responses.

```typescript
type TaskHandler = (
  context: TaskContext
) => AsyncGenerator<TaskYieldUpdate, Task | void, unknown>;
```

---

## TaskContext (Interface/Type)

* An object passed as an argument to the `TaskHandler`. It provides task details such as `userMessage`, `taskId`, and methods like `isCancelled()` to check if a task should be aborted. Use this to access user inputs and manage the agent's execution flow.

```typescript
interface TaskContext {
  task: Task;              // Current task state
  userMessage: Message;    // Message that triggered this task
  history: Message[];      // Previous messages in this conversation
  isCancelled(): boolean;  // Check if cancellation was requested
}
```

---

## Message (Interface/Type)

* Defines the structure for messages exchanged between users and agents, or between agents. It includes a `role` (e.g., 'user', 'agent') and `parts` containing the content (e.g., text, images). This structure follows the A2A protocol specifications and ensures standardized communication.

```typescript
interface Message {
  role: "user" | "agent";
  parts: Part[];           // Content parts (text, file, data)
  metadata?: Record<string, unknown>;
}
```

---

## InMemoryTaskStore

* A simple implementation of the `TaskStore` interface that stores task state and history in memory. Suitable for development, testing, or agents that do not require persistent task data across restarts. Ideal for rapid prototyping and experimentation.

```typescript
// Usage
const store = new InMemoryTaskStore();
const server = new A2AServer({
  handler: myTaskHandler,
  taskStore: store,
  // other parameters...
});
```

---

## FileStore

* An implementation of the `TaskStore` interface that persists task state and history to the local filesystem in a specified directory. Useful for agents that need to retain task data between server restarts. Ensures your agent can maintain conversation context and task state.

```typescript
// Usage
const dataDir = path.join(process.cwd(), "task-data");
const store = new FileStore(dataDir);
const server = new A2AServer({
  handler: myTaskHandler,
  taskStore: store,
  // other parameters...
});
```

---

## TaskStatusUpdateEvent (Interface/Type)

* An event object yielded by a `TaskHandler` during streaming operations. It includes the current `state` of the task (e.g., 'working', 'completed', 'error') and can include an updated `message` from the agent. This allows real-time progress updates to be sent to clients.

```typescript
interface TaskStatusUpdateEvent {
  id: string;
  status: TaskStatus;      // Current state with timestamp
  final?: boolean;         // True if this is the final update
  metadata?: Record<string, unknown>;
}
```

---

## TaskArtifactUpdateEvent (Interface/Type)

* An event object yielded by a `TaskHandler` when an agent produces an artifact (like a file) during a task. It includes details about the `artifact` such as its name, mimeType, and content. This enables agents to share documents, files, or other complex outputs during task execution.

```typescript
interface TaskArtifactUpdateEvent {
  id: string;
  artifact: Artifact;      // The produced artifact
  final?: boolean;         // True if this is the final update
  metadata?: Record<string, unknown>;
}
```

---

## logger / configureLogger / logDebug (Utilities)

* A set of logging utilities provided by the SDK. `logger` is the main logger instance based on the Pino library. `configureLogger` allows customization of log levels and output. `logDebug` and similar functions are helpers for common log levels, making it easier to add structured logging to your agent.

```typescript
// Configure logging level
configureLogger({ level: "debug" });  // Options: silent, error, warn, info, debug, trace

// Use logging helpers
logDebug("ComponentName", "Debug message", optionalData);
logInfo("ComponentName", "Info message", optionalData);
logWarn("ComponentName", "Warning message", optionalData);
logError("ComponentName", "Error message", errorObject, optionalData);
```

---

## JSONRPCServerFactory (Type)

* A function signature for providing custom JSON-RPC server creation logic to the A2AServer for advanced customization. This allows you to implement custom methods, integrate with existing Express apps, or fine-tune the API behavior to meet specific requirements.

```typescript
type JSONRPCServerFactory = (
  params: CreateJSONRPCServerParams
) => JSONRPCServerType;
```

---

## AgentCard (Interface/Type)

* Describes an agent's capabilities, metadata, skills, and endpoint URL. This information is exposed at the standard `/.well-known/agent.json` endpoint (and optional fallback paths) to enable discovery and interoperability with other A2A-compliant systems.

```typescript
interface AgentCard {
  name: string;            // Agent name
  url: string;             // Endpoint URL
  version: string;         // Version identifier
  description?: string;    // Optional description
  capabilities: {          // Supported features
    streaming?: boolean;
    pushNotifications?: boolean;
    stateTransitionHistory?: boolean;
  };
  skills: Array<{          // Agent's abilities
    id: string;
    name: string;
    description?: string;
  }>;
  // Additional optional properties
}
```