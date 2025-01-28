---
title: "obj是否为空"
sequence: "201"
---

```text
function isObjectEmpty(obj: any) {
  const arr = Object.keys(obj);
  return arr.length <= 0;
}
```
