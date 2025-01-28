---
title: "Spring Boot Web Advice"
sequence: "102"
---

- `org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdvice`
- `org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice`
- `org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor`
  - resolveArgument()
  - readWithMessageConverters
- `org.springframework.web.servlet.mvc.method.annotation.AbstractMessageConverterMethodArgumentResolver`
  - readWithMessageConverters
- `org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyAdviceChain`
  - requestBodyAdvice
  - responseBodyAdvice
  - beforeBodyRead()
  - afterBodyRead()
  - beforeBodyWrite()


## Reference

- [SpringBoot初体验之统一响应和异常处理](https://www.bilibili.com/video/BV1mY4y1v7j9)
- [theskyzero](https://space.bilibili.com/525505162)
- [gitee: theskyone](https://gitee.com/theskyone)
- [SpringBoot初体验：Swagger接口文档](https://blog.csdn.net/theskyzero/article/details/124081843)
- [基于springboot搭建访问数据库的web项目](https://www.yuque.com/theskyzero/qdl2y7/qbqai8)
- [springboot统一处理异常注解ExceptionHandler](https://www.bilibili.com/video/BV1hJ411n7HK/)
- [Spring Boot 统一解密数据，统一异常处理](https://www.bilibili.com/video/BV1L34y167YS/)
