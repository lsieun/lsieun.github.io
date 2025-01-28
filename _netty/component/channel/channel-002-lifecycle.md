---
title: "Channel Lifecycle"
sequence: "102"
---

[UP](/netty.html)


- `ChannelUnregistered` The `Channel` was created, but isn't registered to an `EventLoop`.
- `ChannelRegistered` The `Channel` is registered to an `EventLoop`.
- `ChannelActive` The `Channel` is active (connected to its remote peer). It's now possible to receive and send data.
- `ChannelInactive` The `Channel` isn't connected to the remote peer.
