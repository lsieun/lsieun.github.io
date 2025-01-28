---
title: "vue.config.js"
sequence: "201"
---

## Vue项目关闭语法检查

在`vue.config.js`文件加入：

```text
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false // 关闭语法检查
})
```

