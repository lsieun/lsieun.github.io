---
title: "Type Trick"
sequence: "105"
---

## 使用技巧

判断 null，

```text
if (t == null) {
    return;
}
```

先判断 sort

```text
int sort = t.getSort();
if (sort < Type.BOOLEAN || sort > Type.OBJECT) {
    //
}
```

再判断 size
