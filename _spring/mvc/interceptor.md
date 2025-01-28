---
title: "Interceptor"
sequence: "115"
---

Spring MVC中拦截器用于拦截控制器方法的执行

Spring MVC中的拦截器需要实现HandlerInterceptor或继承HandlerInterceptorAdaptor类

Spring MVC的拦截器必须在Spring MVC的配置文件中进行配置

```text
<mvc:interceptors>
    <bean class="lsieun.mvc.interceptor.FirstInterceptor"/>
</mvc:interceptors>
```

```text
<bean id="firstInterceptor" class="lsieun.mvc.interceptor.FirstInterceptor"/>

<!-- 配置拦截器 -->
<mvc:interceptors>
    <ref bean="firstInterceptor"/>
</mvc:interceptors>
```

以上两种方式对`DispatcherServlet`所处理的所有请求进行拦截

```text
<!-- 配置拦截器 -->
<mvc:interceptors>
    <mvc:interceptor>
        <mvc:mapping path="/**"/>
        <mvc:exclude-mapping path="/"/> <!-- 排除首页 -->
        <bean class="lsieun.mvc.interceptor.FirstInterceptor"/>
    </mvc:interceptor>
</mvc:interceptors>
```

```java
package lsieun.mvc.interceptor;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class FirstInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        return HandlerInterceptor.super.preHandle(request, response, handler);
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
}
```


## 拦截器的三个抽象方法

## 多个拦截器的执行顺序


