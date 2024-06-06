---
title: "Netty"
image: /assets/images/netty/netty-cover.png
permalink: /netty.html
---

Netty is a non-blocking I/O client-server framework.

- Netty 基础
- Netty 常用协议
- Netty 优化
- Netty 源码解析

## Netty 基础

### 初识 Netty

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">Example</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/example/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### Netty 核心组件

只有 `ChannelHandler` 是需要我们自己去编写的。

- [Netty 核心组件概览]({% link _netty/component/netty-component-index.md %})

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Data</th>
        <th style="text-align: center;" colspan="3">Network Layer</th>
        <th style="text-align: center;">Application Logic</th>
    </tr>
    <tr>
        <th style="text-align: center;">ByteBuf</th>
        <th style="text-align: center;">EventLoop</th>
        <th style="text-align: center;">Channel</th>
        <th style="text-align: center;">Future & Promise</th>
        <th style="text-align: center;">Handler & Pipeline</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/component/bytebuf/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/component/eventloop/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/component/channel/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/component/future/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/component/handler/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### 处理器详解

<table>
    <thead>
    <tr>
        <th style="text-align: center;">状态：连接和关闭</th>
        <th style="text-align: center;" colspan="3">数据：切割和转换</th>
    </tr>
    <tr>
        <th style="text-align: center;">网络连接（Connection）</th>
        <th style="text-align: center;">数据帧（Frame）</th>
        <th style="text-align: center;">解码器（Codec）</th>
        <th style="text-align: center;">序列化（Serialization）</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/handler/connection/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/handler/frame/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/handler/codec/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/handler/serde/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

## Netty 常用协议

### HTTP

<table>
    <thead>
    <tr>
        <th style="text-align: center;">SSL/TLS</th>
        <th style="text-align: center;">HTTP</th>
        <th style="text-align: center;">HTTP2</th>
        <th style="text-align: center;">HTTP3</th>
        <th style="text-align: center;">WebSocket</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/protocol/ssl/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/protocol/http/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/protocol/http2/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/protocol/http3/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/protocol/websocket/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### UDP

<table>
    <thead>
    <tr>
        <th style="text-align: center;">UDP</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/protocol/udp/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

## Netty 高级特性

### 选项参数

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Server</th>
        <th style="text-align: center;">Client</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/option/server/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/option/client/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### Extra

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Extra</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/extra/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

## Netty 源码解析

- [黑马 Netty 源码](https://www.bilibili.com/video/BV1py4y1E7oA?p=139)
- [Netty源码深入剖析](https://www.bilibili.com/video/BV1rS4y1v7Zw/)
    - [Java读源码之Netty深入剖析](https://coding.imooc.com/class/chapter/230.html)
- [尚硅谷Netty视频教程（B站超火，好评如潮）](https://www.bilibili.com/video/BV1DJ411m7NR/)
- [Netty开发实战 - 1](https://www.bilibili.com/video/BV1Fb4y137LD/)
- [Netty开发实战 - 2](https://www.bilibili.com/video/BV1Xk4y157XG/)

- [YT: netty源码剖析与实战](https://www.youtube.com/playlist?list=PLRLw3X3wZOXsP2Xw-InzKHkPX7Z4Qfo55)
- [YT: 韩顺平】尚硅谷Netty视频教程](https://www.youtube.com/playlist?list=PLmOn9nNkQxJH02M10mFnBW0yPRnLmRSMo)
- [YT: Netty核心技术及源码剖析](https://www.youtube.com/playlist?list=PLmVUaUOGNoKWYks8m16gESmH8w5HkMb-4)

- [Netty4源码分析](https://www.zhihu.com/column/c_1715435263956979712)
- [Netty 核心原理剖析与 RPC 实践](https://www.bilibili.com/video/BV1e24y1z7eJ/)
- [Netty高手教程](https://www.bilibili.com/video/BV1uP411Q7aT/)
- [吃透netty，从原理到实战（2024最新版）](https://www.bilibili.com/video/BV16w4m1Z7ED/)
- [Netty源码剖析](https://www.bilibili.com/video/BV1yk4y117ae/)
- [Netty高手教程（源码剖析+多个项目实战）](https://www.bilibili.com/video/BV1uP411Q7aT/)
- [Netty全套教程](https://www.bilibili.com/video/BV1xq4y1q7Jj/)
- [深入理解netty](https://www.bilibili.com/video/BV1c4411J7Ty/)

### 源码编译

<table>
    <thead>
    <tr>
        <th style="text-align: center;">源码环境</th>
        <th style="text-align: center;">示例代码</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/code/compile/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/code/example/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### Bootstrap

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Bootstrap</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/bootstrap/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### EventLoop

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">Group</th>
        <th style="text-align: center;">Selector</th>
        <th style="text-align: center;">Thread</th>
        <th style="text-align: center;">Task & TaskQueue</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/eventloop/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/eventloop/group/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/eventloop/selector/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/eventloop/thread/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/eventloop/task/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### Channel

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">NIO</th>
        <th style="text-align: center;">Pipeline</th>
        <th style="text-align: center;">Unsafe</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/channel/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/channel/nio/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/channel/pipeline/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/channel/unsafe/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### ByteBuf

<table>
    <thead>
    <tr>
        <th style="text-align: center;">ByteBuf</th>
        <th style="text-align: center;">ByteBufAllocator</th>
        <th style="text-align: center;">Pool（内存池）</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/buf/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/buf/allocator/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/buf/pool/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### Common

<table>
    <thead>
    <tr>
        <th style="text-align: center;">并发类</th>
        <th style="text-align: center;">工具类</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/common/concurrent/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/common/util/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### 设计模式、算法和技巧

<table>
    <thead>
    <tr>
        <th style="text-align: center;">设计模式</th>
        <th style="text-align: center;">算法</th>
        <th style="text-align: center;">技巧</th>
        <th style="text-align: center;">优化</th>
        <th style="text-align: center;">第三方类库</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/design-pattern/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/algorithm/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/trick/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/optimization/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
        <td>
{%
assign filtered_posts = site.netty |
where_exp: "item", "item.url contains '/netty/src/third/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>
        </td>
    </tr>
    </tbody>
</table>

### 参考图

<table>
    <thead>
    <tr>
        <th style="text-align: center;">BootStrap</th>
        <th style="text-align: center;">Channel</th>
        <th style="text-align: center;">EventLoop</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
            <ul>
                <li><a href="/assets/images/netty/bootstrap/netty-bootstrap-invoke-java-nio-1.svg">Netty 调用 Java NIO（第一版）</a></li>
                <li><a href="/assets/images/netty/bootstrap/netty-bootstrap-invoke-java-nio-2.svg">Netty 调用 Java NIO（第二版）</a></li>
                <li><a href="/assets/images/netty/bootstrap/netty-bootstrap-invoke-java-nio-3.svg">Netty 调用 Java NIO（第三版）</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="/assets/images/netty/channel/java-nio-channel-class-hierarchy.svg">Java NIO Channel 类继承关系图</a></li>
                <li><a href="/assets/images/netty/channel/netty-channel-class-hierarchy.svg">Netty Channel 类继承关系图</a></li>
                <li><a href="/assets/images/netty/channel/netty-channel-class-hierarchy-merged.svg">合并之后的类继承关系图</a></li>
                <li><a href="/assets/images/netty/channel/netty-channel-concept-relation.svg">Channel 相关概念</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li><a href="/assets/images/netty/eventloop/netty-eventloop-classes.svg">EventLoop 类继承关系图</a></li>
                <li><a href="/assets/images/netty/eventloop/thread/netty-eventloop-thread-1.svg">EventLoop 创建新线程1</a></li>
                <li><a href="/assets/images/netty/eventloop/thread/netty-eventloop-thread-2.svg">EventLoop 创建新线程2</a></li>
            </ul>
        </td>
    </tr>
    </tbody>
</table>

## Reference

- [lsieun/learn-java-netty](https://github.com/lsieun/learn-java-netty)

- [Netty](https://netty.io/)
    - [User guide for 4.x](https://netty.io/wiki/user-guide-for-4.x.html)
    - [Netty API Reference (4.1.109.Final)](https://netty.io/4.1/api/index.html)

- [GitHub: netty/netty](https://github.com/netty/netty)
    - [4.1.x 示例](https://github.com/netty/netty/tree/4.1/example/src/main/java/io/netty/example)

- [Baeldung Tag: Netty](https://www.baeldung.com/tag/netty)
    - [Introduction to Netty](https://www.baeldung.com/netty)
    - [HTTP Server with Netty](https://www.baeldung.com/java-netty-http-server)
    - [HTTP/2 in Netty](https://www.baeldung.com/netty-http2)

- [Stackoverflow: netty](https://stackoverflow.com/questions/tagged/netty)

