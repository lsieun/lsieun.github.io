---
title: "JLS VS. JSR VS. JEP"
sequence: "101"
---

In the general context:

- A **specification** is a document that specifies (or defines) something.
- A **request** is statement (written or verbal) asking for something.
- A **proposal** is a statement (written or verbal) putting forward something to be considered.

As you can see, the plain English meanings of these words themselves don't help a lot.
We need more context.
In this case, the context is in the pages you linked to.

## Concept

- **JLS**: **Java Language Specification**, specifies the syntax for the Java programming language.
- **JSR**: **Java Specification Request**, A typical JSR's subject material is a relatively **mature technology**.
- **JEP**: **Java Enhancement Proposal**, JEPs may call for exploration of **novel ideas**.

## Relationships

So the relationship between JEPs, JSRs and specifications is like this:

- **JEPs** propose and develop **experimental ideas** to the point where they could be specified. Not all JEPs come to fruition.
- **JSRs** take **mature ideas** (e.g. resulting from a **JEP**), and produce a new specification, or modifications to an existing specification. Not all JSRs come to fruition.
- A **specification** is a common work product of a **JSR**.
  (Others include source code of interfaces, and reference implementations.)
  The **JLS** is an example of a specification.
  Others include the **JVM specification**, the Servlet and JSP specifications, the EJB specifications and so on.

```text
JEP ---> JSR ---> Specification
```

```text
                                         ┌─── JLS
                                         │
                                         ├─── JVM Specification
                                         │
JEP ───┼─── JSR ───┼─── Specification ───┼─── Servlet Specification
                                         │
                                         ├─── JSP Specification
                                         │
                                         └─── EJB Specification
```



