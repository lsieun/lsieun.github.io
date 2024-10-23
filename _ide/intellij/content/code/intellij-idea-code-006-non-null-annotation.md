---
title: "@NonNull"
sequence: "106"
---

[UP](/ide/intellij-idea-index.html)


在使用 SpringBoot Websocket 的时候 IDEA 总是显示告警：

```text
Not annotated parameter overrides @NonNullApi parameter
```

类似的告警一直很烦，可以用下面几个方法消除告警：

## 直接忽略告警

增加 `@SuppressWarnings` 即可解决：

```java
@Slf4j
@Component
@SuppressWarnings("NullableProblems")
public class HttpHandshakeInterceptor implements HandshakeInterceptor {
    // other code
}
```

## 增加参数注解

增加参数注解 `@Nonnull`，这个注解来自 `javax.annotation.Nonnull`，如下代码：

```java
@Slf4j
@Component
public class HttpHandshakeInterceptor implements HandshakeInterceptor {
    // other code

    @Override
    public void afterHandshake(@Nonnull ServerHttpRequest request,
                               @Nonnull ServerHttpResponse response,
                               @Nonnull WebSocketHandler handler,
                               Exception e) {
    }
}
```

## 添加 package 注解

在包下面新建 `package-info.java` 文件，写入注解：

```java
@NonNullApi
package com.example.socket;

import org.springframework.lang.NonNullApi;
```

这种做法会影响到整个包内的代码，而且可能还会出现一个告警：

```text
Parameter annotated @NonNullApi must not override @Nullable parameter
```

这就没完没了了，我推荐第一种做法，直接忽略告警，无代码入侵影响。

## Reference

- [解决 IDEA 告警：Not annotated parameter overrides @NonNullApi parameter](https://markdowner.net/skill/256554048113811456)
- [xternal annotations: Not annotated parameter overrides @NotNull parameter](https://intellij-support.jetbrains.com/hc/en-us/community/posts/360000214479-External-annotations-Not-annotated-parameter-overrides-NotNull-parameter)
- [Not annotated method overrides method annotated with @NotNull](https://stackoverflow.com/questions/24495448/not-annotated-method-overrides-method-annotated-with-notnull)
