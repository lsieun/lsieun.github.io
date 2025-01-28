---
title: "Form表单：收集数据"
sequence: "202"
---

## v-model

### 收集表单数据

- 若`<input type="text"/>`，则`v-model`收集的是`value`值，用户输入的值就是`value`值。
- 若`<input type="radio"/>`，则`v-model`收集的是`value`值，且要给标签配置`value`值：<input type="radio" value="female"/>。
- 若`<input type="checkbox"/>`
  - 没有配置`input`的`value`属性，那么收集的就是`checked`（勾选或未勾选，是布尔值）
  - 配置`input`的`value`属性：
    - 如果`v-model`的初始值是**非数组**，那么收集的就是`checked`（勾选或未勾选，是布尔值）
    - 如果`v-model`的初始值是**数组**，那么收集的数据就是`value`组成的数组。

### 三个修饰符

`v-model`的三个修饰符：

- `lazy`：失去焦点再收集数据
- `number`：输入字符串转为有效数字
- `trim`：输入首尾空格过滤

