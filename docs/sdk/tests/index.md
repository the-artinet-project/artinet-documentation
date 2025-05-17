# Artinet SDK Tests

This section contains documentation for the test suite of the Artinet SDK.

## Available Tests

- [a2a-protocol.test](a2a-protocol.test.md) - Tests for a2a protocol.test
- [bundler.test](bundler.test.md) - Tests for bundler.test
- [client.test](client.test.md) - Tests for client.test
- [common-errors.test](common-errors.test.md) - Tests for common errors.test
- [file-storage.test](file-storage.test.md) - Tests for file storage.test
- [http-utils.test](http-utils.test.md) - Tests for http utils.test
- [integration.test](integration.test.md) - Tests for integration.test
- [register.test](register.test.md) - Tests for register.test
- [rpc-client.test](rpc-client.test.md) - Tests for rpc client.test
- [server-error-handling.test](server-error-handling.test.md) - Tests for server error handling.test
- [server-impl.test](server-impl.test.md) - Tests for server impl.test
- [server.test](server.test.md) - Tests for server.test
- [streaming.test](streaming.test.md) - Tests for streaming.test

## Running All Tests

To run the full test suite:

1. Clone the Artinet SDK repository
2. Install dependencies with `npm install`
3. Run all tests with `npm test`

## Test Coverage

To generate a test coverage report:

```bash
npm test -- --coverage
```

This will create a coverage report that can be viewed in the browser.
