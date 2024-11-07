---
title: "Type Intro"
sequence: "101"
---

Types allow for validation of the content of elements and the values of attributes.

> type用来验证element content和attribute value的有效性

They can be either **simple types** or **complex types**.

Elements that have been assigned **simple types** have character data content, but no child elements or attributes.

By contrast, elements that have been assigned **complex types** may have child elements or attributes.

**Attributes** always have **simple types**, not complex types.
This makes sense, because attributes themselves cannot have children or other attributes.

```text
                                     ┌─── simple type
                   ┌─── Element ─────┤
XML Schema Type ───┤                 └─── complex type
                   │
                   └─── Attribute ───┼─── simple type
```

## Built-in Datatypes

The XML Schema language has 44 built-in simple types
that are specified in [XML Schema Part 2: Datatypes](https://www.w3.org/TR/xmlschema-2/).

XML Schema 1.0 Built-in Datatypes

![](/assets/images/xml/xml-schema-built-in-types.1.0.gif)

XML Schema 1.1 Built-in Datatypes

![](/assets/images/xml/xml-schema-built-in-types.1.1.png)

These datatypes of course belong to the XML Schema namespace, so we will
use them with the `xsd:` prefix, as in `xsd:string`.

Table 1-1 lists the most commonly used built-in datatypes. For a
complete list of built-in datatypes, consult the W3C Recommendation.

Commonly Used Built-in Datatypes

| Datatype | Description                    | Example                                                  |
|----------|--------------------------------|----------------------------------------------------------|
| string   | A character string             | New York, NY                                             |
| int      | –2147483648 to 2147483647      | +234, –345, 678987                                       |
| double   | A 64-bit floating point number | –345.e-7, NaN, –INF, INF                                 |
| decimal  | A valid decimal number         | –42.5, 67, 92.34, +54.345                                |
| date     | A date in CCYY-MM-DD format    | 2006-05-05                                               |
| time     | Time in hh:mm:ss-hh:mm format  | 10:27:34-05:00 (for 10:27:34 EST, which is –5 hours UTC) |

## Complex Type Declarations

A `complexType` constrains **elements** and **attributes** in an XML document.

You can specify a `complexType` in a schema construct or an element declaration.
If you specify a `complexType` in a `schema` construct,
the `complexType` is referenced in an `element` declaration with a `type` attribute.

In the example schema, you can define the `catalogType` type as a complex type as shown here:

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <xsd:element name="catalog" type="catalogType"></xsd:element>
    <xsd:complexType name="catalogType">
    </xsd:complexType>
</xsd:schema>
```

### Sequence Model Groups

You can also define an element within a `sequence` model group,
which, as the name implies, defines **an ordered list of one or more elements**.

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <xsd:element name="catalog" type="catalogType"></xsd:element>
    <xsd:complexType name="catalogType">
        <xsd:sequence>
            <xsd:element ref="journal"/>
            <!-- we have yet to define a global journal element -->
        </xsd:sequence>
    </xsd:complexType>
</xsd:schema>
```

The `journal` element declaration within the `catalogType` complex type uses a `ref` attribute
to refer to a global `journal` element definition.

### Choice Model Groups

You can also define an element within a `choice` model group,
which defines a choice of elements from which one element may be selected.

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <xsd:element name="catalog" type="catalogType"></xsd:element>
    <xsd:complexType name="catalogType">
        <xsd:sequence>
            <xsd:element ref="journal"/>
        </xsd:sequence>
    </xsd:complexType>
    <xsd:element name="journal">
        <xsd:complexType>
            <xsd:choice>
                <xsd:element name="article" type="paperType"/>
                <xsd:element name="research" type="paperType"/>
                <!-- we have yet to define a paperType type -->
            </xsd:choice>
        </xsd:complexType>
    </xsd:element>
</xsd:schema>
```

### All Model Groups

You can also define an element within an `all` model group,
which defines **an unordered list of elements**,
all of which can appear in any order, but each element may be present at most once.

```xml
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <xsd:element name="catalog" type="catalogType"></xsd:element>

    <xsd:complexType name="catalogType">
        <xsd:sequence>
            <xsd:element ref="journal"/>
        </xsd:sequence>
    </xsd:complexType>

    <xsd:element name="journal">
        <xsd:complexType>
            <xsd:choice>
                <xsd:element name="article" type="paperType"/>
                <xsd:element name="research" type="paperType"/>
            </xsd:choice>
        </xsd:complexType>
    </xsd:element>

    <xsd:complexType name="paperType">
        <xsd:all>
            <xsd:element name="title" type="titleType"/>
            <xsd:element name="author" type="authorType"/>
            <!-- we have yet to define titleType and authorType -->
        </xsd:all>
    </xsd:complexType>
</xsd:schema>
```

### Named Model Groups

You can define all the model groups you've seen so far—`sequence`, `choice`, and `all`—within a named model group.

The named model group in turn can be referenced in complex types and in other named model groups.
This promotes the reusability of model groups.

```text
<xsd:complexType name="paperType">
    <xsd:group ref="paperGroup"/>
</xsd:complexType>
<xsd:group name="paperGroup">
    <xsd:all>
        <xsd:element ref="title"/>
        <xsd:element ref="author"/>
    </xsd:all>
</xsd:group>
```

### Cardinality

You specify the cardinality of a construct with the `minOccurs` and `maxOccurs` attributes.

> 两个属性

The default value for both the `minOccurs` and `maxOccurs` attributes is `1`,
which implies that the default cardinality of any construct is 1, if no cardinality is specified.

> 默认值

You can specify cardinality on an `element` declaration or on the `sequence`, `choice`, and `all` model groups,
as long as these groups are specified outside a named model group.
You can specify named model group cardinality when the group is referenced in a complex type.

> 出现的位置

If you want to specify that a `catalogType` complex type should allow zero or more occurrences of `journal` elements,
you can do so as shown here:

```xml
<xsd:complexType name="catalogType">
    <xsd:sequence>
        <xsd:element ref="journal" minOccurs="0" maxOccurs="unbounded"/>
    </xsd:sequence>
</xsd:complexType>
```

## Simple Content

A `simpleContent` construct specifies a constraint on character data and attributes.

You specify a `simpleContent` construct in a `complexType` construct.

> 位置

Two types of simple content constructs exist: an `extension` and a `restriction`.

> 两种类型

You specify `simpleContent` extension with an `extension` construct.
If you want to define an `authorType` as an element
that allows a `string` type in its content and also allows an `email` attribute,
you can do so using a `simpleContent` extension
that adds an `email` attribute to a `string` built-in type, as shown here:

```text
<xsd:complexType name="authorType">
    <xsd:simpleContent>
        <xsd:extension base="xsd:string">
            <xsd:attribute name="email" type="xsd:string" use="optional"/>
        </xsd:extension>
    </xsd:simpleContent>
</xsd:complexType>
```

You specify a `simpleContent` restriction with a `restriction` element.
If you want to define a `titleType` as an element
that allows a string type in its content but restricts the length of this content to between 10 to 256 characters,
you can do so using a simpleContent restriction that adds the `minLength` and `maxLength` constraining facets to a string base type,
as shown here:

```text
<xsd:complexType name="titleType">
    <xsd:simpleContent>
        <xsd:restriction base="xsd:string">
            <xsd:minLength value="10"/>
            <xsd:maxLength value="256"/>
        </xsd:restriction>
    </xsd:simpleContent>
</xsd:complexType>
```

### Constraining Facets

Constraining facets are a powerful mechanism for restricting the content of a built-in **simple type**.

The following table has a complete list of the constraining facets.
These facets must be applied to relevant built-in types,
and most of the time the applicability of a facet to a built-in type is fairly intuitive.

Constraining Facets


- `length`: Number of units of length, 8
- `minLength`: Minimum number of units of length, say `m1`, 20
- `maxLength`: Maximum number of units of length, 200 (Greater or equal to `m1`)
- `pattern`: A regular expression, `[0-9]{5}` (for first part of a U.S. ZIP code)
- `enumeration`: An enumerated value, Male
- `whitespace`: Whitespace processing
    - `preserve` (as is),
    - `replace` (new line and tab with space), or
    - `collapse` (contiguous sequences of space into a single space)
- `maxInclusive`: Inclusive upper bound, 255 (for a value less than or equal to 255)
- `maxExclusive`: Exclusive upper bound, 256 (for a value less than 256)
- `minExclusive`: Exclusive lower bound, 0 (for a value greater than 0)
- `minInclusive`: Inclusive lower bound, 1 (for a value greater than or equal to 1)
- `totalDigits`: Total number of digits in a decimal value, 8
- `fractionDigits`: Total number of fractions digits in a decimal value, 2

## Complex Content

A `complexContent` element specifies a constraint on elements (including attributes).

You specify a complexContent construct in a `complexType` element.

Just like in the case of **simple content**, **complex content** has two types of constructs: an `extension` and a `restriction`.

You specify a `complexContent` extension with an `extension` element.
If, for example, you want to add a `webAddress` attribute to a `catalogType` complex type
using a complex content extension, you can do so as shown here:

```text
<xsd:complexType name="catalogTypeExt">
    <xsd:complexContent>
        <xsd:extension base="catalogType">
            <xsd:attribute name="webAddress" type="xsd:string"/>
        </xsd:extension>
    </xsd:complexContent>
</xsd:complexType>
```

You specify a `complexContent` restriction with a `restriction` element.
In a complex content restriction, you basically have to repeat, in the restriction element,
the part of the base model you want to retain in the restricted complex type.
If, for example, you want to restrict the `paperType` complex type to only a `title` element using a complex content restriction,
you can do so as shown here:

```text
<xsd:complexType name="paperTypeRes">
    <xsd:restriction base="paperType">
        <xsd:all>
            <xsd:element name="title" type="titleType"/>
        </xsd:all>
    </xsd:restriction>
</xsd:complexType>
```

## Simple Type Declarations

A `simpleType` construct specifies information and constraints on attributes and text elements.

Since XML Schema has 44 built-in simple types,
a `simpleType` is either used to constrain **built-in datatypes** or used to define a **list** or **union** type.

If you wanted, you could have specified `authorType` as a simple type restriction on a built-in `string` type,
as shown here:

```text
<xsd:element name="authorType">
    <xsd:simpleType>
        <xsd:restriction base="xsd:string">
            <xsd:minLength value="10"/>
            <xsd:maxLength value="256"/>
        </xsd:restriction>
    </xsd:simpleType>
</xsd:element>
```

### List

A `list` construct specifies a `simpleType` construct as a list of values of a specified datatype.

For example, the following is a `simpleType` that defines a list of integer values in a `chapterNumbers` element:

```text
<xsd:element name="chapterNumbers">
    <xsd:simpleType>
        <xsd:list itemType="xsd:integer"/>
    </xsd:simpleType>
</xsd:element>
```

The following example is an element corresponding to the `simpleType` declaration defined previously:

```text
<chapterNumbers>8 12 11</chapterNumbers>
```

### Union

A `union` construct specifies a union of `simpleType`s.

For example, if you first define `chapterNames` as a `list` of `string` values, as shown here:

```text
<xsd:element name="chapterNames">
    <xsd:simpleType>
        <xsd:list itemType="xsd:string"/>
    </xsd:simpleType>
</xsd:element>
```

then you can specify a union of `chapterNumbers` and `chapterNames` as shown here:

```text
<xsd:element name="chapters">
    <xsd:simpleType>
        <xsd:union memberTypes="chapterNumbers, chapterNames"/>
    </xsd:simpleType>
</xsd:element>
```

This is an example element corresponding to the `chapters` declaration defined previously:

```text
<chapters>8 XSLT 11</chapters>
```

Of course, since list values may not contain any whitespace,
this example is completely contrived
because chapter names in real life almost always contain whitespace.

## Complete Example Schema Document

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

    <xsd:element name="journal">
        <xsd:complexType>
            <xsd:choice>
                <xsd:element name="article" type="paperType"/>
                <xsd:element name="research" type="paperType"/>
            </xsd:choice>
        </xsd:complexType>
    </xsd:element>

    <xsd:complexType name="paperType">
        <xsd:all>
            <xsd:element name="title" type="titleType"/>
            <xsd:element name="author" type="authorType"/>
        </xsd:all>
    </xsd:complexType>

    <xsd:complexType name="authorType">
        <xsd:simpleContent>
            <xsd:extension base="xsd:string">
                <xsd:attribute name="email" type="xsd:string" use="optional"/>
            </xsd:extension>
        </xsd:simpleContent>
    </xsd:complexType>

    <xsd:complexType name="titleType">
        <xsd:simpleContent>
            <xsd:restriction base="xsd:string">
                <xsd:minLength value="10"/>
                <xsd:maxLength value="256"/>
            </xsd:restriction>
        </xsd:simpleContent>
    </xsd:complexType>

</xsd:schema>
```

