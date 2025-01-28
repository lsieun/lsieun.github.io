---
title: "Spring IOC"
sequence: "103"
---

IOC容器

- IOC底层实现
- IOC接口（BeanFactory）
- IOC操作Bean管理
    - 基于XML
    - 基于Annotation

IOC底层原理

- XML解析、工厂模式、反射

IOC接口

- IOC思想基于IOC容器完成，IOC容器底层就是对象工厂
- Spring提供IOC容器实现两种方式
    - BeanFactory：IOC容器基本实现，是Spring内部的使用接口，并不是提供开发人员使用的
        - 加载配置文件（XML）时，不会创建对象，在获取对象的时候，才去创建对象
    - ApplicationContext：BeanFactory接口的子接口，提供更多更强大的功能，一般由开发人员进行使用
        - 加载配置文件（XML）时，就会创建配置文件里的对象

ApplicationContext有哪些实现类：

- ClassPathXmlApplicationContext
- FileSystemXmlApplicationContext

IOC操作Bean管理

- 什么是Bean管理（包含两个操作）
    - Spring创建对象
    - Spring注入属性
- Bean管理操作有两种方式
    - 基于XML
        - 创建对象
        - 注入属性
            - p名称空间注入
            - 注入其它类型
                - 字面量
                    - null值
                    - 特殊符号
                - 对象、集合
                    - 注入外部Bean
                    - 注入内部Bean和级联赋值
    - 基于Annotation
        - 创建对象
        - 注入属性

Spring有两种类型的Bean

- 一种是普通Bean
- 另一种是FactoryBean（注意，不是BeanFactory）

## 作用域

bean作用域

- 创建的bean对象是单实例，还是多实例。
- 在默认情况下，bean是单实例对象
- 在spring配置的xml文件中，`<bean>`标签的`scope`属性
  - `singleton`，表示单实例对象，加载spring配置文件的时候，就会创建单实例对象
  - `prototype`，表示多实例对象，不是在加载spring配置文件的时候创建对象，而调用`getBean()`方法的时候创建对象

另外，还有`request`和`session`，是在Web开发中用到。

## 生命周期

生命周期：从对象创建到对象销毁的过程

bean生命周期：

- 第一步，通过构造器创建Bean实例（无参构造方法）
- 第二步，为Bean的属性设置值和对其他bean引用（调用setter方法）
- 第三步，调用bean的初始化的方法（需要进行配置初始化的方法）
- 第四步，使用bean对象
- 第五步，当容器关闭时，调用bean的销毁的方法（需要进行配置销毁的方法）

加上bean的后置处理器，一共有七步：

- 第一步，通过构造器创建Bean实例（无参构造方法）
- 第二步，为Bean的属性设置值和对其他bean引用（调用setter方法）
- 第三步，**把bean实例传递bean后置处理器的方法**
- 第四步，调用bean的初始化的方法（需要进行配置初始化的方法）
- 第五步，**把bean实例传递bean后置处理器的方法**
- 第六步，使用bean对象
- 第七步，当容器关闭时，调用bean的销毁的方法（需要进行配置销毁的方法）

## 自动装配

什么是自动装配？ 根据指定装配规则（属性名称或属性类型），Spring自动将匹配的属性值进行注入

在Spring配置文件中，`<bean>`标签有一个`autowire`属性：

- `byName`：根据属性名称注入，特点是bean的id值要与属性的名称一样
- `byType`：根据属性类型注入


