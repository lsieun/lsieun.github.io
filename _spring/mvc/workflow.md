---
title: "Spring MVC执行流程"
sequence: "120"
---

## Spring MVC常用组件

- `DispatcherServlet`：前端控制器，不需要工程师开发，由框架提供。
  - 作用：统一处理请求和响应，整个流程控制的中心，由它调用其它组件处理用户的请求。
- `HandlerMapping`：处理映射器，不需要工程师开发，由框架提供。
  - 作用：根据请求的url、method等信息查找Handler，即控制器方法
- Handler：处理器，需要工程师开发。
  - 作用：在`DispatcherServlet`的控制下，Handler对具体的用户请求进行处理。
- `HandlerAdapter`：处理器适配器，不需要工程师开发，由框架提供。
  - 作用：通过`HandlerAdapter`对处理器（控制器方法）进行执行
- `ViewResolver`：视图解析器，不需要工程师开发，由框架提供。
  - 作用：进行视图解析，得到相应的视图，例如`ThymeleafView`、`InternalResourceView`、`RedirectView`
- `View`：视图，不需要工作师开发，由框架或视图技术提供。
  - 作用：将模型数据通过页面展示给用户。



