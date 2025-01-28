---
title: "ViewResolver"
sequence: "119"
---

```xml
<bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"/>
    <property name="prefix" value="/WEB-INF/jsp/"/>
    <property name="suffix" value=".jsp"/>
</bean>
```

A `viewResolver` bean is a specific instance of a predefined class
used to serve an organized and uniform set of view layers.
In the case that we have configured, the `viewResolver` bean is an instance of `InternalResourceViewResolver`,
which can serve JSP pages, handle the JSTL and tiles.
This class also inherits `UrlBasedViewResolver`
that can navigate the application resources and can bind a logical view name to a `View` resource file.
This capability prevents the creation of extramappings.

In our configuration, we have defined the view repository (`/WEB-INF/jsp/*.jsp`)
and we can directly refer to `index.jsp` with the String `index`.

It is better practice to set up the JSP repository under `/WEB-INF` so those JSPs cannot be targeted publicly.
Rather than a JSP templating, we could have used **Velocity** or **Freemarker** respectively
using the view resolvers `VelocityViewResolver` or `FreeMarkerViewResolver`.

```text
<context:component-scan base-package="lsieun.mvc.controller"/>

<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/jsp/"/>
    <property name="suffix" value=".jsp"/>
</bean>
```

