---
title: "rest函数"
sequence: "201"
---

ES6引入`rest`参数，用于获取函数的实参，用来代替`arguments`。

## arguments vs rest

ES5获取实参的方式：

```javascript
function fn() {
    console.log(arguments);
}

fn('小明', '小红', '小刚');
```

ES6的rest参数：

```javascript
function fn(...args) {
    console.log(args);
}

fn('小明', '小红', '小刚');
```

## rest参数必须放到参数最后

```javascript
function fn(a, b, ...args) {
    console.log(args);
}

fn('小明', '小红', '小刚', '小芳');
```


