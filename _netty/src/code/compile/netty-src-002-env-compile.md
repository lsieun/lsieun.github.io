---
title: "Netty 源码编译"
sequence: "102"
---

[UP](/netty.html)

## 下载

```text
https://github.com/netty/netty/tags
```

![](/assets/images/netty/env/netty-github-download-src.png)

## 编译

### 解压

第 1 步，解压之后，删除其中 `testsuite` 相关的文件夹：

![](/assets/images/netty/env/netty-src-env-delete-testsuite.png)

### 编译

第 1 步，使用 IDEA 打开 `netty-netty-4.1.108.Final` 目录

第 2 步，修改项目根目录下的 `pom.xml` 文件的编译版本：

修改前：

```xml
<properties>
    <maven.compiler.source>1.6</maven.compiler.source>
    <maven.compiler.target>1.6</maven.compiler.target>
</properties>
```

修改后：

```xml
<properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
</properties>
```

第 3 步，删除 `pom.xml` 中 `testsuite` 相关的 module：

```xml
<modules>
    <module>testsuite</module>
    <module>testsuite-autobahn</module>
    <module>testsuite-http2</module>
    <module>testsuite-osgi</module>
    <module>testsuite-shading</module>
    <module>testsuite-native</module>
    <module>testsuite-native-image</module>
    <module>testsuite-native-image-client</module>
    <module>testsuite-native-image-client-runtime-init</module>
</modules>
```

第 4 步，编译：

```text
mvn clean compile -Dmaven.test.skip=true -Dcheckstyle.skip=true
```

