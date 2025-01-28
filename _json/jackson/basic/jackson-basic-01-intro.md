---
title: "Overview"
sequence: "101"
---

## What is Jackson?

Jackson is mainly known as a library that converts JSON strings and Plain Old Java Objects (POJOs).
It also supports many other data formats such as CSV, YML, and XML.

Under the hood, Jackson has three core packages **Streaming**, **Databind**, and **Annotations**.
With those, Jackson offers us three ways to handle JSON-POJO conversion:

### Streaming API

It's the **fastest approach** of the three and the one with the least overhead.
It reads and writes JSON content as discrete events.
The API provides a `JsonParser` that reads JSON into POJOs and a `JsonGenerator` that writes POJOs into JSON.

### Tree Model

The Tree Model creates an in-memory tree representation of the JSON document.
An `ObjectMapper` is responsible for building a tree of `JsonNode` nodes.
It is the **most flexible approach** as it allows us to traverse the node tree
when the JSON document doesn't map well to a POJO.

### Data Binding

It allows us to do conversion between POJOs and JSON documents using property accessors or using annotations.
It offers two types of binding:

- **Simple Data Binding** which converts JSON to and from Java Maps, Lists, Strings, Numbers, Booleans, and null objects.
- **Full Data Binding** which Converts JSON to and from any Java class.

