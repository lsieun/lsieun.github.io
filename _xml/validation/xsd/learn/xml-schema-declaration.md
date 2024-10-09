---
title: "XML Schema Declaration"
sequence: "115"
---

## Schema Declarations

The root element of a schema is `schema`, and it is defined in the XML Schema namespace
`xmlns:xsd="http://www.w3.org/2001/XMLSchema"`.

An example schema document with its root element is as follows:

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
</xsd:schema>
```

## Namespace Declaration

A schema document **cannot have more than one** target namespace.

```text
最多只能有一个 target namespace
```

However, you can link together schema documents that have different target namespaces, using an `import`.

```text
可以使用 import
```

If you do not plan to use namespaces, you are not required to specify a target namespace.
In this case, omit the `targetNamespace` attribute entirely.

```text
也可以不使用 namespace
```

## Element Declarations

定义 `element`：

```text
<xsd:element name="element-name" type="element-type"/>
```

例如：

```text
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <xsd:element name="catalog" type="catalogType"></xsd:element>
    <!-- we have yet to define a catalogType -->
</xsd:schema>
```

## Attribute Declarations

You can specify an attribute declaration in a schema with the `attribute` construct.

> 引入 attribute

You can specify an attribute declaration within a `<schema>` or a `<complexType>`.

> 可以出现的位置

```text
<xsd:complexType name="catalogType">
    <xsd:sequence>
        <xsd:element ref="journal" minOccurs="0" maxOccurs="unbounded"/>
    </xsd:sequence>
    <xsd:attribute name="title" type="xsd:string" use="required"/>
    <xsd:attribute name="publisher" type="xsd:string" use="optional" default="Unknown"/>
</xsd:complexType>
```

```text
                        ┌─── name
                        │
                        ├─── type
                        │
XMLSchema::attribute ───┤               ┌─── optional (default)
                        ├─── use ───────┤
                        │               └─── required
                        │
                        └─── default
```

An attribute declaration may specify a `use` attribute, with a value of `optional` or `required`.
The default use value for an attribute is `optional`.

> 介绍 use 属性

In addition, an attribute can specify a **default value** using the `default` attribute.

> 介绍 default 属性

When an XML document instance does not specify an `optional` attribute with a `default` value,
an attribute with the default value is assumed during document validation with respect to its schema.
Clearly, an attribute with a `default` value cannot be a `required` attribute.

> 这两个属性之间的关系

### Attribute Groups

An `<attributeGroup>` construct specifies a group of attributes.

For example, if you want to define the attributes for a `catalogType` as an attribute group,
you can define a `catalogAttrGroup` attribute group, as shown here:

```text
<xsd:attributeGroup name="catalogAttrGroup">
    <xsd:attribute name="title" type="xsd:string" use="required"/>
    <xsd:attribute name="publisher" type="xsd:string" use="optional" default="Unknown"/>
</xsd:attributeGroup>
```

You can specify an `attributeGroup` in a `schema`, `complexType`, and `attributeGroup`.

> 出现的位置

You can specify the `catalogAttrGroup` shown previously within the schema element and
can reference it using the ref attribute in the `catalogType` complex type,
as shown here:

```text
<xsd:complexType name="catalogType">
    <xsd:sequence>
        <xsd:element ref="journal" minOccurs="0" maxOccurs="unbounded"/>
    </xsd:sequence>
    <xsd:attributeGroup ref="catalogAttrGroup"/>
</xsd:complexType>
```

## 示例

### 示例1

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <xsd:element name="catalog" type="catalogType"/>

    <xsd:complexType name="catalogType">
        <xsd:sequence>
            <xsd:element ref="journal" minOccurs="0" maxOccurs="unbounded"/>
        </xsd:sequence>
        <xsd:attribute name="title" type="xsd:string" use="required"/>
        <xsd:attribute name="publisher" type="xsd:string" use="optional" default="Unknown"/>
    </xsd:complexType>

    <xsd:element name="journal" type="xsd:string"/>
</xsd:schema>
```

### 示例2

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <xsd:element name="catalog" type="catalogType"/>

    <xsd:complexType name="catalogType">
        <xsd:sequence>
            <xsd:element ref="journal" minOccurs="0" maxOccurs="unbounded"/>
        </xsd:sequence>
        <xsd:attributeGroup ref="catalogAttrGroup"/>
    </xsd:complexType>

    <xsd:element name="journal" type="xsd:string"/>

    <xsd:attributeGroup name="catalogAttrGroup">
        <xsd:attribute name="title" type="xsd:string" use="required"/>
        <xsd:attribute name="publisher" type="xsd:string" use="optional" default="Unknown"/>
    </xsd:attributeGroup>
</xsd:schema>
```

