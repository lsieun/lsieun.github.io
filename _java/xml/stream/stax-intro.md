---
title: "StAX"
sequence: "161"
---

StAX is a pull-model API for parsing XML.

The **Streaming API for XML** (**StAX**), specified by [JSR-173](http://www.jcp.org/en/jsr/detail?id=173) of Java Community Process,
provides an easy and intuitive means of parsing and generating XML documents.
It is similar to the SAX API, but enables a procedural, stream-based handling of XML documents
rather than requiring you to write SAX event handlers,
which can get complicated when you work with complex XML documents.
In other words, StAX gives you more control over parsing than the SAX.

Key points about StAX API are as follows:

- The StAX API classes are in the `javax.xml.stream` and `javax.xml.stream.events` packages.
- The StAX API offers two different APIs for parsing an XML document: **a cursor-based API** and **an iterator-based API**.
- The `XMLStreamReader` interface parses an XML document using the cursor API.
- `XMLEventReader` parses an XML document using the iterator API.
- You can use the `XMLStreamWriter` interface to generate an XML document.

## Cursor API

For a `START_DOCUMENT` event type, the `getEncoding()` method returns the encoding in the XML document.
The `getVersion()` method returns the XML document version.

For a `START_ELEMENT` event type, the `getPrefix()` method returns the element prefix,
and the `getNamespaceURI()` method returns the namespace or the default namespace.
The `getLocalName()` method returns the local name of an element.

The `getAttributesCount()` method returns the number of attributes in an element.
The `getAttributePrefix(int)` method returns the attribute prefix for a specified attribute index.
The `getAttributeNamespace(int)` method returns the attribute namespace for a specified attribute index.
The `getAttributeLocalName(int)` method returns the local name of an attribute,
and the `getAttributeValue(int)` method returns the attribute value.

## Iterator API