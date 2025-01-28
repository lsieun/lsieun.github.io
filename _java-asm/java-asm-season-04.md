---
title: "Java ASM 系列四：代码模板"
categories: java asm
image: /assets/images/manga/pig-fly.jpg
tags: java asm
published: true
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

ASM is an open-source java library for manipulating bytecode.（艰难挣扎中 ...）

---

《Java ASM 系列四：代码模板》处于“艰难挣扎中 ...”，主要原因：

- 素材不足，需要长时间积累。如果某位同学有好的案例，并且愿意分享，可以联系我。

---

适合人群：对 Java ASM 知识有一定了解的开发者，不适合刚刚接触 ASM 的初学者（beginner）。

---

在编写 ASM 代码时，本文遵循的编码命名规则如下：

- 如果一个类继承自 `ClassVisitor`，我们将其命名为 `XxxVisitor`。
- 如果一个类继承自 `MethodVisitor`，我们将其命名为 `XxxAdapter`。

通过类的名字，我们可以很容易地区分出哪些类是继承自 `ClassVisitor`，哪些类是继承自 `MethodVisitor`。

---

Note that the two APIs(Core API and Tree API) manage only one class at a time, and independently of the others:
no information about the class hierarchy is maintained,
and if a class transformation affects other classes,
it is up to the user to modify these other classes.

## 类层面



## 方法层面



## All



## References

- [stackoverflow: java-bytecode-asm Questions](https://stackoverflow.com/questions/tagged/java-bytecode-asm)
- [intellij-community/java/java-analysis-impl/src/com/intellij/codeInspection/bytecodeAnalysis/asm/](https://github.com/JetBrains/intellij-community/tree/master/java/java-analysis-impl/src/com/intellij/codeInspection/bytecodeAnalysis/asm)
- [google/desugar_jdk_libs](https://github.com/google/desugar_jdk_libs)
- [google/guice](https://github.com/google/guice)

TODO: 

- [ ] 查看方法的调用链
- [ ] 编译器优化之后，将 this 的位置占用了
- [ ] LineNumberTable 有什么样的应用呢？
- [ ] 类层面、方法层面 Annotation，Spring 当中应该用到了

东方不败 - 提莫 (321043695)

就是一个小问题，把一个实例对象调用的方法替换成自己写的某个类里的静态方法，其实也挺简单的，注意平衡一下操作数栈。
这个再安卓开发中挺有用的，因为某些 sdk 会在你不知情的情况下调用 app 已经获取到的一些权限，例如获取通讯录里的联系人信息
只要将获取通讯录的函数调用替换成自己编写的函数调用，就能最大程度避免这样的事情发生

提一个小小小小改进，安卓开发正式环境下都会混淆（类名被打乱），因此方法替换时需要传递正确的类名给调用者用来判断是哪个类调用了这个方法（某些类我们返回正确的值，而其他类就返回一个虚假值）。

不胜桮杓 - 子房<sun33919135@gmail.com>

写 SDK 的时候，有个类表示当前版本，通过 ASM 自动修改版本，避免发版时忘记修改版本

使用的 gradle android transform api 构建

importzhh(2022601637)

https://github.com/alibaba/jvm-sandbox/pull/306 对 native 方法的插桩思路 不知道这个算不算个案例

https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/Instrumentation.html#setNativeMethodPrefix api 有说明思路 场景的话比如 System.currentTimeMillis() 想模拟上一次请求返回结果

![QQ Group](/assets/images/contact/qq-group.jpg)


