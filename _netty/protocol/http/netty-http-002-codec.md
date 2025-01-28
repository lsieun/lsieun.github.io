---
title: "Http Codec"
sequence: "102"
---

[UP](/netty.html)


```text
                                                        ┌─── HttpResponseDecoder (inbound)
                                ┌─── HttpClientCodec ───┤
                                │                       └─── HttpRequestEncoder  (outbound)
CombinedChannelDuplexHandler ───┤
                                │                       ┌─── HttpRequestDecoder  (inbound)
                                └─── HttpServerCodec ───┤
                                                        └─── HttpResponseEncoder (outbound)
```
