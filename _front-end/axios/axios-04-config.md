---
title: "axios: Config"
sequence: "204"
---

## 常见的配置选项

- 请求地址：`url: '/user'`
- 请求类型：`method: 'get'`
- 请求根路径：`baseURL: 'http://www.abc.com/api'`
- 请求前的数据处理：`transformRequest:[function(data){}]`
- 请求后的数据处理：`transformResponse:[function(data){}]`
- 自定义请求头：`header:{'x-Requested-With':'XMLHttpRequest'}`
- URL查询对象：`params:{id:12}`


- 查询对象序列化函数：`paramSerializer:function(params){}`
- request body: `data:{key:'aa'}`
- 超时设置：`timeout:10000`
- 跨域是否带Token：`withCredentials:false`
- 自定义请求处理：`adapter:function(resolve,reject,config){}`
- 身份验证信息：`auth:{uname:'abc',pwd:'123'}`
- 响应的数据格式（json/blob/document/arraybuffer/text/stream）：`responseType:'json'`

## 全局配置

### baseURL

```text
import axios from "axios";

axios.defaults.baseURL = 'http://192.168.80.130';
axios.get('/get', {
    params: {
        username: 'tomcat',
        password: '123456'
    }
}).then((res) => {
    console.log(res.data);
});
```

### timeout

```text
axios.defaults.timeout = 10000;
```

## 单个请求

```text
import axios from "axios";

axios.defaults.baseURL = 'http://192.168.80.130';
axios.get('/get', {
    params: {
        username: 'tomcat',
        password: '123456'
    },
    timeout: 10000,
    headers: {
        'Motto': 'Not Today'
    }
}).then((res) => {
    console.log(res.data);
});
```



