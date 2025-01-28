---
title: "修改 Maven 下载源"
sequence: "105"
---

Gradle 自带的 Maven 源地址是国外的，该 Maven 源在国内的访问速度是很慢的，除非使用了特别的手段。
一般情况下，我们建议使用国内的第三方开放的 Maven 源或企业内部自建 Maven 源。

## 认识 init.d 文件夹

我们可以在 gradle 的 `init.d` 目录下创建以 `.gradle` 结尾的文件，`.gradle` 文件可以实现在 build 开始之前执行，
所以我们可以在这个文件配置一些你想预先加载的操作。

### init.gradle

在 `init.d` 文件夹创建 `init.gradle` 文件

```groovy
allprojects {
    repositories {
        mavenLocal()
        maven { name "Nexus"; url "https://nexus.lsieun.cn/repository/maven-public/" }
        maven { name "Alibaba"; url "https://maven.aliyun.com/repository/public" }
        mavenCentral()
    }

    buildscript {
        repositories {
            maven { name "Nexus"; url 'https://nexus.lsieun.cn/repository/maven-public/' }
            maven { name "Alibaba"; url 'https://maven.aliyun.com/repository/public' }
            maven { name "M2"; url 'https://plugins.gradle.org/m2/' }
        }
    }
}
```

拓展 1：启用 init.gradle 文件的方法有：

第 1 种方式，在命令行指定文件,例如：`gradle --init-script yourdir/init.gradle -q taskName`。
你可以多次输入此命令来指定多个 init 文件

第 2 种方式，把 `init.gradle` 文件放到 `USER_HOME/.gradle/` 目录下

第 3 种方式，把以 `.gradle` 结尾的文件放到 `USER_HOME/.gradle/init.d/` 目录下

第 4 种方式，把以 `.gradle` 结尾的文件放到 `GRADLE_HOME/init.d/` 目录下

如果存在上面的 4 种方式的 2 种以上，gradle 会按上面的 1-4 序号依次执行这些文件；
如果给定目录下存在多个 init 脚本，会按拼音 a-z 顺序执行这些脚本，每个 init 脚本都存在一个对应的 gradle 实例，
你在这个文件中调用的所有方法和属性，都会委托给这个 gradle 实例，每个 init 脚本都实现了 Script 接口。

拓展 2：仓库地址说明

`mavenLocal()`: 指定使用 maven 本地仓库，而本地仓库在配置 maven 时 settings 文件指定的仓库位置。如 E:/repository，gradle 查找 jar 包顺序如下：

```text
USER_HOME/.m2/settings.xml >> M2_HOME/conf/settings.xml >> USER_HOME/.m2/repository
```

`maven { url 地址}`，指定 maven 仓库，一般用私有仓库地址或其它的第三方库【比如阿里镜像仓库地址】。

`mavenCentral()`：这是 Maven 的中央仓库，无需配置，直接声明就可以使用。

总之，gradle 可以通过指定仓库地址为本地 maven 仓库地址和远程仓库地址相结合的方式，避免每次都会去远程仓库下载依赖库。
这种方式也有一定的问题，如果本地 maven 仓库有这个依赖，就会从直接加载本地依赖，如果本地仓库没有该依赖，那么还是会从远程下载。
但是下载的 jar 不是存储在本地 maven 仓库中，而是放在自己的缓存目录中，默认在 `USER_HOME/.gradle/caches` 目录
当然如果我们配置过 `GRADLE_USER_HOME` 环境变量，则会放在 `GRADLE_USER_HOME/caches` 目录,那么可不可以将 gradle caches 指向 maven repository。
我们说这是不行的，caches 下载文件不是按照 maven 仓库中存放的方式。

拓展 3：阿里云仓库地址请参考：https://developer.aliyun.com/mvn/guide
