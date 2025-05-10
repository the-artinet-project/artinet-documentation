# API Reference

This section provides a comprehensive reference for the Artinet SDK Core API components. The SDK implements the [Agent2Agent (A2A) Protocol](https://github.com/google/A2A) and provides enhanced functionality for building interoperable AI agents.

## Overview

The Artinet SDK API is organized into several key component categories:

1. **Client API** - For sending tasks to and receiving responses from agents
2. **Server API** - For hosting and implementing agent behavior
3. **Task Handling API** - For defining agent logic and processing tasks
4. **Storage API** - For persisting task data and state 
5. **Advanced Customization API** - For fine-tuning server behavior
6. **Core Types** - Shared type definitions used throughout the SDK

## Client API

### A2AClient

The primary class for interacting with A2A-compliant agent servers.

```typescript
class A2AClient {
  /**
   * Creates a new A2AClient instance.
   * @param baseUrl The base URL of the A2A-compliant server
   */
  constructor(baseUrl: string);
  
  /**
   * Adds a single HTTP header to requests.
   * @param key The header name
   * @param value The header value
   */
  addHeader(key: string, value: string): void;
  
  /**
   * Sets multiple HTTP headers, replacing any existing headers.
   * @param headers Key-value pairs of headers
   */
  setHeaders(headers: Record<string, string>): void;
  
  /**
   * Sends a task and returns the final result.
   * @param params The task parameters
   * @returns A Promise resolving to the completed task
   */
  async sendTask(params: SendTaskRequest["params"]): Promise<Task>;
  
  /**
   * Retrieves information about an existing task.
   * @param params The task parameters including task ID
   * @returns A Promise resolving to the task
   */
  async getTask(params: GetTaskRequest["params"]): Promise<Task>;
  
  /**
   * Cancels an in-progress task.
   * @param params The task parameters including task ID
   */
  async cancelTask(params: CancelTaskRequest["params"]): Promise<void>;
  
  /**
   * Sends a task and subscribes to streaming updates.
   * @param params The task parameters
   * @returns An AsyncGenerator yielding status and artifact updates
   */
  sendTaskSubscribe(params: SendTaskRequest["params"]): AsyncGenerator<TaskStatusUpdateEvent | TaskArtifactUpdateEvent>;
  
  /**
   * Resubscribes to updates for an existing task.
   * @param params The resubscribe parameters including task ID
   * @returns An AsyncGenerator yielding status and artifact updates
   */
  resubscribe(params: ResubscribeRequest["params"]): AsyncGenerator<TaskStatusUpdateEvent | TaskArtifactUpdateEvent>;
  
  /**
   * Configures push notifications for a task.
   * @param params The push notification parameters
   */
  async setTaskPushNotification(params: SetTaskPushNotificationRequest["params"]): Promise<void>;
  
  /**
   * Retrieves push notification configuration for a task.
   * @param params The parameters including task ID
   * @returns The push notification configuration
   */
  async getTaskPushNotification(params: GetTaskPushNotificationRequest["params"]): Promise<TaskPushNotificationInfo>;
  
  /**
   * Retrieves the agent card describing the server's capabilities.
   * @returns A Promise resolving to the agent card
   */
  async getAgentCard(): Promise<AgentCard>;
}
```

### RpcError

Represents client-side errors encountered during A2A communication.

```typescript
class RpcError extends Error {
  /**
   * The error code (typically an HTTP status code)
   */
  code: number;
  
  /**
   * Additional error data, if any
   */
  data?: unknown;
  
  /**
   * Creates a new RpcError.
   * @param message The error message
   * @param code The error code
   * @param data Additional error data (optional)
   */
  constructor(message: string, code: number, data?: unknown);
}
```

## Server API

### A2AServer

The core server class for hosting A2A-compliant agents.

```typescript
class A2AServer {
  /**
   * Creates a new A2AServer instance.
   * @param params Configuration parameters
   */
  constructor(params: A2AServerParams);
  
  /**
   * Starts the server, making it available to accept requests.
   * @returns A Promise that resolves when the server is started
   */
  start(): Promise<void>;
  
  /**
   * Stops the server, closing all connections.
   * @returns A Promise that resolves when the server is stopped
   */
  stop(): Promise<void>;
  
  /**
   * Gets the underlying Express application instance.
   * Useful for advanced customization.
   * @returns The Express application
   */
  getExpressApp(): Express.Application;
}
```

### A2AServerParams

Configuration interface for the A2AServer constructor.

```typescript
interface A2AServerParams {
  /**
   * The task handler function that implements agent logic
   */
  taskHandler: TaskHandler;
  
  /**
   * The storage implementation for persisting tasks
   */
  taskStore: TaskStore;
  
  /**
   * Metadata about the agent's capabilities
   */
  card: AgentCard;
  
  /**
   * Port number to listen on (default: 3000)
   */
  port?: number;
  
  /**
   * Host address to bind to (default: '0.0.0.0')
   */
  host?: string;
  
  /**
   * Base URL path for API endpoints (default: '/a2a')
   */
  basePath?: string;
  
  /**
   * Alternative path for agent card (default: '/agent-card')
   */
  fallbackPath?: string;
  
  /**
   * Whether to register this agent with the Artinet registry
   */
  register?: boolean;
  
  /**
   * Custom JSON-RPC server factory for advanced usage
   */
  createJSONRPCServer?: JSONRPCServerFactory;
  
  /**
   * Logging verbosity level (default: LogLevel.info)
   */
  logLevel?: LogLevel;
}
```

## Task Handling API

### TaskHandler

The core type for defining agent logic.

```typescript
/**
 * An asynchronous generator function that processes tasks and yields updates.
 * @param context The context containing task information
 * @returns An AsyncGenerator that yields status and artifact updates
 */
type TaskHandler = (
  context: TaskContext
) => AsyncGenerator<TaskYieldUpdate>;
```

### TaskContext

Provides task details to the TaskHandler.

```typescript
interface TaskContext {
  /**
   * The Task being processed
   */
  readonly task: Task;
  
  /**
   * The message from the user that initiated this task
   */
  readonly userMessage: Message;
  
  /**
   * Message history for this task (if available)
   */
  readonly history?: Message[];
  
  /**
   * Task ID for this task
   */
  readonly taskId: string;
  
  /**
   * Checks if the task has been cancelled
   * @returns true if the task is cancelled, false otherwise
   */
  isCancelled(): boolean;
}
```

### TaskYieldUpdate

Union type for updates yielded by a TaskHandler.

```typescript
/**
 * Represents either a status update or an artifact creation
 */
type TaskYieldUpdate = 
  /**
   * Status update with optional message
   */
  | { state: TaskStatus["state"]; message?: Message }
  
  /**
   * Artifact creation
   */
  | { name: string; mimeType: string; parts: Part[] };
```

## Storage API

### TaskStore

Interface for task persistence implementations.

```typescript
interface TaskStore {
  /**
   * Retrieves a task by its ID
   * @param taskId The task ID
   * @returns A Promise resolving to the task, or undefined if not found
   */
  getTask(taskId: string): Promise<Task | undefined>;
  
  /**
   * Creates a new task in the store
   * @param taskId The task ID
   * @param task The task data
   * @returns A Promise that resolves when the task is saved
   */
  createTask(taskId: string, task: Task): Promise<void>;
  
  /**
   * Saves a new task or fully replaces an existing task
   * @param task The task to save
   * @returns A Promise that resolves when the task is saved
   */
  saveTask(task: Task): Promise<void>;
  
  /**
   * Updates an existing task with new data
   * @param task The task with updated data
   * @returns A Promise that resolves when the task is updated
   */
  updateTask(task: Task): Promise<void>;
  
  /**
   * Removes a task from the store
   * @param taskId The task ID
   * @returns A Promise that resolves when the task is deleted
   */
  deleteTask(taskId: string): Promise<void>;
}
```

### InMemoryTaskStore

Simple in-memory task persistence for development/testing.

```typescript
class InMemoryTaskStore implements TaskStore {
  /**
   * Creates a new InMemoryTaskStore
   */
  constructor();
  
  // Implements all TaskStore methods using in-memory storage
  getTask(taskId: string): Promise<Task | undefined>;
  createTask(taskId: string, task: Task): Promise<void>;
  saveTask(task: Task): Promise<void>;
  updateTask(task: Task): Promise<void>;
  deleteTask(taskId: string): Promise<void>;
}
```

### FileStore

File-based task persistence that stores task data in the filesystem.

```typescript
class FileStore implements TaskStore {
  /**
   * Creates a new FileStore
   * @param dataDirectory Path to the directory for storing task files
   */
  constructor(dataDirectory: string);
  
  // Implements all TaskStore methods using filesystem storage
  getTask(taskId: string): Promise<Task | undefined>;
  createTask(taskId: string, task: Task): Promise<void>;
  saveTask(task: Task): Promise<void>;
  updateTask(task: Task): Promise<void>;
  deleteTask(taskId: string): Promise<void>;
}
```

## Logging API

### logger

Built-in structured logger based on Pino.

```typescript
/**
 * The main logger instance for the SDK
 */
const logger: Logger;
```

### configureLogger

Function to configure the logging level and other options.

```typescript
/**
 * Configures the global logger's settings
 * @param options Configuration options
 */
function configureLogger(options: { level?: LogLevel }): void;
```

### Log Helper Functions

```typescript
/**
 * Logs a message at DEBUG level with context
 * @param component Name of the component generating the log
 * @param context Additional context objects
 * @param message The log message
 * @param error Optional error object
 */
function logDebug(component: string, context: object, message: string, error?: Error): void;

/**
 * Logs a message at INFO level with context
 * @param component Name of the component generating the log
 * @param context Additional context objects
 * @param message The log message
 * @param error Optional error object
 */
function logInfo(component: string, context: object, message: string, error?: Error): void;

/**
 * Logs a message at WARN level with context
 * @param component Name of the component generating the log
 * @param context Additional context objects
 * @param message The log message
 * @param error Optional error object
 */
function logWarn(component: string, context: object, message: string, error?: Error): void;

/**
 * Logs a message at ERROR level with context
 * @param component Name of the component generating the log
 * @param context Additional context objects
 * @param message The log message
 * @param error Optional error object
 */
function logError(component: string, context: object, message: string, error?: Error): void;
```

### LogLevel

Enum defining logging levels.

```typescript
enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
  TRACE = "trace"
}
```

## Advanced Customization API

### JSONRPCServerFactory

Function signature for providing custom JSON-RPC server creation logic.

```typescript
/**
 * Factory function for creating a custom JSON-RPC server
 * @param params Parameters with dependencies needed for server creation
 * @returns A configured JSON-RPC server
 */
type JSONRPCServerFactory = (
  params: CreateJSONRPCServerParams
) => JSONRPCServerType;
```

### CreateJSONRPCServerParams

Object containing dependencies provided to a JSONRPCServerFactory function.

```typescript
interface CreateJSONRPCServerParams {
  /**
   * The task handler function
   */
  taskHandler: TaskHandler;
  
  /**
   * The storage implementation
   */
  taskStore: TaskStore;
  
  /**
   * The agent's metadata
   */
  agentCard: AgentCard;
  
  /**
   * Set of active task cancellations
   */
  activeCancellations: Set<string>;
  
  /**
   * Function to create a TaskContext for a task
   */
  createTaskContext: (task: Task) => TaskContext;
  
  /**
   * Function to close all streams for a task
   */
  closeStreamsForTask: (taskId: string) => void;
}
```

### Method Type Definitions

```typescript
/**
 * Type definition for the tasks/send method handler
 */
type SendTaskMethod = (
  deps: CreateJSONRPCServerParams,
  params: SendTaskRequest["params"],
  callback: JSONRPCCallback
) => void;

/**
 * Type definition for the tasks/get method handler
 */
type GetTaskMethod = (
  deps: CreateJSONRPCServerParams,
  params: GetTaskRequest["params"],
  callback: JSONRPCCallback
) => void;

/**
 * Type definition for the tasks/cancel method handler
 */
type CancelTaskMethod = (
  deps: CreateJSONRPCServerParams,
  params: CancelTaskRequest["params"],
  callback: JSONRPCCallback
) => void;
```

### createJSONRPCMethod

Helper function for creating JSON-RPC method handlers.

```typescript
/**
 * Creates a JSON-RPC method with dependency injection and error handling
 * @param deps The dependency parameters
 * @param methodImpl The method implementation
 * @param methodName The name of the method
 * @returns A configured JSON-RPC method handler
 */
function createJSONRPCMethod<T, R>(
  deps: CreateJSONRPCServerParams,
  methodImpl: (deps: CreateJSONRPCServerParams, params: T, callback: JSONRPCCallback) => void,
  methodName: string
): (params: T, callback: JSONRPCCallback) => void;
```

## Quick Agent API

### bundle

Bundles agent code for deployment.

```typescript
/**
 * Bundles an agent's code and dependencies into a single file
 * @param fileUrl URL to the agent's main file
 * @returns A Promise resolving to the bundled code as a string
 */
function bundle(fileUrl: URL): Promise<string>;
```

### taskHandlerProxy

Simplifies agent implementation for quick agents.

```typescript
/**
 * Wraps agent logic for use in managed environments
 * @param agentLogic The agent's main function
 * @returns A Promise that resolves when the agent completes
 */
function taskHandlerProxy(
  agentLogic: (context: TaskContext) => AsyncGenerator<TaskYieldUpdate>
): Promise<void>;
```

### fetchResponseProxy

Enables communication between quick agents.

```typescript
/**
 * Fetches a response from another agent in the Artinet ecosystem
 * @param targetAgent Name of the agent to call
 * @param message Message to send to the target agent
 * @returns A Promise resolving to the agent's response
 */
function fetchResponseProxy(
  targetAgent: string,
  message: Message
): Promise<{ message: Message }>;
```

### testDeployment

Tests a deployment in a temporary sandbox environment.

```typescript
/**
 * Tests an agent deployment in a sandboxed environment
 * @param params Deployment parameters including the agent code
 * @param requests Test requests to send to the deployed agent
 * @returns An AsyncGenerator yielding deployment responses
 */
function testDeployment(
  params: ServerDeploymentRequestParams,
  requests: SendTaskRequest[]
): AsyncGenerator<ServerDeploymentResponse>;
```

### Deployment Types

```typescript
/**
 * Parameters for agent deployment
 */
interface ServerDeploymentRequestParams {
  /**
   * The bundled agent code
   */
  code: string;
  
  /**
   * Optional metadata about the agent
   */
  metadata?: {
    name?: string;
    version?: string;
    description?: string;
  };
}

/**
 * Response from a deployment test
 */
interface ServerDeploymentResponse {
  /**
   * The task ID
   */
  id: string;
  
  /**
   * The response message from the agent
   */
  message: Message;
  
  /**
   * The task status
   */
  status: TaskStatus;
  
  /**
   * Any artifacts generated by the agent
   */
  artifacts?: Artifact[];
}
```

## Core Types

The SDK includes comprehensive TypeScript definitions for all A2A Protocol types. Here are the most important ones:

### AgentCard

Describes the agent's capabilities, metadata, skills, and endpoint URL.

```typescript
interface AgentCard {
  /**
   * The name of the agent
   */
  name: string;
  
  /**
   * The URL where the agent can be reached
   */
  url: string;
  
  /**
   * The agent's version
   */
  version?: string;
  
  /**
   * Description of the agent's purpose
   */
  description?: string;
  
  /**
   * The agent's capabilities
   */
  capabilities?: {
    /**
     * Whether the agent supports streaming
     */
    streaming?: boolean;
    
    /**
     * Whether the agent supports artifacts
     */
    artifacts?: boolean;
  };
  
  /**
   * Skills the agent provides
   */
  skills?: Array<{
    /**
     * Unique identifier for the skill
     */
    id: string;
    
    /**
     * Human-readable name for the skill
     */
    name: string;
    
    /**
     * Description of what the skill does
     */
    description?: string;
  }>;
}
```

### Task

Represents the state and metadata of an A2A task.

```typescript
interface Task {
  /**
   * Unique identifier for the task
   */
  id: string;
  
  /**
   * Current status of the task
   */
  status: TaskStatus;
  
  /**
   * The message that initiated this task
   */
  message: Message;
  
  /**
   * Message history for this task
   */
  history?: Message[];
  
  /**
   * Custom metadata associated with the task
   */
  metadata?: Record<string, unknown>;
  
  /**
   * Artifacts generated during task execution
   */
  artifacts?: Artifact[];
  
  /**
   * Optional session identifier
   */
  sessionId?: string;
}
```

### Message

Represents a message in the A2A protocol.

```typescript
interface Message {
  /**
   * Who sent the message
   */
  role: "user" | "agent";
  
  /**
   * Content parts of the message
   */
  parts: Part[];
}
```

### Part

Represents a part of a message in the A2A protocol.

```typescript
interface Part {
  /**
   * The type of content in this part
   */
  type: "text" | "image" | "video" | "audio" | "file";
  
  /**
   * Text content (for type: "text")
   */
  text?: string;
  
  /**
   * A link to an external resource (for media types)
   */
  uri?: string;
  
  /**
   * Metadata about the part
   */
  [key: string]: unknown;
}
```

### Artifact

Represents an artifact generated during a task.

```typescript
interface Artifact {
  /**
   * Name of the artifact
   */
  name: string;
  
  /**
   * MIME type of the artifact
   */
  mimeType: string;
  
  /**
   * Content parts of the artifact
   */
  parts: Part[];
}
```

### TaskStatus

Represents the status of an A2A task.

```typescript
interface TaskStatus {
  /**
   * Current state of the task
   */
  state: "active" | "working" | "completed" | "failed" | "cancelled";
  
  /**
   * Optional message describing the status
   */
  statusMessage?: string;
}
```

### Stream Event Types

```typescript
/**
 * Event emitted when a task's status changes
 */
interface TaskStatusUpdateEvent {
  /**
   * The new status
   */
  status: TaskStatus;
  
  /**
   * Optional message from the agent
   */
  message?: Message;
}

/**
 * Event emitted when a task generates an artifact
 */
interface TaskArtifactUpdateEvent {
  /**
   * The generated artifact
   */
  artifact: Artifact;
}
```




