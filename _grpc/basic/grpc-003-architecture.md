---
title: "gRPC Architecture"
sequence: "103"
---

![](/assets/images/grpc/landing-2.png)


I have mentioned several times that gRPC's performance is very good, but you might wonder what makes it so good?
What makes gRPC so much better than RPC when their designs are pretty similar?

Here are a few key differences that make gRPC so performant.


## HTTP/2

HTTP has been with us for a long time. Now, almost all backend services use this protocol.

![](/assets/images/grpc/history-of-http.png)

As the picture above shows, HTTP/1.1 stayed relevant for a long time.

Then in 2015, HTTP/2 came out and essentially replaced HTTP/1.1 as the most popular transport protocol on the internet.

If you remember that 2015 was also the year that gRPC came out, it was not a coincidence at all.
HTTP/2 was also created by Google to be used by gRPC in its architecture.

HTTP/2 is one of the big reasons why gRPC can perform so well. And in this next section, you'll see why.

## Request/Response Multiplexing

In a traditional HTTP protocol, is not possible to send multiple requests
or get multiple responses together in a single connection.
A new connection will need to be created for each of them.

This kind of request/response multiplexing is made possible in HTTP/2
with the introduction of a new HTTP/2 layer called **binary framing**.

![](/assets/images/grpc/http-2.png)

This binary layer encapsulates and encodes the data.
In this layer, the HTTP request/response gets broken down into **frames**.

The **headers frame** contains typical HTTP headers information, and the data frame contains the payload.
Using this mechanism, it's possible to have data from multiple requests in a single connection.

This allows payloads from multiple requests with the same header, thus identifying it as a single request.

## Header Compression

You might have encountered many cases where HTTP headers are even bigger than the payload.
And HTTP/2 has a very interesting strategy called HPack to handle that.

For one, everything in HTTP/2 is encoded before it's sent, including the headers.
This does help with performance, but that's not the most important thing about header compression.

HTTP/2 maps the header on both the client and the server side.
From that, HTTP/2 is able to know if the header contains the same value and only sends the header value
if it is different from the previous header.

![](/assets/images/grpc/request-header-frames-diff.png)

As seen in the picture above, Request #2 will only send the `path` since the other values are exactly the same.
And yes, this does cut down a lot on the payload size, and in turn, improves HTTP/2's performance even more.

## Reference

- [What is gRPC? Protocol Buffers, Streaming, and Architecture Explained](https://www.freecodecamp.org/news/what-is-grpc-protocol-buffers-stream-architecture/)
