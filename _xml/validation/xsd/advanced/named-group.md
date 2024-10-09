---
title: "XML Schema - Named Groups"
sequence: "124"
---

XML Schema provides the ability to define groups of element and attribute declarations
that are reusable by many complex types.

**Named model groups** are fragments of content models,
and **attribute groups** are bundles of attribute declarations that are commonly used together.

## Named model groups

Named model groups are reusable fragments of content models.
For example, if there are many type definitions in your schema that specify a description,
optionally followed by a comment,
you could define a group that represents this content model fragment.
The group could then be used by many complex type definitions.

Named model groups cannot contain attribute declarations;
that is the purpose of attribute groups.

### Defining named model groups

Named model groups are represented by `group` elements.

Named model groups are required to have a name,
and that name must be unique among all the named model groups in the schema.
Named model groups are always defined globally, meaning that their parent is always `schema`.

Named model groups may contain any content model.
However, a group cannot contain an element directly.
Instead, group must have one and only one model group (`choice`, `sequence`, or `all`) as a child.
There is an additional constraint that
this one model group child cannot have occurrence constraints (`minOccurs` and `maxOccurs`) like other model groups.
If you wish to indicate that the contents of the group appear multiple times,
you may put occurrence constraints on the **group reference**.

```text
<xsd:group name="descriptionGroup">
    <xsd:sequence>
        <xsd:element name="description" type="xsd:string"/>
        <xsd:element name="comment" type="xsd:string" minOccurs="0"/>
    </xsd:sequence>
</xsd:group>
```

```text
<xsd:element name="description" type="xsd:string"/>
<xsd:element name="comment" type="xsd:string"/>

<xsd:group name="descriptionGroup">
    <xsd:sequence>
        <xsd:element ref="description"/>
        <xsd:element ref="comment" minOccurs="0"/>
    </xsd:sequence>
</xsd:group>
```

### Referencing named model groups

Named model groups may be referenced in complex types and in other groups.

Since they are named global schema components,
they may be referenced not only from within the same schema document,
but also from other schema documents.

#### Group references

Named model groups are referenced through the `ref` attribute, just like other global schema components.

#### Referencing a named model group in a complex type

```text
<xsd:complexType name="purchaseOrderType">
    <xsd:sequence>
        <xsd:group ref="descriptionGroup" minOccurs="0"/>
        <xsd:element ref="items"/>
    </xsd:sequence>
</xsd:complexType>

<xsd:element name="description" type="xsd:string"/>
<xsd:element name="comment" type="xsd:string"/>

<xsd:group name="descriptionGroup">
    <xsd:sequence>
        <xsd:element ref="description"/>
        <xsd:element ref="comment" minOccurs="0"/>
    </xsd:sequence>
</xsd:group>
```

Note that when referencing a group,
`minOccurs` and `maxOccurs` may be specified to indicate
how many times the contents of the group may appear.
If `minOccurs` and `maxOccurs` are not specified, the default for both values is `1`.

#### Named model groups referencing named model groups

## Attribute groups

Attribute groups are used to represent groups of related attributes that appear in many different complex types.
For example, if the attributes `id`, `name`, and `version` are used in multiple complex types in your schema,
it may be useful to define an attribute group that contains declarations for these three attributes,
and then reference the attribute group in various complex type definitions.

### Defining attribute groups

Attribute groups are represented by `attributeGroup` elements.

Attribute groups are required to have a `name`,
and that name must be unique among all the attribute groups in the schema.

Attribute groups are always defined globally, meaning that their parent is always `schema`.

Attribute groups may contain any number of attribute declarations and references to other attribute groups,
plus one optional attribute wildcard.

An attribute group cannot contain more than one attribute declaration with the same qualified name.

In version 1.0, there is an additional constraint
that an attribute group cannot contain more than one attribute declaration of type `ID`.

```text
<xsd:attributeGroup name="identifierGroup">
    <xsd:attribute name="id" type="xsd:ID" use="required"/>
    <xsd:attribute name="version" type="xsd:decimal"/>
</xsd:attributeGroup>
```

### Referencing attribute groups

Attribute groups may be referenced in complex types and in other attribute groups.

Since they are named global schema components,
they may be referenced not only from within the same schema document,
but also from other schema documents.

#### Attribute group references

#### Referencing attribute groups in complex types

```text
<xsd:complexType name="productType">
    <xsd:sequence>
        <xsd:element name="number" type="xsd:integer"/>
        <xsd:element name="name" type="xsd:string"/>
    </xsd:sequence>
    <xsd:attributeGroup ref="identifierGroup"/>
    <xsd:attribute name="effDate" type="xsd:date"/>
</xsd:complexType>

<xsd:attributeGroup name="identifierGroup">
    <xsd:attribute name="id" type="xsd:ID" use="required"/>
    <xsd:attribute name="version" type="xsd:decimal"/>
</xsd:attributeGroup>
```

References to attribute groups must appear after the **content model** (a `sequence` group in this example).
They may appear before, after, or in between attribute declarations.
The order of attribute groups (and attributes) in a complex type is insignificant.

### The default attribute group

In version 1.1, you can indicate that an attribute group is the default attribute group
by specifying its name in the `defaultAttributes` attribute on the schema element.
If such a default attribute group is defined,
the attributes declared in that group will automatically be allowed for every complex type in the schema document,
unless you specifically disallow it.



