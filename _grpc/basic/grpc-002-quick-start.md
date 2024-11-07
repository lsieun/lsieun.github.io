---
title: "Quick Start"
sequence: "102"
---

## 安装 Protobuf 环境

第 1 步，下载 ProtoBuf 编译器：

```text
https://github.com/protocolbuffers/protobuf/releases
```

![](/assets/images/grpc/quick/grpc-quick-001-download-protoc-win.png)

第 2 步，添加 `PROTOCBUF_HOME` 环境变量：

```text
D:\lib\protoc-24.3-win64
```

![](/assets/images/grpc/quick/grpc-quick-002-os-env-protocbuf-home.png)

第 3 步，修改 `Path` 环境变量，添加如下内容：

```text
%PROTOCBUF_HOME%\bin
```

![](/assets/images/grpc/quick/grpc-quick-003-path-protocbuf-bin.png)

第 4 步，验证一下：

```text
> protoc --version
```

![](/assets/images/grpc/quick/grpc-quick-004-protoc-version.png)

## 安装 IDEA 插件

![](/assets/images/grpc/quick/grpc-quick-005-grpc-protobuf.png)

## pom.xml

第 1 步，配置 `grpc.version` 属性：

```text
<grpc.version>1.62.2</grpc.version>
```

第 2 步，添加信赖：

```xml
<dependencies>
    <dependency>
        <groupId>io.grpc</groupId>
        <artifactId>grpc-netty</artifactId>
        <version>${grpc.version}</version>
    </dependency>
    <dependency>
        <groupId>io.grpc</groupId>
        <artifactId>grpc-protobuf</artifactId>
        <version>${grpc.version}</version>
    </dependency>
    <dependency>
        <groupId>io.grpc</groupId>
        <artifactId>grpc-stub</artifactId>
        <version>${grpc.version}</version>
    </dependency>
</dependencies>
```

第 3 步，配置插件：

```xml
<build>
    <extensions>
        <extension>
            <groupId>kr.motd.maven</groupId>
            <artifactId>os-maven-plugin</artifactId>
            <version>1.7.1</version>
        </extension>
    </extensions>
    <plugins>
        <plugin>
            <groupId>org.xolstice.maven.plugins</groupId>
            <artifactId>protobuf-maven-plugin</artifactId>
            <version>0.6.1</version>
            <configuration>
                <protocArtifact>
                    com.google.protobuf:protoc:3.24.3:exe:${os.detected.classifier}
                </protocArtifact>
                <pluginId>grpc-java</pluginId>
                <pluginArtifact>
                    io.grpc:protoc-gen-grpc-java:1.58.0:exe:${os.detected.classifier}
                </pluginArtifact>
            </configuration>
            <executions>
                <execution>
                    <goals>
                        <goal>compile</goal>
                        <goal>compile-custom</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

The `os-maven-plugin` extension/plugin generates various useful platform-dependent project properties,
like `${os.detected.classifier}`.



## Server

### news.proto

第 1 步，新建 `src/main/proto` 目录

![](/assets/images/grpc/quick/grpc-quick-006-src-main-proto.png)

第 2 步，添加 `src/main/proto/news.proto` 文件：

![](/assets/images/grpc/quick/grpc-quick-007-src-main-proto-news.png)

第 3 步，添加如下内容：

```text
// 使用proto3语法
syntax = "proto3";
// 生成多个类
option java_multiple_files = false;
// 生成java类所在的包
option java_package = "lsieun.server.news.proto";
// 生成外层类类名
option java_outer_classname = "NewsProto";
// 逻辑包名
package news;
//service服务，用于描述要生成的API接口，类似于Java的业务逻辑接口类
service NewsService {
  //rpc 方法(参数类型)     returns (返回类型){}
  rpc list(NewsRequest) returns (NewsResponse) {}
}
/*
    消息是gRPC描述信息的基本单位，类似Java的"实体类"
    消息的名字，对应于生成代码后的类名
    每一个消息都对应生成一个类，根据java_multiple_files设置不同文件数量也不同
    java_multiple_files=true，protobuf为每一个消息自动生成一个java文件
    java_multiple_files=false，protobuf会生成一个大类，消息作为内部类集中在一个java文件
 */
message NewsRequest {
  /*
      字段：类型 名称 = 索引值(id)
      每个字段都要定义唯一的索引值，这些数字是用来在消息的二进制格式中识别各个字段的。
      一旦开始使用就不能够再改变，最小的标识号可以从1开始，最大到2^29 - 1, or 536,870,911。
      不可以使用其中的[19000－19999]的标识号， Protobuf协议实现中对这些进行了预留。
      切记：要为将来有可能添加的、频繁出现的标识号预留一些标识号。
  */
  string date = 1;
}
message NewsResponse {
  //repeated说明是一个集合（数组），数组每一个元素都是News对象
  repeated News news = 1; //List<News> getNewsList();
}
//News新闻实体对象
message News {
  int32 id = 1;//int id = 0;
  string title = 2;// String title = "";
  string content = 3; //String content = "";
  int64 createTime = 4; //long createTime = 0l;
}
```

### 生成 Java 文件

第 1 步，使用 protobuf 插件的 `protobuf:compile` 命令：

![](/assets/images/grpc/quick/grpc-quick-008-protobuf-compile.png)

会生成相应的 `.java` 文件：

![](/assets/images/grpc/quick/grpc-quick-009-protobuf-news-proto.png)

第 2 步，执行 protobuf 插件的 `protobuf:compile-custom` 命令：

![](/assets/images/grpc/quick/grpc-quick-010-protobuf-compile-custom.png)

会生成相应的 `.java` 文件：

![](/assets/images/grpc/quick/grpc-quick-011-protobuf-news-service.png)

第 3 步，将两个 `.java` 文件移动到 `src/main/java` 目录：

![](/assets/images/grpc/quick/grpc-quick-012-move-java-file.png)

### NewsService

```java
package lsieun.server.news.service;

import io.grpc.stub.StreamObserver;
import lsieun.server.news.proto.NewsProto;
import lsieun.server.news.proto.NewsServiceGrpc;

import java.util.Date;

public class NewsService extends NewsServiceGrpc.NewsServiceImplBase {
    @Override
    public void list(NewsProto.NewsRequest request, StreamObserver<NewsProto.NewsResponse> responseObserver) {
        String date = request.getDate();
        NewsProto.NewsResponse newList = null;
        try {
            NewsProto.NewsResponse.Builder newListbuilder = NewsProto.NewsResponse.newBuilder();
            for (int i = 1; i <= 100; i++) {
                NewsProto.News news = NewsProto.News.newBuilder().setId(i)
                        .setContent(date + "当日新闻内容" + i)
                        .setTitle("新闻标题" + i)
                        .setCreateTime(new Date().getTime())
                        .build();
                newListbuilder.addNews(news);
            }
            newList = newListbuilder.build();
        } catch (Exception e) {
            responseObserver.onError(e);
        } finally {
            responseObserver.onNext(newList);
        }
        responseObserver.onCompleted();
    }
}
```

### GrpcServer

```java
package lsieun.server.news;

import io.grpc.Server;
import io.grpc.ServerBuilder;
import lsieun.server.news.service.NewsService;

import java.io.IOException;

public class GrpcServer {
    private static  final int port = 9999;
    public static void main(String[] args) throws InterruptedException, IOException {
        Server server = ServerBuilder.forPort(port)
                .addService(new NewsService())
                .build()
                .start();
        System.out.println(String.format("GRPC服务端启动成功, 端⼝号: %d.", port));
        server.awaitTermination();
    }
}
```

## Client

```java
package lsieun.server.news;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import lsieun.server.news.proto.NewsProto;
import lsieun.server.news.proto.NewsServiceGrpc;

import java.util.List;

public class NewsClient {
    private static final String host = "localhost";
    private static final int serverPort = 9999;

    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress(host, serverPort)
                .usePlaintext() // 无需加密或认证
                .build();
        try {
            NewsServiceGrpc.NewsServiceBlockingStub blockingStub = NewsServiceGrpc.newBlockingStub(channel);
            NewsProto.NewsRequest request = NewsProto.NewsRequest.newBuilder().setDate("20230925").build();
            NewsProto.NewsResponse response = blockingStub.list(request);
            List<NewsProto.News> newsList = response.getNewsList();
            for (NewsProto.News news : newsList) {
                System.out.println(news.getTitle() + ":" + news.getContent());
            }
        } finally {
            channel.shutdown();
        }
    }
}
```
