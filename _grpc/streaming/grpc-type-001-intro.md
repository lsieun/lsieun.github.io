---
title: "Streaming"
sequence: "101"
---

Streaming is one of the core concepts of gRPC where several things can happen in a single request.
This is made possible by the multiplexing capability of HTTP/2.

There are several types of streaming:

- **Server Streaming RPC**: Where the client sends a single request and the server can send back multiple responses.
  For example, when a client sends a request for a homepage that has a list of multiple items,
  the server can send back responses separately, enabling the client to use lazy loading.
- **Client Streaming RPC**: Where the client sends multiple requests and the server only sends back a single response.
  For example, a zip/chunk uploaded by the client.
- **Bidirectional Streaming RPC**: Where both the client and server send messages to each other at the same time
  without waiting for a response.
