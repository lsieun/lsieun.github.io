---
title: "Type Hierarchy"
sequence: "102"
---

## Types

**Types** allow for validation of the **content of elements** and the **values of attributes**.
They can be either **simple types** or **complex types**.

```text
                                              ┌─── simple types ────┼─── character data content
                           ┌─── complexity ───┤
                           │                  │                     ┌─── child elements
                           │                  └─── complex types ───┤
XMLSchemaType::classify ───┤                                        └─── attributes
                           │
                           │                  ┌─── named types
                           └─── name ─────────┤
                                              └─── anonymous types
```

### Simple vs. complex types

The XML Schema language defines two main type constructs: **a simple type** and **a complex type**.
Almost no meaningful document structure is feasible without the use of a **complex type**.

**Elements** that have been assigned **simple types** have **character data content**, but no **child elements** or **attributes**.

By contrast, **elements** that have been assigned **complex types** may have **child elements** or **attributes**.

**Attributes** always have **simple types**, not complex types.
This makes sense, because attributes themselves cannot have children or other attributes.

### Named vs. anonymous types

Types can be either **named** or **anonymous**.

**Named types** are always defined globally (at the top level of a schema document)
and are required to have **a unique name**.

**Anonymous types**, on the other hand, must not have names.
They are always defined entirely within an **element** or **attribute declaration**,
and may only be used once, by that declaration.

### The type definition hierarchy

XML Schema allows types to be **derived** from other types.

A complex type can also be derived from another type, either **simple** or **complex**.
It can either **restrict** or **extend** the other type.

The derivation of types from other types forms a **type definition hierarchy**.
Derived types are related to their ancestors and inherit qualities from them.

## Simple types

### Built-in simple types

Forty-nine simple types are built into the XML Schema recommendation.
These simple types represent common data types such as strings, numbers, date and time values,
and also include types for each of the valid attribute types in XML DTDs.

```text
                                                              ┌─── string
                                                              │
                                                              ├─── normalizedString
                                                              │
                                                              ├─── token
                                                              │
                                    ┌─── Strings and names ───┼─── Name
                                    │                         │
                                    │                         ├─── NCName
                                    │                         │
                                    │                         ├─── QName
                                    │                         │
                                    │                         └─── language
                                    │
                                    │                         ┌─── float
                                    │                         │
                                    │                         ├─── double
                                    │                         │
                                    │                         ├─── decimal
                                    │                         │
                                    │                         ├─── integer
                                    │                         │
                                    │                         ├─── long
                                    │                         │
                                    │                         ├─── int
                                    │                         │
                                    │                         ├─── short
                                    │                         │
                                    │                         ├─── byte
                                    ├─── Numeric ─────────────┤
                                    │                         ├─── positiveInteger
                                    │                         │
                                    │                         ├─── nonPositiveInteger
                                    │                         │
                                    │                         ├─── negativeInteger
                                    │                         │
                                    │                         ├─── nonNegativeInteger
                                    │                         │
                                    │                         ├─── unsignedLong
                                    │                         │
                                    │                         ├─── unsignedInt
                                    │                         │
                                    │                         ├─── unsignedShort
                                    │                         │
                                    │                         └─── unsignedByte
                                    │
                                    │                         ┌─── duration
                                    │                         │
XML Schema Built-in simple types ───┤                         ├─── dateTime
                                    │                         │
                                    │                         ├─── date
                                    │                         │
                                    │                         ├─── time
                                    │                         │
                                    │                         ├─── gYear
                                    │                         │
                                    │                         ├─── gYearMonth
                                    ├─── Date and time ───────┤
                                    │                         ├─── gMonth
                                    │                         │
                                    │                         ├─── gMonthDay
                                    │                         │
                                    │                         ├─── gDay
                                    │                         │
                                    │                         ├─── dayTimeDuration (1.1)
                                    │                         │
                                    │                         ├─── yearMonthDuration (1.1)
                                    │                         │
                                    │                         └─── dateTimeStamp (1.1)
                                    │
                                    │                         ┌─── ID
                                    │                         │
                                    │                         ├─── IDREF
                                    │                         │
                                    │                         ├─── IDREFS
                                    │                         │
                                    │                         ├─── ENTITY
                                    ├─── XML DTD types ───────┤
                                    │                         ├─── ENTITIES
                                    │                         │
                                    │                         ├─── NMTOKEN
                                    │                         │
                                    │                         ├─── NMTOKENS
                                    │                         │
                                    │                         └─── NOTATION
                                    │
                                    │
                                    │                         ┌─── boolean
                                    │                         │
                                    │                         ├─── hexBinary
                                    └─── Other ───────────────┤
                                                              ├─── base64Binary
                                                              │
                                                              └─── anyURI
```

### Restricting simple types

New simple types may be derived from other simple types by restricting them.

Using the fourteen facets that are part of XML Schema,
you can specify a valid range of values, constrain the length and precision of values,
enumerate a list of valid values, or specify a regular expression that valid values must match.

```text
                                                          ┌─── minInclusive
                                                          │
                                                          ├─── maxInclusive
                     ┌─── Bounds ─────────────────────────┤
                     │                                    ├─── minExclusive
                     │                                    │
                     │                                    └─── maxExclusive
                     │
                     │                                    ┌─── length
                     │                                    │
                     ├─── Length ─────────────────────────┼─── minLength
                     │                                    │
                     │                                    └─── maxLength
                     │
                     │                                    ┌─── totalDigits
XML Schema Facets ───┼─── Precision ──────────────────────┤
                     │                                    └─── fractionDigits
                     │
                     ├─── Enumerated values ──────────────┼─── enumeration
                     │
                     ├─── Pattern matching ───────────────┼─── pattern
                     │
                     ├─── Whitespace processing ──────────┼─── whiteSpace
                     │
                     ├─── XPath-based assertions (1.1) ───┼─── assertion
                     │
                     │
                     └─── Time zone requirements (1.1) ───┼─── explicitTimezone
```

### List and union types

Most simple types, including those we have seen so far, are **atomic types**.
They contain values that are indivisible.
There are two other varieties of simple types: **list** and **union types**.

**List types** have values that are whitespace-separated lists of **atomic values**.

**Union types** may have values that are either **atomic values** or **list values**.

## Complex types

![](/assets/images/xml/xml-schema-element-content-type-and-model.png)

### Content types

The "content" of an element is the **character data** and **child elements** that are between its tags.

There are four types of content for complex types: **simple**, **element-only**, **mixed**, and **empty**.

The **content type** is independent of **attributes**; all of these **content types** allow **attributes**.

### Content models

The **order** and **structure** of the **child elements** of a **complex type** are known as its **content model**.

**Content models** are defined using a combination of **model groups**, **element declarations or references**, and **wildcards**.

There are three kinds of **model groups**:

- `sequence` groups require that the child elements appear in the order specified.
- `choice` groups allow any one of several child elements to appear.
- `all` groups allow child elements to appear in any order.

这里讲的是“集合”与“单个元素”之间的关系。简单总结：

- `sequence`代表“有序”
- `all`代表“无序”
- `choice`代表“多选一”

These groups can be nested and may occur multiple times, allowing you to create sophisticated content models.

An `any` element is known as a **wildcard**, and it allows for open content models.
There is an equivalent wildcard for attributes, `anyAttribute`, which allows any attribute to appear in a complex type.

### Deriving complex types

**Complex types** may be derived from other types either by **restriction** or by **extension**.

**Restriction**, as the name suggests, restricts the valid contents of a type.
The values for the new type are a subset of those for the base type.
All values of the restricted type are also valid according to the base type.

**Extension** allows for adding additional **child elements** and/or **attributes** to a type,
thus extending the contents of the type.
Values of the base type are not necessarily valid for the extended type,
since required elements or attributes may be added.
New element declarations or references may only be added to the end of a content model.

