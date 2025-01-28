---
title: "Web API"
sequence: "101"
---

Generally speaking, an **API** exposes a set of data and functions to facilitate interactions
between computer programs and allow them to exchange information.

```text
API
```

A **Web API** is the face of a web service, directly listening and responding to client requests.

```text
API --> Web API
```

The REST architectural style is commonly applied to the design of APIs for modern web services.
A **Web API** conforming to the REST architectural style is a **REST API**.

```text
API --> Web API --> REST API
```

Having a REST API makes a web service "RESTful."
A REST API consists of an assembly of interlinked resources.
This set of resources is known as the REST API's **resource model**.

```text
REST API --> interlinked resources --> resource model
```

**REST is resource-based architecture.**
A resource is accessed via a common interface based on the HTTP standard methods.
REST asks developers to use HTTP methods explicitly and in a way that's consistent with the protocol definition.
**Each resource is identified by a URL.**
Every **resource** should support the HTTP common operations,
and REST allows that resource to have different **representations**, e.g., text, xml, json, etc.
The rest client can ask for specific representation via the HTTP protocol (Content Negotiation).

## Structures of REST

| Data Element            | Description                                                                                                                            |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| Resource                | Conceptual target of a hypertext reference, e.g., customer/order                                                                       |
| Resource Identifier     | A uniform resource locator (URL) or uniform resource name (URN) identifying a specific resource, e.g., http://myrest.com/customer/3435 |
| Resource Metadata       | Information describing the resource, e.g., tag, author, source link, alternate location, alias names                                   |
| Representation          | The resource content—JSON Message, HTML Document, JPEG Image                                                                           |
| Representation Metadata | Information describing how to process the representation, e.g., media type, last-modified time                                         |
| Control Data            | Information describing how to optimize response processing, e.g., if-modified-since, cache-control-expiry                              |

 

 


