---
title: "双向流式 RPC 通信模式"
sequence: "105"
---

## ProtoBuf

### sms.proto

```protobuf
syntax = "proto3";
option java_multiple_files = true;
option java_package = "lsieun.rpc.sms.proto";
option java_outer_classname = "SmsProto";

package sms;

service SmsService {
  rpc createAndSendSms(stream PhoneNumberRequest) returns (stream PhoneNumberResponse) {}
}

message PhoneNumberRequest {
  string phoneNumber = 1;
}

message PhoneNumberResponse {
  string result = 1;
}
```

## Server

### SmsService

```java
import io.grpc.stub.StreamObserver;
import lsieun.rpc.sms.proto.PhoneNumberRequest;
import lsieun.rpc.sms.proto.PhoneNumberResponse;
import lsieun.rpc.sms.proto.SmsServiceGrpc;

public class SmsService extends SmsServiceGrpc.SmsServiceImplBase {
    @Override
    public StreamObserver<PhoneNumberRequest> createAndSendSms(StreamObserver<PhoneNumberResponse> responseObserver) {
        return new StreamObserver<PhoneNumberRequest>() {
            int i = 0;

            @Override
            public void onNext(PhoneNumberRequest request) {
                System.out.println(request.getPhoneNumber() + "手机号已登记");

                PhoneNumberResponse response1 = PhoneNumberResponse.newBuilder()
                        .setResult(request.getPhoneNumber() + "手机号码已登记，此消息已发送给部门经理")
                        .build();

                PhoneNumberResponse response2 = PhoneNumberResponse.newBuilder()
                        .setResult(request.getPhoneNumber() + "手机号码已登记，此消息已发送给副总经理")
                        .build();

                PhoneNumberResponse response3 = PhoneNumberResponse.newBuilder()
                        .setResult(request.getPhoneNumber() + "手机号码已登记，此消息已发送给总经理")
                        .build();

                responseObserver.onNext(response1);
                responseObserver.onNext(response2);
                responseObserver.onNext(response3);
                i = i + 1;
            }

            @Override
            public void onError(Throwable throwable) {
                throwable.printStackTrace();
            }

            @Override
            public void onCompleted() {
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

## Client

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

        StreamObserver<PhoneNumberRequest> requestObserver = serviceStub.createAndSendSms(responseObserver);
        for (int i = 1; i <= 10; i++) {
            PhoneNumberRequest request = PhoneNumberRequest.newBuilder()
                    .setPhoneNumber(String.valueOf(12345680 + i))
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
