# Create Quick Agent

A tool to create a Quick-Agent project via the CLI.

## Overview

`create-quick-agent` streamlines the initial setup process for building AI agents with the Artinet SDK, allowing you to get your new agent project up and running in minutes.

**Key Features:**
- 🚀 Quick project scaffolding with predefined templates
- 🎯 Multiple agent types (basic, coder, orchestrator)
- 📦 Automatic dependency installation
- 🛠️ Ready-to-use project structure
- 🔧 Pre-configured build and deployment scripts

## Installation & Usage

### Quick Start

```bash
# Using npx (recommended)
npx @artinet/create-quick-agent@latest

# Or install globally
npm install -g @artinet/create-quick-agent
create-quick-agent
```

### Interactive Workflow

1. Run the command
2. Select a template from the available options
3. Enter your project name
4. The tool creates your project directory
5. Dependencies are automatically installed
6. Follow the generated instructions to start developing

## Available Templates

The tool provides several pre-built templates to jumpstart your agent development:

### echo agent
- **Template ID**: `basic`
- **Description**: a simple echo agent that returns your original message. (best for beginners)

### coding agent
- **Template ID**: `coder`
- **Description**: a coding agent that will return code snippets based on your requests.

### orchestrator agent
- **Template ID**: `orchestrator`
- **Description**: an orchestrator agent that can call other agents to get the information it needs.



## Template Structure

Each generated project includes:

- **`agent.js`** - Main agent logic and task handler
- **`package.json`** - Project configuration and dependencies  
- **`launch.js`** - Local development server
- **`deploy.js`** - Production deployment script
- **`test-deploy.js`** - Test deployment functionality
- **`lib/`** - Configuration files (card.js, deployment.js, etc.)

### Example Project Structure

```
my-agent-project/
├── agent.js              # Main agent implementation
├── package.json          # Project dependencies
├── launch.js             # Development server
├── deploy.js             # Production deployment
├── test-deploy.js        # Test runner
└── lib/
    ├── card.js           # Agent card configuration
    ├── deployment.js     # Deployment configuration
    └── artinet-agent.js  # Artinet platform integration
```

## Template Details

### Basic Template

**Files included**: agent.js, deploy.js, launch.js, lib, package.json, test-deploy.js

**Description**: a simple echo agent that returns your original message.

**Agent Preview**:
```javascript
/**
 * Basic Agent Example
 *
 * This example demonstrates how to create a simple agent
 * that responds to incoming tasks.
 */

export async function* demoAgent(context) {
  // Extract the user's message
  const userText = context.userMessage.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ");

  console.log(`Processing request: ${userText}`);

  // Send a "working" status update
  yield {
    state: "working",
    message: {
// ... (truncated for brevity)
```


### Coder Template

**Files included**: agent.js, deploy.js, lib, package.json, test-deploy.js

**Description**: a coding agent that will return code snippets based on your requests.

**Agent Preview**:
```javascript
import { artinet } from "@artinet/sdk/agents";

export async function* demoAgent({ task, history }) {
  history = [...history, ...(task.status.message ? [task.status.message] : [])];
  const messages = (history ?? [])
    .map((m) => ({
      role: m.role === "agent" ? "model" : "user",
      content: m.parts
        .filter((p) => !!p.text)
        .map((p) => p.text)
        .join("\n"),
    }))
    .filter((m) => m.content.length > 0);

  if (messages.length === 0) {
    console.warn(`[CoderAgent] No history/messages found for task ${task.id}`);
    yield {
      state: "failed",
      message: {
        role: "agent",
// ... (truncated for brevity)
```


### Orchestrator Template

**Files included**: agent.js, deploy.js, lib, package.json, test-deploy.js

**Description**: an orchestrator agent that can call other agents to get the information it needs.

**Agent Preview**:
```javascript
import { artinet } from "@artinet/sdk/agents";

export async function* demoAgent({ userMessage, isCancelled }) {
  yield {
    state: "working",
    message: {
      role: "agent",
      parts: [{ text: "Thinking about your request...", type: "text" }],
    },
  };

  const userText = userMessage.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join(" ");

  // Create a response
  let response = `Failed to send task`;

  try {
// ... (truncated for brevity)
```



## Development Workflow

After creating your project:

1. **Navigate to your project**:
   ```bash
   cd your-project-name
   ```

2. **Test your agent locally**:
   ```bash
   npm test
   ```

3. **Start development server**:
   ```bash
   npm start
   ``` 

4. **Deploy to production**:
   ```bash
   npm run deploy
   ```

## Configuration

### Agent Card

Update the `./lib/card.js` file to customize your agent's metadata:

```javascript
export const agentCard = {
  name: "your-agent-name",
  description: "Your agent description",
  url: "https://your-agent.example.com/api",
  version: "1.0.0",
  capabilities: {
    streaming: false,
    pushNotifications: false,
    stateTransitionHistory: false,
  },
  skills: [
    {
      id: "your-skill",
      name: "Your Skill",
      description: "What your agent can do",
    },
  ],
};
```

### Environment Variables

For deployment, ensure you have:

```bash
ARTINET_API_KEY=your_api_key_here
```

## Requirements

- **Node.js**: >=22.0.0
- **npm**: Comes with Node.js

## Package Information

- **Version**: 0.0.6
- **License**: Apache-2.0
- **Repository**: [https://github.com/the-artinet-project/create-quick-agent](https://github.com/the-artinet-project/create-quick-agent)

## Links

- [Artinet SDK Documentation](https://the-artinet-project.github.io/artinet-documentation/)
- [GitHub Repository](https://github.com/the-artinet-project/create-quick-agent)
- [npm Package](https://www.npmjs.com/package/@artinet/create-quick-agent)

## Contributing

Contributions are welcome! Please see the [repository](https://github.com/the-artinet-project/create-quick-agent) for guidelines on:

- Submitting bug reports
- Requesting new features  
- Contributing template improvements
- Adding new agent templates

