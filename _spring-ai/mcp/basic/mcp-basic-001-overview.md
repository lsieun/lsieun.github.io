---
title: "MCP Overview"
sequence: "101"
---

[UP](/spring-ai/index.html)

## 引入依赖

```xml
<!-- Source: https://mvnrepository.com/artifact/io.modelcontextprotocol.sdk/mcp-bom -->
<dependency>
    <groupId>io.modelcontextprotocol.sdk</groupId>
    <artifactId>mcp-bom</artifactId>
    <version>1.0.0</version>
    <type>pom</type>
    <scope>import</scope>
</dependency>
```

```text
研究 MCP 协议的核心
就是 Client 和 Server 之间一个报文交互过程

查看报文，有多种方式
- 程序层
    - 调试：以断点的方式去追踪
    - 在代码里添加日志输出
- 网络层：
    - 网络抓包的方式
    - MCP Inspector 的开发者模式
```

## Reference

- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
    - [MCP Java SDK](https://java.sdk.modelcontextprotocol.io/latest/)
    - [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)

- [GitHub: Model Context Protocol](https://github.com/modelcontextprotocol)
    - [Java SDK](https://github.com/modelcontextprotocol/java-sdk)

- [Maven: mcp-bom](https://mvnrepository.com/artifact/io.modelcontextprotocol.sdk/mcp-bom)

