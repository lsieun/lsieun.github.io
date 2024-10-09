---
title: "Collection 2 Stream"
sequence: "105"
---

```text
public static <T> Stream<T> collectionToStream(Collection<T> collection) {
    return Optional.ofNullable(collection).stream().flatMap(Collection::stream);
}
```
