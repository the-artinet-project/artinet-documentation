# Grid Management

The Agent Grid is Artinet's visual workflow builder that allows you to create multi-agent systems by connecting agents in sophisticated workflows. This guide covers everything you need to know about managing agents within the grid environment.

## Overview

The Agent Grid provides a drag-and-drop interface for:
- Adding existing agents to workflows
- Creating new agents directly in workflows
- Connecting agents through visual relationships
- Testing complex multi-agent scenarios
- Saving and loading workflow configurations

## Adding Agents to the Grid

### Adding Existing Agents

You can add any deployed agents to the grid workflow:

1. **Find Agent Registration ID**: Browse all deployed agents in the Explore list or your own My Agents list and copy the id for the agent you want to add
2. **Access Agent Library**: Click the **"Add Agent"** button in the grid interface and insert the registration id

### Adding New Agents

Create new agents directly within the grid environment:

1. **Click "New Agent"**: Select the new agent option in the grid and double click the agent to open the Creation Form
2. **Creation Form**: Fill out essential fields (name, type, prompt, skills, etc.)
4. **Immediate Integration**: Agent becomes available in the current workflow
5. **Refine Later**: Access full configuration options from the agent's create menu

## Connecting Agents

### Drag Connection System

The grid uses an intuitive drag-and-drop system for creating agent connections:

#### For Director Agents
Directors can manage multiple agents of all three types:

1. **Connection Points**: Director agents show multiple output connection points
2. **Drag to Connect**: Drag from Director's output to target agent's input
3. **Validation**: System validates connection compatibility automatically

### Connection Management
- **Remove Connection**: Remove the agent in the Director create menu to remove a connection

## Testing Within Grid

### Grid Testing Capabilities

The grid provides comprehensive testing for multi-agent workflows using the create agent [test and deploy](test-and-deploy.md) feature.

#### Director Testing Requirements
**Important**: Directors can only be fully tested if their connected child agents are deployed:

- **Deployment Check**: System verifies all connected agents are deployed
- **Warning System**: Clear indicators when child agents are not ready

## Saving and Loading Workflows

### Workflow Management

**Saving and Loading Workflows**:
- **Manual Save**: Save button for immediate saves to a json file
- **Manual Load**: Simply load up a json file that you have saved previously

## Next Steps

Master grid management and explore:

- [API Key Management](api-keys.md) - Secure workflow access
- [Test and Deploy](test-and-deploy.md) - Test/Deploy your agents and workflows
- [Agent Creation](agent-creation.md) - Create more specialized agents for your workflows

---

> **💡 Grid Mastery**: The Agent Grid transforms complex multi-agent coordination from code-heavy implementations into visual, manageable workflows that anyone can understand and modify. 