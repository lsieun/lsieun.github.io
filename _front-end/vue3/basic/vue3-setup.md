---
title: "setup"
sequence: "201"
---

```text
setup(props, context);
```

setup接收两个参数：

- `props`
- `context`

## setup的两个注意点

setup执行的时机：

- 在`beforeCreate`之前，执行一次，`this`是`undefined`。

setup的参数：

- `props`：值为对象，包含“组件外部传递过来的”且“组件内部声明接收的”属性。
- `context`：上下文对象
  - `attrs`：值为对象，包含“组件外部传递过来的”，但“没有在`props`配置中声明的”属性。
  - `slots`：收到的插槽内容，相当于`this.$slots`。
  - `emit`：分发“自定义事件的函数”，相当于`this.$emit`。
