# Code Documentation Guidelines

When contributing to the Artinet SDK, please use the following Doxygen-style comment patterns to ensure consistent documentation.

## Class Documentation

```typescript
/**
 * @brief Brief description of the class
 * 
 * Detailed description of what the class does and how to use it.
 * Include any important concepts or patterns the class implements.
 * 
 * @example
 * ```typescript
 * const instance = new ExampleClass(params);
 * instance.doSomething();
 * ```
 */
class ExampleClass {
  // Class implementation
}
```

## Method Documentation

```typescript
/**
 * @brief Brief description of the method
 * 
 * Detailed description of what the method does, including any side effects
 * or state changes it causes. Mention any exceptions that might be thrown.
 * 
 * @param paramName Description of the parameter, including type constraints and requirements
 * @param optionalParam Description of an optional parameter and its default value if omitted
 * @return Description of what the method returns, including possible error states
 * 
 * @example
 * ```typescript
 * const result = instance.methodName("input value");
 * console.log(result); // Expected output
 * ```
 */
public methodName(paramName: string, optionalParam?: number): ReturnType {
  // Method implementation
}
```

## Interface Documentation

```typescript
/**
 * @brief Brief description of the interface
 * 
 * Detailed explanation of the interface purpose and usage patterns.
 * Include information about when and why this interface should be implemented.
 * 
 * @example
 * ```typescript
 * class MyImplementation implements ExampleInterface {
 *   // Implementation details
 * }
 * ```
 */
interface ExampleInterface {
  /**
   * @brief Description of the property
   */
  propertyName: string;
  
  /**
   * @brief Description of the method
   * @param input Description of parameter
   * @return Description of return value
   */
  methodName(input: InputType): OutputType;
}
```

## Type Definition Documentation

```typescript
/**
 * @brief Brief description of the type
 * 
 * Detailed explanation of what this type represents and when to use it.
 * Include any constraints or special considerations.
 * 
 * @example
 * ```typescript
 * const value: ExampleType = {
 *   property: "value"
 * };
 * ```
 */
type ExampleType = {
  property: string;
  optional?: number;
};
```

## Function Documentation

```typescript
/**
 * @brief Brief description of the function
 * 
 * Detailed explanation of what the function does, including any side effects.
 * 
 * @param input Description of the input parameter
 * @return Description of the return value
 * @throws Description of any exceptions that might be thrown
 * 
 * @example
 * ```typescript
 * const result = utilityFunction("input");
 * ```
 */
function utilityFunction(input: string): number {
  // Function implementation
}
```

## Constants Documentation

```typescript
/**
 * @brief Brief description of the constant
 * 
 * Additional details about the constant, including where and how it's used.
 */
const IMPORTANT_CONSTANT = "value";
```

## File Headers

Each file should include a header comment describing the file's contents:

```typescript
/**
 * @fileoverview Brief description of the file
 * 
 * Detailed description of the file contents, purpose, and any important
 * concepts or patterns used within. Mention any dependencies.
 * 
 * @example
 * ```typescript
 * import { Something } from './this-file';
 * ```
 */
```

## Deprecation Notices

```typescript
/**
 * @brief Brief description of the deprecated item
 * 
 * @deprecated This feature will be removed in version X.Y.Z.
 * Use NewFeature instead.
 * 
 * @see {@link NewFeature} for the recommended alternative
 */
```

Following these guidelines will ensure that the SDK's documentation is consistent and comprehensive, making it easier for developers to understand and use the library correctly.