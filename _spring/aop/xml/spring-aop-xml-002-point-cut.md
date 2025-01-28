---
title: "切点表达式：配置方式和配置语法"
sequence: "102"
---

## 配置方式

第 1 种方式，配置在外面，使用 `<aop:pointcut>` 标签： 

```xml
<!-- AOP 配置 -->
<aop:config>
    <!-- 配置 PointCut（切点）表达式，目的是指定哪些方法需要被增强 -->
    <aop:pointcut id="myPointCut" expression="execution(void lsieun.service.impl.UserServiceImpl.show1())"/>

    <!-- 配置织入，目的是要执行哪些切点与哪些通知进行结合 -->
    <aop:aspect ref="expert">
        <aop:before method="beforeAdvice" pointcut-ref="myPointCut"/>
    </aop:aspect>
</aop:config>
```

第 2 种方式，配置在里面：

```xml
<!-- AOP 配置 -->
<aop:config>
    <!-- 配置织入，目的是要执行哪些切点与哪些通知进行结合 -->
    <aop:aspect ref="expert">
        <aop:before method="beforeAdvice" pointcut="execution(void lsieun.service.impl.UserServiceImpl.show1())"/>
    </aop:aspect>
</aop:config>
```

## 配置语法

切点表达式，是配置要对哪些连接点（哪些类的哪些方法）进行通知的增强，语法如下：

```text
execution([访问修饰符] 返回值类型 包名.类名.方法名(参数))
```

其中，

- 访问修饰符：可以省略不写；
- 返回值类型、某一级包名、类名、方法名 可以使用 `*` 表示任意；
- 包名与类名之间使用单点 `.` 表示该包下的类，使用双点 `..` 表示该包及其子包下的类；
- 参数列表：可以使用两个点 `..` 表示任意参数。

切点表达式的几个例子：

```text
// 表示访问修改符为 public、无返回值、在 lsieun.aop 包下的 TargetImpl 类的无参方法 show
execution(public void lsieun.aop.TargetImpl.show())

// 表示 lsieun.aop 包下的 TargetImpl 类的任意方法
execution(* lsieun.aop.TargetImpl.*(..))

// 表示 lsieun.aop 包下的任意类的任意方法
execution(* lsieun.aop.*.*(..))

// 表示 lsieun.aop 包及其子包下的任意类的任意方法
execution(* lsieun.aop..*.*(..))

// 表示任意包中的任意类的任意方法
execution(* *..*.*(..))
```

