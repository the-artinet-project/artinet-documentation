# Quick Agents Guide

This guide explains how to use the Artinet SDK's Quick Agents feature to rapidly build, test, and deploy your agents.

## What are Quick Agents?

Quick Agents provide a streamlined way to:

1. **Bundle** your agent code and dependencies into a single file
2. **Test** your agent in a sandboxed environment
3. **Deploy** your agent to the Artinet platform (for beta users)

This feature is ideal for:

- Rapid prototyping
- Testing agent behavior without setting up a full server
- Sharing your agent with others
- Deploying to the Artinet ecosystem

## Key Components

The Quick Agents feature includes several important utilities:

- **`bundle`**: Packages your agent code and dependencies into a single distributable file
- **`taskHandlerProxy`**: Simplifies running your agent logic in managed environments
- **`fetchResponseProxy`**: Enables communication with other agents in the Artinet ecosystem
- **`testDeployment`**: Tests your bundled agent in a temporary sandboxed environment

## Bundling Your Agent

The first step is to bundle your agent's code:

```typescript
import { bundle } from "@artinet/sdk";
import { fileURLToPath } from "url";
import path from "path";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bundleMyAgent() {
  // Path to your agent's main file
  const agentPath = path.join(__dirname, "my-agent.ts");
  
  // Bundle the agent code
  const bundledCode = await bundle(new URL(`file://${agentPath}`));
  
  console.log("Agent bundled successfully!");
  return bundledCode;
}

bundleMyAgent()
  .then((bundledCode) => {
    // Save the bundled code to a file or use it for deployment
    console.log(`Bundled code size: ${bundledCode.length} bytes`);
  })
  .catch((error) => {
    console.error("Bundling failed:", error);
  });
```

## Creating a Quick Agent

When writing an agent for bundling, you can use the `taskHandlerProxy` to simplify the process:

```typescript
// my-agent.ts
import { taskHandlerProxy, fetchResponseProxy } from "@artinet/sdk";

// Define your agent's core logic as an async function
async function* myQuickAgent(context) {
  // Extract the user's message
  const userInput = context.userMessage.parts[0]?.text || "";
  
  // Signal that we're working on the task
  yield { state: "working" };

  // Do some processing...
  const response = `You said: "${userInput}"`;
  
  // Complete the task
  yield {
    state: "completed",
    message: {
      role: "agent",
      parts: [{ type: "text", text: response }]
    }
  };
}

// Export the agent wrapped in taskHandlerProxy
export default taskHandlerProxy(myQuickAgent);
```

## Testing Your Quick Agent

Before deploying, you can test your bundled agent:

```typescript
import { 
  testDeployment, 
  ServerDeploymentRequestParams, 
  SendTaskRequest 
} from "@artinet/sdk";

async function testMyAgent(bundledCode) {
  // Prepare deployment parameters
  const deploymentParams: ServerDeploymentRequestParams = {
    code: bundledCode
  };
  
  // Create test tasks to verify your agent's behavior
  const testRequests: SendTaskRequest[] = [
    {
      id: "test-1",
      message: {
        role: "user",
        parts: [{ type: "text", text: "Hello, agent!" }]
      }
    },
    {
      id: "test-2",
      message: {
        role: "user",
        parts: [{ type: "text", text: "What can you do?" }]
      }
    }
  ];
  
  console.log("Testing agent deployment...");
  
  try {
    // Process each test result as it completes
    for await (const result of testDeployment(deploymentParams, testRequests)) {
      console.log(`Result for task ${result.id}:`);
      
      if (result.message?.parts[0]?.type === "text") {
        console.log(`Response: ${result.message.parts[0].text}`);
      } else {
        console.log("Task completed with non-text response:", result);
      }
    }
    
    console.log("All test tasks completed successfully!");
  } catch (error) {
    console.error("Deployment test failed:", error);
  }
}
```

## Communication Between Agents

Your Quick Agent can communicate with other agents in the Artinet ecosystem using the `fetchResponseProxy`:

```typescript
import { taskHandlerProxy, fetchResponseProxy } from "@artinet/sdk";

async function* collaborativeAgent(context) {
  const userInput = context.userMessage.parts[0]?.text || "";
  
  yield { state: "working" };
  
  // Call another agent for assistance
  try {
    const helperResponse = await fetchResponseProxy(
      "WeatherExpertAgent", // Name of another agent in the Artinet ecosystem
      {
        role: "user",
        parts: [{ type: "text", text: `What's the weather in ${userInput}?` }]
      }
    );
    
    // Extract the helper agent's response
    const weatherInfo = helperResponse.message?.parts[0]?.text || "No weather information available";
    
    yield {
      state: "completed",
      message: {
        role: "agent",
        parts: [{ 
          type: "text", 
          text: `I asked my colleague about the weather in ${userInput}. Here's what they said:\n\n${weatherInfo}` 
        }]
      }
    };
  } catch (error) {
    yield {
      state: "error",
      message: {
        role: "agent",
        parts: [{ 
          type: "text", 
          text: `Sorry, I couldn't get weather information: ${error.message}` 
        }]
      }
    };
  }
}

export default taskHandlerProxy(collaborativeAgent);
```

## Complete Workflow Example

Here's a complete example that brings all the components together:

```typescript
import { 
  bundle, 
  testDeployment, 
  ServerDeploymentRequestParams,
  SendTaskRequest
} from "@artinet/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildAndTestAgent() {
  try {
    console.log("Step 1: Bundling agent code...");
    
    // Bundle your agent code
    const agentPath = path.join(__dirname, "my-quick-agent.ts");
    const bundledCode = await bundle(new URL(`file://${agentPath}`));
    
    console.log(`Successfully bundled agent (${bundledCode.length} bytes)`);
    
    // Optionally save the bundled code
    const outputPath = path.join(__dirname, "bundled-agent.js");
    fs.writeFileSync(outputPath, bundledCode);
    console.log(`Saved bundled code to: ${outputPath}`);
    
    console.log("\nStep 2: Testing agent in sandbox environment...");
    
    // Prepare deployment parameters
    const deploymentParams: ServerDeploymentRequestParams = {
      code: bundledCode,
      // You can add optional metadata about your agent
      metadata: {
        name: "My Quick Agent",
        version: "1.0.0",
        description: "A demonstration of the Quick Agents feature"
      }
    };
    
    // Create test scenarios
    const testRequests: SendTaskRequest[] = [
      {
        id: "greeting-test",
        message: {
          role: "user",
          parts: [{ type: "text", text: "Hello there!" }]
        }
      },
      {
        id: "question-test",
        message: {
          role: "user",
          parts: [{ type: "text", text: "What's your purpose?" }]
        }
      }
    ];
    
    // Test the agent with each scenario
    console.log("Running test cases...");
    for await (const result of testDeployment(deploymentParams, testRequests)) {
      console.log(`\nTest case: ${result.id}`);
      console.log(`Status: ${result.status.state}`);
      
      if (result.message?.parts[0]?.type === "text") {
        console.log(`Response: ${result.message.parts[0].text}`);
      } else if (result.artifacts?.length > 0) {
        console.log(`Generated ${result.artifacts.length} artifacts`);
        result.artifacts.forEach((artifact, index) => {
          console.log(`Artifact ${index + 1}: ${artifact.name} (${artifact.mimeType})`);
        });
      }
    }
    
    console.log("\nAll tests completed successfully!");
    console.log("\nStep 3: Your agent is ready for deployment to Artinet!");
    console.log("To join the beta and deploy your agent, email humans@artinet.io");
    
  } catch (error) {
    console.error("Error during build and test process:", error);
  }
}

buildAndTestAgent();
```

## Limitations and Considerations

When using Quick Agents, be aware of these limitations:

1. **Test-Agents expire after 60 seconds** by default (you can request longer durations for testing complex agents)

2. **Limited environment access**:
   - Quick Agents do not have access to a filesystem
   - Network access is restricted
   - No persistent storage is available

3. **Resource constraints**:
   - Memory and CPU usage are limited
   - Large dependencies may affect performance

## Beta Access for Deployment

The ability to permanently deploy agents to the Artinet platform is currently in beta. To join the waitlist:

1. Email humans@artinet.io with your request
2. Describe your agent's purpose and use case
3. Include any specific requirements or features you need

## Best Practices

For optimal results with Quick Agents:

1. **Keep dependencies minimal** - Large dependencies increase bundle size and startup time

2. **Use efficient algorithms** - Quick Agents have resource constraints

3. **Implement timeouts** - Add timeouts for external operations to prevent hanging

4. **Handle errors gracefully** - Ensure your agent can recover from failed operations

5. **Test thoroughly** - Use a variety of test cases to verify behavior

6. **Structure your code carefully** - Organize your agent logic for clarity and maintainability

## FAQ

**Q: How long does it take to deploy a Quick Agent?**
A: Test deployments typically take a few seconds. Production deployments (for beta users) may take 1-2 minutes.

**Q: Can I use external APIs in my Quick Agent?**
A: Yes, using the fetchResponseProxy, but be mindful of rate limits and timeouts.

**Q: How do I update a deployed agent?**
A: For beta users, you can deploy a new version which will replace the previous one.

**Q: What's the difference between testDeployment and actual deployment?**
A: testDeployment creates a temporary sandbox that expires after 60 seconds. Actual deployment (for beta users) creates a permanent agent instance in the Artinet ecosystem.

**Q: Can my Quick Agent maintain state between invocations?**
A: Test agents cannot maintain state. For beta users, limited persistence capabilities are planned.

## Next Steps

After mastering Quick Agents:

1. Explore more complex agent architectures
2. Implement collaboration between multiple agents
3. Consider joining the beta program for production deployment
4. Explore integrations with other AI services and tools