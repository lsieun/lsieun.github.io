---
title: "API: Document"
sequence: "101"
---

[UP](/spring-ai/index.html)

## 结构

A document is a container for the content and metadata of a document.
It also contains the document's unique ID.
A Document can hold either text content or media content, but not both.
It is intended to be used to take data from external sources as part of spring-ai's ETL pipeline.

```text
text --> Document --> Embedding Model --> vector --> Vector Store
```

```text
Path(Java) --> Resource(Spring) --> DocumentReader(Spring) --> Document
```

- ETL
    - document
        - id
        - content
            - text
            - media
        - metadata

## 更高维度

An **ETL (Extract, Transform, Load) pipeline** is an automated system
that ingests raw data from various sources, cleans and structures it,
and loads it into a centralized repository—like a data warehouse—for analytics and business intelligence.

```text
String --> DocumentReader --> Document --> DocumentWriter
```
