---
title: "双亲委派机制"
sequence: "103"
---


![Class loader parent delegation model](/assets/images/java/jvm/class-loader-parent-delegation-model.png)

```text
protected synchronized Class<?> loadClass(String name, boolean resolved) throws ClassNotFoundException {
    // First check if the class is already loaded
    Class c = findLoadedClass(name);
    if (c == null) {
        try {
            if (parent != null) {
                c = parent.loadClass(name, false);  // parent delegation
            }
            else {
                c = findBootstrapClass0(name);
            }
        } catch (ClassNotFoundException e) {
            c = findClass(name);                    // if still not found, invoke findClass
        }
    }
    if (resolved) {
        resolveClass(c);
    }
    return c;
}
```

## 双亲委派机制的运行过程

- ① 类加载器收到类加载的请求。
- ② 将这个请求委托给父类加载器去完成，一直向上委托，直到引导类加载器。
- ③ 引导类加载器检查是否能够加载当前这个类，能加载就结束，使用当前的加载器，否则，抛出异常，通知子加载器进行加载，向下加载。
- ④ 重复步骤③。

### 双亲委派机制优缺点

优点： 保证类加载的安全性，不管那个类被加载，都会被委托给引导类加载器，只有类加载器不能加载，才会让子加载器加载，这样保证最后得到的对象都是同样的一个。

缺点： 子加载器可以使用父加载器加载的类，而父加载器不能使用子加载器加载的类。

### 为什么要破坏双亲委派机制

原因： 子加载器可以使用父加载器加载的类，而父加载器不能使用子加载器加载的类。

举例： 使用 JDBC 连接数据库，需要用到 `com.mysql.jdbc.Driver` 和 `DriverManager` 类。
然而 DriverManager 被引导类加载器所加载，而 com.mysql.jdbc.Driver 被当前调用者的加载器加载，使用引导类加载器加载不到，所以要打破双亲委派机制。

### 破坏双亲委派机制的方式

- (1) 自定义类加载器，重写 `loadclass()` 方法。
- (2) 使用线程上下文类(`ServiceLoader`：使父加载器可以加载子加载器的类)。
- (3) SPI 机制
- (4) OSGI 热部署、热更新

## 扩展

The **class-loader delegation mode**, also known as the **class loader order**,
determines whether a class loader delegates the loading of classes to the parent class loader.
The following values for class-loader mode are supported:

Available modes include **Parent first** and **Parent last**.

### Parent first

Also known as **Classes loaded with parent class loader first**.

The Parent first class-loader mode causes the class loader to delegate the loading of classes to its parent class loader
before attempting to load the class from its local class path.
This value is the default for the class-loader policy and for standard JVM class loaders.

### Parent last

Also known as **Classes loaded with local class loader first or Application first**.

The Parent last class-loader mode causes the class loader to attempt to load classes from its local class path
before delegating the class loading to its parent.
Using this policy, an application class loader can override and provide its own version of a class that exists in the parent class loader.


## Reference

- [Create custom ClassLoader to bypass parental delegation](https://www.fatalerrors.org/a/create-custom-classloader-to-bypass-parental-delegation.html)
- [Java custom class loader and parent delegation model](https://blog.actorsfit.com/a?ID=01150-9b129f0c-7e95-4e1f-b129-875f71b0b5de)

- [Class-loader modes](https://www.ibm.com/docs/en/was-zos/9.0.5?topic=loading-class-loaders)
