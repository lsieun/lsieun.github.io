---
title: "SAX Features"
sequence: "153"
---

`SAXParserFactory` features are logical switches that you can turn on and off to change parser behavior.

You can set the features of a factory through the `setFeature(String, boolean)` method.

The first argument passed to `setFeature` is the name of a feature,
and the second argument is a `true` or `false` value.

The following table lists some of the commonly used `SAXParserFactory` features.
Some of the `SAXParserFactory` features are implementation specific,
so not all features may be supported by different factory implementations.

`SAXParserFactory` Features:

- `http://xml.org/sax/features/namespaces`: Performs namespace processing if set to true
- `http://xml.org/sax/features/validation`: Validates an XML document
- `http://apache.org/xml/features/validation/schema`: Performs XML Schema validation
- `http://xml.org/sax/features/external-general-entities`: Includes external general entities
- `http://xml.org/sax/features/external-parameter-entities`: Includes external parameter entities and the external DTD subset
- `http://apache.org/xml/features/nonvalidating/load-external-dtd`: Loads the external DTD
- `http://xml.org/sax/features/namespace-prefixes`: Reports attributes and prefixes used for namespace declarations
- `http://xml.org/sax/features/xml-1.1`: Supports XML 1.1
