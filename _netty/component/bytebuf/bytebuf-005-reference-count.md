---
title: "Reference Count"
sequence: "105"
---

[UP](/netty.html)


```text
ReferenceCountUtil.release(message)
ReferenceCountUtil.retain(message)
```

## encoders and decoders

reference counting requires special attention.
In the case of **encoders** and **decoders**, the procedure is quite simple:
once a message has been encoded or decoded,
it will automatically be released by a call to `ReferenceCountUtil.release(message)`.
If you need to keep a reference for later use you can call `ReferenceCountUtil.retain(message)`.
This increments the reference count, preventing the message from being released.
