---
title: "Dependency version ranges"
sequence: "104"
---

[UP](/maven-index.html)


Instead of specifying a certain version number for a dependency, we can also specify a range of versions.

The syntax to be used is the following:

- The `(<from version>,<to version>)` syntax specifies an excluding range
- The `[<from version>,<to version>]` syntax specifies an including range
- We can use the mixed forms `(,]` and `[,)`
- The version numbers before and after the comma are optional
- We can specify multiple ranges, which are separated by commas

举例：

- `(1.0, 1.7)` Any version between 1.0 and 1.7, both excluded
- `[1.0, 1.7]` Any version between 1.0 and 1.7, both included
- `[1.0, 2.0)` Any version; 1.0 included and 2.0 excluded
- `(1.0, 1.9]` Any version; 1.0 excluded and 1.9 included
- `[1.0]` Strictly 1.0, no other version will be accepted
- `(, 2.0)` Versions up to 2.0 excluded
- `[, 2.0)` Versions up to 2.0 excluded
- `(1.0, )` Versions greater than 1.0 (excluded)
- `(1.0, ]` Versions greater than 1.0 (excluded)
- `(1.0, 1.9]`, `[2.1, 3.0)` Any version in the specified ranges

We might wonder which version will be chosen by Maven
when a range of versions is specified.
We have to keep in mind that **when we declare a dependency version** (and not a range of versions),
**we simply give a suggestion about what version Maven should prefer**.
On the other hand, when we **declare a version range**,
**we tell Maven that we can't accept version numbers that are out of the specified range**.
Maven will use this kind of information to resolve conflicts with
other declarations of the same dependency within the same build process.
This can happen because of the **transitive dependency mechanism** or the **dependency inheritance**.
When two or more conflicting ranges are specified for the same dependency, the build process exits with an error.
