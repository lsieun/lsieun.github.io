---
title: "toRaw与markRaw"
sequence: "202"
---

- `toRaw`
  - 作用：将一个由`reactive`生成的**响应式对象**转为**普通对象**
  - 使用场景：用于读取响应式对象对应的普通对象，对这个普通对象的所有操作，不会引起页面更新。
- `markRaw`
  - 作用：标记一个对象，使其永远不会再成为响应式对象。
  - 应用场景：
    - 有些值不应被设置为响应式的，例如复杂的第三方类库等。
    - 当渲染具有不可变数据源的大列表时，跳过响应式转换可以提高性能。