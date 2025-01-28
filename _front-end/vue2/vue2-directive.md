---
title: "Vue2.x directive"
sequence: "202"
---

## 自定义指令

```text
<span v-big="n"></span>
```

```text
directives: {
    big(element, binding) {
        console.log(element, binding);
        element.innerText = binding.value * 10;
    }
}
```



问题：自定义指令（`v-big`）对应的函数（`big()`）何时会被调用呢？

有两个时机：

- 第一个时机，当“指令”与“元素”成功绑定时。
- 第二个时机，当“指令”所在的“模板”被重新解析时。

如果自定义指令的名字（`big-number`）由多个单词组成：

```text
<span v-big-number="n"></span>
```

```text
directives: {
    'big-number': function(element, binding) {
        console.log(element, binding);
        element.innerText = binding.value * 10;
    }
}
```

或者：

```text
directives: {
    'big-number'(element, binding) {
        console.log(element, binding);
        element.innerText = binding.value * 10;
    }
}
```

需求二：定义一个`v-fbind`指令，和`v-bind`功能类似，但可以让其所绑定的`<input>`元素默认获取焦点。

```text
<input type="text" v-fbind:value="n"/>
```

```text
directives: {
    fbind: {
        // “指令”与“元素”成功绑定时（一上来）
        bind(element, binding) {
            element.value = binding.value;
        },
        // “指令所在元素”被插入“页面”时
        inserted(element, binding) {
            element.focus();
        },
        // “指令所在的模板”被重新解析时
        update(element, binding) {
            element.value = bind.value;
        }
    }
}
```

问题：在自定义指令（`v-big`或`v-fbind`）对应的函数（`big`或`fbind`）中，`this`是谁呢？

回答：是`window`。因为这些函数要操作DOM元素（`element`参数）来表现特定的值（`binding`参数），不需要`vm`对象的参与。

## 全局指令

```text
Vue.directive('fbind', {
    // “指令”与“元素”成功绑定时（一上来）
    bind(element, binding) {
        element.value = binding.value;
    },
    // “指令所在元素”被插入“页面”时
    inserted(element, binding) {
        element.focus();
    },
    // “指令所在的模板”被重新解析时
    update(element, binding) {
        element.value = bind.value;
    }
});
```

## 总结

- 第三点，指定定义时不加`v-`前缀，但在使用时要加`v-`前缀。
- 第四点，如果指令名是多个单词，要使用`kebab-case`命名方式，不要使用`camelCase`命令。

