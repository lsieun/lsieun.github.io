---
title: "HandlerExceptionResolver"
sequence: "115"
---

Spring MVC提供了一个处理控制器方法执行过程中所出现的异常的接口：`HandlerExceptionResolver`

HandlerExceptionResolver接口的实现类有：`DefaultHandlerExceptionResolver`和`SimpleMappingExceptionResolver`

Spring MVC提供了自定义的异常处理器`SimpleMappingExceptionResolver`使用方式：

```text
<bean class="org.springframework.web.servlet.handler.SimpleMappingExceptionResolver">
    <property name="exceptionMappings">
        <props>
            <!--
                key: 处理器方法执行过程中出现的异常
                value: 若异常出现时，设置一个新的视图名称，跳转到指定页面
            -->
            <prop key="java.lang.ArithmeticException">error</prop>
        </props>
    </property>
    <!--
        exceptionAttribute设置一个属性名，将出现的异常信息在请求域中进行共享
    -->
    <property name="exceptionAttribute" value="ex"/>
</bean>
```

## 基于注解的异常处理

```java
package lsieun.mvc.exception;

import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionController {

    @ExceptionHandler(ArithmeticException.class)
    public String handleArithmeticException(Exception ex, Model model) {
        model.addAttribute("ex", ex);
        return "error";
    }
}
```
