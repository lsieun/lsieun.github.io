---
title: "MCP Server: Stdio + Sync"
sequence: "101"
---

[UP](/spring-ai/index.html)

## 源码

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>learn-mcp-java</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>pom</packaging>
    
    <!-- 省略... -->

    <properties>
        <!-- Resource -->
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <!-- JDK -->
        <java.version>21</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>

        <!-- MCP -->
        <mcp.version>1.0.0</mcp.version>
        <sl4j.version>2.0.16</sl4j.version>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- Source: https://mvnrepository.com/artifact/io.modelcontextprotocol.sdk/mcp-bom -->
            <dependency>
                <groupId>io.modelcontextprotocol.sdk</groupId>
                <artifactId>mcp-bom</artifactId>
                <version>${mcp.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!-- Source: https://mvnrepository.com/artifact/org.slf4j/slf4j-simple -->
            <dependency>
                <groupId>org.slf4j</groupId>
                <artifactId>slf4j-simple</artifactId>
                <version>${sl4j.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

</project>
```

```xml
<dependencies>
    <dependency>
        <groupId>io.modelcontextprotocol.sdk</groupId>
        <artifactId>mcp</artifactId>
    </dependency>

    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
    </dependency>
</dependencies>
```

### 代码

```java
import io.modelcontextprotocol.json.McpJsonMapper;
import io.modelcontextprotocol.json.jackson3.JacksonMcpJsonMapper;
import io.modelcontextprotocol.server.McpServer;
import io.modelcontextprotocol.server.McpServerFeatures;
import io.modelcontextprotocol.server.McpSyncServer;
import io.modelcontextprotocol.server.McpSyncServerExchange;
import io.modelcontextprotocol.server.transport.StdioServerTransportProvider;
import io.modelcontextprotocol.spec.McpSchema;
import io.modelcontextprotocol.spec.McpServerTransportProvider;
import tools.jackson.databind.json.JsonMapper;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.function.BiFunction;

public class MyMcpStdioServer {
    public static void main(String[] args) {
        // 第 1 步，准备
        McpJsonMapper mcpJsonMapper = createJsonMapper();
        McpServerTransportProvider transportProvider = new StdioServerTransportProvider(mcpJsonMapper);


        // 第 2 步，创建 Server
        McpSyncServer syncServer = createServer(transportProvider);


        // 第 3 步，添加 Tool
        var syncToolSpecification = createCalculatorTool(mcpJsonMapper);
        // Register tools
        syncServer.addTool(syncToolSpecification);

        // Sleep 300 seconds
        silentlySleepBySeconds(300);

        // 第 4 步，关闭
        // Close the server when done
        syncServer.close();
    }

    private static McpJsonMapper createJsonMapper() {
        JsonMapper jsonMapper = JsonMapper.builder().build();
        return new JacksonMcpJsonMapper(jsonMapper);
    }

    private static McpSyncServer createServer(McpServerTransportProvider transportProvider) {
        // Create a server with custom configuration
        McpSchema.ServerCapabilities serverCapabilities = McpSchema.ServerCapabilities.builder()
                .resources(false, true)  // Enable resource support with list changes
                .tools(true)             // Enable tool support with list changes
                .prompts(true)           // Enable prompt support with list changes
                .completions()           // Enable completions support
                .logging()               // Enable logging support
                .build();

        return McpServer.sync(transportProvider)
                .serverInfo("my-server", "1.0.0")
                .capabilities(serverCapabilities)
                .build();
    }

    private static McpServerFeatures.SyncToolSpecification createCalculatorTool(McpJsonMapper mcpJsonMapper) {
        String calculatorSchema = """
                {
                  "type": "object",
                  "properties": {
                    "operation": {"type": "string", "enum": ["add","sub","mul","div"]},
                    "a": {"type":"number"},
                    "b": {"type":"number"}
                  },
                  "required": ["operation","a","b"]
                }
                """;

        McpSchema.Tool calculatorTool = McpSchema.Tool.builder()
                .name("calculator")
                .description("Basic calculator")
                .inputSchema(mcpJsonMapper, calculatorSchema)
                .build();

        BiFunction<McpSyncServerExchange, McpSchema.CallToolRequest, McpSchema.CallToolResult>
                calculatorCallHandler = (exchange, request) -> {
            // Access arguments via request.arguments()
            String operation = (String) request.arguments().get("operation");
            int a = (int) request.arguments().get("a");
            int b = (int) request.arguments().get("b");

            // Tool implementation
            int result;
            if ("add".equalsIgnoreCase(operation)) {
                result = a + b;
            } else if ("sub".equalsIgnoreCase(operation)) {
                result = a - b;
            } else if ("mul".equalsIgnoreCase(operation)) {
                result = a * b;
            } else if ("div".equalsIgnoreCase(operation)) {
                result = a / b;
            } else {
                result = 0;
            }

            return McpSchema.CallToolResult.builder()
                    .content(List.of(new McpSchema.TextContent("Result: " + result)))
                    .build();
        };

        // Sync tool specification using builder
        return McpServerFeatures.SyncToolSpecification.builder()
                .tool(calculatorTool)
                .callHandler(calculatorCallHandler)
                .build();
    }

    private static void silentlySleepBySeconds(long seconds) {
        try {
            TimeUnit.SECONDS.sleep(seconds);
        } catch (InterruptedException ignored) {
        }
    }
}
```

## 打成 Jar 包

### 方案一：IntelliJ IDEA

![](/assets/images/spring-ai/mcp/mcp-server-stdio-package-jar-001-project-structure.png)

![](/assets/images/spring-ai/mcp/mcp-server-stdio-package-jar-002-artifact-with-dependencies.png)

![](/assets/images/spring-ai/mcp/mcp-server-stdio-package-jar-003-create-jar-from-modules.png)
![](/assets/images/spring-ai/mcp/mcp-server-stdio-package-jar-004-output-directory.png)
![](/assets/images/spring-ai/mcp/mcp-server-stdio-package-jar-005-build-artifacts.png)
![](/assets/images/spring-ai/mcp/mcp-server-stdio-package-jar-006-build.png)


```text
>java -jar learn-mcp-01-stdio-server.jar
{"jsonrpc":"2.0","method":"notifications/tools/list_changed"}
```

### 方案二：maven-assembly-plugin

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <artifactId>learn-mcp-01-stdio-server</artifactId>

    <!-- 省略... -->

    <dependencies>
        <dependency>
            <groupId>io.modelcontextprotocol.sdk</groupId>
            <artifactId>mcp</artifactId>
        </dependency>

        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <version>3.8.0</version>
                <configuration>
                    <archive>
                        <manifest>
                            <mainClass>lsieun.mcp.stdio.server.MyMcpStdioServer</mainClass>
                            <addDefaultEntries>false</addDefaultEntries>
                        </manifest>
                    </archive>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                </configuration>
                <executions>
                    <execution>
                        <id>make-assembly</id>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>

</project>
```

```text
mvn clean package
```

## 测试

- Transport Type: `STDIO`
- Command: `java`
- Arguments: `-jar D:/tmp/learn-mcp-01-stdio-server.jar`

```text
注意：jar 包的路径使用 `/` 或者 `\\`

（使用 `/`）
D:/tmp/learn-mcp-01-stdio-server.jar

（使用 `\\`）
D:\\tmp\\learn-mcp-01-stdio-server.jar
```

![](/assets/images/spring-ai/mcp/mcp-inspector-stdio-java-server-connect.png)

```text
# 1
{"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{"sampling":{},"elicitation":{},"roots":{"listChanged":true},"tasks":{"list":{},"cancel":{},"requests":{"sampling":{"createMessage":{}},"elicitation":{"create":{}}}}},"clientInfo":{"name":"inspector-client","version":"0.21.1"}},"jsonrpc":"2.0","id":0}
```

```json
{
  "jsonrpc": "2.0",
  "id": 0,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "completions": {},
      "logging": {},
      "prompts": {
        "listChanged": true
      },
      "resources": {
        "subscribe": false,
        "listChanged": true
      },
      "tools": {
        "listChanged": true
      }
    },
    "serverInfo": {
      "name": "my-server",
      "version": "1.0.0"
    }
  }
}
```

```text
# 2
{"method":"notifications/initialized","jsonrpc":"2.0"}
```

```text
{"method":"logging/setLevel","params":{"level":"debug"},"jsonrpc":"2.0","id":1}

{"method":"ping","jsonrpc":"2.0","id":2,"params":{"_meta":{"progressToken":2}}}
```

```text
# 3
{"method":"tools/list","params":{"_meta":{"progressToken":2}},"jsonrpc":"2.0","id":2}
```

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "calculator",
        "description": "Basic calculator",
        "inputSchema": {
          "type": "object",
          "properties": {
            "operation": {
              "type": "string",
              "enum": [
                "add",
                "sub",
                "mul",
                "div"
              ]
            },
            "a": {
              "type": "number"
            },
            "b": {
              "type": "number"
            }
          },
          "required": [
            "operation",
            "a",
            "b"
          ]
        }
      }
    ]
  }
}
```

```text
{"method":"tools/call","params":{"name":"calculator","arguments":{"operation":"sub","a":5,"b":6},"_meta":{"progressToken":3}},"jsonrpc":"2.0","id":3}
```

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Result: 11"
      }
    ],
    "isError": false
  }
}
```


