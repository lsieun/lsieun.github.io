---
title: "gRPC + Spring Boot"
sequence: "101"
---

`grpc-server-spring-boot-starter`/`grpc-client-spring-boot-starter` 是第三方提供的 Spring Boot 与 gRPC 的整合包，
基于 Spring Boot 自动装配与声明式特性，整体简化了 gRPC 在 Spring BOot 中开发过程。

```text
https://mvnrepository.com/artifact/net.devh/grpc-server-spring-boot-starter
```

```xml
<dependency>
    <groupId>net.devh</groupId>
    <artifactId>grpc-server-spring-boot-starter</artifactId>
    <version>2.15.0.RELEASE</version>
</dependency>
```

```xml
<dependency>
    <groupId>net.devh</groupId>
    <artifactId>grpc-client-spring-boot-starter</artifactId>
    <version>2.15.0.RELEASE</version>
</dependency>
```

## spring-boot-grpc-server

### pom.xml

```xml
<dependency>
    <groupId>net.devh</groupId>
    <artifactId>grpc-server-spring-boot-starter</artifactId>
    <version>2.15.0.RELEASE</version>
</dependency>
```

```xml
<dependencies>
    <!-- 1. 引入 grpc-proto -->
    <dependency>
        <groupId>lsieun</groupId>
        <artifactId>lsieun-grpc-proto</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>

    <!-- 2. 引入 spring-boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- 3. 引入 grpc-server-spring-boot-starter -->
    <dependency>
        <groupId>net.devh</groupId>
        <artifactId>grpc-server-spring-boot-starter</artifactId>
        <version>2.15.0.RELEASE</version>
    </dependency>
</dependencies>
```

### HelloServiceImpl

- `@GrpcService`

```java
package lsieun.grpc.server.service;

import io.grpc.stub.StreamObserver;
import lsieun.grpc.HelloRequest;
import lsieun.grpc.HelloResponse;
import lsieun.grpc.HelloServiceGrpc;
import net.devh.boot.grpc.server.service.GrpcService;

// A. @GrpcService 注解
@GrpcService
public class HelloServiceImpl extends HelloServiceGrpc.HelloServiceImplBase {
    @Override
    public void hello(HelloRequest request, StreamObserver<HelloResponse> responseObserver) {
        String greeting = new StringBuilder()
                .append("Hello, ")
                .append(request.getFirstName())
                .append(" ")
                .append(request.getLastName())
                .toString();

        HelloResponse response = HelloResponse.newBuilder()
                .setGreeting(greeting)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
```

### GrpcServerApplication

```java
package lsieun.grpc.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GrpcServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(GrpcServerApplication.class, args);
	}

}
```

### application.yml

```yaml
spring:
  application:
    name: spring-boot-grpc-server
grpc:
  server:
    port: 9090
server:
  port: 8080
```

### 启动

启动 Spring Boot 程序，会看到：

- `HelloServiceImpl` 成功注册为 bean
- gRPC Server 在 `9090` 端口监听

```text
[main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port(s): 8080 (http) with context path ''
[main] n.d.b.g.s.s.AbstractGrpcServerFactory    : Registered gRPC service: lsieun.grpc.HelloService, bean: helloServiceImpl, class: lsieun.grpc.server.service.HelloServiceImpl
[main] n.d.b.g.s.s.AbstractGrpcServerFactory    : Registered gRPC service: grpc.health.v1.Health, bean: grpcHealthService, class: io.grpc.protobuf.services.HealthServiceImpl
[main] n.d.b.g.s.s.AbstractGrpcServerFactory    : Registered gRPC service: grpc.reflection.v1alpha.ServerReflection, bean: protoReflectionService, class: io.grpc.protobuf.services.ProtoReflectionService
[main] n.d.b.g.s.s.GrpcServerLifecycle          : gRPC Server started, listening on address: *, port: 9090
```

## spring-boot-grpc-client

### pom.xml

```xml
<dependency>
    <groupId>net.devh</groupId>
    <artifactId>grpc-client-spring-boot-starter</artifactId>
    <version>2.15.0.RELEASE</version>
</dependency>
```

```xml
<dependencies>
    <!-- 1. 引入 grpc-proto -->
    <dependency>
        <groupId>lsieun</groupId>
        <artifactId>lsieun-grpc-proto</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>

    <!-- 2. 引入 spring-boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- 3. 引入 grpc-client-spring-boot-starter -->
    <dependency>
        <groupId>net.devh</groupId>
        <artifactId>grpc-client-spring-boot-starter</artifactId>
        <version>2.15.0.RELEASE</version>
    </dependency>
</dependencies>
```

### application.yml

```yaml
spring:
  application:
    name: spring-boot-grpc-client
server:
  port: 8090
grpc:
  client:
    lsieun-server:
      address: 'static://127.0.0.1:9090'
      negotiation-type: plaintext
```

### HelloController

```java
package lsieun.grpc.client.controller;

import lsieun.grpc.HelloRequest;
import lsieun.grpc.HelloResponse;
import lsieun.grpc.HelloServiceGrpc;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class HelloController {
    // A. 使用 GrpcClient 注解
    @GrpcClient("lsieun-server")
    private HelloServiceGrpc.HelloServiceBlockingStub blockingStub;

    @GetMapping("/world")
    public String world(String name) {
        HelloRequest request = HelloRequest.newBuilder().setFirstName(name).setLastName("Green").build();
        HelloResponse response = blockingStub.hello(request);
        return response.getGreeting();
    }
}
```

### GrpcClientApplication

```java
package lsieun.grpc.client;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class GrpcClientApplication {

    public static void main(String[] args) {
        SpringApplication.run(GrpcClientApplication.class, args);
    }

}
```

### 浏览器访问

```text
http://localhost:8090/hello/world?name=tomcat
```

## Reference

- [gRPC-Spring-Boot-Starter Documentation](https://yidongnan.github.io/grpc-spring-boot-starter/en/)
- [Introduction to gRPC with Spring Boot](https://piotrminkowski.com/2023/08/29/introduction-to-grpc-with-spring-boot/)
