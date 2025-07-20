# API Key Management

API keys are essential for securing access to your agents and workflows in the Artinet ecosystem. This guide covers everything you need to know about generating, managing, and securing API keys for optimal agent operation.

## Overview

API keys in Artinet serve multiple purposes:
- **Agent Authentication**: Secure access to your deployed agents
- **Workflow Integration**: Connect external systems to your agent workflows
- **Resource Protection**: Control who can use your computational resources
- **Usage Tracking**: Monitor API consumption and billing
- **Access Control**: Fine-grained permissions for different use cases

## Generating API Keys

### Creating Your First API Key

1. **Navigate to API Management**: Go to your dashboard and select "API Keys"
2. **Click "Generate New Key"**: Start the key creation process
3. **Configure Key Settings**: Set permissions, expiration, and scope
4. **Copy and Secure**: Save the key immediately - it won't be shown again
5. **Test Integration**: Verify the key works with a simple API call

### API Key Configuration Options

#### Key Permissions
Set specific permissions for each API key:

**Agent Access Levels**:
- **Read Only**: Query agent status and retrieve results
- **Execute**: Send tasks to agents and trigger workflows  
- **Manage**: Modify agent configurations and settings
- **Full Access**: Complete control including deployment and deletion

**Resource Scope**:
- **Single Agent**: Access limited to one specific agent
- **Agent Group**: Access to a defined set of agents
- **All Agents**: Access to your entire agent ecosystem
- **Workflow Specific**: Access limited to specific workflows

#### Security Settings

**Expiration Options**:
- **30 Days**: Short-term keys for temporary integrations
- **90 Days**: Medium-term keys for project-based work
- **1 Year**: Long-term keys for production systems
- **No Expiration**: Permanent keys (use with caution)

**IP Restrictions**:
- **Any IP**: Allow access from any location (default)
- **Specific IPs**: Restrict to defined IP addresses
- **IP Ranges**: Allow access from specific network ranges
- **Dynamic IPs**: Support for changing IP addresses with validation

**Usage Limits**:
- **Rate Limiting**: Requests per minute/hour/day
- **Resource Quotas**: Computational resource consumption limits
- **Bandwidth Limits**: Data transfer restrictions
- **Concurrent Connections**: Maximum simultaneous connections

### Key Types and Use Cases

#### Development Keys
**Purpose**: Testing and development environments
- **Permissions**: Limited access to test agents
- **Expiration**: Short-term (30 days)
- **Rate Limits**: Low limits to prevent accidental overuse
- **IP Restrictions**: Development environment IPs only

#### Production Keys  
**Purpose**: Live applications and services
- **Permissions**: Specific to production requirements
- **Expiration**: Long-term or no expiration
- **Rate Limits**: Higher limits based on expected usage
- **IP Restrictions**: Production server IPs only

#### Integration Keys
**Purpose**: Third-party service connections
- **Permissions**: Minimal required permissions
- **Expiration**: Based on integration lifecycle
- **Rate Limits**: Moderate limits
- **IP Restrictions**: Service provider IP ranges

#### Emergency Keys
**Purpose**: Backup access and incident response
- **Permissions**: Full access for emergency situations
- **Expiration**: Short-term with regular rotation
- **Rate Limits**: High limits for rapid response
- **IP Restrictions**: Authorized personnel IPs only

## API Key Security Best Practices

### Key Generation Security

**Strong Key Generation**:
- Keys are generated using cryptographically secure random number generators
- Minimum 256-bit entropy for all production keys
- Unique keys with no predictable patterns
- Immediate encryption of keys in our systems

### Storage and Handling

**Secure Storage**:
- **Environment Variables**: Store keys as environment variables, not in code
- **Secrets Management**: Use dedicated secrets management systems
- **Encryption at Rest**: Encrypt stored keys with additional encryption
- **Access Logging**: Monitor and log all key access attempts

**Code Security**:
```bash
# ✅ Good - Using environment variable
export ARTINET_API_KEY="your-api-key-here"

# ❌ Bad - Hardcoded in code
api_key = "ak_1234567890abcdef"
```

**Version Control**:
- **Never commit keys**: Add API keys to .gitignore
- **Environment files**: Keep .env files out of repositories
- **Key scanning**: Use tools to scan for accidentally committed keys
- **Immediate rotation**: Rotate any keys that may have been exposed

### Key Rotation

**Regular Rotation Schedule**:
- **Production Keys**: Rotate every 90 days
- **Development Keys**: Rotate every 30 days
- **High-privilege Keys**: Rotate every 30 days
- **Emergency Keys**: Rotate after each use

**Rotation Process**:
1. Generate new key with same permissions
2. Update applications to use new key
3. Test all integrations with new key
4. Deactivate old key after verification
5. Monitor for any failed authentications

### Monitoring and Alerts

**Key Usage Monitoring**:
- **Unusual Patterns**: Alert on unexpected usage patterns
- **Failed Authentications**: Monitor failed API key attempts
- **Rate Limit Violations**: Track keys hitting rate limits
- **Geographic Anomalies**: Alert on access from unusual locations

**Security Alerts**:
- **Key Compromise**: Immediate alerts for suspected key theft
- **Privilege Escalation**: Monitor for unusual permission usage
- **Bulk Operations**: Alert on mass operations that could indicate misuse
- **New Key Creation**: Notify on new key generation

## API Key Management Interface

### Dashboard Features

**Key Overview**:
- **Active Keys**: List of all active API keys
- **Key Status**: Health and usage status of each key
- **Permission Summary**: Quick view of key permissions
- **Usage Statistics**: Recent usage patterns and metrics

**Key Details**:
- **Creation Date**: When the key was generated
- **Last Used**: Most recent API call timestamp
- **Usage Stats**: Detailed usage analytics
- **Security Events**: Log of security-related events

### Bulk Operations

**Multi-Key Management**:
- **Batch Rotation**: Rotate multiple keys simultaneously
- **Group Permissions**: Apply permission changes to key groups
- **Bulk Deactivation**: Quickly deactivate multiple keys
- **Export Configuration**: Export key settings for backup

### Audit and Compliance

**Audit Logging**:
- **Key Generation**: Log all key creation events
- **Permission Changes**: Track modifications to key permissions
- **Access Patterns**: Detailed logs of API key usage
- **Security Events**: Comprehensive security event logging

**Compliance Reports**:
- **Access Reports**: Who has access to what resources
- **Usage Reports**: Resource consumption by API key
- **Security Reports**: Security events and responses
- **Compliance Dashboards**: Real-time compliance status

## Integration Examples

### Basic Authentication

```bash
# Basic API call with authentication
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     "https://api.artinet.io/v1/agents/your-agent-id/execute"
```

### Python Integration

```python
import os
import requests

# Secure key retrieval from environment
api_key = os.getenv('ARTINET_API_KEY')

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.post(
    'https://api.artinet.io/v1/agents/execute',
    headers=headers,
    json={'task': 'your task here'}
)
```

### JavaScript Integration

```javascript
// Secure API key usage in Node.js
const apiKey = process.env.ARTINET_API_KEY;

const response = await fetch('https://api.artinet.io/v1/agents/execute', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        task: 'your task here'
    })
});
```

## Troubleshooting

### Common Issues

**Authentication Failures**:
- **Invalid Key**: Verify the key is copied correctly
- **Expired Key**: Check expiration date and rotate if needed
- **Wrong Permissions**: Ensure key has required permissions
- **IP Restrictions**: Verify request is from authorized IP

**Rate Limit Issues**:
- **Exceeded Limits**: Monitor usage and adjust limits if needed
- **Burst Traffic**: Implement proper request queuing
- **Multiple Keys**: Distribute load across multiple keys
- **Usage Optimization**: Optimize requests to reduce API calls

**Integration Problems**:
- **Header Format**: Ensure proper Authorization header format
- **HTTPS Requirements**: All API calls must use HTTPS
- **Request Format**: Verify JSON formatting and content types
- **Response Handling**: Implement proper error response handling

### Support and Recovery

**Key Recovery**:
- **Lost Keys**: Cannot be recovered - generate new keys
- **Compromised Keys**: Immediately deactivate and rotate
- **Access Issues**: Contact support with account verification
- **Emergency Access**: Use emergency key procedures

## Advanced Features

### Key Hierarchies

**Parent-Child Relationships**:
- **Master Keys**: Full access keys for system administration
- **Derived Keys**: Limited keys derived from master keys
- **Inheritance**: Permission inheritance from parent keys
- **Revocation**: Cascading revocation of child keys

### Integration Webhooks

**Key Event Notifications**:
- **Key Creation**: Notify when new keys are generated
- **Usage Anomalies**: Alert on unusual usage patterns
- **Security Events**: Immediate notification of security issues
- **Expiration Warnings**: Advance warning of key expiration

### Custom Permissions

**Advanced Permission Models**:
- **Time-based Access**: Keys that only work during specific hours
- **Geographic Restrictions**: Location-based access control
- **Resource Quotas**: Fine-grained resource usage limits
- **Conditional Access**: Context-aware permission evaluation

## Next Steps

Master API key management and explore:
- [Agent Creation](agent-creation.md) - Return to agent creation guide
- [Grid Management](grid-management.md) - Build visual workflows with your agents
- [Test and Deploy](test-and-deploy.md) - Deploy and monitor your agents

---

> **🔐 Security First**: Proper API key management is the foundation of secure agent operations. Always follow security best practices and regularly audit your key usage patterns. 