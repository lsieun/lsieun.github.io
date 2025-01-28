---
title: "概览"
sequence: "101"
---

## 概览

- 考虑的问题
  - [ ] 上传
    - [ ] 上传文件的大小
  - [ ] 下载
    - [ ] 下载的文件名，包含中文

## Spring Boot File Upload Configuration

Below are the multipart configurations required in `application.properties`
to enable file uploading in a Spring Boot app.

```text
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=15MB
```

- `max-file-size` - It specifies the maximum size permitted for uploaded files. The default is 1MB.
- `max-request-size` - It specifies the maximum size allowed for multipart/form-data requests. The default is 10MB.
- `spring.servlet.multipart.enabled` - Whether to enable support of multipart uploads.

org.springframework.boot.autoconfigure.web.servlet.MultipartProperties

```java
@ConfigurationProperties(prefix = "spring.servlet.multipart", ignoreUnknownFields = false)
public class MultipartProperties {
    // ...
}
```

## Reference

视频：

- [SpringBoot实现文件上传](https://www.bilibili.com/video/BV1sB4y1C7b9)
- [SpringBoot实现文件下载](https://www.bilibili.com/video/BV1FY4y1P7sU)
- [spring boot上传文件直接存到mysql中](https://www.bilibili.com/video/BV1e44y1M7HD/)

文章：

- [Uploading and Downloading Files with Spring Boot](https://www.devglan.com/spring-boot/spring-boot-file-upload-download)
- [SpringBoot实现文件下载的几种方式](https://blog.csdn.net/user2025/article/details/107300831)
- [Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition)
