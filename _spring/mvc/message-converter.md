---
title: "HttpMessageConverter"
sequence: "115"
---

## HttpMessageConverter

HttpMessageConverter：将请求报文转换成Java对象，或将Java对象转换为响应报文。

HttpMessageConverter提供了两个注解和两个类型：`@RequestBody`、`@ResponseBody`、`RequestEntity`、`ResponseEntity`。



```text
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.13.1</version>
</dependency>
```

