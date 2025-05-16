# basic-usage

Basic usage example for the Artinet SDK

This example demonstrates how to:
- Create an A2AClient instance
- Get the agent card
- Send a simple task
- Handle the response

## Source Code

```typescript
/**
 * Basic usage example for the Artinet SDK
 *
 * This example demonstrates how to:
 * - Create an A2AClient instance
 * - Get the agent card
 * - Send a simple task
 * - Handle the response
 */

import { A2AClient } from "../dist/index.js";

async function main() {
  try {
    // Create a new client instance pointing to our local server
    const client = new A2AClient("http://localhost:3000/api");
    console.log("Client initialized");

    // Get the agent card to discover capabilities
    try {
      const agentCard = await client.agentCard();
      console.log(`Connected to agent: ${agentCard.name}`);
      console.log(`Agent version: ${agentCard.version}`);
      console.log(
        `Streaming supported: ${
          agentCard.capabilities.streaming ? "Yes" : "No"
        }`
      );
    } catch (error) {
      console.log("Could not retrieve agent card, continuing anyway...");
      console.error(error);
    }

    // Create a message to send
    const message = {
      role: "user",
      parts: [
        {
          type: "text",
          text: "Hello! Can you help me with a question about climate change?",
        },
      ],
    };

    // Generate a unique task ID
    const taskId = `task-${Date.now()}`;

    // Send a task
    console.log(`Sending task with ID: ${taskId}...`);

    const task = await client.sendTask({
      id: taskId,
      message,
    });

    if (task) {
      console.log(`Task status: ${task.status.state}`);

      if (task.status.message) {
        // Extract the text parts from the response
        const textParts = task.status.message.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text);

        console.log("Agent response:", textParts.join("\n"));
      }
    } else {
      console.log("No task response received");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run the example
main().catch(console.error);

```

## Usage

To run this example:

1. Clone the Artinet SDK repository
2. Navigate to the examples directory
3. Run `npx ts-node basic-usage.js`

## Expected Output

<!-- Expected output will be filled in after testing -->

