---
title: "自动配置 Spring MVC"
sequence: "108"
---

在上一节中，我们介绍了 Spring Boot 是如何启动一个内置 Tomcat 的？
我们知道，在 Spring Boot 项目里面，可以直接使用 `@RequestMapping` 这类的 Spring MVC 的注解，
那么，我们可能会好奇，这是为什么？我们明明没有配置 Spring MVC，为什么就可以使用呢？

其实，仅仅引入 starter 是不够的，回忆一个，在一个普通的 WEB 项目中，
如何去使用 Spring MVC，我们首先就是要在 `web.xml` 中添加如下配置：

```xml
<web-app>
    <servlet>
        <servlet-name>dispatcher</servlet-name>
        <servlet-class>
            org.springframework.web.servlet.DispatcherServlet
        </servlet-class>
    </servlet>

    <servlet-mapping>
        <servlet-name>dispatcher</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

但是，在 Spring Boot 中，我们没有 web.xml 文件，那 Spring Boot 是如何配置 `DispatcherServlet` 呢？
其实，Servlet 3.0 规范中规定，要添加一个 Servlet，除了采用 XML 配置的方式，还有一种通过代码的方式，伪代码如下：

```text
servletContext.addServlet(name, this.servlet);
```

那么，也就是说，如果我们能动态往 Web 容器中添加一个我们构造好的 `DispatcherServlet` 对象，是不是就实现自动装备 Spring MVC 了。

思路，有两步：

- 第 1 步，将 `DispatcherServlet` 存储到 IoC 容器中；
- 第 2 步，将 `DispatcherServlet` 实例注册到 Tomcat (Servlet Container) 当中，才能够提供请求服务

Servlet 3.0 规范的诞生为 Spring Boot 彻底去掉 XML （`web.xml`） 奠定了理论基础。

当实现了 Servlet 3.0 规范的容器（例如，Tomcat 7 及以上版本）启动时，
通过 SPI 扩展机制，自动扫描所有已经添加的 jar 包下的 `META-INF/services/javax.servlet.ServletContainerInitializer`
中指定的全路径类名，并实例化该类，然后回调 `ServletContainerInitializer` 具体实现类的 `onStartup` 方法。

在 `spring-web.jar` 中的 `META-INF/services/javax.servlet.ServletContainerInitializer` 的内容为：

```text
org.springframework.web.SpringServletContainerInitializer
```

## 自动配置 DispatcherServlet 和 DispatcherServletRegistry

Spring Boot 的自动配置，是基于 SPI 机制，实现自动配置的核心要点就是，添加一个自动配置的类；
Spring Boot MVC 的自动配置自然也是相同原理。

所以，先找到 Spring MVC 对应的自动配置类：

```text
org.springframework.boot.autoconfigure.web.servlet.DispatcherServletAutoConfiguration
```

`DispatcherServletAutoConfiguration` 自动配置类：

```java
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@Configuration(proxyBeanMethods = false)
@ConditionalOnWebApplication(type = Type.SERVLET)
@ConditionalOnClass(DispatcherServlet.class)
@AutoConfigureAfter(ServletWebServerFactoryAutoConfiguration.class)
public class DispatcherServletAutoConfiguration {
    // ...
}
```