# bundler.test

Tests for bundler.test functionality in the Artinet SDK.

## Test Suites

- bundle

## Source Code

```typescript
import { describe, it, expect } from "@jest/globals";
import { bundle } from "../src/index.js";
import { configureLogger } from "../src/index.js";

configureLogger({ level: "silent" });

describe("bundle", () => {
  it("should be defined", () => {
    expect(bundle).toBeDefined();
  });

  it("should bundle a file", async () => {
    const filePath = new URL("../examples/code-deployment.js", import.meta.url);
    const result = await bundle(filePath);
    expect(result).toBeDefined();

    // console.log("result: ", result);
  });
});

```

## Running the Tests

To run these tests:

1. Clone the Artinet SDK repository
2. Install dependencies with `npm install`
3. Run the tests with `npm test` or specifically with `npx jest bundler.test.ts`

## Coverage

<!-- Test coverage information will be filled in after running tests with coverage -->

