---
title: "Tree"
sequence: "202"
---

## Basic

```text
<template>
  <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" />
</template>
```

- `:data`：真实的数据
- `:props:` 配置，例如，label、children

事件：

- `@node-click`

## checkbox

Attribute:

- show-checkbox
- default-checked-keys
    - node-key="id"

Event:

- @check-change

Data:


#### Tree node filtering
