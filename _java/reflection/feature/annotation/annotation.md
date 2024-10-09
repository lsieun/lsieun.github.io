---
title: "Annotation"
sequence: "101"
---

Annotations are an important part of reflection.
In fact, annotations are **geared toward** reflection.
They're meant to provide metainformation that can be accessed at run time and is then used to shape the program's behavior.
JUnit's `@Test` and Spring's `@Controller` and `@RequestMapping` are prime examples.

All important reflection-related types like `Class`, `Field`, `Constructor`, `Method`, and `Parameter`
implement the `AnnotatedElement` interface.
Its Javadoc contains a thorough explanation of how annotations can relate to these elements
(directly present, indirectly present, or associated),
but its simplest form is this:
the `getAnnotations` method returns the annotations present on that element in form of an array of `Annotation` instances,
whose members can then be accessed.

