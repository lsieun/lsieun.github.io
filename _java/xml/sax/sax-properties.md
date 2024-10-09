---
title: "SAX Properties"
sequence: "154"
---

### SAX Properties

SAX parser properties are name-value pairs that you can use to supply object values to a SAX parser.

These properties affect parser behavior and can be set on a parser
through the `setProperty(String, Object)` method.

The first argument passed to `setProperty` is the name of a property,
and the second argument is an `Object` value.

The following table lists some of the commonly used SAX parser properties.
Some of the properties are implementation specific,
so not all properties may be supported by different SAX parser implementations.

- `http://apache.org/xml/properties/schema/external-schemaLocation`: Specifies the external schemas for validation
- `http://apache.org/xml/properties/schema/external-noNamespaceSchemaLocation`: Specifies external no-namespace schemas
- `http://xml.org/sax/properties/declaration-handler`: Specifies the handler for DTD declarations
- `http://xml.org/sax/properties/lexical-handler`: Specifies the handler for lexical parsing events
- `http://xml.org/sax/properties/dom-node`: Specifies the DOM node being parsed if SAX is used as a DOM iterator
- `http://xml.org/sax/properties/document-xml-version`: Specifies the XML version of the document

