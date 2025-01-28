---
title: "YAML 语法"
sequence: "201"
---

## 举个例子

我们可以先看一个例子：

XML 配置

```xml
<server>
    <port>9090</port>
</server>
```

Properties 配置

```text
server.port=9090
```

Yaml 配置：

```yaml
server:
  port: 9090
```

## 基础语法

Spring Boot 的配置文件中，有两种形式：

- `application.properties`: `key=value`
- `application.yml`: `key: value` （注意，`:`后面有空格）

文件名为 `application.yaml`

### 语法要求

- 缩进表示层级关系
  - 缩进很严格，两个空格为标准
  - 缩进不能用 Tab，只能用空格
- `value` 与冒号之间的空格不能省略，例如 `key: value`，`:` 后面是有空格的
- 语法中大小写是敏感的

### 配置普通数据

普通数据在这里值得是：**数字**，**布尔值**，**字符串**等。

语法：

```yaml
key: value
```

示例：

```yaml
name: tom
```

- 普通数据的值，直接写在冒号（加空格）后面，通常字符串也不需要加单双引号
  - 双引号(`""`)会将转义字符，例如 `"\n"` 当做换行符返回
  - 单引号（`''`）不会解析转义，`'\n'` 会被当作字符串返回

### 配置对象数据、Map数据

基本写法：

```yaml
key: 
  key1: value1
  key2: value2
```

行内写法：

```yaml
key: {key1: value1, key2: value2}
```

对象示例：

```yaml
user:
  name: tom
  age: 3
```

对象示例（行内写法）：

```yaml
user: {name: tom, age: 3}
```

### 配置数组、List、Set 数据

这里用 `-` 代表一个元素，注意 `-` 和 `value1` 等之间存在一个空格：

```yaml
key: 
  - value1
  - value2
```

行内写法：

```yaml
key: [value1,value2]
```

数组：（注意有`-`）

```yaml
pets:
  - cat
  - dog
  - pig
```

数组（行内写法）：

```yaml
pets: [cat,dog,pig]
```

### 当集合中元素为对象的时候

```yaml
user:
  - name: zhangsan
    age: 20
    address: beijing
  - name: lisi
    age: 28
    address: shanghai
  - name: wangwu
    age: 26
    address: shenzhen
```
