---
title: "Pipeline 关闭"
sequence: "107"
---

[UP](/netty.html)

## 正常关闭

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-close-normal.svg)

### 小总结

- 第 1 步，Java Channel 关闭
- 第 2 步，EventLoop 取消：Selector 取消
- 第 3 步，Pipeline
    - pipeline.fireChannelReadComplete()
    - pipeline.fireChannelInactive()
    - pipeline.fireChannelUnregistered()
        - handlerRemoved

## 异常关闭

![](/assets/images/netty/channel/pipeline/netty-channel-pipeline-close-exception.svg)


