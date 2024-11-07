---
title: "标签分类"
sequence: "101"
---

## 标签分类

Spring 的 XML 标签大体上分为两类，一种是**默认标签**，一种是**自定义标签**

- 默认标签：就是不用额外导入其它命名空间约束的标签，例如 `<bean>` 标签
- 自定义标签：就是需要额外引入其它命名空间约束，并通过前缀引用的标签，例如 `<context:property-placeholder/>` 标签

Spring 的默认标签用到是 Spring 的默认命名空间：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
       http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

</beans>
```

该命名空间约束下的默认标签如下：

- `<beans>`：一般作为 XML 配置的要标签，其它标签都是该标签的子标签
- `<bean>`：Bean 的配置标签
- `<import>`：外部资源导入标签
- `<alias>`：指定 Bean 别名标签，使用较少

`Ctrl+Alt+Space`

![](/assets/images/spring/intellij/auto-import-xml-namespace.png)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/context
       https://www.springframework.org/schema/context/spring-context.xsd">

    <context:property-placeholder></context:property-placeholder>
</beans>
```
