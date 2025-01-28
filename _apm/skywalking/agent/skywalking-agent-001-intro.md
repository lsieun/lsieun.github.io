---
title: "Intro"
sequence: "101"
---

SkyWalking Agent 为了能够让更多开发者加入开发，并能能够有足够的自由度（比如，一些私有协议），使用了插件机制。

Agent 启动时，会加载所有 plugins，进行字节码增强。

Plugins 有两个核心目标：

- 创建 Span 加入 Trace 调用链
- 数据的传输（如何将数据加入到 Header 中）


SkyWalking 没有使用传统的 Span 模型，处于性能考虑，将 Span 保存为数组，存放到 TraceSegment 结构中批量发送；
同时， TraceSegment 可以很好地在 UI 上展示信息。

一个 TraceSegment 是 Trace 在一个进程内所有 Span 的集合。
如果是多个线程协同产生 1 个 Trace （例如，多次 RPC 调用不同的方法），它们只会共同创建 1 个 TraceSegment。

由于支持多个入口，因此 SkyWalking 去掉了 RootSpan 的概念，SkyWalking 提出了 3 种 Span 类型：

- EntrySpan
- LocalSpan
- ExitSpan

```text
                              ┌─── EntrySpan
                              │
         ┌─── TraceSegment ───┼─── LocalSpan
         │                    │
         │                    └─── ExitSpan
Trace ───┤
         ├─── TraceSegment
         │
         └─── TraceSegment
```

## Reference

- [SkyWalking Java Agent]()
- [SkyWalking NodeJS Agent](https://www.npmjs.com/package/skywalking-backend-js)
- [SkyWalking Nginx LUA Agent](https://luarocks.org/modules/apache-skywalking/skywalking-nginx-lua)
- [SkyWalking Client JavaScript](https://npmjs.com/package/skywalking-client-js)

