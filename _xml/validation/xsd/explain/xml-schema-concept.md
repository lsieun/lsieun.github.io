---
title: "XML Schema 相关概念"
sequence: "102"
---

## Elements and attributes

**Elements** and **attributes** are the basic building blocks of XML documents.

### The tag/type distinction

Each of the **elements** and **attributes** is associated with a `type`.

XML Schema separates the concepts of elements and attributes from their types.

## Schema composition

An XSD schema is a set of components such as **type definitions** and **element declarations**.

However, a schema could also be represented by an assembly of schema documents.

One way to compose them is through the `include` and `import` mechanisms.

- **Include** is used when the other schema document has the same target namespace as the "main" schema document.
- **Import** is used when the other schema document has a different target namespace.

The `include` and `import` mechanisms are not the only way for processors to assemble schema documents into a schema.
Unfortunately, there is not always a "main" schema document that represents the whole schema.
Instead, a processor might join schema documents from various predefined locations, or take multiple hints from the instance.

## Instances and schemas

A document that conforms to a **schema** is known as an **instance**.
An instance can be validated against a particular schema,
which may be made up of the schema components defined in multiple schema documents.

A number of different ways exist for the **schema** documents to be located for a particular **instance**.
One way is using the `xsi:schemaLocation` attribute.

Using `xsi:schemaLocation` is not the only way to tell the processor where to find the schema.
XML Schema is deliberately flexible on this topic,
allowing processors to use different methods for choosing schema documents to validate a particular instance.
These methods include **built-in schemas**, use of **internal catalogs**,
use of the `xsi:schemaLocation` attribute, and **dereferencing of namespaces**.

## Annotations

XML Schema provides many mechanisms for describing the structure of XML documents.
However, it cannot express everything there is to know about an instance or the data it contains.

For this reason, XML Schema allows **annotations** to be added to almost any schema component.
These annotations can contain human-readable information
(under `documentation`) or application information (under `appinfo`).

## Advanced features

### Named groups

XML Schema provides the ability to define **groups of element and attribute declarations**
that are reusable by many complex types.
This facility promotes reuse of schema components and eases maintenance.
**Named model groups** are fragments of content models,
and **attribute groups** are bundles of related attributes that are commonly used together.

### Identity constraints

Identity constraints allow you to uniquely identify nodes in a document and
ensure the integrity of references between them.
They are similar to the primary and foreign keys in databases.

### Substitution groups

**Substitution groups** are a flexible way to designate **certain element declarations** as
substitutes for **other element declarations** in content models.
If you have a group of related elements that may appear interchangeably in instances,
you can reference the substitution group as a whole in content models.
You can easily add new element declarations to the substitution groups,
from other schema documents, and even other namespaces,
without changing the original declarations in any way.

### Redefinition and overriding

**Redefinition** and **overriding** allow you to define a new version of a schema component while keeping the same name.
This is useful for extending or creating a subset of an existing schema document,
or overriding the definitions of components in a schema document.

### Assertions

Assertions are XPath constraints on XML data,
which allow complex validation above and beyond what can be specified in a content model.
This is especially useful for co-constraints,
where the values or existence of certain child elements or
attributes affect the validity of other child elements or attributes.

