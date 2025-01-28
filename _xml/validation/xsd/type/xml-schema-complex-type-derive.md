---
title: "Complex Type Deriving"
sequence: "123"
---

## Why derive types?

XML Schema allows you to derive **a new complex type** from **an existing simple or complex type**.

While it is always possible to make a copy of an existing type and modify it to suit your needs.

## Restriction and extension

Complex types are derived from other types either by **restriction** or **extension**.

- Restriction, as the name suggests, restricts the valid contents of a type.
  The values for the new type are a subset of those for the base type.
  All values of the restricted type are also valid according to the base type.
- Extension allows for adding children and/or attributes to a type.
  Values of the base type are not necessarily valid for the extended type,
  since required elements or attributes may be added.

It is not possible to restrict and extend a complex type at the same time,
but it is possible to do this in two steps,
first extending a type, and then restricting the extension, or vice versa.
However, when doing this, it is not legal to remove something in a restriction and
then use extension to add it back in an incompatible way;
for example, you cannot re-add an element declaration with a different type.

## Simple content and complex content

A complex type always has either **simple content** or **complex content**.

**Simple content** means that it has only character data content, with no children.
**Complex content** encompasses the other three content types (mixed, element-only, and empty).

A complex type is derived from another type using either a `simpleContent` element or a `complexContent` element.

### simpleContent elements

A `simpleContent` element is used when deriving a complex type from a simple type,
or from another complex type with simple content.

This can be done to add or remove attribute declarations,
or to further restrict the simple type of the character content.

> simple content可以对attribute（添加和移除）和value space进行操作。

If a complex type has simple content, all types derived from it, directly or indirectly,
must also have simple content.

> simple content保持不变

It is impossible to switch from **simple content** to **complex content** by deriving a type with child elements.

> simple content不能向complex content进行转换

### complexContent elements

A `complexContent` element is used when deriving a complex type from another complex type
which itself has complex content.
This includes mixed, element-only, and empty content types.
This can be done to add or remove parts of the content model as well as attribute declarations.

If `complexContent` has a `mixed` attribute, that value is used.
If it has no `mixed` attribute, the `mixed` attribute of `complexType` is used.
If neither element has a `mixed` attribute, the default for `mixed` is `false`.

## Complex type extensions

Complex types may be extended by adding to the **content model** and to the **attribute declarations**.

### Simple content extensions

The only purpose of simple content extensions is to add **attribute declarations**.

> 能够做什么

It is not possible to extend the value space of the simple content,
just as it is not possible to extend the value space of a simple type.

> 不能做什么

```text
<xsd:complexType name="sizeType">
    <xsd:simpleContent>
        <xsd:extension base="xsd:integer">
            <xsd:attribute name="system" type="xsd:token"/>
        </xsd:extension>
    </xsd:simpleContent>
</xsd:complexType>
```

### Complex content extensions

Complex content extensions allow you to add to the end of the **content model** of the base type.
You can also add **attribute declarations**, but you cannot modify or remove the base type's attribute declarations.

When defining a complex content extension, you do not need to copy the content model from the base type.
The processor handles complex content extensions by appending the new content model after the base type's content model,
as if they were together in a `sequence` group.

```text
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
```

### Mixed content extensions

Complex types with **mixed content** can be extended, but the derived type must also have **mixed content**.
The extension is treated the same way as it is for element-only complex types.

It is illegal to extend a mixed content type to result in an element-only content type.
The reverse is also true; it is illegal to extend an element-only content type to result in a mixed content type.

> mixed content与element-only content不能互相转换

When extending a mixed content type, you must also specify the `mixed` attribute for the derived type.

```text
<xsd:complexType name="letterType" mixed="true">
    <xsd:sequence>
        <xsd:element name="custName" type="xsd:string"/>
        <xsd:element name="prodName" type="xsd:string"/>
        <xsd:element name="prodSize" type="xsd:integer"/>
    </xsd:sequence>
</xsd:complexType>

<xsd:complexType name="extenedLetterType" mixed="true">
    <xsd:complexContent>
        <xsd:extension base="letterType">
            <xsd:sequence>
                <xsd:element name="prodNum" type="xsd:string"/>
            </xsd:sequence>
        </xsd:extension>
    </xsd:complexContent>
</xsd:complexType>
```

### Empty content extensions

Complex types with empty content can be extended to add a content model and/or attribute declarations.

```text
<xsd:complexType name="itemType">
    <xsd:attribute name="routingNum" type="xsd:integer"/>
</xsd:complexType>

<xsd:complexType name="productType">
    <xsd:complexContent>
        <xsd:extension base="itemType">
            <xsd:sequence>
                <xsd:element name="number" type="xsd:integer"/>
                <xsd:element name="name" type="xsd:string"/>
            </xsd:sequence>
        </xsd:extension>
    </xsd:complexContent>
</xsd:complexType>
```

### Attribute extensions

When defining an extension, you may specify additional attribute declarations in the derived type's definition.

When extending complex types, attributes are always passed down from the base type to the new type.
It is not necessary  (or even legal) to repeat any attribute declarations
from the base type or any other ancestors in the new type definition.
It is not possible to modify or remove any attribute declarations from the base type in an extension.

### Attribute wildcard extensions


## Complex type restrictions

Complex types may be restricted by eliminating or restricting **attribute declarations**
as well as by subsetting **content models**.
When restriction is used, instances of the derived type will always be valid for the base type as well. 

### Simple content restrictions

The purpose of a simple content restriction is to restrict the simple content and/or
attribute declarations of a complex type.

The `base` attribute must refer to a complex type with **simple content**, not a simple type.
This is because a restriction of a simple type is another simple type, not a complex type.

```text
<xsd:complexType name="sizeType">
    <xsd:simpleContent>
        <xsd:extension base="xsd:integer">
            <xsd:attribute name="system" type="xsd:token"/>
        </xsd:extension>
    </xsd:simpleContent>
</xsd:complexType>

<xsd:complexType name="smallSizeType">
    <xsd:simpleContent>
        <xsd:restriction base="sizeType">
            <xsd:minInclusive value="2"/>
            <xsd:maxInclusive value="6"/>
            <xsd:attribute name="system" type="xsd:token" use="required"/>
        </xsd:restriction>
    </xsd:simpleContent>
</xsd:complexType>
```

### Complex content restrictions

Complex content restrictions allow you to restrict the **content model**
and/or **attribute declarations** of a complex type.

When restricting complex content, it is necessary to repeat all of the content model that is desired.
The full content model specified in the restriction becomes the content model of the derived type.
This content model must be a restriction of the content model of the base type.
This means that all instances of the new restricted type must also be valid for the base type.

```text
<xsd:complexType name="productType">
    <xsd:sequence>
        <xsd:element name="number" type="xsd:integer"/>
        <xsd:element name="name" type="xsd:string"/>
        <xsd:element name="size" type="xsd:integer" minOccurs="0"/>
        <xsd:element name="color" type="xsd:string" minOccurs="0"/>
    </xsd:sequence>
</xsd:complexType>

<xsd:complexType name="restrictedProductType">
    <xsd:complexContent>
        <xsd:restriction base="productType">
            <xsd:sequence>
                <xsd:element name="number" type="xsd:integer"/>
                <xsd:element name="name" type="xsd:string"/>
            </xsd:sequence>
        </xsd:restriction>
    </xsd:complexContent>
</xsd:complexType>
```

### Mixed content restrictions

Complex types with mixed content may be restricted to derive
other complex types with mixed content or with element-only content.
The reverse is not true: It is not possible to restrict an element-only complex type to result in a complex type with mixed content.

```text
                                           ┌─── extension
                      ┌─── simple ─────────┤
                      │                    └─── restriction
                      │
                      │                    ┌─── extension
                      ├─── element-only ───┤
                      │                    └─── restriction
                      │
                      │                    ┌─── extension
                      │                    │
Complex Derivation ───┤                    │
                      ├─── mixed ──────────┤                   ┌─── mixed
                      │                    │                   │
                      │                    │                   ├─── element-only
                      │                    └─── restriction ───┤
                      │                                        ├─── simple
                      │                                        │
                      │                                        └─── empty
                      │                    ┌─── extension
                      └─── empty ──────────┤
                                           └─── restriction
```

If you want the derived type to be mixed, you must specify the `mixed` attribute for the derived type,
since the quality of being mixed is not inherited from the base type.

**Mixed content restriction**

```text
<xsd:complexType name="letterType" mixed="true">
    <xsd:sequence>
        <xsd:element name="custName" type="xsd:string"/>
        <xsd:element name="prodName" type="xsd:string"/>
        <xsd:element name="prodSize" type="xsd:integer" minOccurs="0"/>
    </xsd:sequence>
</xsd:complexType>

<xsd:complexType name="restrictedLetterType" mixed="true">
    <xsd:complexContent>
        <xsd:restriction base="letterType">
            <xsd:sequence>
                <xsd:element name="custName" type="xsd:string"/>
                <xsd:element name="prodName" type="xsd:string"/>
            </xsd:sequence>
        </xsd:restriction>
    </xsd:complexContent>
</xsd:complexType>
```

It is also possible to restrict a **mixed content type** to derive an **empty content type**,
or even a complex type with **simple content**.
This is only legal if all of the children in the content model of the base type are optional.

```text
<xsd:complexType name="letterType" mixed="true">
    <xsd:sequence minOccurs="0">
        <xsd:element name="custName" type="xsd:string"/>
        <xsd:element name="prodName" type="xsd:string"/>
        <xsd:element name="prodSize" type="xsd:integer"/>
    </xsd:sequence>
</xsd:complexType>

<xsd:complexType name="restrictedLetterType">
    <xsd:simpleContent>
        <xsd:restriction base="letterType">
            <xsd:simpleType>
                <xsd:restriction base="xsd:string"/>
            </xsd:simpleType>
        </xsd:restriction>
    </xsd:simpleContent>
</xsd:complexType>
```

### Empty content restrictions

Complex types with empty content may be restricted, but the restriction applies only to the attributes.

The derived type must also have empty content.

```text
<xsd:complexType name="itemType">
    <xsd:attribute name="routingNum" type="xsd:integer"/>
</xsd:complexType>

<xsd:complexType name="restrictedItemType">
    <xsd:complexContent>
        <xsd:restriction base="itemType">
            <xsd:attribute name="routingNum" type="xsd:short"/>
        </xsd:restriction>
    </xsd:complexContent>
</xsd:complexType>
```

### Attribute restrictions

When defining a restriction, you may restrict or eliminate attribute declarations of the base type.

All attribute declarations are passed down from the base type to the derived type,
so the only attribute declarations that need to appear in the derived type definition are those you want to restrict or remove.

```text
<xsd:complexType name="baseType">
    <!-- type -->
    <xsd:attribute name="a" type="xsd:integer"/>
    <!-- default -->
    <xsd:attribute name="b" type="xsd:string"/>
    <xsd:attribute name="c" type="xsd:string" default="c"/>
    <!-- fixed -->
    <xsd:attribute name="d" type="xsd:string"/>
    <xsd:attribute name="e" type="xsd:string" fixed="e"/>
    <!-- use -->
    <xsd:attribute name="f" type="xsd:string"/>
    <xsd:attribute name="g" type="xsd:string"/>
    <xsd:attribute name="x" type="xsd:string"/>
</xsd:complexType>

<xsd:complexType name="derivedType">
    <xsd:complexContent>
        <xsd:restriction base="baseType">
            <!-- type -->
            <xsd:attribute name="a" type="xsd:positiveInteger"/>
            <!-- default -->
            <xsd:attribute name="b" type="xsd:string" default="b"/>
            <xsd:attribute name="c" type="xsd:string" default="c2"/>
            <!-- fixed -->
            <xsd:attribute name="d" type="xsd:string" fixed="d"/>
            <xsd:attribute name="e" type="xsd:string" fixed="e"/>
            <!-- use -->
            <xsd:attribute name="f" type="xsd:string" use="required"/>
            <xsd:attribute name="g" type="xsd:string" use="prohibited"/>
        </xsd:restriction>
    </xsd:complexContent>
</xsd:complexType>
```

### Attribute wildcard restrictions

### Restricting types from another namespace

## Type substitution


