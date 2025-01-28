---
title: "Select"
sequence: "202"
---

## 普通

```text
<el-select v-model="select" placeholder="Select" style="width: 115px">
  <el-option label="Restaurant" value="1" />
  <el-option label="Order No." value="2" />
  <el-option label="Tel" value="3" />
</el-select>
```

## 数据

```text
<template>
  <el-select v-model="value" placeholder="请选择">
    <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref('');

const options = [
  {
    value: 'freshman',
    label: '大一学生',
  },
  {
    value: 'sophomore',
    label: '大二学生',
  },
  {
    value: 'junior',
    label: '大三学生',
  },
  {
    value: 'senior',
    label: '大四学生',
  }
];
</script>

<style scoped lang="scss">
</style>
```

## Reference

- [API: Select](https://element-plus.gitee.io/en-US/component/select.html)
