---
title: "watch函数"
sequence: "201"
---

- 与`Vue2.x`中`watch`配置功能一致。
- 两个小“坑”：
  - 监视`reactive`定义的响应式数据时：oldValue无法正确获取、强制开启了深度监视（deep配置失效）
  - 监视`reactive`定义的响应式数据中某个属性时：deep配置有效。
