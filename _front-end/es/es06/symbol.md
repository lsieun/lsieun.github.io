---
title: "Symbol"
sequence: "201"
---

ES6引入了一种新的原始数据类型`Symbol`，表示独一无二的值。

`Symbol`是JavaScript语言的第七种数据类型，是一种类似于字符串的数据类型。

```text
USONB = you are so niubility
u = undefined
s string symbol
o object
n null number
b boolean
```

`Symbol`特点：

- `Symbol`的值是唯一的，用来解决命名冲突的问题。
- `Symbol`的值不能与其他数据进行运算
- `Symbol`定义的对象属性不能使用`for...in`循环遍历，但是可以使用`Reflect.ownKeys`来获取对象的所有键名。

创建Symbol：

```javascript
let s1 = Symbol();
console.log(s1, typeof s1);
```

输出：

```text
Symbol() 'symbol'
```

## Reference

- [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
