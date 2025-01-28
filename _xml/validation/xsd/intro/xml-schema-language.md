---
title: "XML Schema Language"
sequence: "111"
---

## Document Type Definition (DTD)

Document Type Definitions (DTDs) are a commonly used method of describing XML documents.
The DTD syntax is the original W3C schema language, built into XML 1.0 itself.

A DTD allows you to define the basic structure of an XML instance, including

- The structure and order of elements
- The allowed attributes for elements
- Basic data typing for attributes
- Default and fixed values for attributes
- Notations to represent other data formats

DTDs have many advantages.
They are relatively simple, have a compact syntax,
and are widely understood by XML software implementers.

However, DTDs also have some shortcomings.
They do not support **namespaces** easily, and they provide very limited data typing, for attributes only.
Also, because they have a non-XML syntax, they cannot be parsed as XML,
which is useful for generating documentation or making wholesale changes.

## Schema requirements expand

As XML became increasingly popular for applications such as e-commerce and enterprise application integration (EAI),
a more robust schema language was needed.
Specifically, XML developers wanted:

- The ability to constrain data based on **common data types** such as `integer` and `date`.
- The ability to **define their own types** in order to further constrain data.
- Support for **namespaces**.
- The ability to specify multiple element declarations with the same name in different contexts.
- Object-oriented features such as **type derivation**.
  The ability to express types as **extensions** or **restrictions** of other types allows them to be processed similarly and substituted for each other.
- A schema language that uses XML syntax.
  This is advantageous because it is extensible, can represent more advanced models, and can be processed by many available tools.
- The ability to add **structured documentation and application information** that is passed to the application during processing.

DTDs have not disappeared since newer schema languages arrived on the scene.
They are supported in many tools, are widely understood,
and are still in use in many applications, especially in the publishing arena.
In addition, they continue to be useful as a lightweight alternative to newer schema languages.

## W3C XML Schema

Four schema languages were developed before work began on XML Schema: XDR (XML Data Reduced), DCD, SOX, and DDML.
These four languages were considered, together, as a starting point for XML Schema,
and many of their originators were involved in the creation of XML Schema.

The World Wide Web Consortium (W3C) began work on XML Schema in 1998,
and it became an official recommendation on May 2, 2001.

On April 5, 2012, version 1.1 of XML Schema became official.
It includes several significant enhancements as well as many small changes.
One change was the name, which is officially "W3C XML Schema Definition Language (XSD) 1.1."
Understandably, this book follows the common practice of continuing to use the name "XML Schema,"
along with "XSD" in syntax tables and other formal language contexts.

XML Schema 1.1 is backward-compatible with 1.0,
and schema authors do not need to specify in their schema documents the version to which they conform.

The formal recommendation is in three parts:

- [XML Schema Part 0: Primer](https://www.w3.org/TR/xmlschema-0/) is a non-normative introduction to XML Schema 1.0 that provides a lot of examples and explanations.
- [XML Schema Part 1: Structures](https://www.w3.org/TR/xmlschema11-1/) describes most of the components of XML Schema.
- [XML Schema Part 2: Datatypes](https://www.w3.org/TR/xmlschema11-2/) covers **simple types**.
  It explains the built-in types and the facets that may be used to restrict them.
  It is a separate document so that other specifications may use it, without including all of XML Schema.






