---
title: "Maven Repo"
sequence: "maven"
---

## 阿里云 Maven

```text
https://developer.aliyun.com/mvn/guide
```

- central: https://maven.aliyun.com/repository/central
- public: https://maven.aliyun.com/repository/public
- gradle-plugin: https://maven.aliyun.com/repository/gradle-plugin
- apache snapshots: https://maven.aliyun.com/repository/apache-snapshots

## Nexus 配置

### 配置 Maven Proxy 仓库

第 1 步，添加一个 Maven Proxy 仓库：

![](/assets/images/nexus3/maven/maven-repo-001-create-maven-proxy-repo.png)

第 2 步，将 `maven-proxy-aliyun` 添加到 `maven-public` 仓库：

![](/assets/images/nexus3/maven/maven-repo-002-add-proxy-aliyun.png)

## Maven 配置

使用 IP 地址：

```xml
<mirror>
    <id>nexus-private</id>
    <name>Nexus Private Repo</name>
    <mirrorOf>*</mirrorOf>
    <url>http://192.168.1.22:8081/repository/maven-public/</url>
</mirror>
```

使用域名：

```xml
<mirror>
    <id>nexus-private</id>
    <name>Nexus Private Repo</name>
    <mirrorOf>*</mirrorOf>
    <url>https://nexus.lsieun.cn/repository/maven-public</url>
</mirror>
```


