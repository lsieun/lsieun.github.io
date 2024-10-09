---
title: "DTD - Attributes"
sequence: "107"
---

In a DTD, attributes are declared with an `ATTLIST` declaration.

Attribute declaration can appear anywhere in the DTD.
For readability, it is best to list attributes immediately after the element declaration.

> 位置

## Declaring Attributes

An attribute declaration has the following syntax:

```text
<!ATTLIST element-name attribute-name attribute-type attribute-value>
```

```text
                               ┌─── character ───┼─── CDATA
                               │
                               ├─── list ────────┼─── (en1|en2|..)
                               │
                               │                 ┌─── ID
                               │                 │
                               ├─── id ──────────┼─── IDREF
                               │                 │
                               │                 └─── IDREFS
                               │
                 ┌─── type ────┤                 ┌─── NMTOKEN
                 │             ├─── token ───────┤
                 │             │                 └─── NMTOKENS
                 │             │
                 │             │                 ┌─── ENTITY
                 │             ├─── entity ──────┤
                 │             │                 └─── ENTITIES
DTD Attribute ───┤             │
                 │             ├─── notation ────┼─── NOTATION
                 │             │
                 │             └─── xml ─────────┼─── xml:
                 │
                 │             ┌─── value
                 │             │
                 │             ├─── #REQUIRED
                 └─── value ───┤
                               ├─── #IMPLIED
                               │
                               └─── #FIXED value
```

DTD example:

```text
<!ATTLIST payment type CDATA "check">
```

XML example:

```text
<payment type="check" />
```

The `attribute-type` can be one of the following:

- `CDATA`: The value is character data
- `(en1|en2|..)`: The value must be one from an enumerated list
- `ID`: The value is a unique id
- `IDREF`: The value is the id of another element
- `IDREFS`: The value is a list of other ids
- `NMTOKEN`: The value is a valid XML name
- `NMTOKENS`: The value is a list of valid XML names
- `ENTITY`: The value is an entity
- `ENTITIES`: The value is a list of entities
- `NOTATION`: The value is a name of a notation
- `xml:`: The value is a predefined xml value

The `attribute-value` can be one of the following:

- `value`: The default value of the attribute
- `#REQUIRED`: The attribute is required
- `#IMPLIED`: The attribute is optional
- `#FIXED value`: The attribute value is fixed

## A Default Attribute Value

DTD:

```text
<!ELEMENT square EMPTY>
<!ATTLIST square width CDATA "0">
```

Valid XML:

```text
<square width="100" />
```

## REQUIRED

Syntax

```text
<!ATTLIST element-name attribute-name attribute-type #REQUIRED>
```

Example

DTD:

```text
<!ATTLIST person number CDATA #REQUIRED>
```

Valid XML:

```text
<person number="5677" />
```

Invalid XML:

```text
<person />
```

## IMPLIED

Syntax

```text
<!ATTLIST element-name attribute-name attribute-type #IMPLIED>
```

Example

DTD:

```text
<!ATTLIST contact fax CDATA #IMPLIED>
```

Valid XML:

```text
<contact fax="555-667788" />
```

Valid XML:

```text
<contact />
```

## FIXED

Syntax

```text
<!ATTLIST element-name attribute-name attribute-type #FIXED "value">
```

Example

DTD:

```text
<!ATTLIST sender company CDATA #FIXED "Microsoft">
```

Valid XML:

```text
<sender company="Microsoft" />
```

Invalid XML:

```text
<sender company="W3Schools" />
```

## Enumerated Attribute Values

Syntax

```text
<!ATTLIST element-name attribute-name (en1|en2|..) default-value>
```

Example

DTD:

```text
<!ATTLIST payment type (check|cash) "cash">
```

XML example:

```text
<payment type="check" />
```

or

```text
<payment type="cash" />
```

## Multiple Attributes

For elements that have more than one attribute,
you can group the declarations.

For example, email has two attributes:

```text
<!ATTLIST email href CDATA #REQUIRED
          preferred (true | false) "false">
```

You can specify a list of attributes in one `ATTLIST` declaration.
For example,

```text
<!ATTLIST element-name attribute-name1 attribute-type1 default-value1 
                       attribute-name2 attribute-type2 default-value2>
```
  declares two attributes
identified as  aname1  and  aname2 .

## CAUTION

If used in a valid document, the special attributes `xml:space` and `xml:lang` must be declared as

```text
xml:space (default|preserve) "preserve"
xml:lang  NMTOKEN  #IMPLIED
```

The DTD provides more control over the content of attributes than over the content of elements.
Attributes are broadly divided into three categories:

- string attributes contain text, for example:

```text
<!ATTLIST email href CDATA #REQUIRED>
```


- tokenized attributes have constraints on the content of the attribute, for example:

```text
<!ATTLIST entry id ID #IMPLIED>
```

- enumerated-type attributes accept one value in a list, for example:

```text
<!ATTLIST entry preferred (true | false) "false">
```

Attribute types can take any of the following values:

- `CDATA` for string attributes.
- `ID` for identifier. An identifier is a name that is unique in the document.
- `IDREF` must be the value of an `ID` used elsewhere in the same document. `IDREF` is used to create links within a document.
- `IDREFS` is a list of `IDREF` separated by spaces.
- `ENTITY` must be the name of an external entity; this is how you assign an external entity to an attribute.
- `ENTITIES` is a list of `ENTITY` separated by spaces.
- `NMTOKEN` is essentially a word without spaces.
- `NMTOKENS` is a list of `NMTOKEN` separated by spaces.
- Enumerated-type list is a closed list of nmtokens separated by `|`, the value has to be one of the nmtokens.
  The list of tokens can further be limited to NOTATIONs.

Optionally, the DTD can specify a default value for the attribute.
If the document does not include the attribute, it is assumed to have the default value.
The default value can take one of the four following values:

- `#REQUIRED` means that a value must be provided in the document
- `#IMPLIED` means that if no value is provided, the application must use its own default
- `#FIXED` followed by a value means that attribute value must be the value declared in the DTD
- A literal value means that the attribute will take this value if no value is given in the document. 

## NOTE

Information that remains constant between documents is an ideal candidate for `#FIXED` attributes.
For example, if `prices` are always given in dollars, you could declare a price element as

```text
<!ELEMENT price (#PCDATA)>
<!ATTLIST price currency NMTOKEN #FIXED "usd">
```

When the application reads

```text
<price>19.99</price>
```

in a document, it appears as though it reads

```text
<price currency="usd">19.99</price>
```

The application has received additional information but it didn't require additional markup in the document! 
