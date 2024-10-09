---
title: "Generics and Annotations"
sequence: "108"
---

It is worth mentioning that in the pre-Java 8 era the generics were not allowed to have annotations associated with their type parameters.
But Java 8 changed that and now it becomes possible to annotate generics **type parameters** at the places they are declared or used.

For example, here is how the generic method could be declared and its type parameter is adorned with annotations:

```text
public<@Actionable T> void performAction(final T action) {
    // Some implementation here
}
```

Or just another example of applying the annotation when generic type is being used:

```text
final Collection<@NotEmpty String> strings = new ArrayList<>();
// Some implementation here
```

