---
title: "XML Schema: Namespaces"
sequence: "103"
---

- XML Schema 1.0 uses [Namespaces 1.0](https://www.w3.org/TR/xml-names/)
- XML Schema 1.1 uses [Namespaces 1.1](https://www.w3.org/TR/xml-names11/)

## Concept

### Target namespaces

Each schema document can declare and define components for one namespace, known as its **target namespace**.

**Every globally declared or defined component** (element, attribute, type, named group, or notation)
is associated with that **target namespace**.

**Local element** declarations may or may not use the **target namespace** of the schema document.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="https://lsieun.github.io/assets/xml/company"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            targetNamespace="https://lsieun.github.io/assets/xml/company">
</xsd:schema>
```

Adding a **target namespace** to a **schema** is not just informational;
the target namespace becomes an important part of the names,
and it must be reflected in the **instance documents**.

```text
schema document ---> target namespace ---> instance document
```

A **schema document** cannot have more than one **target namespace**.
However, you can link together schema documents that have different target namespaces, using an `import`.

If you do not plan to use namespaces, you are not required to specify a target namespace.
In this case, omit the `targetNamespace` attribute entirely.

## Common

```text
                                               ┌─── namespace ───┼─── http://www.w3.org/2001/XMLSchema
                              ┌─── schema ─────┤
                              │                │                 ┌─── xsd
                              │                └─── prefix ──────┤
                              │                                  └─── xs
                              │
XMLSchemaNamespace::common ───┤                ┌─── namespace ───┼─── http://www.w3.org/2001/XMLSchema-instance
                              ├─── instance ───┤
                              │                └─── prefix ──────┼─── xsi
                              │
                              │                ┌─── namespace ───┼─── http://www.w3.org/2007/XMLSchema-versioning
                              └─── version ────┤
                                               └─── prefix ──────┼─── vc
```

### The XML Schema Namespace

- namespace: `http://www.w3.org/2001/XMLSchema`
- prefix: `xsd` or `xs`

Since schema documents are XML, namespaces also apply to them.
For example, all the elements used in schemas,
such as `schema`, `element`, and `simpleType`, are in the XML Schema Namespace,
whose namespace name is `http://www.w3.org/2001/XMLSchema`.
In addition, the names of the built-in simple types are in this namespace.

The prefixes most commonly mapped to this namespace are `xsd` or `xs`.

It is interesting to note that while all the element names are prefixed,
all the attribute names are unprefixed.
This is because none of the attributes in the XML Schema Namespace is declared globally.

> 这里很重要，我要了解它

### The XML Schema Instance Namespace

- namespace: `http://www.w3.org/2001/XMLSchema-instance`
- prefix: `xsi`

The XML Schema Instance Namespace is a separate namespace
for the four schema-related attributes that may appear in instances.
Its namespace name is `http://www.w3.org/2001/XMLSchema-instance`.
These attributes, whose names are commonly prefixed with `xsi`, are:
`type`, `nil`, `schemaLocation` , and `noNamespaceSchemaLocation`. 

### The Version Control Namespace

- namespace: `http://www.w3.org/2007/XMLSchema-versioning`
- prefix: `vc`

The XML Schema Version Control Namespace is a namespace used by six attributes
that signal to processors the conditions under which they should pay attention to particular schema components.
Its namespace name is `http://www.w3.org/2007/XMLSchema-versioning`,
and it is commonly associated with the prefix `vc`.

## Namespace declarations in schema documents

Schema documents must contain namespace declarations of both the **XML Schema Namespace** and the **target namespace**
in order to resolve the references between schema components.
There are three ways to set up the namespace declarations in your schema document.

### Map a prefix to the XML Schema Namespace

You can map the XML Schema Namespace to a prefix such as `xsd` or `xs`,
and make the **target namespace** the **default namespace**.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="https://lsieun.github.io/assets/xml/company"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            targetNamespace="https://lsieun.github.io/assets/xml/company">
</xsd:schema>
```













