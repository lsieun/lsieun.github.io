---
title: "Wrapper 包装器"
sequence: "106"
---

Gradle Wrapper 实际上就是对 Gradle 的一层包装，用于解决实际开发中可能会遇到的不同的项目需要不同版本的 Gradle 问题。
例如：把自己的代码共享给其他人使用，可能出现如下情况：

- 对方电脑没有安装 gradle
- 对方电脑安装过 gradle，但是版本太旧了

这时候，我们就可以考虑使用 Gradle Wrapper 了。这也是官方建议使用 Gradle Wrapper 的原因。
实际上有了 Gradle Wrapper 之后，我们本地是可以不配置 Gradle 的，下载 Gradle 项目后，使用 gradle 项目自带的 wrapper 操作也是可以的。

问题：如何使用 Gradle Wrapper 呢？

项目中的 gradlew、gradlew.cmd 脚本用的就是 wrapper 中规定的 gradle 版本。
而我们上面提到的 gradle 指令用的是本地 gradle，所以 gradle 指令和 gradlew 指令所使用的 gradle 版本有可能是不一样的。

gradlew、gradlew.cmd 的使用方式与 gradle 使用方式完全一致，只不过把 `gradle` 指令换成了 `gradlew` 指令。
当然，我们也可在终端执行 gradlew 指令时，指定指定一些参数，来控制 Wrapper 的生成，比如依赖的版本等，如下：

- `--gradle-version`：用于指定使用的 Gradle 版本
- `--gradle-distribution-url`：用于指定下载 Gradle 发行版的 URL 地址

具体操作如下所示：

- `gradle wrapper --gradle-version=4.4`：升级 wrapper 版本号，只是修改 `gradle.properties` 中 wrapper 版本，未实际下载
- `gradle wrapper --gradle-version 5.2.1 --distribution-type all`：关联源码用

GradleWrapper 的执行流程：

- 当我们第一次执行 `./gradlew build` 命令的时候，`gradlew` 会读取 `gradle-wrapper.properties` 文件的配置信息
- 准确的将指定版本的 `gradle` 下载并解压到指定的位置(`GRADLE_USER_HOME` 目录下的 `wrapper/dists` 目录中)
- 并构建本地缓存(`GRADLE_USER_HOME` 目录下的 `caches` 目录中)，下载再使用相同版本的 `gradle` 就不用下载了
- 之后执行的 `./gradlew` 所有命令都是使用指定的 `gradle` 版本。

如下图所示：

![](/assets/images/gradle/gradle-wrapper-dist.jpeg)

`gradle-wrapper.properties` 文件解读:

- `distributionBase`：下载的 Gradle 压缩包解压后存储的主目录
- `distributionPath`： 相对于 `distributionBase` 的解压后的 Gradle 压缩包的路径
- `zipStoreBase`：同 `distributionBase`，只不过是存放 zip 压缩包的
- `zipStorePath`：同 `distributionPath`，只不过是存放 zip 压缩包的
- `distributionUrl`：Gradle 发行版压缩包的下载地址

注意：前面提到的 `GRADLE_USER_HOME` 环境变量用于这里的 Gradle Wrapper 下载的特定版本的 gradle 存储目录。
如果我们没有配置过 `GRADLE_USER_HOME` 环境变量，默认在当前用户家目录下的.gradle 文件夹中。

那什么时候选择使用 gradle wrapper、什么时候选择使用本地 gradle?
下载别人的项目或者使用操作以前自己写的不同版本的 gradle 项目时：用 Gradle wrapper，也即：gradlew
什么时候使用本地 gradle? 新建一个项目时： 使用 gradle 指令即可。
