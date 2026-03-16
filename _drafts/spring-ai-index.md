---
title: "Spring AI"
image: /assets/images/spring-ai/spring-ai-logo-with-text.svg
permalink: /spring-ai/index.html
---

The **Spring AI** project aims to streamline the development of applications
that incorporate artificial intelligence functionality without unnecessary complexity.

**[Note](https://docs.spring.io/spring-ai/reference/getting-started.html)**:

```text
Spring AI supports Spring Boot 3.4.x and 3.5.x.
```

## Basic

<table>
    <thead>
    <tr>
        <th style="text-align: center;">LLM</th>
        <th style="text-align: center;">快速开始</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.spring-ai |
where_exp: "item", "item.path contains 'spring-ai/llm/'" |
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
assign filtered_posts = site.spring-ai |
where_exp: "item", "item.path contains 'spring-ai/basic/'" |
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

## RAG

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">API</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.spring-ai |
where_exp: "item", "item.path contains 'spring-ai/rag/basic/'" |
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
assign filtered_posts = site.spring-ai |
where_exp: "item", "item.path contains 'spring-ai/rag/api/'" |
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

## MCP

MCP (Model Context Protocol)

<table>
    <thead>
    <tr>
        <th style="text-align: center;">Basic</th>
        <th style="text-align: center;">Stdio</th>
        <th style="text-align: center;">Http</th>
        <th style="text-align: center;">API</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
{%
assign filtered_posts = site.spring-ai |
where_exp: "item", "item.path contains 'spring-ai/mcp/basic/'" |
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
assign filtered_posts = site.spring-ai |
where_exp: "item", "item.path contains 'spring-ai/mcp/stdio/'" |
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
assign filtered_posts = site.spring-ai |
where_exp: "item", "item.path contains 'spring-ai/mcp/http/'" |
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
assign filtered_posts = site.spring-ai |
where_exp: "item", "item.path contains 'spring-ai/mcp/api/'" |
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

## Reference

- [Baeldung: Spring AI](https://www.baeldung.com/category/spring/spring-ai)

- [Spring AI Reference](https://docs.spring.io/spring-ai/reference/index.html)
    - [Chat Models](https://docs.spring.io/spring-ai/reference/api/chatmodel.html)
        - [DeepSeek](https://docs.spring.io/spring-ai/reference/api/chat/deepseek-chat.html)
        - [OpenAI](https://docs.spring.io/spring-ai/reference/api/chat/openai-chat.html)

- [Retrieval Augmented Generation](https://docs.spring.io/spring-ai/reference/api/retrieval-augmented-generation.html)
    - [ETL Pipeline](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html)
- [Qwen](https://qwen.ai/)
    - [Qwen3 Embedding：新一代文本表征与排序模型](https://qwen.ai/blog?id=qwen3-embedding)

- Maven Repository
    - [spring-boot-starter-parent](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-parent)
    - [spring-boot-dependencies](https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-dependencies)
    - [spring-ai-bom](https://mvnrepository.com/artifact/org.springframework.ai/spring-ai-bom)
        - [spring-ai-starter-model-openai](https://mvnrepository.com/artifact/org.springframework.ai/spring-ai-starter-model-openai)
        - [spring-ai-starter-model-ollama](https://mvnrepository.com/artifact/org.springframework.ai/spring-ai-starter-model-ollama)
    - [spring-ai-alibaba-bom](https://mvnrepository.com/artifact/com.alibaba.cloud.ai/spring-ai-alibaba-bom)
        - [spring-ai-alibaba-starter-dashscope](https://mvnrepository.com/artifact/com.alibaba.cloud.ai/spring-ai-alibaba-starter-dashscope)

