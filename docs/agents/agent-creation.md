# Agent Creation Guide

Welcome to the comprehensive guide for creating agents with Artinet. This guide will walk you through creating powerful, autonomous agents using our Hero Types system, designed to make agent creation intuitive and effective.

## Overview

Agent creation in Artinet focuses on three core Hero Types, each designed for specific roles and capabilities. Understanding these types is crucial for creating agents that perform optimally in their intended roles.

## Hero Types

### Director Agent
**Role**: Agent used to orchestrate and manage other agents

Directors are the conductors of the agent ecosystem. They coordinate workflows, delegate tasks, and ensure smooth collaboration between multiple agents.

**Key Characteristics:**
- High-level decision making and planning
- Task orchestration and delegation
- Multi-agent workflow management
- Strategic planning and execution

### Worker Agent  
**Role**: Agent with access to tools (MCP)

Workers are the hands-on agents that execute specific tasks using tools and integrations. They have access to Model Control Protocol (MCP) tools to interact with external systems.

**Key Characteristics:**
- Direct tool and system integration
- Specialized task execution
- Data processing and manipulation
- API interactions and external service calls
- Focused, single-domain expertise

### Speaker Agent
**Role**: Basic text-generation/conversational agent

Speakers excel at communication, content creation, and conversational interfaces. They focus on natural language processing and generation.

**Key Characteristics:**
- Natural language conversation
- Content creation and writing
- Communication facilitation
- Information presentation
- User interaction and support

## Creating Your Agent

### Required Fields

When creating an agent, you'll encounter several fields. Most are explanatory, but **Agent Skills** deserve special attention as their descriptions inform other agents on how best to use and leverage your agent. Think of them as your agent's public interface. 

**Agent Skills** should include:
- Specific capabilities your agent possesses
- Types of tasks it can handle
- Tools and integrations it has access to
- Domain expertise areas
- Input/output formats it works with

#### Basic Information
- **Name**: Choose a clear, descriptive name
- **Hero Type**: Select Director, Worker, or Speaker based on intended role
- **Description**: A clear description for others to understand what your agent does
- **Skills**: List specific capabilities (detailed above)

#### Advanced Configuration
- **Model Selection**: Choose the appropriate LLM for your agent's complexity

#### Integration Settings
- **MCP Tools** (Worker agents): Select relevant tools and integrations
- **API Connections**: Configure external service access
- **Agents** (Director agents): Ids of the agents the direct has access to (can be set using connections in the Grid)

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
- [Test Your Agent](test-and-deploy.md) - Learn how to test and deploy your agent
- [Deploy to Grid](grid-management.md) - Understand workflow integration
- [API Key Management](api-keys.md) - Generate keys

---

> **💡 Pro Tip**: Remember that in Artinet's ecosystem, agents work together. Design your agent not just to solve problems, but to collaborate effectively with other agents in the network. 