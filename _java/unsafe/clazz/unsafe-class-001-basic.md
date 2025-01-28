---
title: "Unsafe Class"
sequence: "101"
---

## API

```java
public final class Unsafe {
    /**
     * Tell the VM to define a class, without security checks.
     * By default, the class loader and protection domain come from the caller's class.
     */
    public native Class<?> defineClass(String name, byte[] b, int off, int len,
                                       ClassLoader loader,
                                       ProtectionDomain protectionDomain);

    /**
     * Define a class but do not make it known to the class loader or system dictionary.
     * <p>
     * @param hostClass context for linkage, access control, protection domain, and class loader
     * @param data      bytes of a class file
     * @param cpPatches where non-null entries exist, they replace corresponding CP entries in data
     */
    public native Class<?> defineAnonymousClass(Class<?> hostClass, byte[] data, Object[] cpPatches);
}
```

## Lambda

在 `java.lang.invoke.InnerClassLambdaMetafactory` 的 `spinInnerClass()` 方法，
会生成 lambda 表达式的内部类，生成的 `byte[] classBytes`，交给 `UNSAFE` 加载：

```text
UNSAFE.defineAnonymousClass(targetClass, classBytes, null);
```

```java
public final class Unsafe {
    public native Class<?> defineAnonymousClass(Class<?> hostClass, byte[] data, Object[] cpPatches);
}
```
