---
title:  "Tree Based Method Transformation"
sequence: "303"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

Transforming a method with the tree API simply consists in modifying the fields of a `MethodNode` object, and in particular the `instructions` list.
Although this list can be modified in arbitrary ways,
**a common pattern is to modify it while iterating over it.**
Indeed, unlike with the general `ListIterator` contract,
the `ListIterator` returned by an `InsnList` supports many concurrent list modifications.
In fact, you can use the `InsnList` methods to remove one or more elements before and including the current one,
to remove one or more elements after the next element(i.e. not just after the current element, but after its successor),
or to insert one or more elements before the current one or after its successor.
These changes will be reflected in the iterator, i.e. the elements inserted (resp. removed) after the next element will be seen (resp. not seen) in the iterator.


Another common pattern to modify an instruction list,
when you need to insert several instructions after an instruction `i` inside a list,
is to add these new instructions in a temporary instruction list,
and to insert this temporary list inside the main one in one step:

```text
InsnList il = new InsnList();
il.add(...);
...
il.add(...);
mn.instructions.insert(i, il);
```

Inserting the instructions one by one is also possible but more cumbersome,
because the insertion point must be updated after each insertion.
