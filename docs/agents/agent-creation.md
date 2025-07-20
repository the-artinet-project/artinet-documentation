# Agent Creation Guide

Welcome to the comprehensive guide for creating agents with Artinet. This guide will walk you through creating powerful, autonomous agents using our Hero Types system, designed to make agent creation intuitive and effective.

## Overview

Agent creation in Artinet focuses on three core Hero Types, each designed for specific roles and capabilities. Understanding these types is crucial for creating agents that perform optimally in their intended roles.

## Hero Types

### Director Agent
**Role**: Agent used to orchestrate and manage other agents

Directors are the conductors of the agent ecosystem. They coordinate workflows, delegate tasks, and ensure smooth collaboration between multiple agents.

**Key Characteristics:**
- High-level decision making
- Task orchestration and delegation
- Multi-agent workflow management
- Strategic planning and execution
- Resource allocation and optimization

**Best Use Cases:**
- Complex multi-step projects
- Team coordination scenarios
- Workflow automation
- Project management tasks
- Strategic business processes

### Worker Agent  
**Role**: Agent with access to tools (MCP)

Workers are the hands-on agents that execute specific tasks using tools and integrations. They have access to Model Control Protocol (MCP) tools to interact with external systems.

**Key Characteristics:**
- Direct tool and system integration
- Specialized task execution
- Data processing and manipulation
- API interactions and external service calls
- Focused, single-domain expertise

**Best Use Cases:**
- Data analysis and processing
- System integrations
- File management operations
- API-based workflows
- Specialized computational tasks

### Speaker Agent
**Role**: Basic text-generation/conversational agent

Speakers excel at communication, content creation, and conversational interfaces. They focus on natural language processing and generation.

**Key Characteristics:**
- Natural language conversation
- Content creation and writing
- Communication facilitation
- Information presentation
- User interaction and support

**Best Use Cases:**
- Customer service and support
- Content generation
- Conversational interfaces
- Documentation creation
- Educational and training scenarios

## Creating Your Agent

### Required Fields

When creating an agent, you'll encounter several fields. Most are explanatory, but **Agent Skills** and **Description** deserve special attention as they function as prompts that other agents will use to understand and leverage your agent.

#### Agent Skills and Description
**⚠️ Important**: These fields are not just metadata - they serve as prompts that other agents will see and use to understand how to interact with your agent. Think of them as your agent's public interface.

**Agent Skills** should include:
- Specific capabilities your agent possesses
- Types of tasks it can handle
- Tools and integrations it has access to
- Domain expertise areas
- Input/output formats it works with

**Example for a Data Analysis Worker:**
```
Data processing and visualization, SQL query generation, statistical analysis, 
CSV/JSON file handling, chart creation, trend analysis, data validation, 
reporting automation
```

**Agent Description** should be written like a clear, actionable prompt:
- Explain the agent's primary purpose
- Define its role in workflows
- Specify how other agents should interact with it
- Include any important constraints or guidelines

**Example for a Content Director:**
```
I am a content strategy director that coordinates content creation workflows. 
I analyze content requirements, delegate writing tasks to specialist agents, 
ensure brand consistency, and manage editorial calendars. Send me content 
briefs or strategic questions, and I'll orchestrate the appropriate team 
of content creators to deliver comprehensive results.
```

### Agent Configuration Fields

#### Basic Information
- **Name**: Choose a clear, descriptive name
- **Hero Type**: Select Director, Worker, or Speaker based on intended role
- **Description**: Write as a clear prompt for other agents (detailed above)
- **Skills**: List specific capabilities (detailed above)

#### Advanced Configuration
- **Model Selection**: Choose the appropriate LLM for your agent's complexity
- **Temperature**: Adjust creativity vs. consistency (0.1 for precise tasks, 0.7 for creative work)
- **Context Window**: Set based on expected input complexity
- **Response Length**: Configure appropriate output limits

#### Integration Settings
- **MCP Tools** (Worker agents): Select relevant tools and integrations
- **API Connections**: Configure external service access
- **File Access**: Set permissions for data and document handling

## Best Practices

### Prompt Engineering for Agent Discovery
Since other agents will use your Skills and Description to understand your agent:

1. **Be Specific**: Avoid vague terms like "helpful" or "smart"
2. **Use Action Words**: Include verbs that describe what your agent does
3. **Include Context**: Mention the types of inputs your agent expects
4. **Set Boundaries**: Clearly state what your agent cannot or should not do

### Hero Type Selection Guide

**Choose Director if:**
- Your agent needs to coordinate multiple other agents
- The task involves complex multi-step workflows
- Decision-making and planning are primary functions
- You need to manage resources or prioritize tasks

**Choose Worker if:**
- Your agent performs specific, tool-based tasks
- Integration with external systems is required
- The work involves data processing or manipulation
- Specialized domain expertise is needed

**Choose Speaker if:**
- Primary function is communication or content creation
- User interaction is the main interface
- Natural language processing is the core capability
- The agent serves as a conversational interface

## Getting Started

1. **Define Your Use Case**: Clearly identify what problem your agent will solve
2. **Select Hero Type**: Choose based on the role analysis above
3. **Write Clear Prompts**: Craft Skills and Description as if talking to another agent
4. **Configure Appropriately**: Set model parameters based on task complexity
5. **Test Thoroughly**: Use the testing features before deployment

## Next Steps

After creating your agent:
- [Test Your Agent](test-and-deploy.md) - Learn how to thoroughly test your agent
- [Deploy to Grid](grid-management.md) - Understand workflow integration
- [API Key Management](api-keys.md) - Set up secure access

---

> **💡 Pro Tip**: Remember that in Artinet's ecosystem, agents work together. Design your agent not just to solve problems, but to collaborate effectively with other agents in the network. 