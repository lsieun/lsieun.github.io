---
title: "XML Schema Components"
sequence: "101"
---

## The components of XML Schema

Schemas are made up of a number of **components** of different kinds.

| Component           | Can be named? | Can be unnamed? | Can be global? | Can be local? |
|---------------------|---------------|-----------------|----------------|---------------|
| Element             | yes           | no              | yes            | yes           |
| Attribute           | yes           | no              | yes            | yes           |
| Simple type         | yes           | yes             | yes            | yes           |
| Complex type        | yes           | yes             | yes            | yes           |
| Notation            | yes           | no              | yes            | no            |
| Named model group   | yes           | no              | yes            | no            |
| Attribute group     | yes           | no              | yes            | no            |
| Identity constraint | yes           | no              | no             | yes           |

```text
                                                                         ┌─── elements
                                                                         │
                                          ┌─── declaration (external) ───┼─── attributes
                                          │                              │
                                          │                              └─── notations
                                          │
                         ┌─── boundary ───┤                                                           ┌─── simple types
                         │                │                              ┌─── types ──────────────────┤
                         │                │                              │                            └─── complex types
                         │                │                              │
                         │                └─── definition  (internal) ───┼─── model groups
XML Schema Components ───┤                                               │
                         │                                               ├─── attribute groups
                         │                                               │
                         │                                               └─── identity constraints
                         │
                         │                ┌─── global components
                         └─── scope ──────┤
                                          └─── local components
```

## Declarations vs. Definitions

Schemas contain both **declarations** and **definitions**.

The term **declaration** is used for components that can appear in the instance and be validated by **name**.
This includes elements, attributes, and notations.

```text
declaration 是给外部的 XML 文档使用的
```

The term **definition** is used for other components that are **internal to the schema**,
such as complex and simple types, model groups, attribute groups, and identity constraints.

```text
definition 是给 XML Schema 内部使用的
```

The order of declarations and definitions in the schema document is insignificant.
A declaration can refer to other declarations or definitions that appear before or after it,
or even those that appear in another schema document.

## Global vs. local components

Components can be declared (or defined) **globally** or **locally**.

**Global components** appear at the top level of a schema document, and they are always named.
Their names must be unique, within their component type, within the entire schema.
For example, it is not legal to have two global element declarations with the same name in the same schema.
However, it is legal to have an element declaration and a complex type definition with the same name.

**Local components**, on the other hand, are scoped to the definition or declaration that contains them.
Element and attribute declarations can be local,
which means their scope is the complex type in which they are declared.
Simple types and complex types can also be locally defined,
in which case they are anonymous and cannot be used by any element
or attribute declaration other than the one in which they are defined.

