---
title: "WebDataBinder"
sequence: "133"
---

- spring-web.jar
    - org.springframework.web.bind.WebDataBinder

```java
public class WebDataBinder extends DataBinder {
    //
}
```

The `WebDataBinder` is a special `DataBinder` for data binding from **web request parameters** to JavaBean objects.

```text
小总结：

WebDataBinder: web request parameters ---> JavaBean objects
```

Designed for web environments, but not dependent on the Servlet API;
serves as base class for more specific `DataBinder` variants, such as `ServletRequestDataBinder`.

```text
- DataBinder
    - WebDataBinder
        - MapDataBinder
        - ServletRequestDataBinder
        - WebExchangeDataBinder
        - WebRequestDataBinder
```


