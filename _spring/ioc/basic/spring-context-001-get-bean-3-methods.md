---
title: "Spring 常用的三种 getBean 的 API"
sequence: "101"
---

- `Object getBean(String beanName)`：根据 beanName 从容器中获取 Bean 实例，要求容器中 Bean 唯一，返回值为 Object，需要强转
- `T getBean(Class type)`：根据 Class 类型从容器中获取 Bean 实例，要求容器中 Bean 类型唯一，返回值为 Class 类型实例，无需强转。
- `T getBean(String beanName, Class type)`：根据 beanName 从容器中获得 Bean 实例，返回值为 Class 类型，无需强转。
