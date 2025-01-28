---
title: "Spring Event Intro"
sequence: "101"
---

```text

```

- Spring事件驱动最基础的使用：`ApplicationEventPublisher`（发布者）、`ApplicationEvent`（事件） 和 `ApplicationListener`（监听者）。
- `ApplicationEventPublisher` 的子接口是 `ApplicationContext`

我想搞清楚，这些类都是属于哪个 `.jar` 文件的呢？回答：`spring-context.jar`。

- `ApplicationEvent`: `org.springframework.context.ApplicationEvent`
- `ApplicationEventPublisher`: `org.springframework.context.ApplicationEventPublisher`
- `ApplicationListener`: `org.springframework.context.ApplicationListener`
- `ApplicationContext`: `org.springframework.context.ApplicationContext`

- 事件源、监听器，都需要被 Spring 管理。
- 监听器，需要实现 `ApplicationListener<ApplicationContext>`
- 可体现**事件源**和**监听器**之间的松耦合，仅依赖 Spring、ApplicationEvent

```java
public abstract class ApplicationEvent extends EventObject {
    
}
```

```java
@FunctionalInterface
public interface ApplicationEventPublisher {
    default void publishEvent(ApplicationEvent event) {
        publishEvent((Object) event);
    }

    void publishEvent(Object event);
}
```

```java
@FunctionalInterface
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {
    void onApplicationEvent(E event);

    static <T> ApplicationListener<PayloadApplicationEvent<T>> forPayload(Consumer<T> consumer) {
        return event -> consumer.accept(event.getPayload());
    }
}
```

```java
public interface ApplicationContext extends EnvironmentCapable, ListableBeanFactory, HierarchicalBeanFactory,
		MessageSource, ApplicationEventPublisher, ResourcePatternResolver {
    @Nullable
    String getId();

    String getApplicationName();

    String getDisplayName();

    long getStartupDate();

    @Nullable
    ApplicationContext getParent();

    AutowireCapableBeanFactory getAutowireCapableBeanFactory() throws IllegalStateException;
}
```

## Reference

- [Spring常用特性之事件驱动（一） 事件驱动模型、观察者模式、发布订阅模式](https://www.bilibili.com/video/BV13e4y1B7Sp/)
- [Spring常用特性之事件驱动（二）EventListener、ApplicationEventPublisher、ApplicationEvent](https://www.bilibili.com/video/BV1Cd4y1q7Vm/)
- [ApplicationEventPublisher事件发布器](https://www.bilibili.com/video/BV1aZ4y1t7jR/)
