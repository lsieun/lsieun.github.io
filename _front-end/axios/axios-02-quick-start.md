---
title: "axios: Quick Start"
sequence: "202"
---

## httpbin.org

```text
docker run -p 80:80 kennethreitz/httpbin
```

## 安装axios

```text
$ npm install axios
```

## 添加axios_demo.ts并引入

```text
import './api/axios_demo';
```

## 模拟GET请求

### 无参数

```text
import axios from "axios";

// axios的实例对象
axios.get('http://localhost:6789/dma/hello/world').then((res) => {
    console.log(res.data);
});
```

### 带参数

```text
import axios from "axios";

axios.get('http://192.168.80.130/get', {
    params: {
        username: 'tomcat',
        password: '123456'
    }
}).then((res) => {
    console.log(res.data);
});
```

## POST请求

### payload

```text
import axios from "axios";

axios.post('http://192.168.80.130/post', {
    username: 'tomcat',
    password: '123456'
}).then((res) => {
    console.log(res.data);
});
```
