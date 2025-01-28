---
title: "NIO File Operations"
sequence: "103"
---

[UP](/java-nio.html)


Once we have a `Path`, we can operate on it with static methods of the `Files` utility to
create the path as a file or directory, read and write to it, and interrogate and set its properties.

The following table summarizes these methods of the `java.nio.file.Files` class.
As you might expect, because the `Files` class handles all types of file operations,
it contains a large number of methods.
To make the table more readable, we have elided overloaded forms of the same method
(those taking different kinds of arguments) and grouped corresponding and related types of methods together.
