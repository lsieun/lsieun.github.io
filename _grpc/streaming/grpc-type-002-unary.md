---
title: "一元 RPC 通信模式"
sequence: "102"
---

## rpc-proto

```protobuf
syntax = "proto3";
option java_multiple_files = true;
package lsieun.grpc;

message HelloRequest {
  string firstName = 1;
  string lastName = 2;
}

message HelloResponse {
  string greeting = 1;
}

service HelloService {
  rpc hello(HelloRequest) returns (HelloResponse);
}
```

## rpc-server

### Overriding the Service Base Class

**The default implementation of the abstract class `HelloServiceImplBase` is
to throw the runtime exception `io.grpc.StatusRuntimeException`,
which says that the method is unimplemented.**

```java
import io.grpc.stub.StreamObserver;
import lsieun.grpc.HelloRequest;
import lsieun.grpc.HelloResponse;
import lsieun.grpc.HelloServiceGrpc;

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

If we compare the signature of `hello()` with the one we wrote in the `HellService.proto` file,
we'll notice that it doesn't return `HelloResponse`.
Instead, it takes the second argument as `StreamObserver<HelloResponse>`,
which is a response observer, a call back for the server to call with its response.

This way **the client gets the option to make a blocking call or a non-blocking call.**

gRPC uses builders for creating objects.
We'll use `HelloResponse.newBuilder()` and set the greeting text to build a `HelloResponse` object.
We'll set this object to the `responseObserver`'s `onNext()` method to send it to the client.

Finally, we'll need to call `onCompleted()` to specify that we've finished dealing with the RPC;
otherwise, the connection will be hung, and the client will just wait for more information to come in.

### Running the Grpc Server

```java
import io.grpc.Server;
import io.grpc.ServerBuilder;
import lsieun.grpc.service.HelloServiceImpl;

public class GrpcServer {
    public static void main(String[] args) throws Exception {
        Server server = ServerBuilder
                .forPort(9999)
                .addService(new HelloServiceImpl())
                .build();

        server.start();
        server.awaitTermination();
    }
}
```

Here, we again use the builder to create a gRPC server on port `9999`,
and add the `HelloServiceImpl` service that we defined.

- `start()` will start the server.
- `awaitTermination()` to keep the server running in the foreground, blocking the prompt.

## Creating the Client

gRPC provides a channel construct that abstracts out the underlying details,
like connection, connection pooling, load balancing, etc.

We'll create a channel using `ManagedChannelBuilder`. Here we'll specify the server address and port.

We'll use plain text without any encryption:

```java
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import lsieun.grpc.HelloRequest;
import lsieun.grpc.HelloResponse;
import lsieun.grpc.HelloServiceGrpc;

public class GrpcClient {
    public static void main(String[] args) {
        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 9999)
                .usePlaintext()
                .build();

        HelloServiceGrpc.HelloServiceBlockingStub stub = HelloServiceGrpc.newBlockingStub(channel);

        HelloResponse helloResponse = stub.hello(HelloRequest.newBuilder()
                .setFirstName("sen")
                .setLastName("liu")
                .build());

        String result = helloResponse.getGreeting();
        System.out.println(result);

        channel.shutdown();
    }
}
```

Then we'll need to create a `stub`, which we'll use to make the actual remote call to `hello()`.
The stub is the primary way for clients to interact with the server.
When using auto-generated stubs, the stub class will have constructors for wrapping the channel.

Here we're using a blocking/synchronous stub so that the RPC call waits for the server to respond,
and will either return a response or raise an exception.
There are two other types of stubs provided by gRPC that facilitate non-blocking/asynchronous calls.

Now it's time to make the `hello()` RPC call.
We'll pass the `HelloRequest`.
We can use the auto-generated setters to set the `firstName` and `lastName` attributes of the `HelloRequest` object.

Finally, the server returns the `HelloResponse` object.
