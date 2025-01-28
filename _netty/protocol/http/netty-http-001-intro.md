---
title: "Http Decoder & Encoder"
sequence: "101"
---

[UP](/netty.html)


![](/assets/images/netty/protocol/http/http-request-components-parts.png)

![](/assets/images/netty/protocol/http/http-response-components-parts.png)

- `HttpRequestEncoder` Encodes `HttpRequest`, `HttpContent`, and `LastHttpContent` messages to bytes.
- `HttpResponseEncoder` Encodes `HttpResponse`, `HttpContent`, and `LastHttpContent` messages to bytes.
- `HttpRequestDecoder` Decodes bytes into `HttpRequest`, `HttpContent`, and `LastHttpContent` messages.
- `HttpResponseDecoder` Decodes bytes into `HttpResponse`, `HttpContent`, and `LastHttpContent` messages.


```text
                                  ┌─── HttpRequest
                                  │
              ┌─── HttpMessage ───┼─── HttpResponse
              │                   │
              │                   │                       ┌─── FullHttpRequest
HttpObject ───┤                   └─── FullHttpMessage ───┤
              │                                           └─── FullHttpResponse
              │
              └─── HttpContent ───┼─── LastHttpContent
```
