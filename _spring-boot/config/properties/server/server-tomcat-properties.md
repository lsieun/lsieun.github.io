---
title: "Tomcat Properties"
sequence: "tomcat"
---

在 `spring-boot-autoconfigure-x.x.x.jar` 中，有以下两个文件：

- `spring-autoconfigure-metadata.properties`
- `spring-configuration-metadata.json`
- `additional-spring-configuration-metadata.json`

```java
package org.springframework.boot.autoconfigure.web;

@ConfigurationProperties(prefix = "server", ignoreUnknownFields = true)
public class ServerProperties {
    private InetAddress address;
    private Integer port;

    public static class Tomcat {
        private int maxConnections = 8192;
        private int acceptCount = 100;

        public static class Threads {
            private int max = 200;
            private int minSpare = 10;
        }
    }
}
```

## URI

| Name                         | Description                                  | Default Value |
|------------------------------|----------------------------------------------|---------------|
| `server.tomcat.uri-encoding` | Character encoding to use to decode the URI. | `UTF-8`       |
| ``                           |                                              |               |

## Server Connections

| Name                              | Description                                           | Default Value |
|-----------------------------------|-------------------------------------------------------|---------------|
| `server.tomcat.threads.max`       | Maximum amount of worker threads.                     | `200`         |
| `server.tomcat.threads.min-spare` | Minimum amount of worker threads.                     | `10`          |
| `server.tomcat.max-connections`   | Maximum number of connections                         | `8192`        |
| `server.tomcat.accept-count`      | Maximum queue length for incoming connection requests | `100`         |
| ``                                |                                                       |               |

- `server.tomcat.max-connections`: Maximum number of connections that the server accepts and processes at any given time.
  Once the limit has been reached, the operating system may still accept connections based on the "acceptCount" property.
- `server.tomcat.accept-count`: Maximum queue length for incoming connection requests
  when all possible request processing threads are in use.

这里做一个“饭店”的比喻：

- thread 可以想像成“厨师”，`min-spare` 是指饭店里最少的厨师的数量，`max` 是指饭店里最多的厨师数据。
- `max-connections` 可以想像成饭店里有多少张“餐桌”，而 `accept-count` 可以想像成饭店的等候区的坐位数量。

要说饭店能服务多少人呢？可以理解成 `max-connections`，也可以理解成 `max-connections + accept-count`。

When running on a low resource container, we might like to decrease the CPU and memory load.
One way of doing that is to limit the number of simultaneous requests that can be handled by our application.
Conversely, we can increase this value to use more available resources to get better performance.

In Spring Boot, we can define the maximum amount of Tomcat worker threads:

```text
server.tomcat.threads.max=200
```

When configuring a web server, it also might be useful to set the **server connection timeout**.
This represents the maximum amount of time the server will wait for
the client to make their request after connecting
before the connection is closed:

```text
server.connection-timeout=5s
```

We can also define the maximum size of a request header:

```text
server.max-http-header-size=8KB
```

The maximum size of a request body:

```text
server.tomcat.max-swallow-size=2MB
```

Or a maximum size of the whole post request:

```text
server.tomcat.max-http-post-size=2MB
```

## Tomcat Server Access Logs

Tomcat access logs are beneficial when measuring page hit counts, user session activity, and so on.

**To enable access logs**, simply set:

```text
server.tomcat.accesslog.enabled=true
```

We should also configure other parameters such as **directory name**, **prefix**, **suffix**,
and **date format** appended to log files:

```text
server.tomcat.accesslog.directory=logs
server.tomcat.accesslog.file-date-format=yyyy-MM-dd
server.tomcat.accesslog.prefix=access_log
server.tomcat.accesslog.suffix=.log
```

## Reference



