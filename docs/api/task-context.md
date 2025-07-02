# Task Context

## BaseContext

@description The base context.

```typescript
{
  /**
   * @description The id.
   * @type {string}
   */
  id: string;
  /**
   * @description The protocol.
   * @type {Protocol}
   */
  protocol: Protocol;
}
```

## MCPContext

@description The id.
@type {string}
/
  id: string;
  /**
@description The protocol.
@type {Protocol}
/
  protocol: Protocol;
}

/**
@description The MCP context.

```typescript
{
  /**
   * @description The message.
   * @type {string}
   */
  message: string;
}
```

## ContextParams

@description The message.
@type {string}
/
  message: string;
}

/**
@description The context params.
@type {A2AContext["params"] | MCPContext}

```typescript
= A2AContext["params"] | MCPContext;

/**
 * @description The base execution context.
 */
export interface BaseExecutionContext<T extends ContextParams = ContextParams>
  extends BaseContext {
  /**
   * @description The method.
   * @type {string}
   */
  method: string;
  /**
   * @description The params.
   * @type {T}
   */
  params: T;
}
```

## BaseExecutionContext

@description The base execution context.

```typescript
<T extends ContextParams = ContextParams>
  extends BaseContext {
  /**
   * @description The method.
   * @type {string}
   */
  method: string;
  /**
   * @description The params.
   * @type {T}
   */
  params: T;
}
```

## A2AExecutionContext

@description The method.
@type {string}
/
  method: string;
  /**
@description The params.
@type {T}
/
  params: T;
}

/**
Represents a request specific to the A2A (Agent-to-Agent) protocol.
The `protocol` field is narrowed to `Protocol.A2A`.

```typescript
<
  RequestType extends A2AContext = A2AContext,
> extends BaseExecutionContext<RequestType["params"]> {
  protocol: Protocol.A2A;
  /**
   * @description The task.
   * @type {Task}
   */
  task: Task;
  /**
   * @description The request.
   * @type {any}
   */
  request: any;
  /**
   * @description The response.
   * @type {any}
   */
  response: any;
}
```

## MCPExecutionContext

@description The task.
@type {Task}
/
  task: Task;
  /**
@description The request.
@type {any}
/
  request: any;
  /**
@description The response.
@type {any}
/
  response: any;
}

/**
@description Represents a request specific to the MCP (Model Context Protocol) protocol.
The `protocol` field is narrowed to `Protocol.MCP`.

```typescript
extends BaseExecutionContext<MCPContext> {
  protocol: Protocol.MCP;
  /**
   * @description The request.
   * @type {any}
   */
  request: any;
  /**
   * @description The response.
   * @type {any}
   */
  response: any;
  /**
   * @description The transport.
   * @type {any}
   */
  transport: any;
  /**
   * @description The skills.
   * @type {AgentSkill[]}
   */
  skills?: AgentSkill[];
}
```

## NLWebExecutionContext

@description The request.
@type {any}
/
  request: any;
  /**
@description The response.
@type {any}
/
  response: any;
  /**
@description The transport.
@type {any}
/
  transport: any;
  /**
@description The skills.
@type {AgentSkill[]}
/
  skills?: AgentSkill[];
}

/**
@description Represents a request specific to the NLWeb protocol.
The `protocol` field is narrowed to `Protocol.NLWEB`.

```typescript
extends Omit<MCPExecutionContext, "protocol"> {
  protocol: Protocol.NLWEB;
}
```

## ACPExecutionContext

@description Represents a request specific to the ACP (Agent Communication Protocol).
The `protocol` field is narrowed to `Protocol.ACP`.

```typescript
extends BaseExecutionContext {
  protocol: Protocol.ACP;
}
```

## ChatExecutionContext

@description Represents a request specific to the CHAT protocol.
The `protocol` field is narrowed to `Protocol.CHAT`.

```typescript
extends BaseExecutionContext {
  protocol: Protocol.CHAT;
}
```

## SupportedContext

@description A discriminated union of all protocol-specific request types.
This allows functions to accept any request and use the `protocol`
field to determine the specific type of request, enabling type-safe
handling based on the protocol.

```typescript
=
  | A2AExecutionContext
  | MCPExecutionContext
  | ACPExecutionContext
  | ChatExecutionContext;

/**
 * @description The execution context.
 */
export interface ExecutionContext<
  ContextType extends BaseExecutionContext = SupportedContext,
> {
  /**
   * @description The id.
   * @type {string}
   */
  id: string;
  /**
   * @description The protocol.
   */
  protocol: Protocol;
  /**
   * @description The get request params.
   * @type {() => ContextType["params"] | undefined}
   */
  getRequestParams: () => ContextType["params"] | undefined;
  /**
   * @description The is cancelled.
   * @type {() => boolean}
   */
  isCancelled: () => boolean;
  /**
   * @description The request context.
   * @type {ContextType}
   */
  requestContext?: ContextType;
}
```

## ExecutionContext

@description The execution context.

```typescript
<
  ContextType extends BaseExecutionContext = SupportedContext,
> {
  /**
   * @description The id.
   * @type {string}
   */
  id: string;
  /**
   * @description The protocol.
   */
  protocol: Protocol;
  /**
   * @description The get request params.
   * @type {() => ContextType["params"] | undefined}
   */
  getRequestParams: () => ContextType["params"] | undefined;
  /**
   * @description The is cancelled.
   * @type {() => boolean}
   */
  isCancelled: () => boolean;
  /**
   * @description The request context.
   * @type {ContextType}
   */
  requestContext?: ContextType;
}
```

## AgentEngine

@description The id.
@type {string}
/
  id: string;
  /**
@description The protocol.
/
  protocol: Protocol;
  /**
@description The get request params.
@type {() => ContextType["params"] | undefined}
/
  getRequestParams: () => ContextType["params"] | undefined;
  /**
@description The is cancelled.
@type {() => boolean}
/
  isCancelled: () => boolean;
  /**
@description The request context.
@type {ContextType}
/
  requestContext?: ContextType;
}

/**
@description The agent engine.
@type {AgentEngine}

```typescript
<Context extends ExecutionContext = ExecutionContext> = (
  context: Context
) => AsyncGenerator<any, void, undefined>;

/**
 * @description The execution context config.
 * @type {const}
```

## executionContextConfig

@description The execution context config.
@type {const}

```typescript
= {
  id: "contextId",
  message: "userMessage",
}
```

