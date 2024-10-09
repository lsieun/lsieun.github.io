---
title: "Attribute Declaration"
sequence: "117"
---

Attribute declarations are used to name an attribute and associate it with a particular simple type.
This is accomplished using an `attribute` element.
Attribute declarations may be either **global** or **local**.

## Global attribute declarations

Global attribute declarations appear at the top level of the schema document,
meaning that their parent must be the `schema` element.
These global attribute declarations can then be used in multiple complex types.

```text
<xs:element name="attribute" type="xs:topLevelAttribute" id="attribute"/>
```

```text
<xs:complexType name="topLevelAttribute">
    <xs:complexContent>
        <xs:restriction base="xs:attribute">
            <xs:sequence>
                <xs:element ref="xs:annotation" minOccurs="0"/>
                <xs:element name="simpleType" minOccurs="0" type="xs:localSimpleType"/>
            </xs:sequence>
            <xs:attribute name="name" use="required" type="xs:NCName"/>
            <xs:attribute name="ref" use="prohibited"/>
            <xs:attribute name="form" use="prohibited"/>
            <xs:attribute name="use" use="prohibited"/>
            <xs:anyAttribute namespace="##other" processContents="lax"/>
        </xs:restriction>
    </xs:complexContent>
</xs:complexType>
```

```text
<xs:complexType name="attribute">
    <xs:complexContent>
        <xs:extension base="xs:annotated">
            <xs:sequence>
                <xs:element name="simpleType" minOccurs="0" type="xs:localSimpleType"/>
            </xs:sequence>
            <xs:attributeGroup ref="xs:defRef"/>
            <xs:attribute name="type" type="xs:QName"/>
            <xs:attribute name="use" use="optional" default="optional">
                <xs:simpleType>
                    <xs:restriction base="xs:NMTOKEN">
                        <xs:enumeration value="prohibited"/>
                        <xs:enumeration value="optional"/>
                        <xs:enumeration value="required"/>
                    </xs:restriction>
                </xs:simpleType>
            </xs:attribute>
            <xs:attribute name="default" type="xs:string"/>
            <xs:attribute name="fixed" type="xs:string"/>
            <xs:attribute name="form" type="xs:formChoice"/>
        </xs:extension>
    </xs:complexContent>
</xs:complexType>
```

```text
<xs:complexType name="annotated">
    <xs:complexContent>
        <xs:extension base="xs:openAttrs">
            <xs:sequence>
                <xs:element ref="xs:annotation" minOccurs="0"/>
            </xs:sequence>
            <xs:attribute name="id" type="xs:ID"/>
        </xs:extension>
    </xs:complexContent>
</xs:complexType>
```

```text
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="https://lsieun.github.io/assets/xml/company"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            targetNamespace="https://lsieun.github.io/assets/xml/company"
            elementFormDefault="qualified">
    <xsd:element name="company" type="companyType"/>
    <xsd:attribute name="name" type="xsd:string"/>
    <xsd:attribute name="years" type="xsd:integer"/>

    <xsd:complexType name="companyType">
        <xsd:attribute ref="name" use="required"/>
        <xsd:attribute ref="years"/>
    </xsd:complexType>
</xsd:schema>
```

The `use` attribute, which indicates whether an attribute is required or optional,
appears in the **attribute reference** rather than **attribute declaration**.
This is because it applies to the appearance of that attribute in a **complex type**, not the attribute itself.

Since **globally declared attribute names** are qualified by the **target namespace** of the schema document,
it is not legal to include a namespace prefix in the value of the `name` attribute.

## Local attribute declarations

**Local attribute declarations**, on the other hand, appear entirely within a **complex type definition**.
They may only be used in that type definition, and are never reused by other types.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="https://lsieun.github.io/assets/xml/company"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            targetNamespace="https://lsieun.github.io/assets/xml/company">
    <xsd:element name="company" type="companyType"/>

    <xsd:complexType name="companyType">
        <xsd:attribute name="name" type="xsd:string" use="required"/>
        <xsd:attribute name="years" type="xsd:integer"/>
    </xsd:complexType>
</xsd:schema>
```

Unlike global attribute declarations, **local attribute declarations** can have a `use` attribute,
which indicates whether an attribute is `required` or `optional`.

The `name` specified in a local attribute declaration must also be an XML non-colonized name.
If its form is qualified, it takes on the target namespace of the schema document.
If it is unqualified, it is considered to be in no namespace.

Locally declared attribute names are scoped to the complex type in which they are declared.
It is illegal to have two attributes with the same qualified name in the same complex type definition.

## Design hint: Should I use global or local attribute declarations?

**Global attribute declarations** are discouraged unless the attribute is used in a variety of element declarations
which are in a variety of namespaces.

This is because **globally declared attribute names must be prefixed in instances**,
resulting in an instance element that looks like this:

```text
<prod:size prod:system="US-DRESS" prod:dim="1"/>
```

Prefixing every attribute is not what users generally expect,
and it adds a lot of extra text without any additional meaning.

## Declaring the types of attributes

Regardless of whether they are local or global,
all attribute declarations associate an attribute name with a simple type.

All attributes have **simple types** rather than **complex types**,
which makes sense since they cannot themselves have child elements or attributes.

There are three ways to assign a simple type to an attribute.

- Reference a named simple type by specifying the `type` attribute in the attribute declaration.
  This may be either a built-in type or a user-derived type.
- Define an anonymous type by specifying a `simpleType` child.
- Use no particular type, by specifying neither a `type` attribute nor a `simpleType` child.
  In this case, the actual type is `anySimpleType`, which may have any value, as long as it is well-formed XML.

## Qualified vs. unqualified forms

XML Schema allows you to exert some control over using namespace- qualified or unqualified attribute names in the instance.
Since **default namespace** declarations do not apply to attributes,
this is essentially a question of whether you want the attribute names to be prefixed or unprefixed.

This is indicated by the `form` attribute, which may be set to `qualified` or `unqualified`.
If the `form` attribute is not present in a local attribute declaration,
the value defaults to the value of the `attributeFormDefault` attribute of the `schema` element.
If neither attribute is present, the default is `unqualified`.
The `form` and `attributeFormDefault` attributes only apply to **locally declared attributes**.
If an attribute is declared globally (at the top level of the schema document),
it must always have a qualified (prefixed) name in the instance.

Qualified attribute names should only be used for attributes
that apply to a variety of elements in a variety of namespaces, such as `xml:lang` or `xsi:type`.
For locally declared attributes,
whose scope is limited to the type definition in which they appear,
prefixes add extra text without any additional meaning.

The best way to handle qualification of attribute names is
to ignore the `form` and `attributeFormDefault` attributes completely.
Then, **globally declared attributes** will have qualified names,
and **locally declared attributes** will have unqualified names, which makes sense.

## Default and fixed values

Default and fixed values are used to augment an instance by adding attributes when they are not present.
If an attribute is absent, and a default or fixed value is specified in its declaration,
the schema processor will insert the attribute and give it the default or fixed value.

Default and fixed values are specified by the `default` and `fixed` attributes, respectively.
Only one of the two attributes (`default` or `fixed`) may appear; they are mutually exclusive.
If an attribute has a default value specified, it cannot be a required attribute.
This makes sense, because if the attribute is required,
it will always appear in instances, and the default value will never be used.

### Default values

A default value is filled in if the attribute is absent from the element.
If the attribute appears, with any value, it is left alone.

### Fixed values

Fixed values are inserted in all the same situations as default values.
The only difference is that if the attribute appears, its value must be equal to the fixed value.
When the schema processor determines whether the value of the attribute is in fact equal to the fixed value,
it takes into account the attribute's type.

## Empty Value

You may have an integer that you want to be either between 2 and 18, or **empty**.
First, consider whether you want to make the element (or attribute) **optional**.
In this case, if the data is absent, the element will not appear at all.

However, sometimes it is desirable for the element to appear, as a placeholder,
or perhaps it is unavoidable because of the technology used to generate the instance.

If you do determine that the elements must be able to appear empty,
you must define a union type that includes both the **integer type** and an **empty string**.

```xml
<xsd:simpleType name="ageType">
    <xsd:union>
        <xsd:simpleType>
            <xsd:restriction base="xsd:integer">
                <xsd:minInclusive value="18"/>
                <xsd:maxInclusive value="60"/>
            </xsd:restriction>
        </xsd:simpleType>
        <xsd:simpleType>
            <xsd:restriction base="xsd:token">
                <xsd:enumeration value=""/>
            </xsd:restriction>
        </xsd:simpleType>
    </xsd:union>
</xsd:simpleType>
```


