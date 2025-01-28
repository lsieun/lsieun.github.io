---
title: "Spring MVC视图"
sequence: "116"
---

Spring MVC中视图是View接口，视图的作用渲染数据，将模型（Model）中的数据展示给用户。

Spring MVC视图的种类很多，默认有转发视图（`InternalResourceView`）和重定向视图（`RedirectView`）。

当工程引入jstl的依赖，转发视图会自动转换为`JstlView`。

若使用的视图技术为Thymeleaf，在Spring MVC配置文件中配置了Thymeleaf的视图解析器，由此视图解析器解析之后所得到是ThymeleafView。


## ThymeleafView


## 转发视图

Spring MVC中默认的转发视图是`InternalResourceView`。

Spring MVC中创建转发视图的情况：
当控制器方法中所设置的视图名称以`forward:`为前缀时，创建`InternalResourceView`视图，
此时的视图名称不会被Spring MVC配置文件中配置的视图解析器解析，而是会将前缀`forward:`去掉，
剩余部分作为最终路径通过转发的方式实现跳转。

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping(value = "/success")
    public String success() {
        return "success";
    }

    @RequestMapping(value = "/world")
    public String world() {
        return "forward:/hello/success";
    }

}
```

## 重定向视图

Spring MVC中默认的重定向视图是`RedirectView`

Spring MVC中创建重定向视图的情况：
当控制器方法中所设置的视图名称以`redirect:`为前缀时，创建`RedirectView`视图，
此时的视图名称不会被Spring MVC配置文件中配置的视图解析器解析，而是会将前缀`redirect:`去掉，
剩余部分作为最终路径通过重定向的方式实现跳转。

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping(value = "/success")
    public String success() {
        return "success";
    }

    @RequestMapping(value = "/world")
    public String world() {
        return "redirect:/hello/success";
    }

}
```

重定向到百度：`redirect:https://cn.bing.com/`

## view-controller

```text
<mvc:view-controller path="/abc" view-name="success"></mvc:view-controller>
```

注意：当Spring MVC中设置任何一个`<mvc:view-controller>`时，其他控制器中的请求映射将全部失效，
此时需要在Spring MVC的核心配置文件中设置MVC注解驱动的标签：

```text
<mvc:annotation-driven />
```

## JSP

`InternalResourceViewResolver`

```text
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/templates/"/>
    <property name="suffix" value=".jsp"/>
</bean>
```

