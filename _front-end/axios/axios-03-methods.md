---
title: "axios: 请求方式"
sequence: "203"
---

支持多种请求方式：

```text
axios(config)
axios.request(config)
axios.get(url,[,config])
axios.delete(url[,config])
axios.head(url[,config])
axios.post(url[,data[,config]])
axios.put(url[,data[,config]])
axios.patch(url[,data[,config]])
```

有的时候，我们可能需求同时发送两个请求：

- 使用`axios.all`，可以放入多个请求的数组
- `axios.all([])`返回的结果是一个数组，使用`axios.spread`将数组`[res1,res2]`展开为`res1`、`res2`。

## axios.all

```text
import axios from "axios";

axios.defaults.baseURL = 'http://192.168.80.130';
axios.all([
    axios.get('/get', {params: {username: 'tomcat', password: '123456'}}),
    axios.post('/post', {name:'jerry', age: 10})
]).then(res => {
    console.log(res[0]);
    console.log(res[1]);
});
```

