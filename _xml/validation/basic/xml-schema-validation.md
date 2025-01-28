---
title: "XML Validation"
sequence: "103"
---

The process of validating an XML document with respect to a schema is **schema validation**.

If a document conforms to a schema, it is called an **instance** of the schema.
A schema defines a class of XML documents,
where each document in the class is an instance of the schema.
The relationship between a schema class and an instance document is analogous to
the relationship between a Java class and an instance object.

Several schema languages are available to define a schema.
The following two schema languages are part of W3C Recommendations:

- DTD is the XML 1.0 built-in schema language that uses XML markup declarations syntax to define a schema.
  Validating an XML document with respect to a DTD is an integral part of parsing.
- W3C XML Schema is an XML-based schema language.

Validating an XML document with respect to a schema definition based on the XML Schema language is the focus of this chapter.

You can classify the APIs into two groups:

- The first group includes the JAXP 1.3 SAX and DOM parser APIs.
  Both these APIs perform **validation** as an intrinsic part of the **parsing** process.
- The second group includes the JAXP 1.3 Validation API.
  **The Validation API** is unlike the first two APIs in that it completely decouples validation from **parsing**.

文件名：`catalog.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<catalog xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="catalog.xsd"
         title="OnJava.com" publisher="O'Reilly">
    <journal date="April 2004">
        <article>
            <title>Declarative Programming in Java</title>
            <author>Narayanan Jayaratchagan</author>
        </article>
    </journal>
    <journal date="January 2004">
        <article>
            <title>Data Binding with XMLBeans</title>
            <author>Daniel Steinberg</author>
        </article>
    </journal>
</catalog>
```

文件名：`catalog.xsd`

```xml
<?xml version="1.0" encoding="utf-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:element name="catalog">
        <xs:complexType>
            <xs:sequence>
                <xs:element ref="journal" minOccurs="0" maxOccurs="unbounded"/>
            </xs:sequence>
            <xs:attribute name="title" type="xs:string"/>
            <xs:attribute name="publisher" type="xs:string"/>
        </xs:complexType>
    </xs:element>

    <xs:element name="journal">
        <xs:complexType>
            <xs:sequence>
                <xs:element ref="article" minOccurs="0" maxOccurs="unbounded"/>
            </xs:sequence>
            <xs:attribute name="date" type="xs:string"/>
        </xs:complexType>
    </xs:element>

    <xs:element name="article">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="title" type="xs:string"/>
                <xs:element ref="author" minOccurs="0" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
    </xs:element>
    <xs:element name="author" type="xs:string"/>
</xs:schema>
```

