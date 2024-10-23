---
title: "Replacing Reflection"
sequence: "104"
---

Java 9 offers an alternative to reflection-based access of frameworks to nonpublic class members in applications:
`MethodHandles` and `VarHandles`.

Applications can pass a `java.lang.invoke.Lookup` instance with the right permissions to the framework,
explicitly delegating private lookup capabilities.
The framework module can then, using `MethodHandles.privateLookupIn(Class, Lookup)`,
access nonpublic members on classes from the application module.
It is expected that frameworks, in time,
move to this more principled and performance-friendly approach to access application internals.




