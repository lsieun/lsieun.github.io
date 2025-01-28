---
title: "文件下载"
sequence: "103"
---

## HttpServletResponse

```java
package lsieun.boot.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/file")
public class FileController {
    @GetMapping("/download")
    public void download(@RequestParam(required = false) String someValue, HttpServletResponse response) throws IOException {
        System.out.println("someValue: " + someValue);

        // 第一步，读取文件
        File file = new File("D:/tmp/my.png");
        Path path = file.toPath();
        byte[] bytes = Files.readAllBytes(path);

        // 第二步，响应Header
        String filename = URLEncoder.encode("一张图片.png", StandardCharsets.UTF_8);
        System.out.println("filename: " + filename);
        response.addHeader("Content-Disposition", "attachment; filename=" + filename);
        response.setContentType("application/octet-stream");

        // 第三步，响应Body
        ServletOutputStream os = response.getOutputStream();
        os.write(bytes);
        os.flush();
        os.close();
    }
}
```

访问地址：

```text
http://localhost:8080/file/download?someValue=abc
```

## ResponseEntity

```java
package lsieun.boot.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/file")
public class FileController {

    @GetMapping("/fetch/{fileName:.+}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String fileName) throws IOException {
        // 第一步，读取文件
        File file = new File("D:/tmp/my.png");
        Path path = file.toPath();
        byte[] bytes = Files.readAllBytes(path);
        String encodedName = URLEncoder.encode(fileName, StandardCharsets.UTF_8);
        System.out.println("filename: " + encodedName);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + encodedName)
                .body(bytes);
    }
}
```

访问地址：

```text
http://localhost:8080/file/fetch/来张图片.png
```

## 常见异常和问题

### 响应对象无需通过return返回

原因： 响应对象是可以不用作为方法返回值返回的，其在方法执行时已经开始输出，且其无法与@RestController配合，以JSON格式返回给前端

### 返回前端的文件名必须进行URL编码

原因： 网络传输只能传输特定的几十个字符，需要将汉字、特殊字符等经过Base64等编码来转化为特定字符，从而进行传输，而不会乱码
