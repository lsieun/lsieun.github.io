---
title: "Relationship"
sequence: "103"
---

## Attributes and namespaces

The relationship between attributes and namespaces is slightly simpler than the relationship between elements and namespaces.
Prefixed attribute names, as you would expect, are in whichever namespace is mapped to that prefix.
Attributes with prefixed names are sometimes referred to as **global attributes**.
Unprefixed attribute names, however, are never in a namespace.
This is because they are not affected by default namespace declarations.

Some people make the argument that an unprefixed attribute is (or should be) in the namespace of its parent element.
While it may be indirectly associated with that namespace, it is not directly in it.
For the purposes of writing schemas and using other XML technologies such as XSLT and XQuery,
you should treat an unprefixed attribute as if it were in no namespace at all.

## The relationship between namespaces and schemas

**Namespaces** and **schemas** have a many-to-many relationship.

A namespace can have names defined in any number of schemas.
A namespace can exist without any schema.
Some namespaces have one schema that defines its names.
Other namespaces have multiple schemas.
These schemas may be designed to be used together, or be completely incompatible with each other.
They could present different perspectives on the same information,
or be designed for different purposes such as varying levels of validation or system documentation.
They could be different versions of each other.
There are no rules that prevent several schemas from utilizing the same namespace, with overlapping declarations.
As long as the processor does not try to validate an instance against all of them at once, this is completely legal.

A schema can declare names for any number of target namespaces.
Some schemas have no target namespace at all.
Other schemas are represented by composing multiple schema documents, each with its own target namespace.

## Element/Attribute + Namespace

An element or an attribute is designated to be part of an XML Namespace
either by explicitly prefixing its name with an XML Namespace prefix
or by implicitly nesting it within an element that has been associated with a default XML Namespace.

It is important to understand
that a namespace `prefix` is merely a syntactic device to impart brevity to a namespace reference and
that **the real namespace** is always **the associated URI**. 


