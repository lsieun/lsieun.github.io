---
title: "Built-in Simple Types"
sequence: "118"
---

## The XML Schema type system

There are 49 simple types built into XML Schema.

Most of the built-in types are atomic types, although there are three list types as well.

### The type hierarchy

Types in the XML Schema type system form a hierarchy.

![](/assets/images/xml/xml-schema-built-in-type-hierarchy.png)

At the top of the hierarchy are three special types:

1. `anyType` is a generic complex type that allows anything: any attributes, any child elements, any text content.
2. `anySimpleType`, derived from `anyType` , is the base of all simple types, including atomic, list, and union types.
3. `anyAtomicType`, derived from `anySimpleType`, is a generic type from which all atomic types are derived.

`anyType` can be declared as the type of an element, in which case that element can have any content.
It is also the default type for elements if none is specified.
`anyType` can also be extended or restricted by complex type definitions.
`anySimpleType` and `anyAtomicType` are special types that cannot be used as the base for user-defined types in a schema.
However, they can be declared as the type of an element or attribute.

The types directly under `anyAtomicType` are known as **primitive types**,
while the rest are derived built-in types.
The primitive types represent basic type concepts,
and all other built-in atomic types are **restrictions** of those types.
When you define new simple types in your schema, they can never be primitive;
they must be derived from a built-in primitive type.

There are three built-in list types (`NMTOKENS`, `ENTITIES`, and `IDREFS`) are derived from `anySimpleType`.
Any user- defined list and union types are also derived from `anySimpleType`,
although they have item types or member types that may be specific atomic types.

### Value spaces and lexical spaces

Every type in the XML Schema type system has a **value space**.
This value space represents the set of possible values for a type.
For example, for the `int` type, it is the set of integers from `–2147483648` to `2147483647`.
Every type also has a **lexical space**, which includes all the possible representations of those values.
For `int`, each value in the value space might have several lexical representations.
For example, the value 12 could also be written as `012` or `+12`.
All of these values are considered equal for this type (but not if their type were string).

Of the lexical representations, one is considered the **canonical representation**:
It maps one-to-one to a value in the value space and can be used to determine whether two values are equal.
For the `int` type, the rule is that the canonical representation has no plus sign and no leading zeros.
If you turn each of the three values `12`, `+12`, and `012` into their canonical representation using that rule,
they would all be 12 and therefore equal to each other.
Some primitive types, such as `string`, only have one lexical representation,
which becomes, by default, the canonical representation.
In this chapter, the canonical representation of a particular type is only mentioned
if there can be more than one lexical representation per value in the value space.

### Facets and built-in types

It is not just the facet `value` that is inherited, but also the `applicability` of a facet.
Each primitive type has certain facets that are applicable to it.
For example, the `string` type has `length` as an applicable facet, but not `totalDigits`,
because it does not make sense to apply `totalDigits` to a string.
Therefore, the `totalDigits` facet cannot be applied to `string` or any of its derived types,
whether they are built-in or user-defined.

It is not necessary to remember which types are primitive and which are derived.
This chapter lists the applicable facets for all of the built-in types, not just the primitive types.
When you derive new types from the built-in types,
you may simply check which facets are applicable to the built-in type,
regardless of whether it is primitive or derived.

## String-based types

### string, normalizedString, and token

The types `string`, `normalizedString`, and `token` represent a character string
that may contain any Unicode characters allowed by XML.
Certain characters, namely the "less than" symbol (`<`) and the ampersand (`&`),
must be escaped (using the entities `&lt;` and `&amp;`, respectively) when used in strings in XML instances.
The only difference between the three types is in the way **whitespace** is handled by a schema-aware processor.

The `string` type has a `whiteSpace` facet of `preserve`,
which means that all whitespace characters (spaces, tabs, carriage returns, and line feeds) are preserved by the processor.

```text
<xs:simpleType name="string" id="string">
    <xs:restriction base="xs:anySimpleType">
        <xs:whiteSpace value="preserve" id="string.preserve"/>
    </xs:restriction>
</xs:simpleType>
```

The `normalizedString` type has a `whiteSpace` facet of `replace`,
which means that the processor replaces each **carriage return**, **line feed**, and **tab** by **a single space**.
There is no collapsing of multiple consecutive spaces into a single space.

```text
<xs:simpleType name="normalizedString" id="normalizedString">
    <xs:restriction base="xs:string">
        <xs:whiteSpace value="replace" id="normalizedString.whiteSpace"/>
    </xs:restriction>
</xs:simpleType>
```

The `token` type represents a tokenized string.
The name `token` may be slightly confusing because it implies that there may be only one token with no whitespace.
In fact, there can be whitespace in a token value.
The `token` type has a `whiteSpace` facet of `collapse`,
which means that the processor replaces each **carriage return**, **line feed**, and **tab** by a **single space**.
After this replacement, **each group of consecutive spaces** is collapsed into **one space character**,
and **all leading and trailing spaces are removed**.

```text
<xs:simpleType name="token" id="token">
    <xs:restriction base="xs:normalizedString">
        <xs:whiteSpace value="collapse" id="token.whiteSpace"/>
    </xs:restriction>
</xs:simpleType>
```

### Name

The type `Name` represents an XML name, which can be used as an element name or attribute name, among other things.
Values of this type must start with a letter, underscore (`_`), or colon (`:`),
and may contain only letters, digits, underscores (`_`), colons (`:`), hyphens (`-`), and periods (`.`).
**Colons** should only be used to separate **namespace prefixes** from **local names**.

```text
<xs:simpleType name="Name" id="Name">
    <xs:restriction base="xs:token">
        <xs:pattern value="\i\c*" id="Name.pattern"/>
    </xs:restriction>
</xs:simpleType>
```

### NCName

The type `NCName` represents an XML non-colonized name, which is simply a name that does not contain colons.
An `NCName` must start with either a letter or underscore (`_`) and
may contain only letters, digits, underscores (`_`), hyphens (`-`), and periods (`.`).
This is identical to the `Name` type, except that colons are not permitted.

```text
<xs:simpleType name="NCName" id="NCName">
    <xs:restriction base="xs:Name">
        <xs:pattern value="[\i-[:]][\c-[:]]*" id="NCName.pattern">
        </xs:pattern>
    </xs:restriction>
</xs:simpleType>
```

### language

The type `language` represents a natural language identifier,
generally used to indicate the language of a document or a part of a document.
Before creating a new attribute of type `language`,
consider using the `xml:lang` attribute that is intended to indicate the natural language of the element and its content.

## Numeric types

### float and double

The type `float` represents an IEEE single-precision 32-bit floating-point number,
and `double` represents an IEEE double-precision 64-bit floating-point number.

In addition, the following values are valid: `INF` (infinity), `+INF` (positive infinity, version 1.1 only),
`-INF` (negative infinity), `0` (positive 0), `-0` (negative 0), and `NaN` (Not a Number).
`0` and `-0` are considered equal.
`INF` and `+INF` are equal and are considered to be greater than all other values,
while `-INF` is less than all other values.
The value `NaN` cannot be compared to any other values.

### decimal

The canonical representation of `decimal` always contains a **decimal point**.
No leading or trailing zeros are present,
except that there is always at least one digit before and after the decimal point.

### Integer types

The canonical representations of integer types do not contain leading zeros or positive signs.

## Date and time types

XML Schema provides a number of built-in date and time types, whose formats are based on ISO 8601. 

### date

The type `date` represents a Gregorian calendar date.
The lexical representation of date is `YYYY-MM-DD`
where `YY` represents the year, `MM` the month and `DD` the day.
No left truncation is allowed for any part of the date.

### time

The type `time` represents a time of day.
The lexical representation of time is `hh:mm:ss.sss`
where `hh` represents the hour, `mm` the minutes, and `ss.sss` the seconds.
An unlimited number of additional digits can be used to increase the precision of fractional seconds if desired.

### dateTime

The type `dateTime` represents a specific date and time.
The lexical representation of dateTime is `YYYY-MM-DDThh:mm:ss.sss`,
which is a concatenation of the date and time forms, separated by a literal letter `T`.
All of the same rules that apply to the `date` and `time` types are applicable to `dateTime` as well.

### Gregorian calendar

The type `gYear` represents a specific Gregorian calendar year.

The type `gYearMonth` represents a specific month of a specific year.
The lexical representation of `gYearMonth` is `YYYY-MM`.

## Legacy types

### ID

The type `ID` is used for an attribute that uniquely identifies an element in an XML document.
An ID value must conform to the rules for an `NCName`.

```text
<xs:simpleType name="ID" id="ID">
    <xs:restriction base="xs:NCName"/>
</xs:simpleType>
```

`ID` values must be unique within an XML instance, regardless of the attribute's name or its element name.



### IDREF

The type `IDREF` is used for an attribute that references an `ID`.
A common use case for `IDREF` is to create a cross-reference to a particular section of a document.
Like `ID`, an `IDREF` value must be an `NCName`.

```text
<xs:simpleType name="IDREF" id="IDREF">
    <xs:restriction base="xs:NCName"/>
</xs:simpleType>
```

All attributes of type `IDREF` must reference an `ID` in the same XML document.

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
        <xsd:attribute name="manager" type="xsd:IDREF" use="required"/>
    </xsd:complexType>

    <xsd:complexType name="employeeType">
        <xsd:sequence>
            <xsd:element name="first-name" type="xsd:string"/>
            <xsd:element name="last-name" type="xsd:string"/>
            <xsd:element name="age" type="xsd:integer"/>
        </xsd:sequence>
        <xsd:attribute name="employee-id" type="xsd:ID" use="required"/>
    </xsd:complexType>
</xsd:schema>
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<company xmlns="http://www.example.com/xml/company"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.example.com/xml/company ./xsd/company.xsd">
    <department manager="E001">
        <employee employee-id="E001">
            <first-name>Tom</first-name>
            <last-name>Cat</last-name>
            <age>10</age>
        </employee>
        <employee employee-id="E002">
            <first-name>Jerry</first-name>
            <last-name>Mouse</last-name>
            <age>9</age>
        </employee>
    </department>
</company>
```

### IDREFS

The type `IDREFS` represents a list of `IDREF` values separated by whitespace.
There must be at least one `IDREF` in the list.

```text
<xs:simpleType name="IDREFS" id="IDREFS">
    <xs:restriction>
        <xs:simpleType>
            <xs:list itemType="xs:IDREF"/>
        </xs:simpleType>
        <xs:minLength value="1" id="IDREFS.minLength"/>
    </xs:restriction>
</xs:simpleType>
```

Each of the values in an attribute of type `IDREFS` must reference an `ID` in the same XML document.

Since `IDREFS` is a list type, restricting an `IDREFS` value with these facets may not behave as you expect.
The facets `length`, `minLength`, and `maxLength` apply to the number of items in the `IDREFS` list,
not the length of each item.
The `enumeration` facet applies to the whole list, not the individual items in the list.

### ENTITY

The type `ENTITY` represents a reference to an unparsed entity.
The `ENTITY` type is most often used to include information from another location that is not in XML format, such as graphics.
An `ENTITY` value must be an `NCName`.

```text
<xs:simpleType name="ENTITY" id="ENTITY">
    <xs:restriction base="xs:NCName"/>
</xs:simpleType>
```

An `ENTITY` value carries the additional constraint that
it must match the name of an unparsed entity in a document type definition (DTD) for the instance.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="http://www.example.com/xml/company"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            targetNamespace="http://www.example.com/xml/company"
            elementFormDefault="qualified">
    <xsd:element name="company" type="companyType"/>
    

    <xsd:complexType name="companyType">
        <xsd:sequence>
            <xsd:element name="website" type="xsd:string"/>
            <xsd:element name="logo" type="logoType"/>
        </xsd:sequence>
    </xsd:complexType>
    
    <xsd:complexType name="logoType">
        <xsd:attribute name="image" type="xsd:ENTITY"/>
    </xsd:complexType>
</xsd:schema>
```

```text
<!ELEMENT company (website,logo)>
<!ELEMENT website (#PCDATA)>
<!ELEMENT logo EMPTY>
<!ATTLIST logo image ENTITY #REQUIRED>
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE company SYSTEM "./dtd/company.dtd"[
    <!NOTATION JPEG SYSTEM "JPG">
    <!ENTITY logo1 SYSTEM "../images/week-cycle.jpg" NDATA JPEG>
    <!ENTITY logo2 SYSTEM "../images/tom-and-jerry-cartoons.jpg" NDATA JPEG>
]>
<company xmlns="http://www.example.com/xml/company"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.example.com/xml/company ./xsd/company.xsd">
    <website>https://lsieun.github.io</website>
    <logo image="logo1"/>
</company>
```

### ENTITIES

The type `ENTITIES` represents a list of `ENTITY` values separated by whitespace.
There must be at least one `ENTITY` in the list.
Each of the `ENTITY` values must match the name of an unparsed entity
that has been declared in a document type definition (DTD) for the instance.

### NMTOKEN

The type `NMTOKEN` represents a single string token.
`NMTOKEN` values may consist of letters, digits, periods (`.`), hyphens (`-`), underscores (`_`), and colons (`:`).
They may start with any of these characters.

```text
<xs:simpleType name="NMTOKEN" id="NMTOKEN">
    <xs:restriction base="xs:token">
        <xs:pattern value="\c+" id="NMTOKEN.pattern"/>
    </xs:restriction>
</xs:simpleType>
```

`NMTOKEN` has a `whiteSpace` facet value of `collapse`,
so any leading or trailing whitespace will be removed.
However, no whitespace may appear within the value itself.

### NMTOKENS

The type `NMTOKENS` represents a list of `NMTOKEN` values separated by whitespace.
There must be at least one `NMTOKEN` in the list.

```text
<xs:simpleType name="NMTOKENS" id="NMTOKENS">
    <xs:restriction>
        <xs:simpleType>
            <xs:list itemType="xs:NMTOKEN"/>
        </xs:simpleType>
        <xs:minLength value="1" id="NMTOKENS.minLength"/>
    </xs:restriction>
</xs:simpleType>
```

### NOTATION

The type `NOTATION` represents a reference to a notation.
A notation is a method of interpreting XML and non-XML content.
For example, if an element in an XML document contains binary graphics data in JPEG format,
a notation can be declared to indicate that this is JPEG data.
An attribute of type `NOTATION` can then be used to indicate which notation applies to the element's content.

```text
<xs:simpleType name="NOTATION" id="NOTATION">
    <xs:restriction base="xs:anySimpleType">
        <xs:whiteSpace value="collapse" fixed="true" id="NOTATION.whiteSpace"/>
    </xs:restriction>
</xs:simpleType>
```

`NOTATION` is the only built-in type that cannot be the type of **attributes** or **elements**.
Instead, you must define a new type that restricts `NOTATION`, applying one or more enumeration facets.
Each of these enumeration values must match the name of a declared notation.
For more information on declaring notations and `NOTATION`-based types.

## Other types

### QName

The type `QName` represents an XML namespace-qualified name that consists of **a namespace name** and **a local part**.

When appearing in XML documents, the lexical representation of a `QName` consists of **a prefix** and **a local part**,
separated by a colon, both of which are `NCNames`.
The **prefix** and **colon** are optional.

```text
<xs:simpleType name="QName" id="QName">
    <xs:restriction base="xs:anySimpleType">
        <xs:whiteSpace value="collapse" fixed="true" id="QName.whiteSpace"/>
    </xs:restriction>
</xs:simpleType>
```

The lexical structure is mapped onto the `QName` value in the context of namespace declarations.
If the `QName` value is prefixed, the namespace name is that which is in scope for that prefix.
If it is not prefixed, the **default namespace** declaration in scope (if any) becomes the `QName`'s namespace.

`QName` is not based on `string` like the other name-related types,
because it has this special two-part value with additional constraints
that cannot be expressed with XML Schema facets.

### boolean

The type `boolean` represents logical yes/no values.
The valid values for `boolean` are `true`, `false`, `0`, and `1`.
Values that are capitalized (e.g., `TRUE`) or abbreviated (e.g., `T`) are not valid.

### The binary types

The types `hexBinary` and `base64Binary` represent binary data.
Their lexical representation is a sequence of binary octets.

The type `hexBinary` uses hexadecimal encoding, where each binary octet is a two-character hexadecimal number.
Lowercase and uppercase letters A through F are permitted.
The canonical representation of `hexBinary` uses only uppercase letters.

The type `base64Binary`, typically used for embedding images and other binary content, uses base64 encoding.

### anyURI

The type `anyURI` represents a Uniform Resource Identifier (URI) reference.
URIs are used to identify resources, and they may be **absolute** or **relative**.
**Absolute URIs** provide the entire context for locating a resource, such as http://datypic.com/prod.html.
**Relative URIs** are specified as the difference from a base URI, for example `../prod.html`.
It is also possible to specify a fragment identifier using the `#` character, for example `../prod.html#shirt`.

