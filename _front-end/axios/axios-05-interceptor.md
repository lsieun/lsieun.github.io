---
title: "axios: 拦截器"
sequence: "205"
---

应用场景：

- 携带token
- UI的loading界面

```text
import axios from "axios";

axios.interceptors.request.use((config) => {
    // 添加token

    // loading动画

    console.log('请求发送成功')
    return config;
}, (err) => {
    console.log('请求发送错误')
    return err;
});

axios.interceptors.response.use((res) => {
    return res;
}, (err) => {
    return err;
});
```


