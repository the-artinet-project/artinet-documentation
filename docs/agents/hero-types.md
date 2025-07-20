# Hero Types: Director, Worker, and Speaker

Artinet's Hero Types system provides a powerful framework for creating specialized agents designed for specific roles within multi-agent workflows. Understanding these types is essential for building effective agent ecosystems.

## Understanding Hero Types

Hero Types represent different operational paradigms that determine how your agent functions, interacts with other agents, and handles tasks. Each type is optimized for specific use cases and comes with unique capabilities and characteristics.

### Why Use Hero Types?

**Simplified Agent Creation**: Instead of building agents from scratch, Hero Types provide pre-configured templates optimized for specific roles.

**Better Agent Discovery**: Other agents can easily understand your agent's capabilities by identifying its Hero Type.

**Optimized Performance**: Each type is optimized for its intended use case, providing better performance and resource utilization.

**Seamless Integration**: Hero Types are designed to work together in complex workflows with minimal configuration.

## Director Agent

### Overview
Directors are the orchestrators of the agent ecosystem. They coordinate complex workflows, manage multiple agents, and make high-level strategic decisions. Think of them as project managers or conductors who don't necessarily do the detailed work themselves but ensure everything runs smoothly.

### Core Characteristics

**Strategic Decision Making**
- Analyzes complex scenarios and breaks them down into manageable tasks
- Makes routing decisions about which agents should handle specific work
- Prioritizes tasks and manages resource allocation
- Handles escalation and exception management

**Multi-Agent Coordination**
- Maintains awareness of connected agents and their capabilities
- Delegates tasks based on agent specializations and current workload
- Monitors progress and ensures workflow completion
- Manages dependencies between different tasks and agents

**Workflow Management**
- Understands complex business processes and workflows
- Sequences operations for optimal efficiency
- Handles parallel processing coordination
- Manages state across multiple operations

### Technical Capabilities

**Agent Communication**
- Direct integration with other agents via standardized protocols
- Ability to query agent status and capabilities
- Task delegation with clear success criteria
- Result aggregation from multiple sources

**Process Intelligence**
- Built-in workflow logic and decision trees
- Conditional routing based on data and context
- Loop and iteration handling for complex processes
- Error handling and recovery strategies

**Resource Management**
- Load balancing across connected agents
- Queue management for high-volume scenarios
- Resource optimization and conflict resolution
- Performance monitoring and adjustment

### Best Use Cases

**Complex Project Management**
```
Example: Content Production Director
- Receives content brief from client
- Analyzes requirements and breaks down into tasks
- Delegates writing to Speaker agents
- Assigns research to Worker agents
- Coordinates review and editing processes
- Manages timeline and quality control
```

**Business Process Automation**
- Order processing workflows
- Customer onboarding sequences
- Financial approval processes
- Compliance and audit workflows

**Multi-Step Data Processing**
- ETL pipeline coordination
- Data validation and quality assurance
- Report generation and distribution
- System integration workflows

**Strategic Analysis**
- Market research coordination
- Competitive analysis management
- Investment decision processes
- Risk assessment workflows

### Configuration Guidelines

**Prompt Design for Directors**
Focus on strategic thinking and coordination:

```
You are a strategic project director responsible for coordinating complex 
multi-agent workflows. You excel at breaking down complex requirements into 
actionable tasks, selecting the right agents for each job, and ensuring 
smooth collaboration between team members. You make decisions based on 
agent capabilities, current workload, and project priorities.

When given a complex task:
1. Analyze and break down requirements
2. Identify the best agents for each sub-task
3. Coordinate execution with clear success criteria
4. Monitor progress and handle any issues
5. Aggregate results and ensure quality

You delegate detailed work to specialist agents but maintain oversight 
and strategic control throughout the process.
```

**Skills and Capabilities**
- Project management and coordination
- Strategic analysis and decision making
- Multi-agent workflow orchestration
- Resource allocation and optimization
- Quality assurance and process improvement

## Worker Agent

### Overview
Workers are the hands-on specialists of the agent ecosystem. They excel at specific tasks, have access to tools and integrations, and focus on executing detailed operations. They are the subject matter experts who handle the technical, analytical, or specialized work.

### Core Characteristics

**Tool Integration**
- Direct access to Model Control Protocol (MCP) tools
- Integration with external APIs and services
- File system operations and data manipulation
- Database queries and data processing capabilities

**Specialized Expertise**
- Deep knowledge in specific domains or technologies
- Optimized for particular types of tasks or data
- Consistent execution of detailed operations
- High accuracy and reliability in their specialty area

**Focused Execution**
- Single-task focus for optimal performance
- Detailed processing of specific data types
- Thorough analysis within their domain
- Comprehensive output with detailed results

### Technical Capabilities

**MCP Tool Access**
- File operations (read, write, process various formats)
- API integrations (REST, GraphQL, webhooks)
- Database operations (SQL queries, data analysis)
- System operations (monitoring, deployment, automation)

**Data Processing**
- Advanced data manipulation and transformation
- Statistical analysis and computational operations
- Format conversion and data validation
- Batch processing and bulk operations

**External System Integration**
- CRM and business system connections
- Cloud service integrations
- Third-party tool coordination
- Real-time data synchronization

### Best Use Cases

**Data Analysis and Processing**
```
Example: Financial Analysis Worker
- Connects to financial databases and APIs
- Processes transaction data and market information
- Performs statistical analysis and trend detection
- Generates detailed reports and visualizations
- Integrates with Excel, databases, and reporting tools
```

**System Integration**
- API data synchronization
- Database management and queries
- File processing and conversion
- System monitoring and maintenance

**Specialized Computations**
- Statistical analysis and modeling
- Image and video processing
- Text analysis and NLP operations
- Mathematical calculations and simulations

**Technical Operations**
- Code analysis and review
- System deployment and management
- Security scanning and compliance checks
- Performance optimization and monitoring

### Configuration Guidelines

**Prompt Design for Workers**
Focus on detailed execution and tool usage:

```
You are a specialized data analysis worker with expertise in financial 
data processing and statistical analysis. You have access to database 
connections, API integrations, and analytical tools. You excel at:

- Processing large datasets with accuracy and efficiency
- Performing complex statistical analysis and modeling
- Generating detailed reports and visualizations
- Integrating data from multiple sources and systems

When given a task:
1. Clarify data requirements and sources
2. Gather and validate necessary data
3. Apply appropriate analytical methods
4. Generate comprehensive results with supporting details
5. Provide actionable insights and recommendations

Always use available tools to provide accurate, data-driven results.
```

**Skills and Capabilities**
- Specific tool proficiencies (databases, APIs, processing tools)
- Domain expertise (finance, marketing, operations, etc.)
- Data analysis and manipulation
- System integration and automation
- Quality assurance and validation

## Speaker Agent

### Overview
Speakers are the communication specialists of the agent ecosystem. They excel at natural language processing, content creation, and user interaction. They serve as the interface between technical systems and human users, translating complex information into understandable communication.

### Core Characteristics

**Natural Language Excellence**
- Advanced language understanding and generation
- Context-aware conversation management
- Tone and style adaptation based on audience
- Multi-language capabilities where needed

**Content Creation**
- High-quality writing and editing
- Creative content development
- Educational content and explanations
- Marketing and promotional materials

**User Interaction**
- Conversational interface management
- User needs assessment and clarification
- Feedback processing and response
- Escalation handling for complex issues

### Technical Capabilities

**Communication Optimization**
- Audience-specific language adaptation
- Format optimization (emails, documents, presentations)
- Brand voice and style consistency
- Accessibility and clarity optimization

**Content Intelligence**
- Context-aware content generation
- Research synthesis and summarization
- Information organization and presentation
- Creative ideation and brainstorming

**Interactive Features**
- Real-time conversation management
- Multi-turn dialogue handling
- Context retention across interactions
- Personalization and user preference learning

### Best Use Cases

**Customer Service and Support**
```
Example: Customer Support Speaker
- Handles customer inquiries with empathy and expertise
- Provides clear explanations of products and policies
- Escalates complex issues to appropriate specialists
- Maintains brand voice and customer satisfaction
- Follows up on resolutions and gathers feedback
```

**Content Creation**
- Blog posts and articles
- Marketing copy and advertisements
- Educational materials and tutorials
- Documentation and user guides

**Communication Management**
- Email communication and responses
- Social media management
- Internal communications and announcements
- Meeting facilitation and note-taking

**User Interface and Experience**
- Chatbot and virtual assistant interactions
- Onboarding and user guidance
- Help system and FAQ management
- User feedback collection and processing

### Configuration Guidelines

**Prompt Design for Speakers**
Focus on communication excellence and user experience:

```
You are an expert communication specialist focused on creating clear, 
engaging, and helpful interactions with users. You excel at understanding 
user needs, explaining complex concepts simply, and maintaining a 
professional yet approachable tone.

Your core strengths:
- Clear, concise communication adapted to your audience
- Empathetic understanding of user concerns and questions
- Creative content creation that engages and informs
- Professional customer service with problem-solving focus

When interacting with users:
1. Listen carefully and ask clarifying questions
2. Provide clear, helpful responses in appropriate language
3. Offer additional resources and next steps
4. Maintain a positive, professional tone throughout
5. Escalate complex issues to appropriate specialists

Always prioritize user satisfaction and clear communication.
```

**Skills and Capabilities**
- Advanced language processing and generation
- Customer service and communication
- Content creation and editing
- User experience optimization
- Brand voice and style management

## Choosing the Right Hero Type

### Decision Framework

**Choose Director When:**
- Your task involves coordinating multiple steps or agents
- Strategic decision-making is required
- You need to manage workflows and processes
- Resource allocation and prioritization are important
- The solution requires orchestrating different specialists

**Choose Worker When:**
- Your task requires specific tools or integrations
- Detailed, specialized work is the primary function
- You need to process data or interact with external systems
- Technical expertise in a specific domain is crucial
- Consistent, reliable execution of specific operations is needed

**Choose Speaker When:**
- Communication and user interaction are primary functions
- Content creation and natural language processing are key
- You need to interface between technical systems and users
- Creative or educational content development is required
- Customer service and support are the main use cases

### Multi-Type Considerations

**Hybrid Scenarios**
Sometimes your use case might seem to fit multiple types. Consider:

- **Primary Function**: What is the agent's main responsibility?
- **User Interface**: How will other agents or users interact with it?
- **Tool Requirements**: Does it need specialized integrations?
- **Communication Needs**: Is natural language interaction crucial?

**Team Composition**
The most powerful Artinet implementations often combine all three types:
- Directors coordinate overall strategy and workflow
- Workers handle specialized technical operations
- Speakers manage communication and user interaction

## Best Practices

### Agent Design Principles

**Single Responsibility**
Each agent should excel at one primary function aligned with its Hero Type.

**Clear Interfaces**
Agent skills and descriptions should clearly indicate how other agents can interact with them.

**Type-Appropriate Optimization**
Configure model parameters, integrations, and capabilities based on the Hero Type requirements.

**Collaborative Design**
Design agents to work well with other types in multi-agent workflows.

### Common Pitfalls

**Type Misalignment**
- Don't use a Speaker for data processing tasks
- Avoid using Workers for strategic coordination
- Don't burden Directors with detailed execution work

**Over-Engineering**
- Keep each agent focused on its Hero Type strengths
- Don't try to make one agent do everything
- Use multiple specialized agents rather than one complex agent

**Under-Specification**
- Provide clear, detailed skills and descriptions
- Configure appropriate tools and integrations
- Set realistic performance expectations

## Migration and Evolution

### From Custom Agents
If you have existing custom agents, consider which Hero Type they most closely align with and refactor accordingly.

### Scaling Strategies
As your agent ecosystem grows:
- Use Directors to manage increasing complexity
- Add specialized Workers for new domains or tools
- Deploy Speakers for improved user experience

### Performance Optimization
Monitor agent performance and adjust Hero Type selection and configuration based on real-world usage patterns.

---

> **🎭 Hero Types Mastery**: The Hero Types system transforms agent development from complex custom coding into strategic role selection, enabling anyone to build sophisticated multi-agent systems with minimal technical complexity. 