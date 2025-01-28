---
title: "XML Namespace Declarations"
sequence: "102"
---

## Namespace declarations and prefixes

### xmlns

An instance may include one or more namespace declarations that relate **elements** and **attributes** to namespaces.
This happens through a `prefix`, which serves as a proxy for the namespace.

A namespace is declared using a special attribute whose name starts with the letters `xmlns`.

You specify an XML Namespace through one of two reserved attributes:

- You can specify **a default XML Namespace URI** using the `xmlns` attribute.
- You can specify **a nondefault XML Namespace URI** using the `xmlns:prefix` attribute,
  where `prefix` is a unique prefix associated with this XML Namespace.

### prefix

Although the instance author may choose prefixes arbitrarily,
there are commonly used prefixes for some namespaces.

- `xsl`: **Extensible Stylesheet Language** (XSL) namespace
- `xsd` or `xs`: XML Schema Namespace

```text
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"/>
```

```text
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
```

## Scope

### Scope of namespace declarations

The scope of a namespace declaration is the element in whose start tag it appears,
and all of its children, grandchildren, and so on.

Generally, it is preferable to put all your namespace declarations in the root element's start tag.
It allows you to see at a glance what namespaces a document uses,
there is no confusion about their scopes, and it keeps them from cluttering the rest of the document.

### Overriding namespace declarations

Namespace declarations can also be overridden.
If a namespace declaration appears within the scope of another namespace declaration
with **the same prefix**, it overrides it.

Likewise, if a default namespace declaration appears within the scope of another default namespace declaration,
it overrides it.

## Undeclaring namespaces

A default namespace declaration may also be the empty string (that is, `xmlns=""`).
This means that unprefixed element names in its scope are not in any namespace.
This can be used to essentially "undeclare" the default namespace.

In version 1.1 (but not in 1.0), you can also undeclare a prefix by using an empty string.
