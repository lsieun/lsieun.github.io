---
title: "文件上传错误"
sequence: "104"
---

错误信息如下：

```text
The field file exceeds its maximum permitted size of 1048576 bytes.
```

1024 x 1024 = 1048576

错误原因：Spring Boot 的默认上传文件的大小是 `1M`。如果上传的文件超过了 `1M`，就会出现这样的错误。

解决方法：在 `application.properties` 配置文件中设置上传的文件大小限制，即可解决

```text
# 上传文件总的最大值 
spring.servlet.multipart.max-request-size=50MB

# 单个文件的最大值 
spring.servlet.multipart.max-file-size=50MB
```
