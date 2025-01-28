---
title: "Request Data"
sequence: "113"
---

## 乱码

乱码（unreadable code）分成两种情况：

- GET请求乱码
- POST请求乱码

## GET乱码

### index.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>首页</title>
</head>
<body>

<h1>你好啊</h1>

<form th:action="@{/hello/world}" method="post">
    <table>
        <tr>
            <td><label for="user-name-input">用户名：</label></td>
            <td><input id="user-name-input" name="username" type="text" value="张三"/></td>
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
                <input type="submit" value="提交">
            </td>
        </tr>
    </table>
</form>

</body>
</html>
```

### HelloController

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Formatter;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping(value = "/world")
    public String world(String username, String password, String gender) {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("username: %s%n", username);
        fm.format("password: %s%n", password);
        fm.format("  gender: %s%n", gender);
        System.out.println(sb);

        return "success";
    }

}
```

### 解决

GET的乱码是由Tomcat造成的

在Tomcat 8版本下，没有出现乱码的情况。



文件路径：`TOMCAT/conf/server.xml`

修改前：

```text
<Connector port="8080" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443" />
```

修改后：（添加`URIEncoding="UTF-8"`）

```text
<Connector port="8080" URIEncoding="UTF-8" protocol="HTTP/1.1"
           connectionTimeout="20000"
           redirectPort="8443" />
```

## POST乱码

```text
<filter>
    <filter-name>CharacterEncodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>UTF-8</param-value>
    </init-param>
    <init-param>
        <param-name>forceEncoding</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>CharacterEncodingFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```

