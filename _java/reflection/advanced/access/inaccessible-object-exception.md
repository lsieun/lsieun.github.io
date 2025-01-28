---
title: "InaccessibleObjectException"
sequence: "103"
---

`InaccessibleObjectException` extends `RuntimeException`, making it an **unchecked exception**,
so the compiler won't force you to catch it.

Definition: `AccessibleObject::trySetAccessible`

If you prefer checking accessibility without causing an exception to be thrown,
the `AccessibleObject::trySetAccessible` method, added in Java 9, is there for you.
At its core, it does the same thing as `setAccessible(true)`:
it tries to make the underlying member accessible, but uses its return value to indicate whether it worked.
If accessibility was granted, it returns `true`; otherwise it returns `false`.

