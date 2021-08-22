---
title:  "Core API VS. Tree API"
sequence: "101"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

Like for class generation, using the tree API to transform classes
takes more time and consumes more memory than using the core API.
But it makes it possible to implement some transformations more easily.

This is the case, for example, of a transformation
that adds to a class an annotation containing a digital signature of its content.
With the core API the digital signature can be computed only when all the class has been visited,
but then it is too late to add an annotation containing it,
because annotations must be visited before class members.
With the tree API this problem disappears because there is no such constraint in this case.

In fact, it is possible to implement the `AddDigitialSignature` example with the core API,
but then the class must be transformed in two passes.
- During the first pass the class is visited with a `ClassReader` (and no `ClassWriter`),
in order to compute the digital signature based on the class content.
- During the second pass the same `ClassReader` is reused to do a second visit of the class,
this time with an `AddAnnotationAdapter` chained to a `ClassWriter`.

By generalizing this argument we see that, in fact,
**any transformation can be implemented with the core API alone, by using several passes if necessary.**
But this increases the transformation code complexity,
this requires to store state between passes (which can be as complex as a full tree representation!),
and parsing the class several times has a cost, 
which must be compared to the cost of constructing the corresponding `ClassNode`.

The conclusion is that **the tree API is generally used for transformations
that cannot be implemented in one pass with the core API.**
But there are of course exceptions.
For example an obfuscator cannot be implemented in one pass,
because you cannot transform classes before the mapping from original to obfuscated names is fully constructed, which requires to parse all classes.
But the tree API is not a good solution either,
because it would require keeping in memory the object representation of all the classes to obfuscate.
In this case it is better to use the core API with two passes:
one to compute the mapping between original and obfuscated names
(a simple hash table that requires much less memory than a full object representation of all the classes),
and one to transform the classes based on this mapping.
