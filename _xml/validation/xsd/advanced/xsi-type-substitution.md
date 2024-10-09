---
title: "XML Schema Instance - Type substitution"
sequence: "123"
---

uses the `xsi:type` attribute to indicate the **type substitution**.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="https://www.example.com/xml/item"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            elementFormDefault="qualified"
            targetNamespace="https://www.example.com/xml/item">

    <xsd:element name="items" type="itemType"/>
    <xsd:element name="product" type="productType"/>

    <xsd:complexType name="itemType">
        <xsd:sequence>
            <xsd:element ref="product" maxOccurs="unbounded"/>
        </xsd:sequence>
    </xsd:complexType>

    <xsd:complexType name="productType">
        <xsd:sequence>
            <xsd:element name="number" type="xsd:integer"/>
            <xsd:element name="name" type="xsd:string"/>
        </xsd:sequence>
    </xsd:complexType>

    <xsd:complexType name="shirtType">
        <xsd:complexContent>
            <xsd:extension base="productType">
                <xsd:choice maxOccurs="unbounded">
                    <xsd:element name="size" type="xsd:integer"/>
                    <xsd:element name="color" type="xsd:string"/>
                </xsd:choice>
            </xsd:extension>
        </xsd:complexContent>
    </xsd:complexType>
</xsd:schema>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<items xmlns="https://www.example.com/xml/item"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="https://www.example.com/xml/item ./xsd/item.xsd">
    <product>
        <number>101</number>
        <name>Shoes</name>
    </product>
    <product xsi:type="shirtType">
        <number>102</number>
        <name>T-Shirt</name>
        <size>170</size>
        <color>blue</color>
    </product>
</items>
```

The `xsi:type` attribute is part of the XML Schema Instance Namespace, which must be declared in the instance.

This attribute does not, however, need to be declared in the type definition for `product`;
a schema processor recognizes `xsi:type` as a special attribute that may appear on any element.
