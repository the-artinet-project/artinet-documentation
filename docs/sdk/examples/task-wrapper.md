# task-wrapper

Example demonstrating task-wrapper

## Source Code

```typescript
export const taskHandlerProxy = async (taskHandler) => {
  if (!env.hostOnYield && !env.Context) {
    const err = new Error("invalid runtime environment");
    throw err;
  }
  const context = env.Context;
  const onYieldProxy = env.hostOnYield;

  if (!onYieldProxy || !context) {
    const err = new Error("invalid runtime environment");
    throw err;
  }
  const generator = taskHandler(context);
  for await (const yieldValue of generator) {
    onYieldProxy(yieldValue);
  }
};

export const fetchResponseProxy = async (agentID, messages) => {
  if (!env.hostFetchResponse) {
    const err = new Error("invalid runtime environment");
    throw err;
  }
  const fetchResponseImpl = env.hostFetchResponse;
  return fetchResponseImpl(agentID, messages);
};

```

## Usage

To run this example:

1. Clone the Artinet SDK repository
2. Navigate to the examples directory
3. Run `npx ts-node task-wrapper.js`

## Expected Output

<!-- Expected output will be filled in after testing -->

