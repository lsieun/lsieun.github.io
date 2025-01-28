---
title: "客户端流式 RPC 通信模式"
sequence: "104"
---

## lsieun-sms-proto

### sms.proto

```protobuf
syntax = "proto3";
option java_multiple_files = true;
option java_package = "lsieun.rpc.sms.proto";
option java_outer_classname = "SmsProto";

package sms;

service SmsService {
  rpc createPhone(stream PhoneNumberRequest) returns (PhoneNumberResponse) {}
}

message PhoneNumberRequest {
  string phoneNumber = 1;
}

message PhoneNumberResponse {
  string result = 1;
}
```


## sms-server

### SmsService

```java
import io.grpc.stub.StreamObserver;
import lsieun.rpc.sms.proto.PhoneNumberRequest;
import lsieun.rpc.sms.proto.PhoneNumberResponse;
import lsieun.rpc.sms.proto.SmsServiceGrpc;

public class SmsService extends SmsServiceGrpc.SmsServiceImplBase {
    @Override
    public StreamObserver<PhoneNumberRequest> createPhone(StreamObserver<PhoneNumberResponse> responseObserver) {
        return new StreamObserver<PhoneNumberRequest>() {
            int i = 0;

            @Override
            public void onNext(PhoneNumberRequest request) {
                System.out.println(request.getPhoneNumber() + "手机号已登记");
                i = i + 1;
            }

            @Override
            public void onError(Throwable throwable) {
                throwable.printStackTrace();
            }

            @Override
            public void onCompleted() {
                PhoneNumberResponse response = PhoneNumberResponse.newBuilder()
                        .setResult("您本次批量导入" + i + "个员工电话")
                        .build();
                responseObserver.onNext(response);
                responseObserver.onCompleted();
            }
        };
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

## sms-client

### GrpcClient

```java
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import lsieun.rpc.sms.proto.PhoneNumberRequest;
import lsieun.rpc.sms.proto.PhoneNumberResponse;
import lsieun.rpc.sms.proto.SmsServiceGrpc;

public class GrpcClient {
    private static final String host = "localhost";
    private static final int serverPort = 9999;

    public static void main(String[] args) throws InterruptedException {
        ManagedChannel channel = ManagedChannelBuilder.forAddress(host, serverPort)
                .usePlaintext()
                .build();
        SmsServiceGrpc.SmsServiceStub serviceStub = SmsServiceGrpc.newStub(channel);

        StreamObserver<PhoneNumberResponse> responseObserver = new StreamObserver<PhoneNumberResponse>() {
            @Override
            public void onNext(PhoneNumberResponse response) {
                System.out.println(response.getResult());
            }

            @Override
            public void onError(Throwable throwable) {
                throwable.printStackTrace();
            }

            @Override
            public void onCompleted() {
                System.out.println("处理完毕");
            }
        };

        StreamObserver<PhoneNumberRequest> requestObserver = serviceStub.createPhone(responseObserver);
        for (int i = 1; i <= 10; i++) {
            PhoneNumberRequest request = PhoneNumberRequest.newBuilder()
                    .setPhoneNumber(String.valueOf(12345670 + i))
                    .build();
            requestObserver.onNext(request);

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                requestObserver.onError(e);
            }
        }

        requestObserver.onCompleted();
        Thread.sleep(1000);

        channel.shutdown();
    }
}
```

