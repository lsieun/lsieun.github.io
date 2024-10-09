---
title: "ClassLoader"
sequence: "102"
---

At runtime, every type is loaded by a class loader,
which is represented by an instance of the `java.lang.ClassLoader` class.
You can get the reference of the class loader of a type
by using the `getClassLoader()` method of the `Class` class. 

```text
Class<Bulb> cls = Bulb.class;
ClassLoader loader = cls.getClassLoader();
```

The Java runtime uses three class loaders to load classes.
The direction of the arrows indicates the delegation direction.
These class loaders load classes from different locations and of different types.
You can add more class loaders,
which would be a subclass of the `ClassLoader` class.

Using **custom class loaders**, you can load classes from custom locations, partition user code, and unload classes.
For most applications, the built-in class loaders are sufficient.

Note: Since JDK9, the **application class loader** can delegate to the **platform class loader** as
well as the **bootstrap class loader**;
the **platform class loader** can delegate to the **application class loader**.

## bootstrap class loader

The **bootstrap class loader** is implemented in the library code and in the virtual machine.
Classes under its custody return `null` if you call `getClassLoader()`,
as in `Object.class.getClassLoader() == null`.
Not all Java SE Platform and JDK modules are loaded by the **bootstrap class loader**.
To name a few, modules loaded by the **bootstrap class loader** are
`java.base`, `java.logging`, `java.prefs`, and `java.desktop`. 

Other Java SE Platform and JDK modules are loaded by
the **platform class loader** and the **application class loader**.
Use the `-Xbootclasspath/a` option to specify additional boot class paths.
Its value is stored in the system property `jdk.boot.class.path.append`.

## platform class loader

The **platform class loader** may be used to implement a class loading extension mechanism
(the JDK8 extension mechanism for loading classes is no longer supported).

The `ClassLoader` class contains a new static method named `getPlatformClassLoader()`,
which returns the reference of the **platform class loader**.

The JDK Modules Loaded by the Platform Class Loader

- java.compiler
- java.net.http
- java.scripting
- java.security.jgss
- java.smartcardio
- java.sql
- java.sql.rowset
- java.transaction.xa
- java.xml.crypto
- jdk.accessibility
- jdk.charsets
- jdk.crypto.cryptoki
- jdk.crypto.ec
- jdk.dynalink
- jdk.httpserver
- jdk.jsobject
- jdk.localedata
- jdk.naming.dns
- jdk.security.auth
- jdk.security.jgss
- jdk.xml.dom
- jdk.zipfs

The platform class loader serves another purpose.
**Classes loaded by the bootstrap class loader are granted all permissions by default.**
However, several classes did not need all permissions.
Such classes are loaded by the platform class loader.

## application class loader

The **application class loader** loads the application modules found on the module path and a few JDK modules
that provide tools or export tool APIs.

The JDK Modules Loaded by the Application Class Loader

- jdk.compiler
- jdk.internal.opt
- jdk.jartool
- jdk.javadoc
- jdk.jdeps
- jdk.jlink
- jdk.unsupported.desktop

You can still use the static method named `getSystemClassLoader()` of the `ClassLoader` class
to get the reference of the application class loader.

Note: Before JDK9, the **extension class loader** and the **application class loader**
were an instance of the `java.net.URLClassLoader` class.
In JDK9 and later, the **platform class loader** (the erstwhile extension class loader) and
the **application class loader** are an instance of an internal JDK class.
If your code relied on the methods specific to the `URLClassLoader` class,
your pre-JDK9 code may break in JDK9 or later.

```java
public class ModulesByClassLoader {
    public static void main(String[] args) {
        // Get the boot layer
        ModuleLayer layer = ModuleLayer.boot();

        // Print all module's names and their class loader
        // names in the boot layer
        for (Module m : layer.modules()) {
            ClassLoader loader = m.getClassLoader();
            String moduleName = m.getName();
            String loaderName = loader == null ? "bootstrap" : loader.getName();
            String line = String.format("%s: %s", loaderName, moduleName);
            System.out.println(line);
        }
    }
}
```

## Work Together

The three built-in class loaders work in tandem to load classes.

When the **application class loader** needs to load a class, it searches modules defined to all class loaders.
If a suitable module is defined to one of these class loaders,
that class loader loads the class,
implying that the **application class loader** can now delegate to the **bootstrap class loader**
and the **platform class loader**.
If a class is not found in a **named module** defined to these class loaders,
the **application class loader** delegates to its parent,
which is the **platform class loader**.
If a class is still not loaded, the **application class loader** searches the **class path**.
If it finds the class on the class path, it loads the class as a member of its **unnamed module**.
If it does not find the class on the class path, a `ClassNotFoundException` is thrown.


When the **platform class loader** needs to load a class,
it searches modules defined to all class loaders.
If a suitable module is defined to one of these class loaders,
that class loader loads the class,
implying that the **platform class loader** can delegate to the **bootstrap class loader**
as well as the **application class loader**.
If a class is not found in a **named module** defined to these class loaders,
the **platform class loader** delegates to its parent, which is the **bootstrap class loader**.


When the **bootstrap class loader** needs to load a class,
it searches its own list of **named modules**.
If a class is not found,
it searches the list of files and directories specified through the command-line option: `Xbootclasspath/a`.
If it finds a class on the **bootstrap class path**, it loads the class as a member of its **unnamed module**.
If a class is still not found, a `ClassNotFoundException` is thrown.


## 类的加载方式

### Java 8

#### Proxy

在 `java.lang.reflect.Proxy` 类当中，定义了 `defineClass0()` 方法：

```java
public class Proxy implements java.io.Serializable {
    private static native Class<?> defineClass0(ClassLoader loader, String name, byte[] b, int off, int len);
}
```

在 `java.lang.reflect.Proxy.ProxyClassFactory.apply()` 方法中，加载生成的 `$Proxy` 类：

```text
byte[] proxyClassFile = ProxyGenerator.generateProxyClass(proxyName, interfaces, accessFlags);
defineClass0(loader, proxyName, proxyClassFile, 0, proxyClassFile.length);
```

#### Unsafe

```java
public final class Unsafe {
    /**
     * Tell the VM to define a class, without security checks.
     * By default, the class loader and protection domain come from the caller's class.
     */
    public native Class<?> defineClass(String name, byte[] b, int off, int len,
                                       ClassLoader loader, ProtectionDomain protectionDomain);

    /**
     * Define a class but do not make it known to the class loader or system dictionary.
     * <p>
     * For each CP entry, the corresponding CP patch must either be null or have
     * the a format that matches its tag:
     * <ul>
     * <li>Integer, Long, Float, Double: the corresponding wrapper object type from java.lang
     * <li>Utf8: a string (must have suitable syntax if used as signature or name)
     * <li>Class: any java.lang.Class object
     * <li>String: any object (not just a java.lang.String)
     * <li>InterfaceMethodRef: (NYI) a method handle to invoke on that call site's arguments
     * </ul>
     * @param hostClass context for linkage, access control, protection domain, and class loader
     * @param data      bytes of a class file
     * @param cpPatches where non-null entries exist, they replace corresponding CP entries in data
     */
    public native Class<?> defineAnonymousClass(Class<?> hostClass, byte[] data, Object[] cpPatches);
}
```

`java.lang.invoke.InnerClassLambdaMetafactory` 类当中，`spinInnerClass()` 方法：

```java
final class InnerClassLambdaMetafactory extends AbstractValidatingLambdaMetafactory {
    private Class<?> spinInnerClass() throws LambdaConversionException {
        // ...
        byte[] classBytes = cw.toByteArray();
        return UNSAFE.defineAnonymousClass(targetClass, classBytes, null);
    }
}
```

### Java 17

#### JavaLangAccess

`jdk.internal.access.JavaLangAccess`

```java
public interface JavaLangAccess {
    Class<?> defineClass(ClassLoader cl, String name, byte[] b, ProtectionDomain pd, String source);
    Class<?> defineClass(ClassLoader cl, Class<?> lookup, String name, byte[] b, ProtectionDomain pd, boolean initialize, int flags, Object classData);
    Class<?> findBootstrapClassOrNull(String name);
}
```

`java.lang.reflect.Proxy.ProxyBuilder#defineProxyClass`

```java
private static final class ProxyBuilder {
    private static Class<?> defineProxyClass(Module m, List<Class<?>> interfaces) {
        //...
        byte[] proxyClassFile = ProxyGenerator.generateProxyClass(loader, proxyName, interfaces, accessFlags);
        Class<?> pc = JLA.defineClass(loader, proxyName, proxyClassFile, null, "__dynamic_proxy__");
    }
}
```

#### MethodHandles.Lookup

`java.lang.invoke.MethodHandles.Lookup#defineHiddenClassWithClassData`

```java
public static final class Lookup {
    public Lookup defineHiddenClassWithClassData(byte[] bytes, Object classData, boolean initialize, ClassOption... options)
            throws IllegalAccessException;

    public Lookup defineHiddenClass(byte[] bytes, boolean initialize, ClassOption... options)
            throws IllegalAccessException;
}
```

`java.lang.invoke.InnerClassLambdaMetafactory#generateInnerClass`

```java
final class InnerClassLambdaMetafactory extends AbstractValidatingLambdaMetafactory {
    private Class<?> generateInnerClass() throws LambdaConversionException {
        // ...
        byte[] classBytes = cw.toByteArray();
        lookup = caller.defineHiddenClassWithClassData(classBytes, implementation, !disableEagerInitialization, NESTMATE, STRONG);
        lookup = caller.defineHiddenClass(classBytes, !disableEagerInitialization, NESTMATE, STRONG);
    }
}
```

