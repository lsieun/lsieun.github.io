---
title: "Spring MVC基础模板"
sequence: "101"
---

目录结构：

```text
learn-spring-mvc
├─── pom.xml
└─── src
     └─── main
          ├─── java
          │    └─── lsieun
          │         └─── mvc
          │              └─── controller
          │                   ├─── HelloController.java
          │                   └─── WelcomeController.java
          ├─── resources
          │    └─── spring-mvc.xml
          └─── webapp
               └─── WEB-INF
                    ├─── templates
                    │    ├─── fail.html
                    │    ├─── index.html
                    │    └─── success.html
                    └─── web.xml
```

## Maven: pom.xml

注意，`<packaging>`的类型是`war`：

```text
<packaging>war</packaging>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>learn-spring-mvc</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <spring.version>5.3.15</spring.version>
    </properties>

    <dependencies>
        <!-- Spring MVC -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>

        <!-- Servlet API-->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.1.0</version>
            <scope>provided</scope>
        </dependency>

        <!-- Spring5+Thymeleaf -->
        <dependency>
            <groupId>org.thymeleaf</groupId>
            <artifactId>thymeleaf-spring5</artifactId>
            <version>3.0.14.RELEASE</version>
        </dependency>

        <!-- Log -->
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>1.2.10</version>
        </dependency>
    </dependencies>

</project>
```

## WEB: web.xml

在IDEA当中，`File ---> Project Structure...`，添加`web.xml`文件：

![](/assets/images/spring/mvc/project-structure-modules-web-framework-web-xml.png)

文件路径：`src/main/webapp/WEB-INF/web.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <servlet>
        <servlet-name>SpringMVC</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath:spring-mvc.xml</param-value>
        </init-param>
        <load-on-startup>1</load-on-startup>
    </servlet>
    <servlet-mapping>
        <servlet-name>SpringMVC</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

## Spring: spring-mvc.xml

文件路径：`src/main/resources/spring-mvc.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
                           http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context
                           https://www.springframework.org/schema/context/spring-context.xsd">
    <!-- 自动扫描包 -->
    <context:component-scan base-package="lsieun.mvc.controller"/>

    <!-- 配置Thymeleaf视图解析器 -->
    <bean id="viewResolver" class="org.thymeleaf.spring5.view.ThymeleafViewResolver">
        <property name="order" value="1"/>
        <property name="characterEncoding" value="UTF-8"/>
        <property name="templateEngine">
            <bean class="org.thymeleaf.spring5.SpringTemplateEngine">
                <property name="templateResolver">
                    <bean class="org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver">
                        <!-- 视图前缀 -->
                        <property name="prefix" value="/WEB-INF/templates/"/>

                        <!-- 视频后缀 -->
                        <property name="suffix" value=".html"/>
                        <property name="templateMode" value="HTML5"/>
                        <property name="characterEncoding" value="UTF-8"/>
                    </bean>
                </property>
            </bean>
        </property>
    </bean>
</beans>
```

## Controller

文件目录：`src/main/java/lsieun/mvc/controller/`

### WelcomeController

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WelcomeController {

    @RequestMapping("/")
    public String greeting() {
        return "index";
    }

}
```

### HelloController

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping("/world")
    public String world() {
        long val = System.currentTimeMillis() % 2;
        return val == 1 ? "success" : "fail";
    }

}
```

## HTML

文件目录：`src/main/webapp/WEB-INF/templates/`

### index.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
    <style>
        table, table tr th, table tr td {
            border: 1px solid #ccc;
        }

        table {
            border-collapse: collapse;
            vertical-align: middle;
            text-align: center;
        }
    </style>
</head>
<body>

<h1>首页</h1>
<form th:action="@{/hello/world}" method="post">
    <table>
        <tr>
            <td><label for="user-name-input">用户名：</label></td>
            <td><input id="user-name-input" name="username" type="text" value="刘森"/></td>
        </tr>
        <tr>
            <td><label for="password-input">密码：</label></td>
            <td><input id="password-input" name="password" type="password" value="123456"/></td>
        </tr>
        <tr>
            <td><label>性别：</label></td>
            <td>
                <input id="gender-male" name="gender" type="radio" value="男" checked="checked"><label for="gender-male">男</label>
                <input id="gender-female" name="gender" type="radio" value="女"><label for="gender-female">女</label>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <input type="submit" value="提交"/>
                <input type="reset" value="重置"/>
            </td>
        </tr>
    </table>
</form>

</body>
</html>
```

### success.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>SUCCESS</title>
</head>
<body>

<h1>成功了</h1>

</body>
</html>
```

### fail.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>FAIL</title>
</head>
<body>

<h1>失败了</h1>

</body>
</html>
```

## 部署

- Deployment
  - Artifact: `learn-spring-mvc:war exploded`
  - Application Context: `/portal`
- Server
  - URL: `http://localhost:8080/portal/`
  - On 'Update' action: `Redeploy`

![](/assets/images/spring/mvc/tomcat-deploy-spring-mvc.gif)
