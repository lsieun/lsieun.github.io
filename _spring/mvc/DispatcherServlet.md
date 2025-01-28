---
title: "DispatcherServlet"
sequence: "118"
---

```text
                                                                                                                                      ┌─── Servlet(i)
                                                                                 ┌─── HttpServlet ─────────────┼─── GenericServlet ───┤
                                                                                 │                                                    └─── ServletConfig(i)
                                              ┌─── HttpServletBean ──────────────┤
                                              │                                  ├─── EnvironmentCapable(i)
DispatcherServlet ───┼─── FrameworkServlet ───┤                                  │
                                              │                                  └─── EnvironmentAware(i)
                                              │
                                              └─── ApplicationContextAware(i)
```

Each `DispatcherServlet` has a restricted-scope `WebApplicationContext`
that inherits the beans from the root `ApplicationContext`.

By default, for the `WebApplicationContext`,
Spring MVC looks in the `/WEB-INF` directory for a configuration file named `{servletName}-servlet.xml`.
We have, however, overridden this default name and location through the initialization
parameter `contextConfigLocation`:

```text
<servlet>
 <servlet-name>spring</servlet-name>
   <servlet-class>
    org.springframework.web.servlet.DispatcherServlet
  </servlet-class>
   <init-param>
    <param-name>contextConfigLocation</param-name>
    <param-value>/WEB-INF/dispatcher-context.xml</param-value>
   </init-param>
   <load-on-startup>1</load-on-startup>
</servlet>
<servlet-mapping>
    <servlet-name>spring</servlet-name>
    <url-pattern>/*</url-pattern>
</servlet-mapping>
```

Still in the `web.xml`, you can see that the root application context
(`classpath*:/META-INF/spring/*-config.xml`) starts with the `ContextLoaderListener`:

```text
<listener>
  <listener-class>
    org.springframework.web.context.ContextLoaderListener
  </listener-class>
</listener>
```






