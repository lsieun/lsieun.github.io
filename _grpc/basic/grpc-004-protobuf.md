---
title: "ProtoBuf"
sequence: "104"
---

## Protocol Buffer Compiler

```text
https://github.com/protocolbuffers/protobuf/releases
```

## gRPC Java Codegen Plugin

```text
protoc --plugin=protoc-gen-grpc-java=$PATH_TO_PLUGIN -I=$SRC_DIR 
  --java_out=$DST_DIR --grpc-java_out=$DST_DIR $SRC_DIR/HelloService.proto
```

## Defining the Service

### Basic Configurations

```text
syntax = "proto3";
option java_multiple_files = true;
package lsieun.grpc;
```

- `syntax = "proto3";`: This line tells the compiler which syntax this file uses.
- `option java_multiple_files = true;`: By default, the compiler generates all the Java code in a single Java file.
  This line overrides this setting, meaning everything will be generated in individual files. 

### Defining the Message Structure

```text
message HelloRequest {
    string firstName = 1;
    string lastName = 2;
}
```

This defines the request payload. Here, each attribute that goes into the message is defined, along with its type.

A unique number needs to be assigned to each attribute, called the **tag**.
The protocol buffer uses this tag to represent the attribute, instead of using the attribute name.

So unlike JSON, where we'd pass the attribute name `firstName` every single time,
the protocol buffer will use the number `1` to represent `firstName`.
The response payload definition is similar to the request.

Note that we can use the same tag across multiple message types:

```text
message HelloResponse {
    string greeting = 1;
}
```

### Defining the Service Contract

Finally, let's define the service contract. For our `HelloService`, we'll define a `hello()` operation:

```text
service HelloService {
    rpc hello(HelloRequest) returns (HelloResponse);
}
```

The `hello()` operation accepts a unary request, and returns a unary response.
gRPC also supports streaming by prefixing the `stream` keyword to the request and response.

File: `src/main/proto/HelloService.proto`

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

## Generating the Code

The following key files will be generated:

- `HelloRequest.java` – contains the `HelloRequest` type definition
- `HelloResponse.java` – this contains the `HelleResponse` type definition
- `HelloServiceImplBase.java` – this contains the abstract class `HelloServiceImplBase`,
  which provides an implementation of all the operations we defined in the service interface


<table>
    <thead>
        <tr>
            <th>.proto Type</th>
            <th>Notes</th>
            <th>C++ Type</th>
            <th>Java Type</th>
            <th>Python Type[2]</th>
            <th>Go Type</th>
            <th>Ruby Type</th>
            <th>C# Type</th>
            <th>PHP Type</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>double</td>
            <td></td>
            <td>double</td>
            <td>double</td>
            <td>float</td>
            <td>float64</td>
            <td>Float</td>
            <td>double</td>
            <td>float</td>
        </tr>
        <tr>
            <td>float</td>
            <td></td>
            <td>float</td>
            <td>float</td>
            <td>float</td>
            <td>float32</td>
            <td>Float</td>
            <td>float</td>
            <td>float</td>
        </tr>
        <tr>
            <td>int32</td>
            <td>使用变长编码，对于负值的效率很低，如果你的域有可能有负值，请使用sint64替代</td>
            <td>int32</td>
            <td>int</td>
            <td>int</td>
            <td>int32</td>
            <td>Fixnum 或者 Bignum（根据需要）</td>
            <td>int</td>
            <td>integer</td>
        </tr>
        <tr>
            <td>uint32</td>
            <td>使用变长编码</td>
            <td>uint32</td>
            <td>int</td>
            <td>int/long</td>
            <td>uint32</td>
            <td>Fixnum 或者 Bignum（根据需要）</td>
            <td>uint</td>
            <td>integer</td>
        </tr>
        <tr>
            <td>uint64</td>
            <td>使用变长编码</td>
            <td>uint64</td>
            <td>long</td>
            <td>int/long</td>
            <td>uint64</td>
            <td>Bignum</td>
            <td>ulong</td>
            <td>integer/string</td>
        </tr>
        <tr>
            <td>sint32</td>
            <td>使用变长编码，这些编码在负值时比int32高效的多</td>
            <td>int32</td>
            <td>int</td>
            <td>int</td>
            <td>int32</td>
            <td>Fixnum 或者 Bignum（根据需要）</td>
            <td>int</td>
            <td>integer</td>
        </tr>
        <tr>
            <td>sint64</td>
            <td>使用变长编码，有符号的整型值。编码时比通常的int64高效。</td>
            <td>int64</td>
            <td>long</td>
            <td>int/long</td>
            <td>int64</td>
            <td>Bignum</td>
            <td>long</td>
            <td>integer/string</td>
        </tr>
        <tr>
            <td>fixed32</td>
            <td>总是4个字节，如果数值总是比总是比228大的话，这个类型会比uint32高效。</td>
            <td>uint32</td>
            <td>int</td>
            <td>int</td>
            <td>uint32</td>
            <td>Fixnum 或者 Bignum（根据需要）</td>
            <td>uint</td>
            <td>integer</td>
        </tr>
        <tr>
            <td>fixed64</td>
            <td>总是8个字节，如果数值总是比总是比256大的话，这个类型会比uint64高效。</td>
            <td>uint64</td>
            <td>long</td>
            <td>int/long</td>
            <td>uint64</td>
            <td>Bignum</td>
            <td>ulong</td>
            <td>integer/string</td>
        </tr>
        <tr>
            <td>sfixed32</td>
            <td>总是4个字节</td>
            <td>int32</td>
            <td>int</td>
            <td>int</td>
            <td>int32</td>
            <td>Fixnum 或者 Bignum（根据需要）</td>
            <td>int</td>
            <td>integer</td>
        </tr>
        <tr>
            <td>sfixed64</td>
            <td>总是8个字节</td>
            <td>int64</td>
            <td>long</td>
            <td>int/long</td>
            <td>int64</td>
            <td>Bignum</td>
            <td>long</td>
            <td>integer/string</td>
        </tr>
        <tr>
            <td>bool</td>
            <td></td>
            <td>bool</td>
            <td>boolean</td>
            <td>bool</td>
            <td>bool</td>
            <td>TrueClass/FalseClass</td>
            <td>bool</td>
            <td>boolean</td>
        </tr>
        <tr>
            <td>string</td>
            <td>一个字符串必须是UTF-8编码或者7-bit ASCII编码的文本。</td>
            <td>string</td>
            <td>String</td>
            <td>str/unicode</td>
            <td>string</td>
            <td>String (UTF-8)</td>
            <td>string</td>
            <td>string</td>
        </tr>
        <tr>
            <td>bytes</td>
            <td>可能包含任意顺序的字节数据。</td>
            <td>string</td>
            <td>ByteString</td>
            <td>str</td>
            <td>[]byte</td>
            <td>String (ASCII-8BIT)</td>
            <td>ByteString</td>
            <td>string</td>
        </tr>
    </tbody>
</table>

