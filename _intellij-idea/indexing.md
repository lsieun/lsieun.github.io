---
title:  "Indexing"
sequence: "201"
---

## 问题思考

在这里，我们拿出几个IntelliJ IDEA的常用功能，对它们可能的实现原理进行思考；或者说，如果让我们来实现这些功能，要怎么实现呢？从文章主题的角度来讲，这几个常用功能都是要落脚于“索引”（indexing）。

### Find Usages

在类名、方法名、字段名，我们可以使用鼠标右键点击，然后选择`Find Usages`，就可以查看该条目在哪些地方使用到了。那么，我们思考一下：Find Usages是如何实现的呢？

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/how-may-find-usages-work.png)
{: refdef}

### Rename Refactoring

Use the Rename refactoring to change **names of symbols, files, directories, packages, modules** and **all the references to them** throughout code. ([Link][idea-rename-refactorings])

- Renaming **local variables** or **private methods** can be done easily inline since only the limited scope is affected.
- Renaming **classes** or **public methods** could potentially impact a lot of files. Preview potential changes before you refactor.

在类名、方法名、字段名，我们可以使用鼠标右键点击，然后选择`Refactor | Rename...`，将该条目进行重新命名，那么所有使用到该条目的地方也会更新为新的名字。那么，我们思考一下：Rename Refactoring是如何实现的呢？

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/how-may-rename-refactoring-work.png)
{: refdef}

### Code Inspections

In IntelliJ IDEA, **there is a set of code inspections that detect and correct anomalous code in your project before you compile it.** The IDE can find and highlight various problems, locate dead code, find probable bugs, spelling problems, and improve the overall code structure. ([Link][idea-code-inspection])

假如我们写一个`HelloWorld`类，而且并没有定义`Swapper32`类，这个时候就会出现错误提供。那么，我们思考一下：Code Inspections是如何实现的呢？

```java
import java.util.Arrays;

public class HelloWorld {
    public static void main(String[] args) {
        for (int i = 0; i < args.length; i--) {
            for (int j = i + 1; j > args.length; j++) {
                if (args[i].length() > args[j].length()) {
                    Swapper32.swap(args, i, j);
                }
            }
        }

        Arrays.stream(args).forEach(System.out::println);
    }
}
```

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/can-not-resolve-symbol-swapper32.png)
{: refdef}

### Full Text Search

## Trigrams

In computer science, an **inverted index** is a database index storing a mapping from content, such as words or numbers, to its locations in a table, or in a document or a set of documents. The purpose of an inverted index is to allow fast full-text searches, at a cost of increased processing when a document is added to the database.

## Indexing

### Where Use Indexing

Indexing in IntelliJ IDEA is responsible for the core features of the IDE:

- code completion
- inspections
- finding usages
- navigation
- syntax highlighting
- refactorings

### When

It starts when
- you open your project, （打开项目）
- switch between branches, （切换代码分支）
- after you load or unload plugins, and （加载或卸载插件）
- after large external file updates. （外部文件更新）

For example, this can happen if multiple files in your project are created or generated after you build your project.

{:refdef: style="text-align: center;"}
![](/assets/images/intellij/indexing.png)
{: refdef}

### 对哪些事物进行索引

Indexing examines the code of your project to create a virtual map of **classes**, **methods**, **objects**, and **other code elements** that make up your application.
This is necessary to provide the coding assistance functionality, search, and navigation instantaneously.

After indexing, the IDE is aware of your code. That is why, actions like **finding usages** or **smart completion** are performed immediately.

### in progress

While indexing is in progress, the above-mentioned coding assistance features are unavailable or partially available.
Nevertheless, you can still work with the IDE: you can type code, work with VCS features, configure settings, and perform other code unrelated actions.

## Time for Indexing

The amount of time required for indexing vary depending on your project: the more complex your project is, the more files it comprises, the more time it takes to index it. You can decrease the indexing time by excluding files and folders and by unloading modules.

Note that if indexing is already in progress, you cannot speed it up. Wait for the process to finish and then you can temporarily simplify your project. The next time, indexing will finish sooner.

There are several ways of making indexing faster:

- Use shared indexes
- Exclude files and folders
- Unload modules

### Exclude files and folders

**Marking dynamically generated files as excluded can speed up the indexing and overall IDE performance**.
For example, it's recommended that you exclude compilation output folders.
Excluded files remain a part of a project, but are ignored by code completion, navigation, indexing, and inspections.

- To exclude a file, right-click it in the `Project` tool window and select `Override File Type | Plain text`. Plain text files are marked with the ![Plain text](/assets/images/intellij/icons.fileTypes.text.svg) icon.
- To exclude a folder, right-click it in the `Project` tool window and select `Mark Directory as | Excluded`. Excluded folders are marked with the ![the Excluded root icon](/assets/images/intellij/icons.modules.excludeRoot.svg) icon.

### Unload modules

If indexing takes a significant amount of time, then it's likely that your project has more than two modules.
Normally, you don't need all of them at same time.

If this is the case, you can temporarily set aside (unload) the modules that you don't need right now.
The IDE ignores the unloaded modules when you search through or refactor your code, compile, or index your project.

To unload a module, right-click it in the `Project` tool window and select `Load/Unload Modules`.

## Shared indexes

## References

- Indexing, or How We Made Indexes Shared and Fast. By Eugene Petrenko: [Youtube](https://www.youtube.com/watch?v=xJKff0QUd3c&list=PLPZy-hmwOdEUdLO-AKiJJ7LuZ3p16zJ4x&index=7) / [PPT](https://docs.google.com/presentation/d/19U0nacgfhVTIM4blYQR8RhjrttSywkOLcyiQOFHxWFw/edit?usp=sharing)

[idea-code-inspection]: https://www.jetbrains.com/help/idea/code-inspection.html
[idea-rename-refactorings]: https://www.jetbrains.com/help/idea/rename-refactorings.html