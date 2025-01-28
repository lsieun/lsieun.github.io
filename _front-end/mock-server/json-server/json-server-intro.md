---
title: "JSON Server"
sequence: "101"
---

## 安装和启动

安装JSON Server：

```text
npm install -g json-server
```

启动JSON Server：

```text
json-server --watch db.json
```

npm install -g json-server

json-server -v



json-server --watch db.json



json-server --watch db.json --port 3004



新建一个package.json，配置信息：



```text
{
  "scripts": {
    "mock": "json-server db.json --port 3004"
  }
}
```


```text
npm run mock
```


## 数据

```text

```

## GET

### 过滤

### 分页

```text
http://localhost:3000/fruits?_page=2&_limit=2
```

### 排序

```text
http://localhost:3000/fruits?_sort=id&_order=desc
```

### 取局部数据

```text
http://localhost:3000/fruits?_start=2&_end=4
```

```text
http://localhost:3000/fruits?_start=2&_limit=4
```

### 取某个范围 Operator

第一种，取值范围：采用`_gte`、`_lte`来设置一个取值范围（range）：

```text
http://localhost:3000/fruits?id_gte=4&id_lte=6
```

第二种，采用`_ne`来设置不包含某个值：

```text
http://localhost:3000/fruits?id_ne=4
```

```text
http://localhost:3000/fruits?id_ne=1&&id_ne=2
```

第三种，采用`_like`来设置匹配某个字符串（或正则表达式）：

```text
http://localhost:3000/fruits?name_like=apple
```

### 全文搜索 Full-text search

采用`q`来设置搜索内容：

```text
http://localhost:3000/fruits?q=oran
```

## 配置静态资源服务器

主要是用来配置图片、音频、视频资源

通过命令配置路由、数据文件、监控等会让命令变的很长，而且容易写错。

JSON Server允许我们把所有的配置放到一个配置文件中，这个配置文件一般命名为`json_server_config.json`：

File: `json_server_config.json`

```text
{
    "port": 3004,
    "watch": true,
    "static": "./public",
    "readonly": "false",
    "no-cors": false,
    "no-gzip": false
}
```

File: `package.json`

```text
{
    "scripts": {
        "mock": "json-server --c json_server_config.json db.json"
    }
}
```

既然我们已经在`json_server_config.json`里面指明了静态文件的目录，那么我们访问的时候，就可以忽略`public`：

```text

```

## Reference

- [Github: typicode/json-server](https://github.com/typicode/json-server)
