---
title: "MCP Stdio Server: Debug"
sequence: "102"
---

[UP](/spring-ai/index.html)

```text
McpTransport --- McpSchema --- McpSession --- McpServer (handler)
```

## 调试技巧

### 思路

MCP 使用 Client-Server 模式，因此有两个主体，
一个是 MCP Server，另一个是 MCP Client。

在 MCP Server 启动之后，它虽然“安安静静”的（不用 `System.out.println()`输出），
但是，它一定在“某个地方”在等待 MCP Client 的消息，然后进行响应。

更进一步的说，MCP Server 的『某个线程』在**阻塞**着。
『某个线程』在阻塞着干什么呢？在等待接收 MCP Client 发来的信息。

### 具体操作

第 1 步，以 Debug 方式运行程序，并点击“暂停”按钮。

![](/assets/images/spring-ai/mcp/debug/mcp-sdio-server-debug-001.png)

第 2 步，找到『某个线程』，例如 `pool-1-thread-1`

![](/assets/images/spring-ai/mcp/debug/mcp-sdio-server-debug-002.png)

第 3 步，通过方法层级调用的 Stack Frame 信息，找到 MCP 中具体的代码位置（即 `StdioServerTransportProvider.java` 的第 206 行）

![](/assets/images/spring-ai/mcp/debug/mcp-sdio-server-debug-003.png)

第 4 步，分析代码的逻辑：

```text
line --> message --> inboundSink.tryEmitNext(message)
```

但是，`inboundSink.tryEmitNext(message)` 是一个异步操作，我们需要找到真正的处理逻辑：

![](/assets/images/spring-ai/mcp/debug/mcp-sdio-server-debug-004.png)

第 5 步，继续跟踪 `inboundSink`

找到 `inboundSink` 的字段定义：

![](/assets/images/spring-ai/mcp/debug/mcp-sdio-server-debug-005.png)

找到 `inboundSink` 的字段使用：

- 真正的处理逻辑在 `session.handle(message)`

![](/assets/images/spring-ai/mcp/debug/mcp-sdio-server-debug-006.png)

第 6 步，探索 `McpServerSession.handle(message)` 方法

![](/assets/images/spring-ai/mcp/debug/mcp-sdio-server-debug-007.png)

找到 `handleIncomingRequest()` 方法

![](/assets/images/spring-ai/mcp/debug/mcp-sdio-server-debug-008.png)

第 7 步，探索 `McpServerSession.handleIncomingRequest()` 方法

![](/assets/images/spring-ai/mcp/debug/mcp-sdio-server-debug-009.png)

第 8 步，探索 `McpRequestHandler.handle()` 方法

![](/assets/images/spring-ai/mcp/debug/mcp-sdio-server-debug-010.png)

## 测试

```text
{"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{"sampling":{},"elicitation":{},"roots":{"listChanged":true},"tasks":{"list":{},"cancel":{},"requests":{"sampling":{"createMessage":{}},"elicitation":{"create":{}}}}},"clientInfo":{"name":"inspector-client","version":"0.21.1"}},"jsonrpc":"2.0","id":0}
```

```text
{"method":"notifications/initialized","jsonrpc":"2.0"}
```

```text
{"method":"tools/list","params":{"_meta":{"progressToken":2}},"jsonrpc":"2.0","id":2}
```

```text
{"method":"tools/call","params":{"name":"calculator","arguments":{"operation":"add","a":5,"b":6},"_meta":{"progressToken":3}},"jsonrpc":"2.0","id":3}
```
