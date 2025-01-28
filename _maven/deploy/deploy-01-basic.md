---
title: "Deploy Intro"
sequence: "101"
---

[UP](/maven-index.html)


## 权限

### Nexus 3

```text
nx-repository-admin-maven2-maven-releases-*
nx-repository-admin-maven2-maven-snapshots-*
nx-repository-view-maven2-maven-releases-*
nx-repository-view-maven2-maven-snapshots-*
```

### Nexus 2

```text
All M2 Repositories - (create)
All M2 Repositories - (delete)
All M2 Repositories - (read)
All M2 Repositories - (update)
```

## snapshot

### pom.xml

```xml
<distributionManagement>
    <snapshotRepository>
        <id>nexus-snapshots</id>
        <name>Nexus Snapshot Repository</name>
        <url>http://192.168.1.22:8081/repository/maven-snapshots/</url>
    </snapshotRepository>
</distributionManagement>
```

### settings.xml

```xml
<server>
    <id>nexus-snapshots</id>
    <username>admin</username>
    <password>123456</password>
</server>
```

### deploy

```text
mvn clean deploy '-Dmaven.test.skip=true'

mvn clean deploy -DskipTests
```

## release

### pom.xml

```xml
<distributionManagement>
    <repository>
        <id>nexus-releases</id>
        <name>Nexus Release Repository</name>
        <url>http://192.168.1.22:8081/repository/maven-releases/</url>
    </repository>
</distributionManagement>
```

### settings.xml

```xml
<server>
    <id>nexus-releases</id>
    <username>admin</username>
    <password>123456</password>
</server>
```

### deploy

```text
mvn clean deploy '-Dmaven.test.skip=true'

mvn clean deploy -DskipTests
```

## snapshot + release

### pom.xml

```xml
<distributionManagement>
    <repository>
        <id>nexus-releases</id>
        <name>Nexus Release Repository</name>
        <url>http://192.168.1.22:8081/repository/maven-releases/</url>
    </repository>
    <snapshotRepository>
        <id>nexus-snapshots</id>
        <name>Nexus Snapshot Repository</name>
        <url>http://192.168.1.22:8081/repository/maven-snapshots/</url>
    </snapshotRepository>
</distributionManagement>
```

### settings.xml

```xml
<servers>
    <server>
        <id>nexus-releases</id>
        <username>admin</username>
        <password>123456</password>
    </server>
    <server>
        <id>nexus-snapshots</id>
        <username>admin</username>
        <password>123456</password>
    </server>
</servers>
```

### deploy

如果使用 `cmd` 命令，使用：

```text
mvn clean deploy -Dmaven.test.skip=true
```

如果使用 `PowerShell`，则需要带引号：

```text
mvn clean deploy '-Dmaven.test.skip=true'
# 或者
mvn clean deploy "-Dmaven.test.skip=true"
```

不管是使用 `cmd`，还是使用 `PowerShell`，都可以使用如下命令：

```text
mvn clean deploy -DskipTests
```
