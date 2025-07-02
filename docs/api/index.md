# API Reference

This section provides a comprehensive reference for the Artinet SDK Core API components. The SDK implements the [Agent2Agent (A2A) Protocol](https://github.com/google/A2A) and provides enhanced functionality for building interoperable AI agents.

## Overview

The Artinet SDK API is organized into several key component categories:

=== "Client API"
    - `A2AClient` - For sending tasks to and receiving responses from agents
    - Task submission and streaming
    - Push notification handling

=== "Server API"
    - `A2AServer` - For hosting and implementing agent behavior
    - Task processing and state management
    - Server registration

=== "Storage API"
    - `InMemoryTaskStore` - For development
    - `FileTaskStore` - For production
    - Custom store implementations

=== "Advanced"
    - Task handling customization
    - Express middleware integration
    - Runtime configuration

!!! info "TypeScript Support"
    The Artinet SDK is fully written in TypeScript with comprehensive type definitions for a robust developer experience.

## Client API

### A2AClient

The primary class for interacting with A2A-compliant agent servers.

```typescript
class A2AClient {
  /**
   * Creates a new A2AClient instance.
   * @param baseUrl The base URL of the A2A-compliant server
   * @param headers Optional custom headers to include in requests
   * @param fallbackPath Optional path for retrieving the agent card if the standard path fails
   */
  constructor(
    baseUrl: string | URL,
    headers?: Record<string, string>,
    fallbackPath?: string
  );
  
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
   * Removes a specific HTTP header.
   * @param name The header name to remove
   */
  removeHeader(name: string): void;
  
  /**
   * Clears all custom HTTP headers.
   */
  clearHeaders(): void;
  
  /**
   * Sends a task and returns the final result.
   * @param params The task parameters
   * @returns A Promise resolving to the completed task
   */
  async sendMessage(params: MessageSendParams): Promise<Task | null>;
  
  /**
   * Retrieves information about an existing task.
   * @param params The task parameters including task ID
   * @returns A Promise resolving to the task
   */
  async getTask(params: TaskQueryParams): Promise<Task | null>;
  
  /**
   * Cancels an in-progress task.
   * @param params The task parameters including task ID
   */
  async cancelTask(params: TaskIdParams): Promise<Task | null>;
  
  /**
   * Sends a task and subscribes to streaming updates.
   * @param params The task parameters
   * @returns An AsyncIterable yielding status and artifact updates
   */
  sendStreamingMessage(params: MessageSendParams): AsyncIterable<TaskStatusUpdateEvent | TaskArtifactUpdateEvent>;
  
  /**
   * Resubscribes to updates for an existing task.
   * @param params The resubscribe parameters including task ID
   * @returns An AsyncIterable yielding status and artifact updates
   */
  resubscribeTask(params: TaskQueryParams): AsyncIterable<TaskStatusUpdateEvent | TaskArtifactUpdateEvent>;
  
  /**
   * Configures push notifications for a task.
   * @param params The push notification parameters
   */
  async setTaskPushNotification(params: TaskPushNotificationConfig): Promise<TaskPushNotificationConfig | null>;
  
  /**
   * Retrieves push notification configuration for a task.
   * @param params The parameters including task ID
   * @returns The push notification configuration
   */
  async getTaskPushNotification(params: TaskIdParams): Promise<TaskPushNotificationConfig | null>;
  
  /**
   * Retrieves the agent card describing the server's capabilities.
   * @returns A Promise resolving to the agent card
   */
  async agentCard(): Promise<AgentCard>;
  
  /**
   * Refreshes the cached agent card.
   * @returns A Promise resolving to the refreshed agent card
   */
  async refreshAgentCard(): Promise<AgentCard>;
  
  /**
   * Checks if the server supports a specific capability.
   * @param capability The capability to check
   * @returns A Promise resolving to a boolean indicating support
   */
  async supports(capability: "streaming" | "pushNotifications" | "stateTransitionHistory"): Promise<boolean>;
}
```

### RpcError

Represents client-side errors encountered during A2A communication.

```typescript
class SystemError<ErrorData = unknown, C extends number = number> extends Error {
  /**
   * The error code (typically a JSON-RPC error code)
   */
  code: C;
  
  /**
   * Additional error data, if any
   */
  data: ErrorData;
  
  /**
   * Creates a new SystemError.
   * @param message The error message
   * @param code The error code
   * @param data Additional error data
   */
  constructor(message: string, code: C, data: ErrorData);
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
   * @returns The Express application instance
   */
  start(): express.Express;
  
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
  getExpressApp(): express.Express;
  
  /**
   * Registers the server with the A2A registry.
   * @returns A Promise resolving to the registration ID
   */
  registerServer(): Promise<string>;
  
  /**
   * Gets the base path for the server.
   * @returns The base path
   */
  getBasePath(): string;
  
  /**
   * Gets the CORS options for the server.
   * @returns The CORS options
   */
  getCorsOptions(): CorsOptions;
  
  /**
   * Gets the agent card for the server.
   * @returns The agent card
   */
  getCard(): AgentCard;
  
  /**
   * Gets the task store.
   * @returns The task store
   */
  getTaskStore(): TaskStore;
  
  /**
   * Gets the task handler.
   * @returns The task handler
   */
  getTaskHandler(): TaskHandler;
  
  /**
   * Gets the active cancellations set.
   * @returns The set of active cancellations
   */
  getActiveCancellations(): Set<string>;
  
  /**
   * Gets the active streams map.
   * @returns The map of active streams
   */
  getActiveStreams(): Map<string, Response[]>;
  
  /**
   * Gets the port number.
   * @returns The port number
   */
  getPort(): number;
}
```

### A2AServerParams

Configuration interface for the A2AServer constructor.

```typescript
interface A2AServerParams {
  /**
   * The task handler function that implements agent logic
   */
  handler: TaskHandler;
  
  /**
   * The storage implementation for persisting tasks
   */
  taskStore?: TaskStore;
  
  /**
   * Metadata about the agent's capabilities
   */
  card?: AgentCard;
  
  /**
   * Port number to listen on (default: 41241)
   */
  port?: number;
  
  /**
   * Host address to bind to (default: '0.0.0.0')
   */
  host?: string;
  
  /**
   * Base URL path for API endpoints (default: '/')
   */
  basePath?: string;
  
  /**
   * Alternative path for agent card (default: '/agent-card')
   */
  fallbackPath?: string;
  
  /**
   * Whether to register this agent with the Artinet registry (default: false)
   */
  register?: boolean;
  
  /**
   * Custom JSON-RPC server factory for advanced usage
   */
  createJSONRPCServer?: JSONRPCServerFactory;
  
  /**
   * CORS options for the server
   */
  corsOptions?: CorsOptions;
  
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
) => AsyncGenerator<TaskYieldUpdate, Task | void, unknown>;
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
  readonly history: Message[];
  
  /**
   * Function to check if the task has been cancelled
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
  | { name: string; parts: Part[]; mimeType?: string };
```

## Storage API

### TaskStore

Interface for task persistence implementations.

```typescript
interface TaskStore {
  /**
   * Saves a task and its associated message history.
   * @param data An object containing the task and its history
   * @returns A promise resolving when the save operation is complete
   */
  save(data: TaskAndHistory): Promise<void>;
  
  /**
   * Loads a task and its history by task ID.
   * @param taskId The ID of the task to load
   * @returns A promise resolving to an object containing the Task and its history, or null if not found
   */
  load(taskId: string): Promise<TaskAndHistory | null>;
}
```

### TaskAndHistory

Interface representing a task and its associated message history.

```typescript
interface TaskAndHistory {
  /**
   * The task object
   */
  task: Task;
  
  /**
   * The complete message history associated with the task
   */
  history: Message[];
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
  
  /**
   * Saves a task and its associated message history.
   * @param data An object containing the task and its history
   */
  save(data: TaskAndHistory): Promise<void>;
  
  /**
   * Loads a task and its history by task ID.
   * @param taskId The ID of the task to load
   * @returns A promise resolving to the task and history, or null if not found
   */
  load(taskId: string): Promise<TaskAndHistory | null>;
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
  
  /**
   * Saves a task and its associated message history.
   * @param data An object containing the task and its history
   */
  save(data: TaskAndHistory): Promise<void>;
  
  /**
   * Loads a task and its history by task ID.
   * @param taskId The ID of the task to load
   * @returns A promise resolving to the task and history, or null if not found
   */
  load(taskId: string): Promise<TaskAndHistory | null>;
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
function configureLogger(options: { level?: LogLevel, name?: string, prettyPrint?: boolean }): Logger;
```

### Log Helper Functions

```typescript
/**
 * Logs a message at DEBUG level with context
 * @param context Name of the component generating the log
 * @param message The log message
 * @param data Optional data to include
 */
function logDebug(context: string, message: string, data?: unknown): void;

/**
 * Logs a message at INFO level with context
 * @param context Name of the component generating the log
 * @param message The log message
 * @param data Optional data to include
 */
function logInfo(context: string, message: string, data?: unknown): void;

/**
 * Logs a message at WARN level with context
 * @param context Name of the component generating the log
 * @param message The log message
 * @param data Optional data to include
 */
function logWarn(context: string, message: string, data?: unknown): void;

/**
 * Logs a message at ERROR level with context
 * @param context Name of the component generating the log
 * @param message The log message
 * @param error The error object
 * @param data Optional additional data
 */
function logError(context: string, message: string, error: unknown, data?: unknown): void;
```

### LogLevel

Type defining logging levels.

```typescript
type LogLevel = "silent" | "error" | "warn" | "info" | "debug" | "trace";
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
  card: AgentCard;
  
  /**
   * Set of active task cancellations
   */
  activeCancellations: Set<string>;
  
  /**
   * Function to create a TaskContext for a task
   */
  createTaskContext: (task: Task, message: Message, history: Message[]) => TaskContext;
  
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
type SendTaskMethod = A2AMethodHandler<
  SendTaskRequest["params"],
  SendTaskResponse | null
>;

/**
 * Type definition for the tasks/get method handler
 */
type GetTaskMethod = A2AMethodHandler<
  GetTaskRequest["params"],
  GetTaskResponse | null
>;

/**
 * Type definition for the tasks/cancel method handler
 */
type CancelTaskMethod = A2AMethodHandler<
  CancelTaskRequest["params"],
  CancelTaskResponse | null
>;

/**
 * Type definition for the tasks/pushNotification/set method handler
 */
type SetTaskPushNotificationMethod = A2AMethodHandler<
  SetTaskPushNotificationRequest["params"],
  SetTaskPushNotificationResponse | null
>;

/**
 * Type definition for the tasks/pushNotification/get method handler
 */
type GetTaskPushNotificationMethod = A2AMethodHandler<
  GetTaskPushNotificationRequest["params"],
  GetTaskPushNotificationResponse | null
>;
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
function createJSONRPCMethod<
  Params extends RequestParams,
  Result extends A2AResponse | null,
>(
  deps: CreateJSONRPCServerParams,
  methodImpl: A2AMethodHandler<Params, Result>,
  methodName: string
): (params: Params, callback: JSONRPCCallback<Result>) => void;
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
  agentLogic: (context: TaskContext) => AsyncGenerator<TaskYieldUpdate, Task | void, unknown>
): Promise<void>;
```

### fetchResponseProxy

Enables communication between quick agents.

```typescript
/**
 * Fetches a response from another agent in the Artinet ecosystem
 * @param agentID Name of the agent to call
 * @param messages Array of message objects to send to the target agent
 * @returns A Promise resolving to the agent's response string
 */
function fetchResponseProxy(
  agentID: string,
  messages: { role: string; content: string }[]
): Promise<string>;
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
): AsyncGenerator<Task | ServerDeploymentResponse | null>;
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
   * Name of the agent
   */
  name: string;
  
  /**
   * The agent card defining capabilities and metadata
   */
  agentCard: AgentCard;
  
  /**
   * Optional NPM dependencies
   */
  dependencies?: string[];
}

/**
 * Response from a deployment test
 */
interface ServerDeploymentResponse {
  /**
   * The deployment ID
   */
  deploymentId: string;
  
  /**
   * Whether the deployment was successful 
   */
  success: boolean;
  
  /**
   * The name of the server (if successful)
   */
  name?: string;
  
  /**
   * The URL of the server (if successful)
   */
  url?: string;
  
  /**
   * The base path of the server (if successful)
   */
  basePath?: string;
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
  version: string;
  
  /**
   * Description of the agent's purpose
   */
  description?: string;
  
  /**
   * The agent's capabilities
   */
  capabilities: {
    /**
     * Whether the agent supports streaming
     */
    streaming?: boolean;
    
    /**
     * Whether the agent supports push notifications
     */
    pushNotifications?: boolean;
    
    /**
     * Whether the agent supports state transition history
     */
    stateTransitionHistory?: boolean;
  };
  
  /**
   * Skills the agent provides
   */
  skills: Array<{
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
   * Optional message that initiated this task
   */
  message?: Message;
  
  /**
   * Optional session identifier
   */
  sessionId?: string;
  
  /**
   * Custom metadata associated with the task
   */
  metadata?: Record<string, unknown>;
  
  /**
   * Artifacts generated during task execution
   */
  artifacts?: Artifact[];
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
  
  /**
   * Optional metadata about the message
   */
  metadata?: Record<string, unknown>;
}
```

### Part

Represents a part of a message in the A2A protocol.

```typescript
type Part = TextPart | FilePart | DataPart;

interface TextPart {
  /**
   * Type identifier
   */
  type: "text";
  
  /**
   * Text content
   */
  text: string;
  
  /**
   * Optional metadata
   */
  metadata?: Record<string, unknown>;
}

interface FilePart {
  /**
   * Type identifier
   */
  type: "file";
  
  /**
   * File content
   */
  file: FileContent;
  
  /**
   * Optional metadata
   */
  metadata?: Record<string, unknown>;
}

interface DataPart {
  /**
   * Type identifier
   */
  type: "data";
  
  /**
   * Structured data
   */
  data: Record<string, unknown>;
  
  /**
   * Optional metadata
   */
  metadata?: Record<string, unknown>;
}
```

### Artifact

Represents an artifact generated during a task.

```typescript
interface Artifact {
  /**
   * Name of the artifact
   */
  name?: string;
  
  /**
   * Description of the artifact
   */
  description?: string;
  
  /**
   * MIME type of the artifact
   */
  mimeType?: string;
  
  /**
   * Content parts of the artifact
   */
  parts: Part[];
  
  /**
   * Optional index for ordering
   */
  index?: number;
  
  /**
   * Whether to append to existing content
   */
  append?: boolean;
  
  /**
   * Optional metadata
   */
  metadata?: Record<string, unknown>;
  
  /**
   * Whether this is the last chunk
   */
  lastChunk?: boolean;
}
```

### TaskStatus

Represents the status of an A2A task.

```typescript
interface TaskStatus {
  /**
   * Current state of the task
   */
  state: TaskState;
  
  /**
   * Optional message describing the status
   */
  message?: Message;
  
  /**
   * Timestamp when the status was recorded
   */
  timestamp?: string;
}
```

### Stream Event Types

```typescript
/**
 * Event emitted when a task's status changes
 */
interface TaskStatusUpdateEvent {
  /**
   * Task ID
   */
  id: string;
  
  /**
   * The new status
   */
  status: TaskStatus;
  
  /**
   * Whether this is the final update
   */
  final?: boolean;
  
  /**
   * Optional metadata
   */
  metadata?: Record<string, unknown>;
}

/**
 * Event emitted when a task generates an artifact
 */
interface TaskArtifactUpdateEvent {
  /**
   * Task ID
   */
  id: string;
  
  /**
   * The generated artifact
   */
  artifact: Artifact;
  
  /**
   * Whether this is the final update
   */
  final?: boolean;
  
  /**
   * Optional metadata
   */
  metadata?: Record<string, unknown>;
}
```




