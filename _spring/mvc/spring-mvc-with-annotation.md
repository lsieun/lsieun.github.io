---
title: "注解配置Spring MVC"
sequence: "119"
---

使用配置类和注解代替web.xml和SpringMVC配置文件的功能

## 创建初始化类，代替web.xml

在Servlet 3.0环境中，容器会在类路径中查找实现`javax.servlet.ServletContainerInitializer`接口的类。如果找到的话就用它来配置Servlet容器。

Spring提供了这个接口的实现，名为`SpringServletContainerInitializer`，
这个类反过来又会查找实现`WebApplicationInitializer`的类并将配置的任务交给它们来完成。
Spring 3.2引入了一个便利的`WebApplicationInitializer`基础实现，名为`AbstractAnnotationConfigDispatcherServletInitializer`，
当我们的类扩展了`AbstractAnnotationConfigDispatcherServletInitializer`并将其部署到Servlet 3.0容器的时候，容器会自动发现它，并用它来配置Servlet上下文。





