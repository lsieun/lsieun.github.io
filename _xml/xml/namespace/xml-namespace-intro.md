---
title: "XML Namespace Intro"
sequence: "101"
---

Namespaces are defined by a separate W3C recommendation called **Namespaces in XML**,
which is in two versions: [1.0](https://www.w3.org/TR/xml-names/) and [1.1](https://www.w3.org/TR/xml-names11/).

## 作用

An XML Namespace associates **an element or attribute name** with **a specified URI** and
thus allows for multiple elements (or attributes) within an XML document to have the same name
yet have different semantics associated with those names
because they belong to different XML Namespaces.

The key point to understand is that the sole purpose of associating
**a uniform resource indicator (URI)** to a **namespace**
is to associate **a unique value** with a namespace.

## Namespace names

**Namespace names are Uniform Resource Identifiers (URIs).**

URIs encompass URLs of various schemes (e.g., HTTP, FTP, gopher, telnet),
as well as URNs (Uniform Resource Names).
Many namespaces are written in the form of HTTP URLs.

```text
常用方式：namespace 使用 HTTP URL 的表达方式
```

**The main purpose of a namespace is not to point to a location where a resource resides.**
Instead, much like a Java package name, **it is intended to provide a unique name**
that can be associated with a particular person or organization.
**Therefore, namespace names are not required to be dereferenceable.**

```text
主要是提供一个 unique name，并不需要能够 dereferenceable
```

**There is absolutely no requirement that the URI should point to anything meaningful.**
The namespace URI could point to a schema, an HTML page, a directory of resources, or nothing at all.

