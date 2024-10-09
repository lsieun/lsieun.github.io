---
title: "SAX Handlers"
sequence: "155"
---

To parse a document using the SAX 2.0 API, you must define two classes:

- A class that implements the `ContentHandler` interface
- A class that implements the `ErrorHandler` interface

The SAX 2.0 API provides a `DefaultHandler` helper class that fully implements the `ContentHandler` and `ErrorHandler`
interfaces and provides default behavior for every parser event type along with default error handling.

Applications can extend the `DefaultHandler` class and override relevant base class methods to implement their custom callback handler.
`CustomSAXHandler`, shown in Listing 2-13, is such a class that overrides some of the base class event notification
methods, including the error-handling methods.
