---
title: "Win 10"
sequence: "102"
---

TestContainers是一个Java库，它能够在测试期间启动所依赖的Docker容器。在Win10环境下，使用TestContainers需要安装和配置Docker。

以下是在Win10环境中使用TestContainers的步骤：

## 安装 Docker 桌面版

在 Docker 官网下载并安装 Docker 桌面版，可以从以下链接下载：

```text
https://www.docker.com/products/docker-desktop
```

## 启动Docker

安装完成后，启动Docker桌面版。在启动后，Docker会自动启动。

## 导入所需的Docker镜像

TestContainers提供了各种Docker镜像，例如 MySQL，PostgreSQL，ElasticSearch 等。可以使用以下命令从 Docker Hub 导入这些镜像：

```text
docker pull mysql
docker pull postgresql
docker pull elasticsearch
```

根据测试需求导入所需的Docker镜像。

## 编写测试代码

使用TestContainers的步骤类似于使用JUnit或TestNG编写测试用例。首先，需要在测试类中添加@TestContainer注解，然后在测试方法中实例化所需的Docker容器。

例如，以下是使用MySQL容器在JUnit测试中进行数据库测试的示例代码：

```java
public class MySqlTest {
   @TestContainer
   public MySQLContainer mysql = new MySQLContainer<>("mysql:5.7")
           .withDatabaseName("test")
           .withUsername("test")
           .withPassword("test");

   @Test
   void testDatabaseConnection() {
       // 使用JDBC连接MySQL容器
       Connection conn = DriverManager.getConnection(mysql.getJdbcUrl(), mysql.getUsername(), mysql.getPassword());
       // ...
   }
}
```

在上述示例代码中，`@TestContainer` 注解告诉 TestContainers 在测试期间运行 MySQL 容器。
在 `testDatabaseConnection()` 方法中，可以使用JDBC连接到MySQL容器。

## 运行测试用例

编写完测试用例后，在IDE中使用JUnit或TestNG运行测试用例。TestContainers 将会在测试运行前启动 Docker 容器，在测试完成后关闭容器。

运行测试用例后，在Docker 桌面版中可以看到启动的 Docker 容器列表。如果测试用例运行成功，则意味着 TestContainers 已经成功启动了所需的 Docker 容器。


