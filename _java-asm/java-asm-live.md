---
title: "Java ASM 字节码操作（直播）"
categories: java asm
tags: java asm
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 课程资料

课程[文档](https://lsieun.github.io/)：

```text
https://lsieun.github.io/
```

课程代码：

- Gitee: [https://gitee.com/lsieun/learn-java-asm](https://gitee.com/lsieun/learn-java-asm)
- Github: [https://github.com/lsieun/learn-java-asm](https://github.com/lsieun/learn-java-asm)

课程交流 [QQ 群](https://jq.qq.com/?_wv=1027&k=yOBiOaJV)：

```text
584642776
```

## 直播信息

腾讯课堂[直播地址](https://ke.qq.com/course/4156657)：

```text
https://ke.qq.com/course/4156657
```

直播时间：

- 从 2021-12-10 到 2022-01-01 的每周五、周六晚上 20:00~22:00

小提示：

- 每节课都有相应的任务，讲课内容主要围绕着任务展开，可以参考下面的“内容安排”。
- 如果课程当中有疑问，可以讨论区进行说明。如果有些问题没有得到回答，可能是我没有看到，也可能是我一时没有理解，同学们可以在群里重新提出相同的问题。
- 如果有互动问答，想回复“是”或“赞同”，就可以输入 `1`；想回答“否”或“不”，就可以输入 `0`。
- 每节课两个小时，如果讲完的早，就提前下课。
- 每节课结束后，同学们可以给课程一个适当的评价。

## 开发环境

- [Git](https://git-scm.com/)
- [Java 8](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html)
- [Apache Maven](https://maven.apache.org/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/download/other.html) (Community Edition)

## 内容安排

- 第一节课 了解 Java ASM
    - 任务一：ASM 是什么
    - 任务二：ASM 能够做什么
    - 任务三：ASM 的两个组成部分
    - 任务四：搭建 ASM 开发环境
    - 任务五：ASM 与 ClassFile 的关系
    - 任务六：如何使用 Core API 编写代码
- 第二节课 使用 Core API 生成类
    - 任务一：三个重要的类 ClassReader、ClassVisitor、ClassWriter
    - 任务二：ClassVisitor 类的方法调用顺序
    - 任务三：创建 ClassWriter 对象使用 COMPUTE_FRAMES 选项
    - 任务四：如何使用 ClassWriter 类
    - 任务五：生成接口
    - 任务六：生成接口 + 字段
    - 任务七：生成类 + 构造方法
- 第三节课 使用 Core API 生成方法
    - 任务一：`MethodVisitor` 类的方法调用顺序
    - 任务二：`<init>()` 方法
    - 任务三：`<clinit>` 方法
    - 任务四：创建对象和调用方法
    - 任务五：`Label` 类能够做什么
    - 任务六：如何使用 `Label` 类
- 第四节课 方法的 Frame
    - 任务一：方法的初始 Frame
    - 任务二：Frame 的后续变化（顺序执行、跳转执行）
    - 任务三：记录关键的 Frame 变化
    - 任务四：如何使用 `MethodVisitor.visitFrame()` 方法
    - 任务五：不推荐使用 `MethodVisitor.visitFrame()` 方法
- 第五节课 使用 Core API 进行类转换
    - 任务一：Class Transformation 的思路和本质
    - 任务二：如何使用 ClassReader 类
    - 任务三：parsingOptions 参数
    - 任务四：修改类的版本和接口
    - 任务五：添加和删除字段
    - 任务六：添加和删除方法
- 第六节课 使用 Core API 进行方法转换
    - 任务一：方法进入和方法退出时添加代码（增）
    - 任务二：使用 AdviceAdapter 类（增）
    - 任务三：移除 Instruction（删）
    - 任务四：清空方法体（删）
    - 任务五：替换方法调用（改）
    - 任务六：查找方法调用（查）
- 第七节课 使用 Tree API 生成类
    - 任务一：ASM 的两个组成部分（回顾知识）
    - 任务二：如何使用 Tree API 编写代码
    - 任务三：如何使用 ClassNode 类
    - 任务四：添加字段
    - 任务五：添加方法
- 第八节课 使用 Tree API 进行类转换
    - 任务一：从 Core API 到 Tree API
    - 任务二：从 Tree API 到 Core API
    - 任务三：如何对 ClassNode 进行转换
    - 任务四：添加和删除字段
    - 任务五：添加和删除方法
    - 任务六：修改方法内的代码
    - 任务七：混合使用 Core API 和 Tree API

<p style="text-align: center;">
  <img width="500" height="500" src="/assets/images/contact/we-app-code.jpg" alt=""/>
</p>

![QQ Group](/assets/images/contact/qq-group-java-asm.png)
