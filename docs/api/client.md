# A2AClient

## A2AClient

A2AClient is the main client class for interacting with Agent2Agent (A2A) protocol-compliant services.
It provides methods for sending tasks, retrieving statuses, canceling operations, and handling streaming responses.

```typescript
export class A2AClient implements Client {
  private baseUrl: URL;
  private cachedAgentCard: AgentCard | null = null;
  private customHeaders: Record<string, string> = {};
  private fallbackPath: string;
  /**
   * Creates a new A2AClient instance.
   * @param baseUrl The base URL for the A2A server.
   * @param headers Optional custom headers to include in all requests.
   */
  constructor(
    baseUrl: URL | string,
    headers: Record<string, string> = {},
    fallbackPath?: string
  ) {
    this.baseUrl = typeof baseUrl === "string" ? new URL(baseUrl) : baseUrl;
    this.customHeaders = headers;
    this.fallbackPath = fallbackPath ?? "/agent-card";
  }

  /**
   * Retrieves the AgentCard from the A2A server.
   * Caches the result after the first successful fetch.
   * @returns A promise resolving to the AgentCard.
   */
  async agentCard(): Promise<AgentCard> {
    if (this.cachedAgentCard) {
      return this.cachedAgentCard;
    }

    // Standard location for agent cards
    const wellKnownUrl = new URL("/.well-known/agent.json", this.baseUrl);
    try {
      try {
        if (!URL.canParse(wellKnownUrl)) {
          throw new Error("Invalid well-known URL");
        }
        const card: AgentCard = await executeGetRequest<AgentCard>(
          wellKnownUrl,
          this.customHeaders,
          "agent card (well-known)"
        );
        if (!card.name || card.name === null || card.name === undefined) {
          throw new Error("No agent card found");
        }

        this.cachedAgentCard = card as AgentCard;
        return this.cachedAgentCard;
      } catch (error) {
        const fallbackUrl = new URL(this.fallbackPath, this.baseUrl);
        const fallbackCard: AgentCard = await executeGetRequest<AgentCard>(
          fallbackUrl,
          this.customHeaders,
          "agent card (fallback)"
        );

        if (
          !fallbackCard.name ||
          fallbackCard.name === null ||
          fallbackCard.name === undefined
        ) {
          throw new Error("No fallback agent card found");
        }
        this.cachedAgentCard = fallbackCard;

        return this.cachedAgentCard;
      }
    } catch (error) {
      logError(
        "A2AClient:agentCard",
        "Failed to fetch or parse agent card:",
        error
      );

      throw INTERNAL_ERROR(
        `Could not retrieve agent card: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Refreshes the cached AgentCard by fetching it again from the server.
   * @returns A promise resolving to the updated AgentCard.
   */
  async refreshAgentCard(): Promise<AgentCard> {
    this.cachedAgentCard = null;
    return this.agentCard();
  }

  /**
   * Sends a task request to the agent (non-streaming).
   * @param params The parameters for the message/send method.
   * @returns A promise resolving to the Task object or null.
   */
  async sendMessage(params: MessageSendParams): Promise<Message | Task | null> {
    return await executeJsonRpcRequest<SendMessageRequest, SendMessageResponse>(
      this.baseUrl,
      "message/send",
      params,
      this.customHeaders
    );
  }

  /**
   * @deprecated Use sendMessage instead.
   * Sends a task request to the agent (non-streaming).
   * @param params The parameters for the message/send method.
   * @returns A promise resolving to the Task object or null.
   */
  async sendTask(params: MessageSendParams): Promise<Message | Task | null> {
    return await this.sendMessage(params);
  }

  /**
   * Sends a task and returns a subscription to status and artifact updates.
   * @param params Task parameters for the request
   * @returns An AsyncIterable that yields TaskStatusUpdateEvent or TaskArtifactUpdateEvent payloads.
   */
  sendStreamingMessage(params: MessageSendParams): AsyncIterable<UpdateEvent> {
    return executeStreamEvents<
      SendStreamingMessageRequest,
      SendStreamingMessageResponse
    >(this.baseUrl, "message/stream", params, this.customHeaders);
  }

  /**
   * @deprecated Use sendStreamingMessage instead.
   * Sends a task and returns a subscription to status and artifact updates.
   * @param params Task parameters for the request
   * @returns An AsyncIterable that yields TaskStatusUpdateEvent or TaskArtifactUpdateEvent payloads.
   */
  sendTaskSubscribe(params: MessageSendParams): AsyncIterable<UpdateEvent> {
    return this.sendStreamingMessage(params);
  }

  /**
   * Retrieves the current state of a task.
   * @param params The parameters for the tasks/get method.
   * @returns A promise resolving to the Task object or null.
   */
  async getTask(params: TaskQueryParams): Promise<Task | null> {
    return await executeJsonRpcRequest<GetTaskRequest, GetTaskResponse>(
      this.baseUrl,
      "tasks/get",
      params,
      this.customHeaders
    );
  }

  /**
   * Cancels a currently running task.
   * @param params The parameters for the tasks/cancel method.
   * @returns A promise resolving to the updated Task object (usually canceled state) or null.
   */
  async cancelTask(params: TaskIdParams): Promise<Task | null> {
    return await executeJsonRpcRequest<CancelTaskRequest, CancelTaskResponse>(
      this.baseUrl,
      "tasks/cancel",
      params,
      this.customHeaders
    );
  }

  /**
   * Sets or updates the push notification config for a task.
   * @param params The parameters for the tasks/pushNotificationConfig/set method (which is TaskPushNotificationConfig).
   * @returns A promise resolving to the confirmed TaskPushNotificationConfig or null.
   */
  async setTaskPushNotification(
    params: TaskPushNotificationConfig
  ): Promise<TaskPushNotificationConfig | null> {
    return await executeJsonRpcRequest<
      SetTaskPushNotificationConfigRequest,
      SetTaskPushNotificationConfigResponse
    >(
      this.baseUrl,
      "tasks/pushNotificationConfig/set",
      params,
      this.customHeaders
    );
  }

  /**
   * Retrieves the currently configured push notification config for a task.
   * @param params The parameters for the tasks/pushNotificationConfig/get method.
   * @returns A promise resolving to the TaskPushNotificationConfig or null.
   */
  async getTaskPushNotification(
    params: TaskIdParams
  ): Promise<TaskPushNotificationConfig | null> {
    return await executeJsonRpcRequest<
      GetTaskPushNotificationConfigRequest,
      GetTaskPushNotificationConfigResponse
    >(
      this.baseUrl,
      "tasks/pushNotificationConfig/get",
      params,
      this.customHeaders
    );
  }

  /**
   * Resubscribes to an existing task's update stream.
   * @param params Parameters identifying the task to resubscribe to
   * @returns An AsyncIterable that yields TaskStatusUpdateEvent or TaskArtifactUpdateEvent payloads.
   */
  resubscribeTask(params: TaskQueryParams): AsyncIterable<UpdateEvent> {
    return executeStreamEvents<
      TaskResubscriptionRequest,
      SendStreamingMessageResponse
    >(this.baseUrl, "tasks/resubscribe", params, this.customHeaders);
  }

  /**
   * Checks if the server supports a specific capability based on the agent card.
   * @param capability The capability to check (e.g., 'streaming', 'pushNotifications').
   * @returns A promise resolving to true if the capability is supported.
   */
  async supports(
    capability: "streaming" | "pushNotifications" | "stateTransitionHistory"
  ): Promise<boolean> {
    try {
      const card = await this.agentCard();

      if (!card.capabilities) {
        return false;
      }

      switch (capability) {
        case "streaming":
          return !!card.capabilities.streaming;
        case "pushNotifications":
          return !!card.capabilities.pushNotifications;
        case "stateTransitionHistory":
          return !!card.capabilities.stateTransitionHistory;
        default:
          return false;
      }
    } catch (error) {
      logError(
        "A2AClient:supports",
        `Failed to determine support for capability '${capability}':`,
        error
      );
      return false; // Assume not supported if card fetch fails
    }
  }

  /**
   * Sets custom headers to be included in all requests.
   * @param headers A record of header name/value pairs.
   */
  setHeaders(headers: Record<string, string>): void {
    this.customHeaders = { ...headers };
  }

  /**
   * Adds a single custom header to be included in all requests.
   * @param name The header name.
   * @param value The header value.
   */
  addHeader(name: string, value: string): void {
    this.customHeaders[name] = value;
  }

  /**
   * Removes a custom header.
   * @param name The header name to remove.
   */
  removeHeader(name: string): void {
    delete this.customHeaders[name];
  }

  /**
   * Clears all custom headers.
   */
  clearHeaders(): void {
    this.customHeaders = {};
  }
}
```

