---
title: "远程仓库镜像（Mirror）"
sequence: "103"
---

## Maven 配置

打开 Maven 的配置文件(windows机器一般在maven安装目录的conf/settings.xml)，
在 `<mirrors></mirrors>` 标签中添加 `mirror` 子节点:

```xml
<mirror>
    <id>aliyunmaven</id>
    <mirrorOf>*</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```


## Reference

- [阿里云 Maven 仓库介绍](https://developer.aliyun.com/mvn/guide)
- [Maven 镜像](https://developer.aliyun.com/mirror/maven/)
