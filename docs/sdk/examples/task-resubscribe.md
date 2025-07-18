# task-resubscribe

Task resubscription example for the Artinet SDK

This example demonstrates how to:
- Create an A2AClient instance
- Send a task without subscribing initially
- Resubscribe to an existing task to get updates

## Source Code

```typescript
/**
 * Task resubscription example for the Artinet SDK
 *
 * This example demonstrates how to:
 * - Create an A2AClient instance
 * - Send a task without subscribing initially
 * - Resubscribe to an existing task to get updates
 */

import { A2AClient } from "../dist/index.js";

async function main() {
  try {
    // Create a new client instance pointing to our local server
    const client = new A2AClient("http://localhost:3000/api");
    console.log("Client initialized");

    // Create a message to send
    const message = {
      role: "user",
      parts: [
        {
          type: "text",
          text: "Generate a detailed analysis of climate change impacts over the next 50 years. This should take some time.",
        },
      ],
    };

    // Generate a unique task ID
    const taskId = `long-running-task-${Date.now()}`;
    console.log(`Sending task with ID: ${taskId}...`);

    // First, send the task without subscribing
    await client.sendMessage({
      id: taskId,
      message,
    });
    console.log("Task sent successfully");

    console.log("Simulating a client disconnect...");
    // In a real application, this might be triggered by a client reconnection
    // after a network interruption or browser refresh

    // Wait for 2 seconds to simulate time passing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Client reconnected, resubscribing to task...");

    // Now resubscribe to the task to get updates
    const stream = client.resubscribeTask({ id: taskId });
    console.log("Resubscribed to task");

    // Process the updates as they arrive
    console.log("Processing task updates after resubscription:");
    let responseText = "";

    for await (const update of stream) {
      // Check the type of update
      if ("status" in update) {
        console.log(`Task status update: ${update.status.state}`);

        // Process message if present
        if (update.status.message) {
          const textParts = update.status.message.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text);

          responseText = textParts.join("\n");
          console.log(`\nResponse text (${responseText.length} chars):`);
          console.log("-------------------");
          console.log(
            responseText.substring(0, 200) +
              (responseText.length > 200 ? "..." : "")
          );
          console.log("-------------------\n");
        }

        // Check if this is the final update
        if (update.final) {
          console.log("Final update received, task is complete");
        }
      } else if ("artifact" in update) {
        // Handle artifact updates
        console.log(`Received artifact: ${update.artifact.name || "unnamed"}`);

        // Process artifact parts
        for (const part of update.artifact.parts) {
          if (part.type === "text") {
            console.log(`Artifact text: ${part.text.substring(0, 100)}...`);
          } else if (part.type === "file") {
            console.log(`Artifact file: ${part.file.name || "unnamed"}`);
            // In a real app, you might download the file from part.file.uri
          }
        }
      }
    }

    console.log("Task stream completed");
  } catch (error) {
    console.error("Error:", error.message);

    // If there's an error, try to get the current status of the task
    if (error.message.includes("connection") && client) {
      console.log("Attempting to check task status...");
      try {
        const taskId = error.taskId || `long-running-task-${Date.now() - 2000}`;
        const taskStatus = await client.getTask(taskId);
        console.log("Current task status:", taskStatus);
      } catch (statusError) {
        console.error("Could not retrieve task status:", statusError.message);
      }
    }
  }
}

// Run the example
main().catch(console.error);

```

## Usage

To run this example:

1. Clone the Artinet SDK repository
2. Navigate to the examples directory
3. Run `npx ts-node task-resubscribe.js`

## Expected Output

<!-- Expected output will be filled in after testing -->

