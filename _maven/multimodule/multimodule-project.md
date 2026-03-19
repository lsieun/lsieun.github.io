---
title: "Multimodule Project"
sequence: "101"
---

[UP](/maven/index.html)

## 项目结构

Multimodule Project Structure

```text
Parent Project
├─── Module 1
│    └─── pom.xml
├─── Module 2
│    └─── pom.xml
├─── Module 3
│    └─── pom.xml
└─── pom.xml
```

## 执行命令

```text
project-parent
├─── project-child-first
│    └─── pom.xml
├─── project-child-second
│    └─── pom.xml
├─── project-child-third
│    └─── pom.xml
└─── pom.xml
```

**建议**：
在 IDEA 中开发时，通常先对父项目执行一次 `mvn install`，
这样能确保所有子模块的依赖关系在本地仓库中都已就绪。

`-pl` or `--projects`: This is a comma-separated list of projects to be built.

```text
mvn clean package –pl project-child-first
```

- `-am` or `--also-make`: This builds projects required by the list if the project list is specified:

```text
mvn clean package –pl project-child-second –am
```

- `-amd` or `--also-make-dependants`: This builds projects that depend
  on projects on the list (if project list is specified):

```text
mvn clean package –pl project-child-second –amd
```

- `-rf` or `--resume-from`: This resumes build from a specific project
  (useful in the case of failures in a multi-module build):

```text
mvn clean package –rf project-child-second
```


### 只编译相关的项目

场景描述：

- `project-child-second` 依赖于 `project-child-first`
- 不想处理 `project-child-third`

如果只想处理这两个相关的子项目，可以在根目录（`project-parent`）运行：

```text
mvn compile -pl project-child-second -am
```

参数：

- `-pl` or `--projects` (project list): 指定目标项目。
- `-am` or `--also-make` (also make): 自动发现并构建目标项目所依赖的所有模块。

查看帮助：

```text
mvn compile --help
```



