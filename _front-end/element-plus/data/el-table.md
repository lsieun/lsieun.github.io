---
title: "Table"
sequence: "201"
---

## Basic Table

After setting attribute `data` of `el-table` with an object array,

```text
第一步，给<el-table>设置data属性
```

you can use `prop` (corresponding to a key of the object in `data` array) in `el-table-column`
to insert data to table columns, and set the attribute `label` to define the column name.

```text
第二步，给el-table-column设置prop（数据）和label（列名）
```

You can also use the attribute `width` to define the width of columns.

```text
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script lang="ts" setup>
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>
```

## 不同场景

### 隐藏id列

使用场景：

- 使用`el-table`进行数据的展示时，查询数据时要获取对象的ID属性，在展示时不需要展示ID这一列，但是在进行编辑时需要获取该ID。

实现方法：

- 可以通过在`el-table-column`上添加`v-if="false"`。

```text
<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="selection" width="50" />
    <el-table-column prop="id" label="ID" v-if="false" />
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>
```

### formatter

We can use `formatter` attribute to format the value of certain columns.
It accepts a function which has two parameters: `row` and `column`.

```text
<template>
  <el-table :data="tableData" style="width: 100%" >
    <el-table-column prop="address" label="Address" :formatter="formatter" />
  </el-table>
</template>

<script lang="ts" setup>
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'

interface User {
  date: string
  name: string
  address: string
}

const formatter = (row: User, column: TableColumnCtx<User>) => {
  return row.address
}

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  }
]
</script>
```

## Reference

- [API: Table](https://element-plus.gitee.io/en-US/component/table.html)

