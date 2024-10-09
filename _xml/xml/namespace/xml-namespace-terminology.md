---
title: "Name terminology"
sequence: "104"
---

## Name terminology

In the context of namespaces, there are several different kinds of names.

**Qualified names**, known as **QNames**, are names that are qualified with a namespace name.
This may happen one of two ways:

- The name contains a prefix that is mapped to a namespace.
- The name does not contain a prefix, but there is a default namespace declared for that element.
  This applies only to **elements**; there is no such thing as an unprefixed, qualified **attribute** name.

**Unqualified names**, on the other hand, are names that are not in any namespace.

- For **element names**, this means they are unprefixed and there is no default namespace declaration.
- For **attribute names**, this means they are unprefixed, period.

**Prefixed names** are names that contain a namespace prefix, such as `prod:product`.
Prefixed names are qualified names, assuming there is a namespace declaration for that prefix in scope.

**Unprefixed names** are names that do not contain a prefix, such as `items`.
Unprefixed element names can be either qualified or unqualified, depending on whether there is a default namespace declaration.

A **local name** is the part of a qualified name that is not the prefix.

**Non-colonized names**, known as **NCNames**, are simply XML names that do not contain colons.
All **local names** and **unprefixed names** are NCNames. Prefixes are also NCNames, because they follow these same rules.

