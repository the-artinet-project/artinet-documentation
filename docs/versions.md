# Version History

This page documents the version history of the Artinet SDK, highlighting breaking changes and important updates that may affect your integration.

## Migration Guides

### 0.5.x to 0.5.4 Migration

If you're upgrading to 0.5.4, be aware of the following breaking changes:

1. **Method Name Changes**: Core methods have been renamed to align with message-based approach:
   - `sendTask` → `sendMessage`
   - `sendTaskSubscribe` → `sendStreamingMessage`
   - Update push notification config methods to `tasks/pushNotificationConfig/set` and `tasks/pushNotificationConfig/get`

2. **Schema Import Paths**: Import paths have been refactored to use new schema structure under `schemas/a2a`

3. **Deprecated Submodules**: The `a2a-samples` and `mcp-use` submodules have been removed

### 0.3.x to 0.5.0 Migration

If you're upgrading from 0.3.x to 0.5.0, be aware of the following breaking changes:

1. **SystemError Constructor**: The `data` parameter in the `SystemError` constructor and all specific error factory functions (e.g., `PARSE_ERROR()`, `INVALID_PARAMS()`, `TASK_NOT_FOUND()`) is now mandatory.

2. **Express Server Refactoring**: The `createExpressServer` utility has been refactored:
   - No longer accepts a `port` parameter.
   - No longer creates or returns an `http.Server` instance.
   - Server starting is now handled within `A2AServer.start()` only.

3. **Type Definition Changes**: Optional properties are now defined using `type?` instead of `type | null`.

4. **Task Status Initialization**: When a task is initiated, the initial task status no longer includes a `message: null` field.

5. **Error Messaging**: Generic `METHOD_NOT_FOUND()` errors have been replaced with more specific `PUSH_NOTIFICATION_NOT_SUPPORTED()` errors.

## Detailed Version History

<!-- This section contains the consolidated changelog -->
# Changelog

All notable changes to the @artinet/sdk package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.4] - 2025-06-12

### Added
- New `ExecutionContext` interface for enhanced parameter management across services
- `MCPExecutionContext` and `NLWebExecutionContext` interfaces for protocol-specific request handling
- New schema organization under `schemas/a2a` directory for improved code structure

### Changed
- **BREAKING**: Renamed core methods to align with message-based approach:
  - `sendTask` → `sendMessage`
  - `sendTaskSubscribe` → `sendStreamingMessage`
  - Updated push notification config methods to `tasks/pushNotificationConfig/set` and `tasks/pushNotificationConfig/get`
- Refactored import paths to use new schema structure under `schemas/a2a`
- Enhanced error handling and validation for message parameters across the codebase
- Updated documentation to reflect new method names and functionalities

### Removed
- Deprecated submodules for `a2a-samples` and `mcp-use`

## [0.5.2] - 2025-05-25

### Added
- New `artinet.v0` namespace in `src/utils/deployment/agents.ts` providing `taskManager`, `connect`, and `agent` utilities. These are designed for agents running in sandboxed or managed environments, offering a standardized way to interact with the host system for task execution, inter-agent communication, and external API calls.
- Corresponding types for the new agent utilities in `src/types/proxy.ts`: `TaskProxy`, `TaskManagerProps`, `TaskManager`, `ConnectProps`, `ConnectAPICallback`, `ClientProxy`, `ClientProps`, `ClientFactory`.
- New `exports` path `./agents` in `package.json` to expose the `artinet.v0` utilities.
- New example file `examples/nested-deployment.ts` demonstrating how to use `artinet.v0.agent` for an agent to call another agent, and `artinet.v0.taskManager` for managing the agent's lifecycle.
- New `dev-pack` script in `package.json` for easier local development and packaging.

### Changed
- **Refactoring**:
    - `src/client/interfaces/client.ts` has been moved to `src/types/client.ts`.
    - `src/server/interfaces/context.ts` has been moved to `src/types/context.ts`.
    - Internal type imports throughout the codebase have been updated to reflect these changes.
- Examples `examples/code-deployment.js` and `examples/code-deployment.ts` have been updated to use the new `artinet.v0.taskManager` and `artinet.v0.connect` utilities instead of the deprecated proxy functions.
- Updated `@types/node` dependency to `^20.17.50`.

### Deprecated
- The `taskHandlerProxy` and `fetchResponseProxy` functions in `src/utils/deployment/task-wrapper.ts` are now deprecated. Developers should migrate to the new `artinet.v0.taskManager` and `artinet.v0.connect` utilities respectively.

### Removed
- Removed `json-schema-to-typescript` from `devDependencies` as it's no longer directly used.

### Fixed
- Minor wording update in the "QUICK-AGENT FAQs" section of `README.md` for clarity on searching by `registrationId/agentId`.

## [0.5.1] - 2025-05-12

### Added
- `fullDeployment` utility (`src/utils/deployment/full-deployment.ts`): Enables direct deployment of bundled agent code and its `AgentCard` to the Artinet platform. Requires an `ARTINET_API_KEY`.
- New comprehensive test suite for deployment features (`tests/deployment.test.ts`), covering `testDeployment` and `fullDeployment`.
- Agents registered via `A2AServer.registerServer()` or `register: true` now include `tags: ["a2a"]` in their registration payload.

### Changed
- The `handler` property in `A2AServerParams` (used to pass the agent's core logic) was previously documented and used in some examples as `taskHandler`. This has been corrected to `handler` consistently. While `taskHandler` might have worked due to object flexibility, `handler` is the intended property name.
- Clarified type description for `ServerDeploymentRequestParams.dependencies` to note it is "currently unsupported".
- Clarified type description for `BaseServerDeploymentResponseParams.deploymentId` regarding its value in full deployments.

### Fixed
- Improved error handling in `A2AClient` during `agentCard()` fetching:
    - Validates parsed URLs before use.
    - Ensures `AgentCard` objects contain a `name` property.
- Enhanced error logging in `src/transport/rpc/parser.ts` to include `error.message` for `SystemError` instances.
- Prevented agent registration via `register()` utility if the `AgentCard.url` is localhost, 127.0.0.1, or empty, returning an empty string instead of attempting registration.
- Corrected an issue in an example in `README.md` where `taskHandler` was used instead of `handler` for the `A2AServer` constructor (matches the breaking change clarification above).
- Minor stability improvement in `testDeployment` utility's event handling logic.

## [0.5.0] - 2025-05-10

### Added
- `A2AServer.getExpressApp()`: New method to access the underlying Express application instance, allowing for more flexible server customization and middleware integration.
- More specific error messages for various RPC errors (e.g., `TASK_NOT_FOUND`, `INVALID_PARAMS`, `PARSE_ERROR`), providing better debugging information and context.

### Changed
- **BREAKING**: The `data` parameter in the `SystemError` constructor and all specific error factory functions (e.g., `PARSE_ERROR()`, `INVALID_PARAMS()`, `TASK_NOT_FOUND()`) is now mandatory. This change aims to enhance error reporting by ensuring contextual information is always provided with errors.
- **BREAKING**: Refactored the `createExpressServer` utility (`src/server/lib/express-server.ts`):
    - It no longer accepts a `port` parameter.
    - It no longer creates or returns an `http.Server` instance (i.e., it doesn't call `app.listen()`). It now solely configures and returns the Express `app` instance.
    - The responsibility of starting the HTTP server is now fully handled within the `A2AServer.start()` method, which uses the `app` configured by `createExpressServer`.
- Updated numerous TypeScript type definitions in `src/types/schema.ts` to more strictly define optional properties. Many properties that were previously `type | null` are now just `type?`, and JSDoc `@default null` comments have been removed. This aligns with standard TypeScript practices where optional properties are either present with a value or absent (undefined), rather than being explicitly `null`.
- When a task is initiated via `A2AServer.sendTaskAndStore()`, the initial task status (`Task.status`) no longer includes a `message: null` field.
- In `src/server/lib/state.ts`, when creating a new task object during `loadState`, `sessionId` and `metadata` properties are assigned directly if provided, without defaulting to `null` if they are undefined.
- Replaced generic `METHOD_NOT_FOUND()` errors with more specific `PUSH_NOTIFICATION_NOT_SUPPORTED()` errors in `defaultSetTaskPushNotificationMethod` and `defaultGetTaskPushNotificationMethod` when the agent's card indicates that push notifications are not supported.

### Removed
- The test file `tests/deployment.test.ts` has been removed. The `testDeployment` utility and related "Quick-Agents" features remain.

### Improved
- The documentation section in `README.md` regarding agent code deployment has been renamed from "Agent Code Deployment (Beta)" to "Quick-Agents (Alpha)". This section includes updated descriptions, code examples for bundling and testing agents, and a new FAQ.
- Server startup logging in `A2AServer` now consistently uses `logInfo` for messages like "A2A Server started and listening".

## [0.4.1] - 2025-05-08

### Added

- Utility for bundling agent code using `esbuild` (`src/utils/deployment/bundler.ts`).
- Task handler wrapper (`taskHandlerProxy`) and `fetchResponseProxy` for streamlined agent deployment logic (`src/utils/deployment/task-wrapper.ts`, `examples/task-wrapper.js`).
- Test deployment functionality (`testDeployment`) to test agent deployments in a sandboxed environment (`src/utils/deployment/test-deployment.ts`).
- New types for server deployment requests and responses (`ServerDeploymentRequestParams`, `ServerDeploymentResponse`, etc. in `src/types/extended-schema.ts`).
- Comprehensive tests for the new bundler and deployment features (`tests/bundler.test.ts`, `tests/deployment.test.ts`).
- Example agents demonstrating code deployment: `examples/code-deployment.js` and `examples/code-deployment.ts`.
- `esbuild` dependency for bundling.

### Changed

- **BREAKING**: Updated `rootDir` in `tsconfig.json` to `src` and `declarationDir` to `./dist/types`. This changes the output structure for type declarations.
- Type declaration paths in `package.json` updated to `dist/types/index.d.ts` to reflect `tsconfig.json` changes.
- Deprecated `JSONRPCSuccessResponse`, `JSONRPCErrorResponse` in `src/types/extended-schema.ts` in favor of the more general `JSONRPCResponse`.
- Enhanced error logging in `src/transport/rpc/parser.ts` by adding response data to parse errors.

## [0.3.0] - 2025-04-28

### Added

- Server option `register: boolean` in `A2AServerParams` to automatically register the agent with the [A2A Registry](https://artinet.io) on startup (default: `false`).
- `A2AServer.registerServer()` method to manually trigger agent registration.
- Server option `fallbackPath: string` in `A2AServerParams` to customize the fallback endpoint for serving the Agent Card (defaults to `/agent-card`). The standard `/.well-known/agent.json` endpoint remains.
- Client constructor option `fallbackPath: string` in `A2AClient` to specify a custom path when fetching the Agent Card if the standard paths fail.

### Changed

- **BREAKING:** Renamed server configuration type from `A2AServerOptions` to `A2AServerParams` for consistency.
- Updated dependencies to latest versions:
    - `eventsource-parser` to `^3.0.1`. Adapted streaming logic (`handleEventStream`) to use `EventSourceMessage` type from this library.
    - `express` to `^5.1.0`.
    - `jayson` to `^4.2.0`.
    - `node:16` to `node:22`
    - `ES2020` to `ES2022`
- Updated various code examples in documentation for improved clarity and consistency (`README.md`, `examples/`).

### Improved

- Refactored server JSON-RPC method handling:
    - Introduced `createJSONRPCMethod` helper for wrapping A2A method logic with dependency injection and error handling.
    - Exported default implementations for standard A2A methods (e.g., `defaultSendTaskMethod`) from `lib/middleware/a2a-methods.js`.
    - Provided `defaultCreateJSONRPCServer` factory demonstrating standard server setup. This simplifies advanced server customization.
- Significantly revised and expanded `README.md` documentation:
    - Updated Features, Class Documentation, and Usage sections.
    - Added detailed section on Server Registration & Discovery.
    - Corrected and clarified Advanced Server Customization examples.
- Updated test suite to incorporate tests for new server registration and fallback path functionalities.

## [0.2.0] - 2025-04-25

### Fixed

- Fixed TypeScript errors related to the `eventsource-parser` package imports
  - Updated imports to use the correct types from `eventsource-parser` v1.1.1
  - Properly typed the `EventSourceMessage` as `ParsedEvent`
  - Refactored `createParser` implementation to match the package's API
- Fixed streaming response handler to use the correct event type checking

### Changed

- Updated `tsconfig.json` to add `isolatedModules: true` for better compatibility with `ts-jest`
- Modified `package.json` test scripts to include `NODE_OPTIONS=--experimental-vm-modules` flag to support ES modules in Jest tests

### Improved

- Expanded test suite to achieve 80% code coverage
  - Added tests for all client methods
  - Added robust error handling tests
  - Added tests for streaming functionality
  - Added tests for push notification configuration
  - Added tests for edge cases in agent card fetching and capability detection

## [0.1.0] - 2025-04-22

### Added

- Initial release of the @artinet/sdk package
- Implementation of the Agent2Agent (A2A) Protocol client
- Support for sending tasks, retrieving statuses, and canceling operations
- Support for streaming responses and push notifications
- Comprehensive test suite and documentation

[0.2.0]: https://github.com/the-artinet-project/artinet-sdk/commit/e0b908327e0251d6f6241f9b0294e16bc07fa527
[0.1.0]: https://github.com/the-artinet-project/artinet-sdk/commit/c07bd01a225b09de65b70144e8963b8a1143d324
