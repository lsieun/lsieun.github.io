---
title: "注解方式开发 AOP 配置详解"
sequence: "102"
---

各种注解方式通知类型：

```text
// 前置通知
@Before("execution(* lsieun.aop.*.*(..))")
public void before(JoinPoint joinPoint) {}

// 后置通知
@AfterReturning("execution(* lsieun.aop.*.*(..))")
public void AfterReturning(JoinPoint joinPoint) {}

// 环绕通知
@Around("execution(* lsieun.aop.*.*(..))")
public void around(ProceedingJoinPoint joinPoint) throws Throwable {}

// 异常通知
@AfterThrowing("execution(* lsieun.aop.*.*(..))")
public void afterThrowing(JoinPoint joinPoint) {}

// 最终通知
@After("execution(* lsieun.aop.*.*(..))")
public void after(JoinPoint joinPoint) {}
```
