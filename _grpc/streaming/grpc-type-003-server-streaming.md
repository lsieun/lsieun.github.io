---
title: "服务端流式 RPC 通信模式"
sequence: "103"
---

## lsieun-sms-proto

### sms.proto

File: `src/main/proto/sms.proto`

```protobuf
syntax = "proto3";
option java_multiple_files = true;
option java_package = "lsieun.rpc.sms.proto";
option java_outer_classname = "SmsProto";

package sms;

service SmsService {
  // A. 注意 returns 的括号里有 stream
  rpc send(SmsRequest) returns (stream SmsResponse) {}
}

message SmsRequest {
  repeated string phoneNumber = 1;
  string content = 2;
}

message SmsResponse {
  string result = 1;
}
```

## lsieun-sms-server

### pom.xml

```xml
<dependency>
    <groupId>lsieun</groupId>
    <artifactId>lsieun-sms-proto</artifactId>
    <version>${parent.version}</version>
</dependency>
```

### SmsService

```java
import com.google.protobuf.ProtocolStringList;
import io.grpc.stub.StreamObserver;
import lsieun.rpc.sms.proto.SmsRequest;
import lsieun.rpc.sms.proto.SmsResponse;
import lsieun.rpc.sms.proto.SmsServiceGrpc;

public class SmsService extends SmsServiceGrpc.SmsServiceImplBase {
    @Override
    public void send(SmsRequest request, StreamObserver<SmsResponse> responseObserver) {
        ProtocolStringList phoneNumberList = request.getPhoneNumberList();
        for (String phoneNumber : phoneNumberList) {
            SmsResponse response = SmsResponse.newBuilder()
                    .setResult(request.getContent() + ", " + phoneNumber + "已经收到")
                    .build();
            responseObserver.onNext(response);

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        responseObserver.onCompleted();
    }
}
```

### GrpcServer

```java
import io.grpc.Server;
import io.grpc.ServerBuilder;
import lsieun.rpc.service.SmsService;

import java.io.IOException;

public class GrpcServer {
    private static final int port = 9999;

    public static void main(String[] args) throws IOException, InterruptedException {
        Server server = ServerBuilder.forPort(port)
                .addService(new SmsService())
                .build()
                .start();
        String msg = String.format("GRPC 服务端启动成功，端口号：%d.", port);
        System.out.println(msg);
        server.awaitTermination();
    }
}
```

## lsieun-sms-client

### pom.xml

```xml
<dependency>
    <groupId>lsieun</groupId>
    <artifactId>lsieun-sms-proto</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

### GrpcClient

```java
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import lsieun.rpc.sms.proto.SmsRequest;
import lsieun.rpc.sms.proto.SmsResponse;
import lsieun.rpc.sms.proto.SmsServiceGrpc;

import java.util.Iterator;

public class GrpcClient {
    private static final String host = "localhost";
    private static final int serverPort = 9999;

    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress(host, serverPort)
                .usePlaintext()
                .build();

        SmsServiceGrpc.SmsServiceBlockingStub serviceSub = SmsServiceGrpc.newBlockingStub(channel);
        Iterator<SmsResponse> it = serviceSub.send(
                SmsRequest.newBuilder()
                        .setContent("3PM")
                        .addPhoneNumber("123456")
                        .addPhoneNumber("123457")
                        .addPhoneNumber("123458")
                        .addPhoneNumber("123459")
                        .build()
        );

        while (it.hasNext()) {
            SmsResponse response = it.next();
            System.out.println(response.getResult());
        }

        channel.shutdown();
    }
}
```
