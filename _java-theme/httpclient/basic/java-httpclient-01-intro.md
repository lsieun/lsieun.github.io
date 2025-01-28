---
title: "Java HttpClient"
sequence: "101"
---

The [Java HttpClient](https://docs.oracle.com/en/java/javase/17/docs/api/java.net.http/java/net/http/HttpClient.html)
API was introduced with **Java 11**.
**The API implements the client-side of the most recent HTTP standards.**
It supports HTTP/1.1 and HTTP/2, both synchronous and asynchronous programming models.

```text
                                      ┌─── Builder
                                      │
                                      │                ┌─── NEVER
                                      │                │
                 ┌─── HttpClient ─────┼─── Redirect ───┼─── ALWAYS
                 │                    │                │
                 │                    │                └─── NORMAL
                 │                    │
                 │                    │                ┌─── HTTP_1_1
                 │                    └─── Version ────┤
                 │                                     └─── HTTP_2
                 │
                 ├─── HttpHeaders
                 │
                 │                    ┌─── BodyPublisher
                 │                    │
                 ├─── HttpRequest ────┼─── BodyPublishers
                 │                    │
java.net.http ───┤                    └─── Builder
                 │
                 │                    ┌─── BodyHandler
                 │                    │
                 │                    ├─── BodyHandlers
                 │                    │
                 │                    ├─── BodySubscriber
                 ├─── HttpResponse ───┤
                 │                    ├─── BodySubscribers
                 │                    │
                 │                    ├─── PushPromiseHandler
                 │                    │
                 │                    └─── ResponseInfo
                 │
                 │                    ┌─── Builder
                 └─── WebSocket ──────┤
                                      └─── Listener
```

## Reference

- [Posting with Java HttpClient](https://www.baeldung.com/java-httpclient-post)

