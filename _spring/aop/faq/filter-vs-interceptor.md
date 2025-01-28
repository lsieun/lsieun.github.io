---
title: "过滤器（Filter）与拦截器（Interceptor）的区别"
sequence: "101"
---

第一，**运行顺序**不同：

```text
Request : Filter --> Servlet --> Interceptor --> Controller
Response: Filter <-- Servlet <-- Interceptor <-- Controller
```

在 Servlet 容器中，

- 在接收 Request 过程中，Filter 是在 Servlet 之前执行的；而 Interceptor 是在 Servlet 之后运行的。
- 在返回 Response 过程中，

第二，**配置方式**不同：

- 过滤器（Filter），是在 `web.xml` 或 注解上进行配置。
- 拦截器，是在 Spring 的配置文件中进行配置，或者使用注解进行配置。

第三，Filter 依赖于 Servlet 容器；而 Interceptor 不依赖于 Servlet 容器。

第四，Filter，只能对 request 和 response 进行操作；
而 Interceptor 可以对 request、response、handler、modelAndView、Exception 进行操作。
