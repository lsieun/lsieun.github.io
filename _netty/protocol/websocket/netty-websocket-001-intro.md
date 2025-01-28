---
title: "WebSocket Intro"
sequence: "101"
---

[UP](/netty.html)

- `BinaryWebSocketFrame` Contains binary data
- `TextWebSocketFrame` Contains text data
- `ContinuationWebSocketFrame` Contains text or binary data that belongs to a previous `BinaryWebSocketFrame` or `TextWebSocketFrame`
- `CloseWebSocketFrame` Represents a CLOSE request and contains a close status code and a phrase
- `PingWebSocketFrame` Requests the transmission of a `PongWebSocketFrame`
- `PongWebSocketFrame` Sent as a response to a `PingWebSocketFrame`

```text
                                                    ┌─── BinaryWebSocketFrame
                                     ┌─── first ────┤
                  ┌─── data ─────────┤              └─── TextWebSocketFrame
                  │                  │
                  │                  └─── remain ───┼─── ContinuationWebSocketFrame
WebSocketFrame ───┤
                  │                                ┌─── PingWebSocketFrame
                  │                  ┌─── alive ───┤
                  └─── connection ───┤             └─── PongWebSocketFrame
                                     │
                                     └─── close ───┼─── CloseWebSocketFrame
```

## Reference

- [RFC6455: The WebSocket Protocol](https://www.rfc-editor.org/rfc/rfc6455)
- [Protocol upgrade mechanism](https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism)
- [NETTY WEBSOCKET SSL](https://nikoskatsanos.com/blog/2022/01/netty-websocket-ssl/)

- [Netty (10)-WebSocket](https://blog.csdn.net/wangb_java/article/details/136468549)
- [Netty 实现 WebSocket 聊天功能](https://waylau.com/netty-websocket-chat/)
- [netty系列之:使用netty搭建websocket客户端](https://www.cnblogs.com/flydean/p/15378849.html)
