---
title: "Simple Types"
sequence: "119"
---

```text
                                     ┌─── simple type
                   ┌─── Element ─────┤
                   │                 └─── complex type
XML Schema Type ───┤
                   │
                   └─── Attribute ───┼─── simple type
```

## Simple type varieties

There are three varieties of simple types: **atomic types**, **list types**, and **union types**.

- Atomic types have values that are indivisible.
- List types have values that are whitespace-separated lists of atomic values
- Union types may have values that are either atomic values or list values.

What differentiates them is that the set of valid values, or "value space," for the type is the union of the value spaces of two or more other simple types.

```text
                                        ┌─── atomic type
                                        │
                   ┌─── simple type ────┼─── list
                   │                    │
XML Schema Type ───┤                    └─── union
                   │
                   └─── complex type
```

## Simple type definitions

### Named simple types

Simple types can be either **named** or **anonymous**.
Named simple types are always defined globally  (i.e., their parent is always `schema`)
and are required to have a name that is unique among the types (both simple and complex) in the schema.

The `name` of a **simple type** must be an XML non-colonized name,
which means that it must start with a letter or underscore,
and may only contain letters, digits, underscores, hyphens, and periods.
You cannot include a namespace prefix when defining the type;
it takes its namespace from the **target namespace** of the **schema document**.

```text
<xsd:simpleType name="ageType">
    <xsd:restriction base="xsd:integer">
        <xsd:minInclusive value="18"/>
        <xsd:maxInclusive value="60"/>
    </xsd:restriction>
</xsd:simpleType>
```

All examples of named types in this book have the word "Type" at the end of their names
to clearly distinguish them from **element** and **attribute names**.
However, this is a convention and not a requirement.
You can even have a type definition and an element declaration using the same name,
but this is not recommended because it can be confusing.



```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="http://www.example.com/xml/company"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            targetNamespace="http://www.example.com/xml/company"
            elementFormDefault="qualified">
    <xsd:element name="company" type="companyType"/>
    <xsd:element name="department" type="departmentType"/>
    <xsd:element name="employee" type="employeeType"/>
    
    <xsd:complexType name="companyType">
        <xsd:sequence>
            <xsd:element ref="department" maxOccurs="unbounded"/>
        </xsd:sequence>
    </xsd:complexType>
    
    <xsd:complexType name="departmentType">
        <xsd:sequence>
            <xsd:element ref="employee" maxOccurs="unbounded"/>
        </xsd:sequence>
    </xsd:complexType>
    
    <xsd:complexType name="employeeType">
        <xsd:sequence>
            <xsd:element name="name" type="xsd:string"/>
            <xsd:element name="age" type="ageType"/>
        </xsd:sequence>
    </xsd:complexType>
    
    <xsd:simpleType name="ageType">
        <xsd:restriction base="xsd:integer">
            <xsd:minInclusive value="18"/>
            <xsd:maxInclusive value="60"/>
        </xsd:restriction>
    </xsd:simpleType>
</xsd:schema>
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<company xmlns="http://www.example.com/xml/company"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.example.com/xml/company ./xsd/company.xsd">
    <department>
        <employee>
            <name>Tomcat</name>
            <age>20</age>
        </employee>
    </department>
</company>
```

### Anonymous simple types

Anonymous types, on the other hand, must not have names.
They are always defined entirely within an element or attribute declaration,
and may only be used once, by that declaration.

```text
<xsd:element name="age">
    <xsd:simpleType>
        <xsd:restriction base="xsd:integer">
            <xsd:minInclusive value="18"/>
            <xsd:maxInclusive value="60"/>
        </xsd:restriction>
    </xsd:simpleType>
</xsd:element>
```

Defining a type anonymously prevents it from ever being restricted,
used in a list or union, redefined, or overridden.

## Simple type restrictions

Every simple type is a **restriction** of another simple type, known as its base type.
It is not possible to **extend** a simple type, except by adding attributes which results in a **complex type**.

> simple type只能进行restriction操作，不能进行extension操作。

Every new simple type restricts the **value space** of its base type in some way.

```text
<xsd:element name="age">
    <xsd:simpleType>
        <xsd:restriction base="xsd:integer">
            <xsd:minInclusive value="8"/>
            <xsd:maxInclusive value="60"/>
            <xsd:pattern value="\d{2}"/>
        </xsd:restriction>
    </xsd:simpleType>
</xsd:element>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="https://www.example.com/xml/company"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            targetNamespace="https://www.example.com/xml/company"
            elementFormDefault="qualified">

    <xsd:element name="company" type="companyType"/>
    <xsd:element name="department" type="departmentType"/>
    <xsd:element name="employee" type="employeeType"/>

    <xsd:complexType name="companyType">
        <xsd:sequence>
            <xsd:element ref="department" maxOccurs="unbounded"/>
        </xsd:sequence>
    </xsd:complexType>

    <xsd:complexType name="departmentType">
        <xsd:sequence>
            <xsd:element ref="employee" maxOccurs="unbounded"/>
        </xsd:sequence>
    </xsd:complexType>

    <xsd:complexType name="employeeType">
        <xsd:sequence>
            <xsd:element name="first-name" type="xsd:string"/>
            <xsd:element name="last-name" type="xsd:string"/>
            <xsd:element name="age">
                <xsd:simpleType>
                    <xsd:restriction base="xsd:integer">
                        <xsd:minInclusive value="8"/>
                        <xsd:maxInclusive value="60"/>
                        <xsd:pattern value="\d{2}"/>
                    </xsd:restriction>
                </xsd:simpleType>
            </xsd:element>
        </xsd:sequence>
    </xsd:complexType>
</xsd:schema>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<company xmlns="https://www.example.com/xml/company"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://www.example.com/xml/company ./xsd/company.xsd">
    <department>
        <employee>
            <first-name>Tom</first-name>
            <last-name>Cat</last-name>
            <age>10</age>
        </employee>
    </department>
</company>
```

A **simple type** restricts its **base type** by applying **facets** to restrict its values.

### Defining a restriction

```text
<xs:element name="restriction" id="restriction">
    <xs:complexType>
        <xs:complexContent>
            <xs:extension base="xs:annotated">
                <xs:group ref="xs:simpleRestrictionModel"/>
                <xs:attribute name="base" type="xs:QName"/>
            </xs:extension>
        </xs:complexContent>
    </xs:complexType>
</xs:element>
```

```text
<xs:group name="simpleRestrictionModel">
    <xs:sequence>
        <xs:element name="simpleType" type="xs:localSimpleType" minOccurs="0"/>
        <xs:group ref="xs:facets" minOccurs="0" maxOccurs="unbounded"/>
    </xs:sequence>
</xs:group>
```

```text
<xs:group name="facets">
    <xs:choice>
        <xs:element ref="xs:minExclusive"/>
        <xs:element ref="xs:minInclusive"/>
        <xs:element ref="xs:maxExclusive"/>
        <xs:element ref="xs:maxInclusive"/>
        <xs:element ref="xs:totalDigits"/>
        <xs:element ref="xs:fractionDigits"/>
        <xs:element ref="xs:length"/>
        <xs:element ref="xs:minLength"/>
        <xs:element ref="xs:maxLength"/>
        <xs:element ref="xs:enumeration"/>
        <xs:element ref="xs:whiteSpace"/>
        <xs:element ref="xs:pattern"/>
    </xs:choice>
</xs:group>
```

You must specify one **base type** either by using the `base` attribute or
by defining the simple type anonymously using a `simpleType` child.
The option of using a `simpleType` child is generally only useful when restricting **list types**.

Within a `restriction` element, you can specify any of the facets, in any order.
However, the only facets that may appear more than once in the same `restriction` are `pattern`, `enumeration`, and `assertion`.

It is legal to define a `restriction` that has no facets specified.
In this case, the derived type allows the same values as the base type.



```text
<xs:complexType name="facet">
    <xs:complexContent>
        <xs:extension base="xs:annotated">
            <xs:attribute name="value" use="required"/>
            <xs:attribute name="fixed" type="xs:boolean" default="false"/>
        </xs:extension>
    </xs:complexContent>
</xs:complexType>
```

```text
<xs:element name="minExclusive" id="minExclusive" type="xs:facet"/>
<xs:element name="minInclusive" id="minInclusive" type="xs:facet"/>

<xs:element name="maxExclusive" id="maxExclusive" type="xs:facet"/>
<xs:element name="maxInclusive" id="maxInclusive" type="xs:facet"/>
```

## Overview of the facets

- `minExclusive`: Value must be greater than x.
- `minInclusive`: Value must be greater than or equal to x.
- `maxInclusive`: Value must be less than or equal to x.
- `maxExclusive`: Value must be less than x.
- `length`: The length of the value must be equal to x.
- `minLength`: The length of the value must be greater than or equal to x.
- `maxLength`: The length of the value must be less than or equal to x.
- `totalDigits`: The number of significant digits must be less than or equal to x.
- `fractionDigits`: The number of fractional digits must be less than or equal to x.
- `whiteSpace`: The schema processor should either `preserve`, `replace`, or `collapse` whitespace depending on x.
- `enumeration`: x is one of the valid values.
- `pattern`: x is one of the regular expressions that the value may match.
- `explicitTimezone`(1.1): The time zone part of the date/time value is required, optional, or prohibited depending on x.
- `assertion`(1.1): The value must conform to a constraint in the XPath expression.

All facets (except `assertion`) must have a `value` attribute,
which has different valid values depending on the facet.
Most facets may also have a `fixed` attribute.

### type - facet

Certain facets are not applicable to some types.
For example, it does not make sense to apply the `fractionDigits` facet to a character string type.
There is a defined set of applicable facets for each of the built-in types.

If a facet is applicable to a built-in type, it is also applicable to atomic types that are derived from it.
For example, since the `length` facet is applicable to `string`,
if you derive a new type from `string`,
the `length` facet is also applicable to your new type.

> 继承与facet

### Inheriting and restricting facets

When a simple type restricts its base type,
it **inherits** all of the facets of its base type, its base type's base type,
and so on back through its ancestors.

> 继承facet，限制value space

```text
<xsd:simpleType name="salaryType">
    <xsd:restriction base="xsd:integer">
        <xsd:minInclusive value="100"/>
        <xsd:maxInclusive value="300"/>
    </xsd:restriction>
</xsd:simpleType>

<xsd:simpleType name="juniorSalaryType">
    <xsd:restriction base="salaryType">
        <xsd:minInclusive value="100"/>
        <xsd:maxInclusive value="200"/>
    </xsd:restriction>
</xsd:simpleType>

<xsd:simpleType name="seniorSalaryType">
    <xsd:restriction base="salaryType">
        <xsd:minInclusive value="200"/>
        <xsd:maxInclusive value="300"/>
    </xsd:restriction>
</xsd:simpleType>
```

It is a requirement that the facets of a **derived type** be more restrictive than those of the **base type**.

Although `enumeration` facets can appear multiple times in the same type definition, they are treated in much the same way.
If both a derived type and its ancestor have a set of enumeration facets,
the values of the derived type must be a subset of the values of the ancestor.

Likewise, the `pattern` facets specified in a derived type must allow a subset of the values allowed by the ancestor types.
A schema processor will not necessarily check that the regular expressions represent a subset;
instead, it will validate instances against the patterns of both the derived type and all the ancestor types.



### Fixed facets

When you define a simple type, you can fix one or more of the facets.
This means that further restrictions of this type cannot change the value of the facet.
Any of the facets may be fixed, with the exception of `pattern`, `enumeration`, and `assertion`.

Some of the built-in types have fixed facets that cannot be overridden.
For example, the built-in type `integer` has its `fractionDigits` facet fixed at `0`,
so it is illegal to derive a type from `integer` and specify a `fractionDigits` that is not `0`.

```text
<xs:simpleType name="integer" id="integer">
    <xs:restriction base="xs:decimal">
        <xs:fractionDigits value="0" fixed="true" id="integer.fractionDigits"/>
        <xs:pattern value="[\-+]?[0-9]+"/>
    </xs:restriction>
</xs:simpleType>
```

A justification for fixing facets might be that changing that facet value
would significantly alter the meaning of the type.
For example, suppose you want to define a simple type that represents **price**.
You define a `Price` type and fix the `fractionDigits` at `2`.
This still allows other schema authors to restrict `Price` to define other types,
for example, by limiting it to a certain range of values.
However, they cannot modify the `fractionDigits` of the type,
because this would result in a type not representing a price in dollars and cents.

## Facets

```text
                                                   ┌─── minInclusive
                                                   │
                                                   ├─── maxInclusive
                    ┌─── bound ────────────────────┤
                    │                              ├─── minExclusive
                    │                              │
                    │                              └─── maxExclusive
                    │
                    │                              ┌─── length
                    │                              │
                    ├─── length ───────────────────┼─── minLength
                    │                              │
                    │                              └─── maxLength
                    │
                    │                              ┌─── totalDigits
XML Schema Facet ───┼─── precision ────────────────┤
                    │                              └─── fractionDigits
                    │
                    ├─── enumerated values ────────┼─── enumeration
                    │
                    ├─── pattern matching ─────────┼─── pattern
                    │
                    ├─── whitespace processing ────┼─── whiteSpace
                    │
                    ├─── XPath-based assertions ───┼─── assertion
                    │
                    │
                    └─── Time zone requirements ───┼─── explicitTimezone
```

### Bounds facets

The four bounds facets (`minInclusive`, `maxInclusive`, `minExclusive`, and `maxExclusive`)
restrict a value to a specified range.

The four bounds facets can be applied only to the **date/time** and **numeric types**, and the types derived from them.
Special consideration should be given to **time zones** when applying bounds facets to **date/time types**.

### Length facets

The `length` facet allows you to limit values to a specific length.

- If it is a **string-based type**, `length` is measured in number of characters. This includes the XML DTD types and `anyURI`.
- If it is a **binary type**, `length` is measured in octets of binary data.
- If it is a **list type**, `length` is measured as the number of items in the list.

The facet value for `length` must be a nonnegative integer.

The three length facets (`length`, `minLength`, `maxLength`) can be applied to any string-based types
(including the XML DTD types), the binary types, and anyURI.
They cannot be applied to the **date/time types**, **numeric types**, or **boolean** .

#### empty values

Many of the built-in types do not allow **empty values**.
Types other than `string`, `normalizedString`, `token`, `hexBinary`, `base64Binary`, and `anyURI`
do not allow **empty values** unless `xsi:nil` appears in the element tag.

### totalDigits and fractionDigits

The `totalDigits` facet allows you to specify the maximum number of digits in a number.
The facet value for `totalDigits` must be a positive integer.

The `fractionDigits` facet allows you to specify the maximum number of digits in the fractional part of a number.
The facet value for `fractionDigits` must be a nonnegative integer,
and it must not exceed the value for `totalDigits`, if one exists.

The `totalDigits` facet can be applied to `decimal` or any of the `integer` types, as well as types derived from them.
The `fractionDigits` facet may only be applied to `decimal`, because it is fixed at `0` for all `integer` types.

### Enumeration

The `enumeration` facet allows you to specify a distinct set of valid values for a type.

Each enumerated value must be unique, and must be valid for that type.

If it is a string-based or binary type,
you may also specify the empty string in an enumeration value,
which allows elements or attributes of that type to have empty values.

Unlike most other facets (except `pattern` and `assertion`),
the `enumeration` facet can appear multiple times in a single restriction.

```text
<xsd:simpleType name="skillLevel">
    <xsd:restriction base="xsd:token">
        <xsd:enumeration value="junior"/>
        <xsd:enumeration value="senior"/>
    </xsd:restriction>
</xsd:simpleType>
```

### Pattern

The `pattern` facet allows you to restrict values to a particular pattern, represented by a regular expression.

Unlike most other facets (except `enumeration` and `assertion`),
the `pattern` facet can be specified multiple times in a single restriction.
If multiple pattern facets are specified in the same restriction,
the instance value must match at least one of the patterns.
It is not required to match all of the patterns.

### Assertion

The `assertion` facet allows you to specify additional constraints on values using XPath 2.0.

### Explicit Time Zone

The `explicitTimezone` facet allows you to control the presence of an explicit time zone on a date/time value.

### Whitespace

The `whiteSpace` facet allows you to specify the whitespace normalization rules which apply to this value.

Unlike the other facets, which restrict the **value space** of the type,
the `whiteSpace` facet is an instruction to the schema processor on to what to do with **whitespace**.
This type of facet is known as a **prelexical** facet
because it results in some processing of the value before the other constraining facets are applied.

The valid values for the `whiteSpace` facet are:

- `preserve`: All whitespace is preserved; the value is not changed.
- `replace`: Each occurrence of tab (`#x9`), line feed (`#xA`), and carriage return (`#xD`) is replaced with a single space (`#x20`).
- `collapse`: As with `replace`, each occurrence of tab (`#x9`), line feed (`#xA`), and carriage return (`#xD`) is replaced with a single space (`#x20`).
  After the replacement, all **consecutive spaces** are collapsed into a single space.
  In addition, **leading and trailing spaces** are deleted.

The whitespace processing, if any, will happen first, before any validation takes place.

Although you should understand what the `whiteSpace` facet represents,
it is unlikely that you will ever apply it directly in your schemas.
The `whiteSpace` facet is fixed at `collapse` for most built-in types.
Only the string-based types can be restricted by a `whiteSpace` facet, but this is not recommended.
Instead, select a base type that already has the `whiteSpace` facet you want.
The types `string`, `normalizedString`, and `token`
have the `whiteSpace` values `preserve`, `replace`, and `collapse`, respectively.
For example, if you wish to define a string-based type that will have its whitespace `collapsed`,
base your type on `token`, instead of basing it on `string` and applying a `whiteSpace` facet.

## Preventing simple type derivation

XML Schema allows you to prevent derivation of other types from your type.

By specifying the `final` attribute with a value of `#all` in your simple type definition,
you prevent derivation of any kind (`restriction`, `extension`, `list`, or `union`).
If you want more granular control, the value of `final` can be a whitespace-separated list of
any of the keywords `restriction`, `extension`, `list`, or `union`.

The `extension` value refers to the extension of **simple types** to derive **complex types**.

```text
final="#all"
final="restriction list union"
final="list restriction extension"
final="union"
final=""
```

If no `final` attribute is specified, it defaults to the value of the `finalDefault` attribute of the `schema` element.
If neither `final` nor `finalDefault` is specified, there are no restrictions on derivation from that type.
You can specify the empty string ("") for the `final` value if you want to override the `finalDefault` value.




