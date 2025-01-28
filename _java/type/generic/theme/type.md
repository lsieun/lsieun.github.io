---
title: "Type"
sequence: "127"
---

## type parameter

Can I use a type parameter like a type? **No, a type parameter is not a type in the regular sense** (different from a regular type such as a non-generic class or interface).

Type parameters can be used for typing (like non-generic classes and interfaces):

- as argument and return types of methods
- as type of a field or local reference variable
- as type argument of other parameterized types
- as target type in casts
- as explicit type argument of parameterized methods

Type parameters can NOT be used for the following purposes (different from non-generic classes and interfaces):

- for creation of objects
- for creation of arrays
- in exception handling
- in static context
- in instanceof expressions
- as supertypes
- in a class literal

