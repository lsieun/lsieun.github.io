---
title: "文件上传和下载"
sequence: "115"
---

## 文件上传

### 前端-HTML

编写前端页面`index.html`：

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
<form th:action="@{/hello/world}" enctype="multipart/form-data" method="post">
    <table>
        <tr>
            <td>上传文件：</td>
            <td>
                <input type="file" name="myfile"/>
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

### 后端-POM

```text
<dependency>
    <groupId>commons-fileupload</groupId>
    <artifactId>commons-fileupload</artifactId>
    <version>1.4</version>
</dependency>
```

### 后端-Spring Config

在Spring的配置文件中，添加`CommonsMultipartResolver`：

```text
<!-- 配置文件上传解析器，将上传的文件封装为MultipartFile -->
<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver"/>
```

注意：此处一定要命令成`multipartResolver`，否则找不到这个Bean，从而不能进一步转换成`MultipartFile`。

在`DispatcherServlet`类当中，定义了一个`MULTIPART_RESOLVER_BEAN_NAME`，其值为`multipartResolver`：

```java
public class DispatcherServlet extends FrameworkServlet {
    public static final String MULTIPART_RESOLVER_BEAN_NAME = "multipartResolver";
}
```

### 后端-Controller

#### 两个名字

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/hello")
public class HelloController {
    @RequestMapping("/world")
    public String world(MultipartFile myfile) {
        System.out.println(myfile.getName());
        System.out.println(myfile.getOriginalFilename());
        return "success";
    }
}
```

#### 存储

将文件存储到某个目录：

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.io.IOException;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping("/world")
    public String world(MultipartFile myfile, HttpSession session) throws IOException {
        // 第一步，获取ServletContext
        ServletContext servletContext = session.getServletContext();

        // 第二步，根据ServletContext获取文件上传目录
        String dirPath = servletContext.getRealPath("upload");
        System.out.println(dirPath);
        File dirFile = new File(dirPath);
        if (!dirFile.exists()) {
            boolean flag = dirFile.mkdirs();
            assert flag : "create dir failed: " + dirPath;
        }

        // 第三步，将上传的文件进行存储
        if (myfile.isEmpty()) return "fail";
        String filepath = dirPath + File.separator + myfile.getOriginalFilename();
        myfile.transferTo(new File(filepath));

        // 第四步，返回成功
        return "success";
    }

}
```

## 错误处理

### 空指针异常

第一种情况：bean的ID没有配置正确

```text
<bean id="multipartResolver" class="org.springframework.web.multipart.commons.CommonsMultipartResolver"/>
```

第二种情况：表单中名字与Controller当中的名字不匹配。下面的两个名字是统一的，都叫`myfile`。

```text
<input type="file" name="myfile"/>
```

```text
public String world(MultipartFile myfile)
```

### 中文名乱码

如果文件名有中文字符，上传到服务器之后，看到乱码的情况。

解决方法：在`web.xml`文件中配置`CharacterEncodingFilter`。

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

