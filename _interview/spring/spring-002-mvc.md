---
title: "Spring MVC"
sequence: "102"
---

- [ ] Spring MVC处理请求的流程是什么？https://www.bilibili.com/video/BV1EN411e77V?p=67
- [ ] Spring MVC 处理请求底层原理流程 https://www.bilibili.com/video/BV1EN411e77V?p=83
- [ ] DispatcherServlet 与 Spring 容器之间的关系
- [ ] Spring MVC 中的 Spring 容器是什么时候创建的？
- [ ] Spring MVC 中的父子容器怎么理解？
- [ ] Spring MVC中的零配置怎么理解？

- Tomcat 启动
- 解析 web.xml
- DispatcherServlet 实例化
- DispatcherServlet 初始化，即 init() 方法，创建 Spring 容器
- 接收请求


 
- Tomcat 启动
- 解析 web.xml
- DispatcherServlet 实例化
- DispatcherServlet 初始化，即 init() 方法
    - DispatcherServlet --> FrameworkServlet --> HttpServletBean.init() 方法 --> initServletBean()
    - initServletBean()：初始化 Servlet，创建 Spring 容器
    - FrameworkServlet.initServletBean(
        - this.webApplicationContext() = initWebApplicationContext()
        - initFrameworkServlet() 空方法无实现
