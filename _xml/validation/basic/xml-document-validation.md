---
title: "XML Document Validation"
sequence: "102"
---

Two commonly used grammar languages are **Document Type Definition** and **XML Schema**.

## Document Type Definition

**Document Type Definition** (**DTD**) is the oldest grammar language for specifying an XML document's grammar.
DTD grammar documents (known as DTDs) are written in accordance to a strict syntax
that states what elements may be present and in what parts of a document,
and also what is contained within elements (child elements, content, or mixed content)
and what attributes may be specified.

Element declarations take the form `<!ELEMENT name content-specifier>`,
where `name` is any legal XML name (it cannot contain whitespace, for example),
and `content-specifier` identifies what can appear within the element.

Child elements must be specified as **a comma-separated list**.
Furthermore, **a list** is always surrounded by **parentheses**.

Element declarations support three other content specifiers.
You can specify `<!ELEMENT name ANY>` to allow any type of element content or
`<!ELEMENT name EMPTY>` to disallow any element content.
To state that an element contains mixed content,
you would specify `#PCDATA` and **a list of element names**,
separated by vertical bars (`|`).
For example, `<!ELEMENT ingredient (#PCDATA | measure | note)*>` states that
the ingredient element can contain a mix of parsed character data, zero or more `measure` elements,
and zero or more `note` elements.
It doesn't specify the order in which the parsed character data and these elements occur.
However, `#PCDATA` must be the first item specified in the list.
When a regular expression is used in this context,
it must appear to the right of the closing parenthesis.

Attribute declarations take the form `<!ATTLIST ename aname type default-value>`,
where `ename` is the name of the element to which the attribute belongs,
`aname` is the name of the attribute,
`type` is the attribute's type, and `default-value` is the attribute's default value.

### document type declaration



## XML Schema

XML Schema is a grammar language for declaring the structure, content, and semantics  (meaning) of an XML document.
This language's grammar documents are known as schemas that are themselves XML documents.
Schemas must conform to the [XML Schema DTD](https://www.w3.org/2001/XMLSchema.dtd).

```text
                                              ┌─── CDATA
                  ┌─── DTD ──────┼─── type ───┤
                  │                           └─── PCDATA
XML Validation ───┤
                  │              ┌─── namespaces
                  │              │
                  └─── Schema ───┤                  ┌─── primitive types
                                 │                  │
                                 └─── type ─────────┼─── simple types
                                                    │
                                                    └─── complex types
```

XML Schema was introduced by the W3C to overcome limitations with DTD, such as DTD's lack of support for **namespaces**.
Also, XML Schema provides an object-oriented approach to declaring an XML document's grammar.
This grammar language provides a much larger set of **primitive types** than DTD's `CDATA` and `PCDATA` types.
For example, integer, floating-point, various date and time, and string types are part of XML Schema.

XML Schema predefines 19 **primitive types**, which are expressed via the following identifiers:
anyURI, base64Binary, boolean, date, dateTime, decimal, double, duration, float, hexBinary, gDay, gMonth, gMonthDay, gYear,
gYearMonth, NOTATION, QName, string, and time.

XML Schema provides restriction (reducing the set of permitted values through constraints),
list (allowing a sequence of values),
and union (allowing a choice of values from several types) derivation methods
for creating new **simple types** from these **primitive types**.
For example, XML Schema derives 13 **integer types** from `decimal` through restriction;
these types are expressed via the following identifiers:
byte, int, integer, long, negativeInteger, nonNegativeInteger, nonPositiveInteger, positiveInteger,
short, unsignedByte, unsignedInt, unsignedLong, and unsignedShort.
It also provides support for creating **complex types** from **simple types**.

The next step is to classify the elements according to XML Schema's
**content model**, which specifies the types of child elements and text nodes that can be included in an element.
An element is considered to be **empty** when the element has no child elements or text nodes,
**simple** when only text nodes are accepted,
**complex** when only child elements are accepted,
and **mixed** when child elements and text nodes are accepted.

```text
                 ┌─── empty
                 │
                 ├─── simple ────┼─── text nodes
content model ───┤
                 ├─── complex ───┼─── child elements
                 │
                 │               ┌─── text nodes
                 └─── mixed ─────┤
                                 └─── child elements
```

For elements that have a **simple** content model,
we can distinguish between **elements having attributes** and **elements not having attributes**.
XML Schema classifies elements having a simple content model and no attributes as **simple types**.
Furthermore, it classifies elements having a simple content model and attributes,
or elements from other content models as **complex types**.
Furthermore, XML Schema classifies attributes as **simple types**
because they only contain text values—attributes don't have child elements.

At this point, you can begin to declare the schema.
The following code fragment presents the introductory `schema` element: 

```text
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
```

The `schema` element introduces the grammar.
It also assigns the commonly used `xs` namespace prefix to the standard XML Schema namespace;
`xs:` is subsequently prepended to XML Schema element names.

Next, you use the `element` element to declare the `title` and `instructions` **simple type** elements, as follows:

```text
<xs:element name="title" type="xs:string"/> 
<xs:element name="instructions" type="xs:string"/>
```

XML Schema requires that each element have a `name` and (unlike DTD) be associated with a type,
which identifies the kind of data stored in the element.
For example, the first element declaration identifies `title` as the name via its `name` attribute
and `string` as the type via its `type` attribute (`string` or character data appears between the `<title>` and `</title>` tags).
The `xs:` prefix in `xs:string` is required because `string` is a predefined W3C type.

Continuing, you now use the `attribute` element to declare the `qty` **simple type attribute**, as follows:

```text
<xs:attribute name="qty" type="xs:unsignedInt" default="1"/>
```

This attribute element declares an attribute named `qty`.
I chose `unsignedInt` as this attribute's type
because quantities are nonnegative values.
Furthermore, I specified 1 as the default value for when `qty` isn't specified—
attribute elements default to declaring optional attributes 

**The order of element and attribute declarations isn't significant within a schema.**

Now that you've declared the **simple types**, you can start to declare the **complex types**.
To begin, declare `recipe` as follows:

```xml
<xs:element name="recipe">
    <xs:complexType>
        <xs:sequence>
            <xs:element ref="title"/>
            <xs:element ref="ingredients"/>
            <xs:element ref="instructions"/>
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

This declaration states that `recipe` is a complex type (via the `complexType` element) consisting of a sequence
(via the `sequence` element) of one `title` element followed by one `ingredients` element
followed by one `instructions` element.
Each of these elements is declared by a different element that's referred to by its element's `ref` attribute. 

The next complex type to declare is `ingredients`.
The following code fragment provides its declaration:

```xml
<xs:element name="ingredients">
    <xs:complexType>
        <xs:sequence>
            <xs:element ref="ingredient" maxOccurs="unbounded"/>
        </xs:sequence>
    </xs:complexType>
</xs:element>
```

This declaration states that `ingredients` is a complex type consisting of a sequence of one or more `ingredient` elements.
The "or more" is specified by including element's `maxOccurs` attribute and setting this attribute's value to `unbounded`.

The `maxOccurs` attribute identifies the maximum number of times that an element can occur.
A similar `minOccurs` attribute identifies the minimum number of times that an element can occur.
Each attribute can be assigned `0` or a positive integer.
Furthermore, you can specify `unbounded` for `maxOccurs`,
which means that there's no upper limit on occurrences of the element.
Each attribute defaults to a value of `1`,
which means that an element can appear only one time when neither attribute is present.

The final complex type to declare is `ingredient`.
Although `ingredient` can contain only text nodes,
which implies that it should be a simple type, it's the presence of the `qty` attribute that makes it complex.
Check out the following declaration:

```xml
<xs:element name="ingredient">
    <xs:complexType>
        <xs:simpleContent>
            <xs:extension base="xs:string">
                <xs:attribute ref="qty"/>
            </xs:extension>
        </xs:simpleContent>
    </xs:complexType>
</xs:element>
```

The element named `ingredient` is a complex type (because of its optional `qty` attribute).
The `simpleContent` element indicates that `ingredient` can only contain **simple content** (**text nodes**),
and the `extension` element indicates that `ingredient` is a new type
that extends the predefined `string` type (specified via the `base` attribute),
implying that `ingredient` inherits all of `string`'s attributes and structure.
Furthermore, `ingredient` is given an additional `qty` attribute.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
    <xs:element name="title" type="xs:string"/>
    <xs:element name="instructions" type="xs:string"/>
    <xs:attribute name="qty" type="xs:unsignedInt" default="1"/>
    <xs:element name="recipe">
        <xs:complexType>
            <xs:sequence>
                <xs:element ref="title"/>
                <xs:element ref="ingredients"/>
                <xs:element ref="instructions"/>
            </xs:sequence>
        </xs:complexType>
    </xs:element>
    <xs:element name="ingredients">
        <xs:complexType>
            <xs:sequence>
                <xs:element ref="ingredient" maxOccurs="unbounded"/>
            </xs:sequence>
        </xs:complexType>
    </xs:element>
    <xs:element name="ingredient">
        <xs:complexType>
            <xs:simpleContent>
                <xs:extension base="xs:string">
                    <xs:attribute ref="qty"/>
                </xs:extension>
            </xs:simpleContent>
        </xs:complexType>
    </xs:element>
</xs:schema>
```

After creating the schema, you can reference it from a `recipe` document.
Accomplish this task by specifying `xmlns:xsi` and `xsi:schemaLocation` attributes
on the document's root element start tag (`<recipe>`), as follows:

```xml
<recipe xmlns="http://www.javajeff.ca/" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
         xsi:schemaLocation="http://www.javajeff.ca/schemas recipe.xsd">
</recipe>
```

The `xmlns` attribute identifies `http://www.javajeff.ca/` as the document's **default namespace**.
Unprefixed elements and their unprefixed attributes belong to this namespace. 

The `xmlns:xsi` attribute associates the conventional `xsi` (**XML Schema Instance**) prefix
with the standard `http://www.w3.org/2001/XMLSchema-instance` namespace.
The only item in the document that's prefixed with `xsi:` is `schemaLocation`.

The `schemaLocation` attribute is used to locate the schema.
This attribute's value can be multiple pairs of space-separated values,
but is specified as a single pair of such values in this example.
The first value (`http://www.javajeff.ca/schemas`) identifies **the target namespace for the schema**,
and the second value (`recipe.xsd`) identifies **the location of the schema** within this namespace.

Schema files that conform to XML Schema's grammar are commonly assigned the `.xsd` file extension.

If an XML document declares a namespace (`xmlns` default or `xmlns:prefix`),
that namespace must be made available to the schema
so that a validating parser can resolve all references to elements and other schema components for that namespace.
You also need to mention which namespace the schema describes,
and you do so by including the `targetNamespace` attribute on the `schema` element.
For example, suppose your `recipe` document declares a default XML namespace, as follows:

```xml
<?xml version="1.0"?>
<recipe xmlns="http://www.javajeff.ca/">
</recipe>
```

At minimum, you would need to modify `schema` element to include `targetNameSpace` and
the `recipe` document's default namespace as `targetNameSpace`'s value, as follows:

```xml
<xs:schema targetNamespace="http://www.javajeff.ca/" 
            xmlns:xs="http://www.w3.org/2001/XMLSchema">
</xs:schema>
```
