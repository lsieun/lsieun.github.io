---
title: "Dapper"
sequence: "105"
---

- dapper: (of a man 男人) with a neat appearance and nice clothes 利落的；衣冠楚楚的（楚楚：鲜明、整洁的样子。衣帽穿戴得很整齐，很漂亮。）
- dagger: a short pointed knife that is used as a weapon 匕首；短剑

- Two Fundamental Requirements
    - ubiquitous deployment
    - continuous monitoring
- Three Concrete Design Goals
    - low overhead
        - implementation
            - sampling
            - restricting the instrumentation to a rather small number of common libraries
    - application-level transparency: programmers should not need to be aware of the tracing system.
    - scalability

```text
用过某种产品 --> 发现它有某种问题 --> 设计新的产品 --> 设计目标（解决什么问题）
```

## 必要性

**Complex distributed systems** are of special interest
because **large collections of small servers** are a particularly cost-efficient platform
for Internet services workloads.
**Understanding system behavior** in this context requires **observing related activities**
across many different programs and machines.

```text
问题：如何理解复杂的系统？

回答：
complex distributed systems --> large collections of small servers --> observing related activities --> understanding system behavior
       复杂的系统                         大量的微服务                               观察                                理解
```

> special interest 指某个人或团体对某个特定领域、主题或活动的特殊关注和热衷。


A web-search example will illustrate some of the challenges such a system needs to address.
**A front-end service** may distribute a web query to many hundreds of **query servers**,
each searching within its own piece of the index.
The query may also be sent to a number of other sub-systems that may process advertisements,
check spelling, or look for specialized results, including images, videos, news, and so on.
Results from all of these services are selectively combined in the **results page**;
we call this model “**universal search**”.
In total, thousands of machines and many different services might be needed to process one universal search query.

```text
描述一个使用场景：

用户 --> 浏览器 --> query server --> a number of other sub-systems (advertisements, images, videos, news)
                                             |
              <-----------------   combined results page
```

Moreover, web-search users are sensitive to delays,
which can be caused by poor performance in any sub-system.

> web-search users 如何感受

An engineer looking only at the overall latency may know there is a problem,
but may not be able to guess which service is at fault, nor why it is behaving poorly.

> engineer 只看到了 latency 的表象，却不了解……

First, the engineer may not be aware precisely which services are in use;
new services and pieces may be added and modified from week to week,
both to add user-visible features and to improve other aspects such as performance or security.

```text
第一种情况，engineer 不了解都用到了哪些 service    （service 的集合）
```

Second, the engineer will not be an expert on the internals of every service;
each one is built and maintained by a different team.

```text
第二种情况，engineer 不知道 service 的内部    （某一个 service 的内部细节）
```

Third, services and machines may be shared simultaneously by many different clients,
so a performance artifact may be due to the behavior of another application.
For example, front-ends may handle many different request types,
or a storage system such as Bigtable may be most efficient when shared across multiple applications.

```text
第三种情况，engineer 不了解是哪个 service 造成了 performance 问题

performance artifact，其中 artifact 
```

## Two Fundamental Requirements

The scenario described above gives rise to two fundamental requirements for Dapper:
**ubiquitous deployment**, and **continuous monitoring**.

### Ubiquity

Ubiquity is important since the usefulness of a tracing infrastructure can be severly
impacted if even small parts of the system are not being monitored.

### Continuous Monitoring

In addition, **monitoring should always be turned on**,
because it is often the case that unusual or
otherwise noteworthy system behavior is difficult or impossible to reproduce.

## Three Concrete Design Goals

Three concrete design goals result from these requirements:

### Low overhead

the tracing system should have negligible performance impact on running services.
In some highly optimized services even small monitoring overheads are easily noticeable,
and might compel the deployment teams to turn the tracing system off.

### Application-level transparency

programmers should not need to be aware of the tracing system.
A tracing infrastructure
that relies on active collaboration from application-level developers in order to function
becomes extremely fragile, and is often broken due to instrumentation bugs or omissions,
therefore violating the ubiquity requirement.
This is especially important in a fast-paced development environment.

### Scalability

it needs to handle the size of Google's services and clusters for at least the next few years.

### tracing data available for analysis quickly

An additional design goal is for tracing data to be available for analysis quickly after it is generated:
ideally within a minute.
Although a trace analysis system operating on hours-old data is still quite valuable,
the availability of fresh information enables faster reaction to production anomalies.

## 如何实现这些 Goal

**True application-level transparency**, possibly our **most challenging design goal**, was achieved by restricting
Dapper's core tracing instrumentation to a small corpus of ubiquitous threading, control flow, and RPC library code.

```text
application-level transparency --> core tracing instrumentation to a small corpus of ubiquitous threading, control flow, and RPC library code
```

Making the **system scalable** and **reducing performance overhead** was facilitated by the use of **adaptive sampling
**.

```text
Scalability --> sampling

Low overhead --> sampling
```

The resulting system also includes code to collect traces, tools to visualize them,
and libraries and APIs (Application Programming Interfaces) to analyze large collections of traces.

```text
最终的系统，需要有一个完整的处理过程。

adaptive sampling --> trace data(分散存储) --> collect trace(汇总) --> visualize
                                                                 --> analyze
```

Although Dapper alone is sometimes sufficient for a developer to identify the source of a performance anomaly,
it is not intended to replace all other tools.
We have found that Dapper's system-wide data often focuses a performance investigation
so that other tools can be applied locally.

## Implementation

### sampling

We have found **sampling** to be necessary for **low overhead**,
especially in highly optimized Web services which tend to be quite latency sensitive.

Perhaps somewhat more surprisingly, we have found that
**a sample of just one out of thousands of requests provides sufficient information**
for many common uses of the tracing data.

## Two classes of solutions

Two classes of solutions have been proposed to aggregate this information
so that one can associate all record entries with a given initiator,
**black-box** and **annotation-based monitoring schemes**.

```text
两种方式：black-box + annotation-based
```

**Black-box schemes** assume there is no additional information other than the message record described above,
and use statistical regression techniques to infer that association.

```text
Black-box schemes
```

**Annotation-based schemes** rely on applications or middleware to explicitly tag every record with a global identifier
that links these message records back to the originating request.

```text
Annotation-based schemes
```

While **black-box schemes** are more portable than **annotation-based methods**,
they need more data in order to gain sufficient accuracy due to their reliance on statistical inference.

```text
black-box schemes 的劣势是 需要更多的数据
```

The key disadvantage of **annotation-based methods** is, obviously, the need to instrument programs.

```text
annotation-based methods 的劣势是需要 instrument program
```

In our environment, since all applications use the same threading model, control flow and RPC system,
we found that it was possible to restrict instrumentation to a small set of common libraries,
and achieve a monitoring system that is effectively transparent to application developers.

## Distributed Tracing in Dapper

Formally, we model Dapper traces using **trees**, **spans**, and **annotations**.

### Trace trees and spans

In a Dapper trace tree, the **tree** nodes are basic units of work which we refer to as **spans**.

The edges indicate a casual relationship between a span and its parent span.

```text
parent span -- edge --> span 
```

Independent of its place in a larger trace tree, though,
a span is also a simple log of timestamped records
which encode the span's start and end time, any RPC timing data, and zero or more application-specific annotations.

```text
span = a simple log of timestamped records
```

We illustrate how spans form the structure of a larger trace in Figure 2.

Dapper records a human-readable **span name** for **each span**, as well as a **span id** and **parent id**
in order to reconstruct the causal relationships between the individual spans in a single distributed trace.

```text
span = span name + span id + parent span id
```

Spans created without a parent id are known as **root spans**.

```text
root span
```

All spans associated with a specific trace also share a common trace id.
All of these ids are probabilistically unique 64-bit integers.
In a typical Dapper trace we expect to find a single span for each RPC,
and each additional tier of infrastructure adds an additional level of depth to the trace tree.

### Instrumentation points

Instrumentation 是修改字节码，Instrumentation points 是修改字节码的地方

- 线程内
- 跨线程（Thread）
- 跨进程（inter-process）

### Annotations

The **instrumentation points** described above are sufficient
to derive detailed traces of complex distributed systems,
making the core Dapper functionality available to otherwise unmodified Google applications.

```text
通过 instrumentation points，从某种程度上，可以衍生出 detailed traces of complex distributed systems
```

However, Dapper also allows application developers to enrich Dapper traces with additional information
that may be useful to monitor higher level system behavior or to help in debugging problems.
We allow users to define timestamped annotations through a simple API.

```text
但是，application developers 可以使用 annotation 提供更“精细”的链路信息。
```

### Sampling

Sampling 解决的一个关键问题就是 low overhead。

### Trace collection

怎样将 Instrumentation Points、Annotation、Sampling 和 Trace collection 关联起来呢？

- Instrumentation Points 是通过Instrumentation（修改字节码）的方式来收集数据，不需要 developer 的参与
- Annotation 是由 developer 参与，提供更详细的 trace data
- 前两者都是收集 trace data 的方式，而 sampling 是减少 trace data 的数据量
- Trace collection 是一个过程，
    - 第一步，trace data 放到 host 上
    - 第二步，分散在不同 host 上的 trace data 收集到一起
    - 第三步，将汇总的数据，存储起来

The Dapper trace logging and collection pipeline is a three-stage process.

```text
trace logging (local) --> trace collection (hosts) --> trace central repository
```

First, span data is written (1) to local log files.
It is then pulled (2) from all production hosts by Dapper daemons and collection infrastructure and
finally written (3) to a cell in one of several regional Dapper Bigtable repositories.

![](/assets/images/apm/dapper/an-overview-of-the-dapper-collection-pipeline.png)

### Out-of-band trace collection

```text
out of band 在通信系统中，指在正常数据传输频带之外的频带，用于传输额外的信息或信号。
```

The Dapper system performs trace logging and collection out-of-band with the request tree itself.
This is done for two unrelated reasons.

```text
trace logging + trace collection --> 两种实施方式：out-of-band 和 in-band


Dapper 选择了 out-of-band 的方式，有两个原因
```

First, **an in-band collection scheme** – where trace data is sent back within RPC response headers –
can affect application network dynamics.
In many of the larger systems at Google, it is not uncommon to find traces with thousands of spans.
However, RPC responses – even near the root of such large distributed traces – can still be comparatively small:
often less than ten kilobytes.
In cases like these, the **in-band Dapper trace data** would dwarf the **application data**
and bias the results of subsequent analyses.

```text
in-band trace data 的数据量要大于 application data
```

Secondly, **in-band collection schemes assume that all RPCs are perfectly nested.**
We find that there are many middleware systems
which return a result to their caller before all of their own backends have returned a final result.
**An in-band collection system is unable to account for such non-nested distributed execution patterns.**

```text
in-band collection schemes 做了一个这样的假设：all RPCs are perfectly nested.

但是，事实上，有些 middleware systems 是一种 non-nested distributed execution pattern

因此，in-band collection system 不支持
```

### Security and privacy considerations

Logging some amount of RPC **payload** information
would enrich Dapper traces since analysis tools might be able to find patterns in payload data
which could explain performance anomalies.

```text
payload 信息，可能有助于查找 performance anomalies 的问题
```

However, there are several situations
where the payload data may contain information that should not be disclosed to unauthorized internal users,
including engineers working on performance debugging.

```text
但是，payload 信息可能包含需要保密的信息
```

Since security and privacy concerns are non-negotiable,
Dapper stores the name of RPC methods but does not log any payload data at this time.

```text
Dapper 记录 the name of RPC methods，但是并不记录 payload data
```

Instead, application-level annotations provide a convenient opt-in mechanism:
the **application developer** can choose to associate any data
it determines to be useful for later analysis with a span.

```text
opt-in 选择性加入，决定参加（计划等）

application developer 可以有选择性的添加 trace data
```

## Reference

- [【论文阅读】Dapper, a Large-Scale Distributed Systems Tracing Infrastructure](https://www.bilibili.com/video/BV19q4y1T7e3)

