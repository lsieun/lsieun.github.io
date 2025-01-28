---
title: "env"
sequence: "203"
---

在开发中，有时候我们需要根据不同的环境设置不同的环境变量，常见三种环境：

- 开发环境：development
- 生产环境：production
- 测试环境：test

如何区分环境变量呢？常见有三种方式：

- 方式一：手动修改不同的变量
- 方式二：根据`process.env.NODE_ENV`的值进行区分
- 方式三：编写不同的环境变量配置文件

## env.NODE_ENV

根据`process.env.NODE_ENV`区分：

```text
import * as process from "process";

let BASE_URL: string = '';
let BASE_NAME: string = '';

if (process.env.NODE_ENV === 'development') {
    BASE_URL = 'https://www.example.com/dev';
    BASE_NAME = 'App1';
}
else if (process.env.NODE_ENV === 'production') {
    BASE_URL = 'https://www.example.com/prod';
    BASE_NAME = 'Tom';
}
else {
    BASE_URL = 'https://www.example.com/test';
    BASE_NAME = 'Jerry';
}
console.log(BASE_URL);
console.log(BASE_NAME);

export {
    BASE_URL,
    BASE_NAME
};
```

## .env

```text
.env
.env.development
.env.production
.env.test
```

```text
VUE_APP_BASE_URL=https://www.abc.com
VUE_APP_BASE_NAME=Tom
```

## Reference

- [Modes and Environment Variables](https://cli.vuejs.org/guide/mode-and-env.html)

