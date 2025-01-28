---
title: "Shared indexes"
sequence: "202"
---

[UP](/ide/intellij-idea-index.html)


One of the possible ways of reducing the indexing time is by using shared indexes.
Unlike the regular indexes that are built locally,
shared indexes are generated once and are later reused on another computer whenever they are needed.

Using shared indexes is reasonable for large projects,
where indexing might take a lot of time, creating inconveniences for the teams involved.
For smaller projects, we recommend other ways of reducing the indexing time.

## shared indexes and local indexes

IntelliJ IDEA can connect to the dedicated resource
to download shared indexes for your JDK and Maven libraries and build shared indexes for your project's code.
Whenever IntelliJ IDEA needs to reindex your application,
it will use the available shared indexes and will build local indexes for the rest of the project.
Normally, this is faster than building local indexes for the entire application from scratch.

- shared indexes
  - Shared indexes for JDKs and Maven libraries
  - Shared project indexes
- local indexes

When you launch a project, IntelliJ IDEA processes local and shared indexes together at the same time.
This might increase CPU usage on your computer.
If you want to avoid this, enable the `Wait for shared indexes` option in `Settings/ Preferences | Tools | Shared Indexes`.

![](/assets/images/intellij/settings-tools-shared-indexes.png)



## Shared indexes for JDKs and Maven libraries

Indexes for JDKs and Maven libraries are built by JetBrains and stored
on the dedicated [CDN resource](https://index-cdn.jetbrains.com/?_ga=2.246546948.1061344926.1627717955-380037762.1608477184).
When you open a project, IntelliJ IDEA shows a notification prompting you to enable the automatic download.

![](/assets/images/intellij/download-pre-built-shared-indexes.png)

If you miss the notification, you can configure these options in the settings.

- In the `Settings/ Preferences` dialog, select `Tools | Shared Indexes`.
- Select the `Download automatically` option for JDKs and Maven libraries to allow IntelliJ IDEA to download the indexes silently whenever they are needed.
- Alternatively, select `Ask before download` if you prefer to confirm every download manually.

![](/assets/images/intellij/settings-tools-shared-indexes.png)

### 下载到哪里了

JDK indexes will be downloaded to `index/shared_indexes` in the IDE [system directory](https://www.jetbrains.com/help/idea/tuning-the-ide.html#system-directory).

```text
C:\Users\liusen\AppData\Local\JetBrains\IntelliJIdea2021.2\index\shared_indexes
```

After that, IntelliJ IDEA will be using the suitable indexes whenever they are needed.



### Remove the downloaded shared indexes

If you don't need the project indexes anymore (for example, if the project is no longer in development), you can remove them all together.
In this case, the IDE will remove the regular indexes and all the downloaded shared indexes for the project and the JDK.

From the main menu, select `File | Invalidate Caches`.

In the dialog that opens, select `Clear downloaded shared indexes` and click `Invalidate and Restart`.

![](/assets/images/intellij/clear-downloaded-shared-indexes.png)

## shared project indexes

To be able to use shared project indexes, the `Shared Project Indexes` bundled plugin must be enabled in the settings.

具体内容可以参考[Shared project indexes](https://www.jetbrains.com/help/idea/shared-indexes.html#project-shared-indexes)。



## References

- [www.jetbrains.com: Project configuration/Indexing](https://www.jetbrains.com/help/idea/indexing.html)
- [www.jetbrains.com: Project configuration/Shared indexes](https://www.jetbrains.com/help/idea/shared-indexes.html)
- [blog.jetbrains.com: Shared Indexes Plugin Unveiled](https://blog.jetbrains.com/idea/2020/07/shared-indexes-plugin-unveiled/)
