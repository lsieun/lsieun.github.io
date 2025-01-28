---
title: "gRPC"
image: /assets/images/grpc/grpc-cover.png
permalink: /grpc.html
---

**gRPC** is a powerful framework for working with **Remote Procedure Calls**.
RPCs allow you to write code as though it will be run on a local computer,
even though it may be executed on another computer.

## Basic

{%
assign filtered_posts = site.grpc |
where_exp: "item", "item.url contains '/grpc/basic/'" |
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

## 通信模式

{%
assign filtered_posts = site.grpc |
where_exp: "item", "item.url contains '/grpc/streaming/'" |
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

## Integration

{%
assign filtered_posts = site.grpc |
where_exp: "item", "item.url contains '/grpc/integration/'" |
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

## Reference

- [lsieun/learn-java-grpc](https://github.com/lsieun/learn-java-grpc)

- [gRPC](https://grpc.io/)
    - [Generated-code reference](https://grpc.io/docs/languages/java/generated-code/)
- [Language Guide (proto 3)](https://protobuf.dev/programming-guides/proto3/)

- [Bealdung Tag: gRPC](https://www.baeldung.com/tag/grpc)
    - [Introduction to gRPC](https://www.baeldung.com/grpc-introduction)
    - [Streaming with gRPC in Java](https://www.baeldung.com/java-grpc-streaming)
    - [Error Handling in gRPC](https://www.baeldung.com/grpcs-error-handling)
- [Badeldung Tag: Protobuf](https://www.baeldung.com/tag/protobuf)
    - [Introduction to Google Protocol Buffer](https://www.baeldung.com/google-protocol-buffer)

- [What is gRPC? Protocol Buffers, Streaming, and Architecture Explained](https://www.freecodecamp.org/news/what-is-grpc-protocol-buffers-stream-architecture/)


