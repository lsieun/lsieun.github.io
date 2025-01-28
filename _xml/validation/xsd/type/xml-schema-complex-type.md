---
title: "Complex Type"
sequence: "122"
---

## What are complex types?

**Elements** that have complex types have **child elements** or **attributes**.
They may also have **character content**.

## Defining complex types

Complex types may be either **named** or **anonymous**.

### Named complex types

Named types can be used by multiple element and attribute declarations.
They are always defined globally (i.e., their parent is always `schema`) and are required to have a name
that is unique among the types (both simple and complex) in the schema.

### Anonymous complex types

Anonymous complex types, on the other hand, must not have names.
They are always defined entirely within an element declaration, and may only be used once, by that declaration.

Defining a type anonymously prevents it from ever being restricted, extended, redefined, or overridden.

### Complex type alternatives

There are four different possible structures for the children of `complexType` elements,
representing four different methods of creating complex types:

- A single `complexContent` child, which is used to derive a **complex type** from another **complex type**.
- A single `simpleContent` child, which is used to derive a **complex type** from a **simple type**.
- A group (`group`, `all`, `choice`, or `sequence`) and/or attribute declarations.
  This is used to define a **complex type** without deriving it from any particular type.
- No content at all, in which case the type allows no attributes and no content.

The various declarations that make up the content of a complex type are known collectively as **particles**.
Particles include **local element declarations**, **element references**, **model groups** (`all`, `choice`, or `sequence`),
**named model group references**, and **element wildcards**.

## Content types

The contents of an element are the **character data** and **child elements** that are between its tags.
The order and structure of the children allowed by a complex type are known as its **content model**.

There are four types of content for complex types: **simple**, **element-only**, **mixed**, and **empty**.
The content type is independent of **attributes**; all of these content types allow **attributes**.

### Simple content

Simple content allows character data only, with no children.

```text
<xsd:complexType name="sizeType">
    <xsd:simpleContent>
        <xsd:extension base="xsd:integer">
            <xsd:attribute name="system" type="xsd:token"/>
        </xsd:extension>
    </xsd:simpleContent>
</xsd:complexType>
```

### Element-only content

Element-only content allows only children, with no character data content. 

```text
<xsd:complexType name="productType">
    <xsd:sequence>
        <xsd:element name="number" type="xsd:integer"/>
        <xsd:element name="name" type="xsd:string"/>
        <xsd:element name="size" type="sizeType"/>
        <xsd:element name="color" type="colorType"/>
    </xsd:sequence>
</xsd:complexType>
```

### Mixed content

Mixed content allows **character data** as well as **child elements**.
This is most often used for freeform text such as letters and documents.

The default value for `mixed` is `false`, meaning that character data content is not permitted.

```text
<xsd:element name="desc" type="descType"/>
<xsd:complexType name="descType" mixed="true">
    <xsd:choice minOccurs="0" maxOccurs="unbounded">
        <xsd:element name="i" type="xsd:string"/>
        <xsd:element name="b" type="xsd:string"/>
        <xsd:element name="u" type="xsd:string"/>
    </xsd:choice>
</xsd:complexType>
```

```text
<desc>
    This is our <i>best-selling</i> shirt.
    <b>Note:</b> runs <u>large</u>.
</desc>
```

### Empty content

Empty content allows neither character data nor child elements.

Elements with empty content often have values in attributes.

In some cases, they may not even have attributes; their presence alone is meaningful.
For example, a `<br/>` element in XHTML indicates a line break, without providing any data other than its presence.

```text
<xsd:complexType name="colorType">
    <xsd:attribute name="value" type="xsd:token"/>
</xsd:complexType>
```

## Using element declarations

Element declarations can be included in complex-type content models in three ways:
as local element declarations, as references to global element declarations, and as wildcards.

## Using model groups

Model groups allow you to group child element declarations or references together
to construct more meaningful content models.
There are three kinds of model groups: `all` groups, `choice` groups, and `sequence` groups.

**Every complex type (except empty-content types) has exactly one model group child.**
This model group child contains the element declarations or references, or other model groups that make up the content model.
Element declarations are never directly contained in the `complexType` element.

```text
complexType ---> model group ---> element
complexType ---> simpleContent ---> built-in simple type
complexType ---> complexContent ---> complexType
```

### sequence groups

A `sequence` group is used to indicate that elements should appear in a specified order.

### choice groups

A `choice` group is used to indicate that only one of the declared elements must appear.

### all groups

An `all` group is used to indicate that elements can appear in any order.

### Named model group references

Named model groups may be referenced in complex type definitions,
in order to make use of predefined content model fragments.

### Deterministic content models

Like XML DTDs, XML Schema requires that content models be deterministic.
In XML Schema, this is known as the **Unique Particle Attribution** (**UPA**) constraint.
A schema processor, as it makes its way through the children of an instance element,
must be able to find only one branch of the content model that is applicable,
without having to look ahead to the rest of the children.

## Using attribute declarations

As with **elements**, **attributes** can be included in complex types as
local declarations, as references to global declarations, or via attribute group references.

Within complex type definitions, **attributes** must be specified after the **content model**.
The local attribute declarations, attribute references, and attribute group references may appear in any order,
intermixed with each other.
There is no significance to the ordering of attributes in XML.

It is illegal to define a complex type that contains two attribute declarations with the same qualified name.
This is understandable, since XML forbids this.
However, if two attribute declarations have the same local name
but different namespace names, they may both appear in the same complex type.

### Local attribute declarations

Complex type definitions can contain local attribute declarations.
This means that the attributes are declared (that is, given a name, a type, and other properties) within the complex type.
The scope of that attribute declaration is limited to the complex type within which it appears.

### Attribute references

Complex type definitions can also contain references to global attribute declarations.

The `use` attribute may be used to indicate whether the attribute is `required` or `optional`.
The value `prohibited` is used only when restricting complex types.
If `required` is chosen, then a `default` or `fixed` value in the global attribute declaration are ignored.

The `default` attribute may be used to add a default value,
or to override the default attribute in the global attribute declaration.
This is true for **attribute references** only;
an element reference cannot override the default value in a global element declaration.

The `fixed` attribute may be used to add a fixed value,
but it cannot override or remove a fixed value specified in the global attribute declaration.
Only one of default and fixed may appear; they are mutually exclusive.

The `inheritable` attribute may be used to indicate that the attribute is inheritable.
If it is not specified, it defaults to the `inheritable` value of the global attribute declaration,
which itself defaults to `false`.

### Attribute group references

Attribute groups may be referenced in complex type definitions,
in order to make use of predefined groups of attributes.

### Default attributes

In version 1.1, it is possible to indicate that **an attribute group** is the **default attribute group**
by specifying its name in the `defaultAttributes` attribute on the `schema` element.
If such a default attribute group is defined,
those attributes will automatically be allowed for every complex type in the schema document,
unless you specifically disallow it.
To disallow it, use the attribute `defaultAttributesApply="false"` to your complex type.

## Using wildcards

Wildcards allow for more flexibility in the content models and attributes defined in a complex type.

There are two kinds of wildcards: **element wildcards**, which use the `any` element,
and **attribute wildcards**, which use the `anyAttribute` element.

### Element wildcards

Element wildcards provide flexibility in which child elements may appear.

Element wildcards are represented by `any` elements.

The `minOccurs` and `maxOccurs` attributes control the number of replacement elements.
This number represents how many total replacement elements may appear,
not how many of a particular type or how many types.
The number does not include child elements of the replacement elements.

#### Controlling the namespace of replacement elements

The `namespace` attribute allows you to specify what namespaces the replacement elements may belong to.
It may have the value `##any`, `##other`, or **a list of values**.

If it is `##any`, the replacement elements can be in any namespace whatsoever, or in no namespace.
This is the default setting if neither the `namespace` nor the `notNamespace` attribute have been specified.

If it is `##other`, the replacement elements can be in any namespace other than the target namespace of the schema document,
but they must be in a namespace.
If the schema document has no target namespace,
the replacement elements can have any namespace, but they must have one.

Otherwise, the value of the `namespace` attribute can be a whitespace-separated list of values
that may include any or all of the following items:

- `##targetNamespace` to indicate that the replacement elements may be in the target namespace of the schema document
- `##local` to indicate that the replacement elements may be in no namespace
- Specific namespace names for the replacement elements

The namespace constraint applies only to the replacement elements.
The children of each replacement element, if they exist,
are then validated according to the type of the replacement element.

#### Controlling the strictness of validation

The `processContents` attribute controls how much validation takes place on the replacement elements.

It may have one of three values:

- If it is `skip`, the schema processor performs no validation whatsoever,
  and does not attempt to find a schema document associated with the wildcard's namespace.
  The replacement elements must, however, be well-formed XML and must be in one of the namespaces allowed by the wildcard.
- If it is `lax`, the schema processor will validate replacement elements
  for which it can find declarations and raise errors if they are invalid.
  It will not, however, report errors on the elements for which it does not find declarations.
- If it is `strict`, the schema processor will attempt to find a schema document associated with the namespace,
  and validate all of the replacement elements.
  If it cannot find the schema document, or the elements are invalid, it will raise errors.
  This is the default value.

#### Negative wildcards

Version 1.1 provides two additional attributes for wildcards
that allow you to specify namespaces and names that are disallowed for replacement elements.

The `notNamespace` attribute allows you to specify the namespaces that the replacement elements may not belong to.
It is a whitespace-separated list of values that may include any or all of the following items:

- `##targetNamespace` to indicate that the replacement elements may not be in the target namespace of the schema document.
- `##local` to indicate that the replacement elements must be in a namespace.
- Specific disallowed namespace names for the replacement elements.

The `notNamespace` and the `namespace` attributes on wildcards are **mutually exclusive**.
They cannot both be specified. If neither is specified, the replacement elements can be in any namespace.

The `notQName` attribute allows you to disallow certain elements from being replacement elements.
It is a whitespace-separated list of values that may include any or all of the following items:

- `##defined`, to disallow replacement elements whose names match global element declarations in the schema.
- `##definedSibling`, to disallow replacement elements whose names match declarations
  (local element declarations or element references) in the same complex type, i.e. that could be siblings of the replacement element.
- Specific names for the disallowed replacement elements, which may or may not actually be declared in the schema;
  if these names are in a namespace, they must be prefixed appropriately or
  use in-scope default namespace declarations to assign the namespace.

### Open content models

#### Open content in a complex type

An **open content model** for a single complex type is defined using an `openContent` element.

The `openContent` element always appears before the **content model**.
It contains a standard `any` wildcard.

The one difference is that the wildcard inside the `openContent` cannot have `minOccurs` and `maxOccurs` specified;
it is implied that any number of replacement elements can appear.

The `openContent` element has a `mode` attribute that indicates where the replacement elements can appear.

- If it is `interleave` (the default), the replacement elements can appear
  intermingled with the elements explicitly declared in the content model.
- If it is `suffix`, the replacement elements can only appear at the end of the content.
- If it is `none`, no `any` child appears within `openContent` and the content model is not open
  (this is primarily used to override a default open content model).

#### Default open content

It is also possible in version 1.1 to specify a **default open content model**
that can apply to any complex type in the schema that allows children
(that is, any one with element-only or mixed content).
This is accomplished using a `defaultOpenContent` element.

The `defaultOpenContent` element works the same way as the `openContent` element,
containing an element wildcard and specifying a `mode` attribute to indicate where the replacement elements can appear.

However, since it applies to multiple complex types in a schema document,
it appears at the top level of the schema, after any `includes`, `imports`, and `overrides`
but before any component definitions.

> 位置

If a **default open content model** is defined,
it is possible to override it in an individual complex type using the `openContent` element with a `mode="none"` attribute.

Note that the **default open content model** does not apply to complex types with **simple content**,
since they do not allow children.

By default, it does not apply to complex types with **empty content**, either.
However, you can use an `appliesToEmpty="true"` attribute on `defaultOpenContent` to indicate that
the default open content model should apply to complex types with **empty content**.

### Attribute wildcards

Attribute wildcards are used to allow flexibility as to
what attributes may appear on elements of a particular complex type.

Attribute wildcards are represented by `anyAttribute` elements.

The `namespace`, `processContents`, `notNamespace`, and `notQName` attributes for **attribute wildcards**
work exactly the same as for **element wildcards**.

The only difference between **attribute wildcards** and **element wildcards** is that
attribute wildcards cannot have `minOccurs` and `maxOccurs` specified.
If an **attribute wildcard** is present, it is assumed that there may be zero, one, or many
replacement attributes present.

Attribute wildcards in a complex type must appear after
all of the attribute declarations, attribute references, and attribute group references.
There can only be one attribute wildcard in each complex type definition.

> 位置和数量


