---
title: "箭头函数"
sequence: "201"
---

箭头函数：

- 适合与this无关的回调，定时器、数组的方法回调
- 不适合与this有关的回调：事件的回调、对象的方法

## 注意this指向

```javascript
function getName() {
    console.log(this.name);
}

let getName2 = () => {
    console.log(this.name);
};

window.name = '小红';
let student = {
    name: '小明'
};

getName(); // 小红
getName2();// 小红
console.log(this); // Window

getName.call(student);// 小明
getName2.call(student); // 小红
```

## 不能构造实例化对象

```javascript
let Person = (name, age) => {
    this.name = name;
    this.age = age;
}

let p = new Person('小明', 10); // Uncaught TypeError: Person is not a constructor
console.log(p);
```

## 不能使用arguments对象

```javascript
let fn = () => {
    console.log(arguments); // Uncaught ReferenceError: arguments is not defined
};

fn(1, 2, 3);
```

## 箭头函数的简写

### 省略小括号

当形参有且只有一个的时候：

```javascript
let add = (n) => {
    return n + n;
};

let add2 = n => {
    return n + n;
};

console.log(add(10));
console.log(add2(10));
```

### 省略花括号

当代码体只有一条语句的时候，此时return必须省略，而且语句的执行结果就是函数的返回值。

```javascript
let add = (n) => {
    return n + n;
};

let add2 = n =>  n + n;

console.log(add(10));
console.log(add2(10));
```
