---
title: "gRPC + Spring Boot + Nacos"
sequence: "102"
---

## Spring Boot + Nacos + Server

```xml
<properties>
    <!-- Spring Boot/Cloud -->
    <spring-boot.version>2.7.17</spring-boot.version>
    <spring-cloud.version>2021.0.8</spring-cloud.version>
    <spring-cloud-alibaba.version>2021.0.5.0</spring-cloud-alibaba.version>
</properties>
```

```xml
<dependencyManagement>
    <dependencies>
        <!-- Spring Boot Dependencies -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${spring-boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <!-- Spring Cloud Dependencies -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <!-- Spring Cloud Alibaba Dependencies -->
        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>${spring-cloud-alibaba.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>lsieun</groupId>
        <artifactId>lsieun-grpc-proto</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- cloud -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bootstrap</artifactId>
    </dependency>

    <!-- nacos -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>

    <!-- grpc -->
    <dependency>
        <groupId>net.devh</groupId>
        <artifactId>grpc-server-spring-boot-starter</artifactId>
        <version>2.15.0.RELEASE</version>
    </dependency>
</dependencies>
```

### application.yml

```yaml
server:
  port: 1916
spring:
  application:
    name: spring-boot-nacos-server
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
grpc:
  server:
    port: 9090
```

### Application

```java
package lsieun.grpc.nacos.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class NacosServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosServerApplication.class, args);
    }
}
```

### HelloServiceImpl

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

## Spring Boot + Nacos + Client

### pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>lsieun</groupId>
        <artifactId>lsieun-grpc-proto</artifactId>
        <version>1.0-SNAPSHOT</version>
    </dependency>

    <!-- boot -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <!-- web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- cloud -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-bootstrap</artifactId>
    </dependency>

    <!-- nacos -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>

    <!-- loadbalancer -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-loadbalancer</artifactId>
    </dependency>

    <!-- grpc -->
    <dependency>
        <groupId>net.devh</groupId>
        <artifactId>grpc-client-spring-boot-starter</artifactId>
        <version>2.15.0.RELEASE</version>
    </dependency>
</dependencies>
```

好像不使用 `spring-cloud-starter-loadbalancer` 也可以。

### application.yml

```yaml
server:
  port: 1903
spring:
  application:
    name: spring-boot-nacos-client
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
grpc:
  client:
    spring-boot-nacos-server:
      # address: 'static://127.0.0.1:9090' #整合nacos后无需设置，grrpc服务端地址，根据服务名寻找对应的服务
      negotiation-type: plaintext
      enable-keep-alive: true
      keep-alive-without-calls: true
```

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class NacosClientApplication {
    public static void main(String[] args) {
        SpringApplication.run(NacosClientApplication.class, args);
    }
}
```

### HelloController

```java
package lsieun.grpc.nacos.client.controller;

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
    @GrpcClient("spring-boot-nacos-server")
    private HelloServiceGrpc.HelloServiceBlockingStub blockingStub;

    @GetMapping("/world")
    public String world(String name) {
        HelloRequest request = HelloRequest.newBuilder().setFirstName(name).setLastName("Green").build();
        HelloResponse response = blockingStub.hello(request);
        return response.getGreeting();
    }
}
```

```text
http://localhost:1903/hello/world?name=jerry
```

## Reference

- [Grpc 整合 Nacos SpringBoot 日常使用（Java版本）包括 Jwt 认证](https://blog.csdn.net/qq_42875345/article/details/130828513)
- [Spring Boot+Nacos+gRPC，一个区别于 OpenFeign 的微服务通信方案！](https://juejin.cn/post/7218743537495490620)
- [超高性能rpc框架之gRPC 快速整合gRPC+nacos+springCloud](https://blog.csdn.net/qq_21046665/article/details/120722942)
