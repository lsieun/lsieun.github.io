---
title: "Dev Tools: Intro"
sequence: "101"
---

To enhance the development experience further,
Spring released the `spring-boot-devtools` tool as part of Spring Boot-1.3.

```xml
<!-- devtools -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>
```

We'll cover the following topics:

- Property defaults
- Automatic Restart
- Live Reload
- Global settings
- Remote applications

## Property Defaults

Spring-boot does a lot of auto-configurations, including enabling caching by default to improve performance.

One such example is caching of templates used by template engines, e.g. thymeleaf.
But during development, it's more important to see the changes as quickly as possible.

The default behavior of caching can be disabled for thymeleaf
using the property `spring.thymeleaf.cache=false` in the `application.properties` file.
We do not need to do this manually, introducing this `spring-boot-devtools` does this automatically for us.

## Live Reload

`spring-boot-devtools` module includes an embedded LiveReload server
that is used to trigger a browser refresh when a resource is changed.

For this to happen in the browser
we need to install the LiveReload plugin one such implementation is
[Remote Live Reload for Chrome](https://chrome.google.com/webstore/detail/remotelivereload/jlppknnillhjgiengoigajegdpieppei?hl=en-GB).

## Global Settings

`spring-boot-devtools` provides a way to configure global settings that are not coupled with any application.
This file is named as `.spring-boot-devtools.properties` and it located at `$HOME`.

## Remote Applications

这个部分，我没有看懂，地址在[这里][baeldung-devtools]

### Remote Debugging via HTTP (Remote Debug Tunnel)

```text
-Xdebug -Xrunjdwp:server=y,transport=dt_socket,suspend=n
```

### Remote Update



## References

- [Overview of Spring Boot Dev Tools][baeldung-devtools]
- [Live reload for thymeleaf template](https://stackoverflow.com/questions/58275418/live-reload-for-thymeleaf-template)
- [How to reload templates without restarting the spring boot application?](https://github.com/thymeleaf/thymeleaf/issues/614)
- [Spring Boot & Intellij IDEA: Auto reload Thymeleaf templates without restart](https://attacomsian.com/blog/spring-boot-auto-reload-thymeleaf-templates)


[baeldung-devtools]: https://www.baeldung.com/spring-boot-devtools
