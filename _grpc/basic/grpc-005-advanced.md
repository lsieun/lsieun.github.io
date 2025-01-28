---
title: "Advanced"
sequence: "105"
---

## Metadata

Instead of using a usual HTTP request header, gRPC has something called **metadata**.
**Metadata** is a type of key-value data that can be set from either the client or server side.

Header can be assigned from the client side,
while servers can assign Header and Trailers so long as they're both in the form of metadata.

## Interceptors

gRPC supports the usage of interceptors for its request/response.
Interceptors, well, intercept messages and allow you to modify them.

Does this sound familiar?
If you have played around with HTTP processes on a REST API, interceptors are very similar to middleware.

gRPC libraries usually support interceptors,
and allow for easy implementation. Interceptors are usually used to:

- Modify the request/response before being passed on.
  It can be used to provide mandatory information before being sent to the client/server.
- Allow you to manipulate each function call such as adding additional logging to track response time.

## ALTS authentication

- [Link](https://grpc.io/docs/languages/java/alts/)

**Application Layer Transport Security (ALTS)**
is a mutual authentication and transport encryption system developed by Google.
It is used for securing RPC communications within Google's infrastructure.
ALTS is similar to mutual TLS but has been designed and optimized to meet the needs of Google's production environments.
For more information, take a look at the ALTS whitepaper.


## Load Balancing

If you aren't already familiar with load balancing,
it's a mechanism that allows client requests to be spread out across multiple servers.

But load balancing is usually done at the proxy level (for example, NGINX). So why am I talking about it here?

Turns out that gRPC supports a method of load balancing by the client
. It's already implemented in the Golang library, and can be used with ease.

While it might seem like some sort of crazy magic, it's not.
There's some sort of DNS resolver to get an IP list, and a load balancing algorithm under the hood.

## Call Cancellation

gRPC clients are able to cancel a gRPC call when it doesn't need a response anymore.
Rollback on the server side is not possible, though.

This feature is especially useful for server side streaming where multiple server requests might be coming.
The gRPC library comes equipped with an observer method pattern to know
if a request is cancelled and allow it to cancel multiple corresponding requests at once.
