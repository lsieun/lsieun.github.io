---
title:  "pre-built shared indexes"
sequence: "203"
---

## Shared Indexes

### 什么是pre-built shared indexes

在IntelliJ IDEA当中，索引（indexing）占据着一个非常重要的位置，具体的索引类型分成两种：

- pre-built shared indexes，是从Jetbrains的CDN服务器下载的索引信息。
- local indexes，是指IntelliJ IDEA在个人的电脑上构建的索引信息。

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/intellij-idea-using-indexing.png)
{: refdef}

这两种索引（local indexes和shared indexes）的关系，并不是彼此冲突的，而是相互补充的，它们有各自的应用场景：

- shared indexes，适合于JDK或Maven Libraries建立索引。因为JDK和Maven Libraries只要版本相同，那么它们对应的索引就应该是相同的，因此适合建立shared indexes。
- local indexes，适合于对我们的项目代码进行索引。因为项目代码是我们独有的，不是公开的内容，因此适合建立local indexes。

这两种索引（local indexes和shared indexes）可以结合在一起由IntelliJ IDEA来使用。


### 提示信息

我们在使用IntelliJ IDEA的过程中，可能会看到如下的提示信息：

{:refdef: style="text-align: center;"}
![Download pre-built shared indexes](/assets/images/intellij/download-pre-built-shared-indexes.png)
{: refdef}

点击`More actions`会弹出3个选项，即`Download once`、`Don't show again`和`Configure...`，如下所示：

{:refdef: style="text-align: center;"}
![Download pre-built shared indexes](/assets/images/intellij/download-pre-built-shared-indexes-more-actions.png)
{: refdef}

那么，我们应该怎么选择呢？在此，**推荐大家选择`Always download`或者`Download once`选项**。

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/downloading-pre-built-shared-indexes.png)
{: refdef}

只所以推荐大家选择`Always download`或者`Download once`选项，原因有如下两点：

- 第一点，pre-built shared indexes确实是有用的，能够提升IntelliJ IDEA查找内容的速度。
- 第二点，别人已经构建好的内容，我们可以直接拿来用，自己没有必要重新做一遍。

### 重新设置

如果我们错过了这个提示信息，或者我们想重新设置一个新的值，应该怎么办呢？可以依次选择`Settings | Tools | Shared Indexes`，在右侧进行选择

- 在Wait for shared indexes处，**推荐进行勾选，以减少CPU的使用**
- 在Public Shared Indexes下的JDKs和Maven Libraries下有三个选项：
  - 第一个选项，Download automatically。（**网络畅通**）
  - 第二个选项，Ask before download。（**有网络连接，但是速度比较慢，或流量有限制**）
  - 第三个选项，Don't download, use local indexes。（**无法连接到网络**）

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/settings-tools-shared-indexes.png)
{: refdef}

### 下载位置

在IntelliJ IDEA的[system directory](https://www.jetbrains.com/help/idea/tuning-the-ide.html#system-directory)中包含了caches和local history files。 （参考[此处](https://www.jetbrains.com/help/idea/tuning-the-ide.html#system-directory)）

在Windows操作系统上，它的路径信息：

- Syntax: `%LOCALAPPDATA%\JetBrains\<product><version>`
- Example: `C:\Users\JohnS\AppData\Local\JetBrains\IntelliJIdea2021.2`

在macOS操作系统上，它的路径信息：

- Syntax: `~/Library/Caches/JetBrains/<product><version>`
- Example: `~/Library/Caches/JetBrains/IntelliJIdea2021.2`

在Linux操作系统上，它的路径信息：

- Syntax: `~/.cache/JetBrains/<product><version>`
- Example: `~/.cache/JetBrains/IntelliJIdea2021.2`

在IntelliJ IDEA的[system directory](https://www.jetbrains.com/help/idea/tuning-the-ide.html#system-directory)下的`index/shared_indexes`目录中，就存储着JDK indexes。在我的电脑上，它的位置如下：

```text
C:\Users\liusen\AppData\Local\JetBrains\IntelliJIdea2021.2\index\shared_indexes
```

下载完成之后，IntelliJ IDEA就可以使用这些shared indexes了。

### 删除Shared Indexes

有些场景下，我们想要删除已经下载的Shared Indexes：

- JDK的版本发生了变化，例如从Java 8变成了Java 11
- 转入到新的项目后，在maven中依赖的jar包发生了变化

那么，原来下载的Shared Indexes就不再需要了，但是它们还是占用一定的硬盘空间，那么我们可以删掉这些已经下载的Shared Indexes。

我们选择`File | Invalidate Caches`，会弹出一个对话框，勾选`Clear downloaded shared indexes`选项，然后点击`Invalidate and Restart`按钮。

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/clear-downloaded-shared-indexes.png)
{: refdef}

## IntelliJ IDEA的索引原理

在IntelliJ IDEA当中进行索引，使用的是Trigram Indexes算法。
接下来，我们通过四个部分来看一下IntelliJ IDEA如何进行索引：

- 首先，我们看一个查找示例，让大家对IntelliJ IDEA的查找速度有一个直观的了解。
- 其次，Trigram Indexes是什么。
- 接着，IntelliJ IDEA如何建立（Building）Trigram Indexes的索引。
- 最后，IntelliJ IDEA如何使用（Using）Trigram Indexes的索引。

### 查找示例

在这里，我们举一个全文检索（Full Text Search）示例，目的就是让大家对于IntelliJ IDEA的查找速度有一个直观的了解。

这个示例，是由Jetbrains的工作人员来测试的，我们只是呈现一下结果，让大家有一个大体的印象。

实验对象：

- 源码：[IntelliJ IDEA Community](https://github.com/jetbrains/intellij-community)
- License: Apache-2.0 License
- 120k files / 4.5Gb total
- with 69k Java files, 7k Kotlin files consuming 212Mb

第一组测试，就是编写一个Kotlin程序，内容如下：

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/full-text-search-kotlin-files-walk.png)
{: refdef}


测试结果：

- takes 2.5 seconds on macOS
- takes 4 seconds on Windows

第二组测试，就是使用IntelliJ IDEA进行查找，示例如下：

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/full-text-search-intellij-idea.png)
{: refdef}

在Find in Files搜索框当中，刚输入完`Swapper`，相应的结果就直接显示出来了。

那么，引出一个问题就是，IntelliJ IDEA的查找为什么这么迅速呢？原因就是IntelliJ IDEA对这些内容建立了索引。

### Trigram Indexes是什么

Trigram Indexes就是将一个比较长的单词转换成"三个字符"为一组的形式：

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/trigram-indexes-qwerty.png)
{: refdef}

### 建立Trigram Indexes的索引

首先，从一个文件当中取出所有的单词，那么对每一个单词都分隔成"三个字符"为一组的形式。进一步理解，就是一个文件向"三个字符"的映射，这就是正向索引(forward index)。

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/trigram-indexes-building-forward-index.png)
{: refdef}

接着，我们建立倒排索引(inverted index)。也就是说，某一个特定的"三个字符"出现在哪些文件中。

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/trigram-indexes-building-inverted-index.png)
{: refdef}

最后，我们将"三个字符"的字符串以树（Tree）的形式存储到数据库当中；在树（Tree）结构的叶子节点上，存储的就是"三个字符"在哪些文件中出现，如下图所示：

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/trigram-indexes-building-tree-index.png)
{: refdef}


### 使用Trigram Indexes的索引

假设我们想要查找的字符串是`Swapper32`，它经历以下几个步骤：

- 第一步，将`Swapper32`拆分成`m`个"三个字符"的形式。
- 第二步，对每一个"三个字符"内容在database当中进行查找，会找到`m`个对应的文件集合。
- 第三步，求`m`个文件集合的交集，也就是`m`个"三个字符"都出现的文件的集合。
- 第四步，再进一步检查新这个文件集合当中是否包含`Swapper32`字符串。

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/trigram-indexes-example-02.png)
{: refdef}

## IntelliJ IDEA的索引应用

### 索引在哪些地方使用（Where）

Indexing in IntelliJ IDEA is responsible for the core features of the IDE:

- Find Usages
- Rename Refactorings，是在Find Usages的基础上实现
- Navigation
- Code Completion
- Inspections
- Syntax Highlighting

我们可以选择`Navigate | Search Everywhere`，或者按下两次`Shift`键，会弹出如下对话框：

- Classes: finds a class by name
- Files: finds any file or directory by name
- Symbols: finds a symbol. In IntelliJ IDEA, a **symbol** is any **code element** such as `method`, `field`, `class`, `constant`, and so on.
- Actions: finds an action by name. You can find any action even if it doesn't have a mapped shortcut or appear in the menu.

![](/assets/images/intellij/search-window-changing_scopes-animated.gif)

### 什么时候建立索引（When）

It starts when
- you open your project, （打开项目）
- switch between branches, （切换代码分支）
- after you load or unload plugins, and （加载或卸载插件）
- after large external file updates. （外部文件更新）

For example, this can happen if multiple files in your project are created or generated after you build your project.

![](/assets/images/intellij/indexing.png)

### 对哪些事物进行索引（What）

对于IntelliJ IDEA中的索引，它由两部分组成：

- local indexes，是对我们的项目代码进行索引
- shared indexes，是从Jetbrains Shared Indexes CDN上下载的索引（后续会提到）

在查找的过程中，IntelliJ IDEA会现时使用这两种索引（local indexes和shared indexes）。但是，我们现在只关注local indexes，也就是对我们的项目代码进行索引。

Indexing examines **the code of your project** to create a virtual map of **classes**, **methods**, **objects**, and **other code elements** that make up your application.
This is necessary to provide the coding assistance functionality, search, and navigation instantaneously.

After indexing, the IDE is aware of your code. That is why, actions like **finding usages** or **smart completion** are performed immediately.

### 索引数量

- IntelliJ IDEA Ultimate: 208 different indexes
- IntelliJ IDEA Community: 99 different indexes
- The actual number of indexes depends on the plugins you have
  - 使用的插件（plugins）越多，那么相应的indexes也越多
  - 对于平常用不到的插件（plugins），我们可以禁用掉

## Jetbrains的解决方案

### 原因分析

为什么要建立Shared Indexes呢？这里给出三个理由：

- Indexing can be slow
- Indexing is done per IDE （我们每一个开发人员，都有一个IntelliJ IDEA，每一个IDEA都要建立索引）
- We spend human years per week on indexing

### Public Shared Indexes

针对上面的问题，Jetbrains就想到了一个解决方法：将索引进行共享。那么，Jetbrains为社区（Community）提供了public shared indexes:

- For actual JDK releases
- For popular Maven Libraries
- For IntelliJ SDK based Gradle projects

### Distributing Shared Indexes

- IntelliJ uses a stateless protocol over HTTPS
  - to discover the best matching shared indexes
  - no need for the server-side logic
  - a downloaded shared index is cached at the IDE side
- Jetbrains has about 700Gb of data on the pulic CDN
  - constantly updating the data with newly build indexes
- The world-wide shared indexes download service

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/jetbrains-public-shared-indexes-cdn.png)
{: refdef}


## 参考资料

- [Youtube: Indexing, or How We Made Indexes Shared and Fast. By Eugene Petrenko](https://www.youtube.com/watch?v=xJKff0QUd3c&list=PLPZy-hmwOdEUdLO-AKiJJ7LuZ3p16zJ4x&index=7)
- [Google Docs: PPT](https://docs.google.com/presentation/d/19U0nacgfhVTIM4blYQR8RhjrttSywkOLcyiQOFHxWFw/edit?usp=sharing)
- [www.jetbrains.com: Project configuration/Indexing](https://www.jetbrains.com/help/idea/indexing.html)
- [www.jetbrains.com: Project configuration/Shared indexes](https://www.jetbrains.com/help/idea/shared-indexes.html)
- [blog.jetbrains.com: Shared Indexes Plugin Unveiled](https://blog.jetbrains.com/idea/2020/07/shared-indexes-plugin-unveiled/)

