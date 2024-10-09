---
title: "Element Declaration"
sequence: "116"
---

Element declarations are used to assign **names** and **types** to elements.
This is accomplished using an `element`.
Element declarations can be either **global** or **local**.

## Global element declarations

Global element declarations appear at the top level of the `schema` document,
meaning that their parent must be `schema`.
These global element declarations can then be used in multiple complex types.

XSD Syntax: global element declaration

| Attribute Name | Type   | Description  |
|----------------|--------|--------------|
| id             | ID     | Unique ID    |
| name           | NCName | Element name |
| type           | QName  | Type         |

The qualified names used by global element declarations must be unique in the schema.

The `name` specified in an element declaration must be an XML non-colonized name.

The **qualified element name** consists of the target namespace of the schema document,
plus the local name in the declaration.

Since globally declared element names are qualified by the target namespace of the schema document,
it is not legal to include a namespace prefix in the value of the `name` attribute.

Occurrence constraints (`minOccurs` and `maxOccurs`) appear in an element reference
rather than the global element declaration.
This is because they are related to the appearance of an element in a particular content model.

## Local element declarations

Local element declarations, on the other hand, appear entirely within a complex type definition.
Local element declarations can only be used in that type definition,
never referenced by other complex types or used in a substitution group. 

XSD Syntax: local element declaration


Occurrence constraints  (`minOccurs` and `maxOccurs`)  can appear in local element declarations.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <xsd:element name="company" type="companyType"/>
    <xsd:element name="department" type="departmentType"/>
    <xsd:element name="employee" type="employeeType"/>

    <xsd:complexType name="companyType">
        <xsd:sequence>
            <xsd:element ref="department"/>
        </xsd:sequence>
    </xsd:complexType>

    <xsd:complexType name="departmentType">
        <xsd:sequence>
            <xsd:element ref="employee"/>
        </xsd:sequence>
    </xsd:complexType>

    <xsd:complexType name="employeeType">
        <xsd:sequence>
            <xsd:element name="first-name" type="xsd:string"/>
            <xsd:element name="last-name" type="xsd:string"/>
            <xsd:element name="age" type="xsd:integer" minOccurs="0" maxOccurs="1"/>
        </xsd:sequence>
    </xsd:complexType>
</xsd:schema>
```

## Declaring the types of elements

Regardless of whether they are local or global, all element declarations associate an element name with a `type`,
which may be either simple or complex.

There are four ways to associate a `type` with an **element name**:

- Reference a named type by specifying the `type` attribute in the `element` declaration.
  This may be either **a built-in type** or **a user-defined type**.
- Define **an anonymous type** by specifying either a `simpleType` or a `complexType` child.
- Use no particular type, by specifying neither a `type` attribute nor a `simpleType` or `complexType` child.
  In this case, the actual type is `anyType` which allows **any children** and/or **character data content**,
  and **any attributes**, as long as it is well-formed XML.
- Define one or more type alternatives using alternative children.

## Qualified vs. unqualified forms

When an **element declaration** is **local**—that is,
when it isn't at the top level of a schema document—
you have the choice of putting those element names into the **target namespace** of the schema or not.

### Using elementFormDefault

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="https://lsieun.github.io/assets/xml/company"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            targetNamespace="https://lsieun.github.io/assets/xml/company">
    <xsd:element name="company" type="companyType"/>

    <xsd:complexType name="companyType">
        <xsd:sequence>
            <xsd:element name="website" type="xsd:string"/>
            <xsd:element name="years" type="xsd:integer"/>
        </xsd:sequence>
    </xsd:complexType>
</xsd:schema>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<company xmlns="https://lsieun.github.io/assets/xml/company"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://lsieun.github.io/assets/xml/company ./xsd/company.xsd">
    <website>https://lsieun.github.io</website>
    <years>3</years>
</company>
```

The schema document has `elementFormDefault` set to `qualified`.
As a result, elements conforming to **local declarations** must use qualified element names in the instance.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="https://lsieun.github.io/assets/xml/company"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            targetNamespace="https://lsieun.github.io/assets/xml/company"
            elementFormDefault="qualified">
    <xsd:element name="company" type="companyType"/>

    <xsd:complexType name="companyType">
        <xsd:sequence>
            <xsd:element name="website" type="xsd:string"/>
            <xsd:element name="years" type="xsd:integer"/>
        </xsd:sequence>
    </xsd:complexType>
</xsd:schema>
```

### Using form

It is also possible to specify the `form` on a particular element declaration using a `form` attribute whose value, like
`elementFormDefault`, is either `qualified` or `unqualified`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="https://lsieun.github.io/assets/xml/company"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            targetNamespace="https://lsieun.github.io/assets/xml/company"
            elementFormDefault="qualified">
    <xsd:element name="company" type="companyType"/>

    <xsd:complexType name="companyType">
        <xsd:sequence>
            <xsd:element name="website" type="xsd:string" form="unqualified"/>
            <xsd:element name="years" type="xsd:integer"/>
        </xsd:sequence>
    </xsd:complexType>
</xsd:schema>
```

### Default namespaces and unqualified names

Default namespaces do not mix well with unqualified element names.

Although unqualified element names may seem confusing,
they do have some advantages when combining multiple namespaces.

## Default and fixed values

Default and fixed values are used to augment an instance by adding values to empty elements.
The schema processor will insert a **default** or **fixed** value if the element in question is empty.
If the element is absent from the instance, it will not be inserted.
This is different from the treatment of **default** and **fixed** values for **attributes**.

Default and fixed values are specified by the `default` and `fixed` attributes, respectively.
Only one of the two attributes (`default` or `fixed`) may appear; they are mutually exclusive.

Default and fixed values can be specified in element declarations with:

- Simple types
- Complex types with simple content
- Complex types with mixed content, if all children are optional

The default or fixed value must be valid for the type of that element.
For example, it is not legal to specify a **default** value of `xyz` if the type of the element is `integer`.

The specification of fixed and default values in element declarations is
independent of their occurrence constraints (`minOccurs` and `maxOccurs`).

Unlike defaulted attributes, a defaulted element may be required
(i.e., `minOccurs` in its declaration may be more than `0`).
If an element with a default value is required,
it may still appear empty and have its default value filled in.

### Default values

The default value is filled in if the element is empty.

It is important to note that certain types allow an empty value.
This includes `string`, `normalizedString`, `token`,
and any types derived from them that do not specifically disallow the empty string as a value.
Additionally, unrestricted list types allow empty values.
For any type that allows an empty string value,
the element will never be considered to have that empty string value
because the default value will be filled in.
However, if an element has the `xsi:nil` attribute set to `true`,
its default value is not inserted.

### Fixed values

Fixed values are added in all the same situations as default values.
The only difference is that if the element has a value, its value must be equivalent to the fixed value.
When the schema processor determines whether the value of the element is in fact equivalent to the fixed value,
it takes into account the element's type.

## Nils and nillability

XML Schema offers a third method of indicating a missing value: `nil`s.
By marking an element as `nil`, you are telling the processor 
"I know this element is empty, but I want it to be valid anyway."
The actual reason why it is empty, or what the application should do with it, is entirely up to you.
XML Schema does not associate any particular semantics with this absence.
It only offers an additional way to express a missing value, with the following benefits:

If the `xsi:nil` attribute appears on an element, and its value is set to `true`, that element must be empty.
It cannot contain any child elements or character data, even if its type requires content.

### Making elements nillable

In order to allow an element to appear in the instance with the `xsi:nil` attribute,
its element declaration must indicate that it is nillable.
Nillability is indicated by setting the `nillable` attribute in the element declaration to `true`.

