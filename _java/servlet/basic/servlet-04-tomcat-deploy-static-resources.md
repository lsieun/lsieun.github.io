---
title: "Tomcat项目部署：静态资源"
sequence: "104"
---

Tomcat是Web服务器，我们的项目应用是部署在`webapps`下，然后通过特定的URL访问。

## 创建项目

在`webapps`中建立文件夹（项目应用），比如`myweb`：

- 创建`WEB-INF`文件夹，用于存放项目的核心内容
    - 创建`classes`夹，用于存放`.class`文件
    - 创建`lib`文件夹，用于存放jar文件
    - 创建`web.xml`，项目配置文件（到`ROOT`项目下的`WEB-INF`复制即可）
- 把网页`hello.html`复制到`myweb`文件夹中，与`WEB-INF`在同组目录

```text
myweb
├─── hello.html
├─── images
│    └─── abc.jpg
└─── WEB-INF
     ├─── classes
     ├─── lib
     └─── web.xml
```

File: `web.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                      http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
  version="3.1"
  metadata-complete="true">

  <display-name>Welcome to Tomcat</display-name>
  <description>
     Welcome to Tomcat
  </description>

</web-app>
```

## URL访问资源

浏览器地址中输入URL：

```text
http://localhost:8080/myweb/hello.html
```

URL主要有4部分组成：协议、主机、端口和资源路径。


