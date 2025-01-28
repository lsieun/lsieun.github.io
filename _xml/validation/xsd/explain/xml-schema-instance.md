---
title: "XML Schema: Instance"
sequence: "104"
---

## Using the instance attributes

There are four attributes that can apply to any element in an instance.

XML Schema Instance Namespace: `http://www.w3.org/2001/XMLSchema-instance`

This namespace is commonly mapped to the prefix `xsi`.

| Attribute Name            | Type           | Description                                                                  |
|---------------------------|----------------|------------------------------------------------------------------------------|
| nil                       | boolean:false  | Whether the element's value is nil                                           |
| type                      | QName          | The name of a type that is being substituted for the element's declared type |
| schemaLocation            | list of anyURI | List of the locations of schema documents for designated namespaces          |
| noNamespaceSchemaLocation | anyURI         | Location of a schema document with no target namespace                       |

Because these four attributes are globally declared, their names must be prefixed in instances.
You are required to declare the XML Schema Instance Namespace and map a prefix (preferably `xsi`) to it.
However, you are not required to specify a **schema location** for these four attributes.

## Relating instances to schemas

**Instances** can be related to **schemas** in a number of ways.

Using hints in the instance.
The `xsi:schemaLocation` and `xsi:noNamespaceSchemaLocation` attributes can be used
in the instance to provide a hint to the processor where to find the **schema documents**.

Application's choice.
Most applications will be processing the same type of instances repeatedly.
These applications may already know where the appropriate schema documents are on the web, or locally, or even have them built in.
In this case, the processor could either (1) `ignore xsi:schemaLocation`,
or (2) reject documents containing `xsi:schemaLocation` attributes,
or (3) reject documents in which the `xsi:schemaLocation` does not match the intended schema document.

## Using hints in the instance

XML Schema provides two attributes
that act as hints to where the processor might find the schema document(s) for the instance.
Different processors may ignore or acknowledge these hints in different ways.

These two attributes are: `xsi:schemaLocation`, for use with **schema documents** that have **target namespaces**,
and `xsi:noNamespaceSchemaLocation`, for use with **schema documents** without **target namespaces**.

### The xsi:schemaLocation attribute

The `xsi:schemaLocation` attribute allows you to specify a list of pairs
that match **namespace names** with **schema locations**.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<company xmlns="https://lsieun.github.io/assets/xml/company"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="https://lsieun.github.io/assets/xml/company ./xsd/company.xsd">

    <website>https://lsieun.github.io</website>
</company>
```

The value of the `xsi:schemaLocation` attribute is actually at least two values separated by whitespace.
The first value is the namespace name (in this example `https://lsieun.github.io/assets/xml/company`),
and the second value is the URL for the schema location (in this example `./xsd/company.xsd`, a relative URI).
The processor will retrieve the schema document from the schema location and make sure that
its **target namespace** matches that of the namespace it is paired with in `xsi:schemaLocation`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns="https://lsieun.github.io/assets/xml/company"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            targetNamespace="https://lsieun.github.io/assets/xml/company">
    <xsd:element name="company" type="companyType"/>
    <xsd:element name="website" type="xsd:string"/>

    <xsd:complexType name="companyType">
        <xsd:sequence>
            <xsd:element ref="website"/>
        </xsd:sequence>
    </xsd:complexType>
</xsd:schema>
```

Since **spaces** are used to separate values in this attribute,
you should not have spaces in your schema location path.
You can replace a **space** with `%20`, which is standard for URLs.

To use an absolute path rather than a relative path,
some processors require that you start your schema location with `file:///` (with three forward slashes),
as in `file:///C:/Users/PW/Documents/prod.xsd`.

If multiple namespaces are used in the document,
`xsi:schemaLocation` can contain more than one pair of values.

If you have a schema document that imports schema documents with different target namespaces,
you do not have to specify schema locations for all the namespaces
(if the processor has some other way of finding the schema documents,
such as the `schemaLocation` attribute of `import`).

### The xsi:noNamespaceSchemaLocation attribute

The `xsi:noNamespaceSchemaLocation` attribute is used to reference a **schema document** with no **target namespace**.
`xsi:noNamespaceSchemaLocation` does not take a list of values;
only one schema location may be specified.
The **schema document** referenced cannot have a **target namespace**.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<company xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="./xsd/company.xsd">

    <website>https://lsieun.github.io</website>
</company>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema">
    <xsd:element name="company" type="companyType"/>
    <xsd:element name="website" type="xsd:string"/>

    <xsd:complexType name="companyType">
        <xsd:sequence>
            <xsd:element ref="website"/>
        </xsd:sequence>
    </xsd:complexType>
</xsd:schema>
```

It is legal according to XML Schema to have both `xsi:noNamespaceSchemaLocation` and `xsi:schemaLocation` specified,
but once again, you should check with your processor to see what it will accept.

## The root element

Sometimes you want to be able to specify which element declaration is for the root element of the instance.

Schemas work similarly to DTDs in this regard.
**There is no way to designate the root.**
Any element conforming to a global element declaration can be a root element for validation purposes.

You can work around this by having only one global element declaration.




