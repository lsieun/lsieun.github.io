---
title: "JDK Dynamic Proxy Analysis (Java 8)"
sequence: "102"
---



```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Proxy;

public class HelloWorld {
    public static void main(String[] args) {
        OperationImpl instance = new OperationImpl();

        ClassLoader classLoader = HelloWorld.class.getClassLoader();
        Class<?>[] interfaces = new Class[]{AdvancedOperation.class, BasicOperation.class};
        InvocationHandler handler = new OperationHandler(instance);

        Object proxy = Proxy.newProxyInstance(classLoader, interfaces, handler);
        System.out.println(proxy.getClass().getName());
        System.out.println("=== === ===");

        BasicOperation basicOperation = (BasicOperation) proxy;
        int result1 = basicOperation.add(10, 20);
        System.out.println(result1);
        System.out.println("=== === ===");

        AdvancedOperation advancedOperation = (AdvancedOperation) proxy;
        int result2 = advancedOperation.mul(5, 6);
        System.out.println(result2);
        System.out.println("=== === ===");
    }
}
```

关注点：

```text
Object proxy = Proxy.newProxyInstance(classLoader, interfaces, handler);
```

## Proxy

### newProxyInstance

```java
public class Proxy implements java.io.Serializable {
    public static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h)
    {
        // 第一步，clone interface
        Class<?>[] intfs = interfaces.clone();
        
        // 第二步，获取 Class（重点）
        Class<?> cl = getProxyClass0(loader, intfs);

        try {
            // 第三步，创建 Instance
            Constructor<?> cons = cl.getConstructor(constructorParams);
            return cons.newInstance(new Object[]{h});
        } catch (Exception ex) {
            throw new InternalError(e.toString(), e);
        }
    }
}
```

### getProxyClass0

在 `getProxyClass0()` 方法中，会调用 `proxyClassCache.get()` 方法；
其中，`proxyClassCache` 是 `WeakCache` 类型，它的具体实现由 `KeyFactory` 和 `ProxyClassFactory` 类来完成。

```java
public class Proxy implements java.io.Serializable {
    private static final WeakCache<ClassLoader, Class<?>[], Class<?>>
            proxyClassCache = new WeakCache<>(new KeyFactory(), new ProxyClassFactory());
    
    private static Class<?> getProxyClass0(ClassLoader loader, Class<?>... interfaces) {
        // If the proxy class defined by the given loader implementing
        // the given interfaces exists, this will simply return the cached copy;
        // otherwise, it will create the proxy class via the ProxyClassFactory
        return proxyClassCache.get(loader, interfaces);
    }
}
```

接下来，我们重点关注 `ProxyClassFactory` 类。

### ProxyClassFactory

`ProxyClassFactory` 是 `Proxy` 的 static nested class。

```java
public class Proxy implements java.io.Serializable {
    private static final class ProxyClassFactory implements BiFunction<ClassLoader, Class<?>[], Class<?>>
    {
        // prefix for all proxy class names
        private static final String proxyClassNamePrefix = "$Proxy";

        // next number to use for generation of unique proxy class names
        private static final AtomicLong nextUniqueNumber = new AtomicLong();

        @Override
        public Class<?> apply(ClassLoader loader, Class<?>[] interfaces) {

            // 第一步，获取 proxyName 和 access flag（这里省略了一些判断逻辑）
            String proxyPkg = null; 
            int accessFlags = Modifier.PUBLIC | Modifier.FINAL;
            if (proxyPkg == null) {
                // String PROXY_PACKAGE = "com.sun.proxy"
                proxyPkg = ReflectUtil.PROXY_PACKAGE + ".";
            }

            /*
             * Choose a name for the proxy class to generate.
             * proxyPkg = "com.sun.proxy";
             * proxyClassNamePrefix = "$Proxy";
             * proxyName = "com.sun.proxy.$Proxy0";
             */
            long num = nextUniqueNumber.getAndIncrement();
            String proxyName = proxyPkg + proxyClassNamePrefix + num;

            // 第二步，生成 byte[] （重点）
            byte[] proxyClassFile = ProxyGenerator.generateProxyClass(proxyName, interfaces, accessFlags);
            
            // 第三步，转换成 Class
            try {
                return defineClass0(loader, proxyName, proxyClassFile, 0, proxyClassFile.length);
            } catch (ClassFormatError e) {
                throw new IllegalArgumentException(e.toString());
            }
        }
    }
}
```

## ProxyGenerator

### generateProxyClass

```text
ProxyGenerator.generateProxyClass("com.sun.proxy.$Proxy0", "BasicOperation, AdvancedOperation", "Modifier.PUBLIC | Modifier.FINAL");
```

```java
public class ProxyGenerator {
    public static byte[] generateProxyClass(String name, Class<?>[] interfaces, int accessFlags)
    {
        ProxyGenerator gen = new ProxyGenerator(name, interfaces, accessFlags);
        byte[] classFile = gen.generateClassFile();

        if (saveGeneratedFiles) {
            // 保存生成的文件
        }

        return classFile;
    }
}
```

### generateClassFile

```java
public class ProxyGenerator {
    /**
     * Generate a class file for the proxy class.  This method drives the
     * class file generation process.
     */
    private byte[] generateClassFile() {

        /* ============================================================
         * Step 1: Assemble ProxyMethod objects for all methods to
         * generate proxy dispatching code for.
         */

        /*
         * Record that proxy methods are needed for the hashCode, equals,
         * and toString methods of java.lang.Object.  This is done before
         * the methods from the proxy interfaces so that the methods from
         * java.lang.Object take precedence over duplicate methods in the
         * proxy interfaces.
         */
        addProxyMethod(hashCodeMethod, Object.class);
        addProxyMethod(equalsMethod, Object.class);
        addProxyMethod(toStringMethod, Object.class);

        /*
         * Now record all of the methods from the proxy interfaces, giving
         * earlier interfaces precedence over later ones with duplicate
         * methods.
         */
        for (Class<?> intf : interfaces) {
            for (Method m : intf.getMethods()) {
                addProxyMethod(m, intf);
            }
        }


        /* ============================================================
         * Step 2: Assemble FieldInfo and MethodInfo structs for all of
         * fields and methods in the class we are generating.
         */
        try {
            methods.add(generateConstructor());

            for (List<ProxyMethod> sigmethods : proxyMethods.values()) {
                for (ProxyMethod pm : sigmethods) {

                    // add static field for method's Method object
                    fields.add(new FieldInfo(pm.methodFieldName,
                        "Ljava/lang/reflect/Method;",
                         ACC_PRIVATE | ACC_STATIC));

                    // generate code for proxy method and add it
                    methods.add(pm.generateMethod());
                }
            }

            methods.add(generateStaticInitializer());

        } catch (IOException e) {
            throw new InternalError("unexpected I/O Exception", e);
        }
        

        /* ============================================================
         * Step 3: Write the final class file.
         */

        /*
         * Make sure that constant pool indexes are reserved for the
         * following items before starting to write the final class file.
         */
        cp.getClass(dotToSlash(className));
        cp.getClass(superclassName);
        for (Class<?> intf: interfaces) {
            cp.getClass(dotToSlash(intf.getName()));
        }

        /*
         * Disallow new constant pool additions beyond this point, since
         * we are about to write the final constant pool table.
         */
        cp.setReadOnly();

        ByteArrayOutputStream bout = new ByteArrayOutputStream();
        DataOutputStream dout = new DataOutputStream(bout);

        try {
            /*
             * Write all the items of the "ClassFile" structure.
             */
                                        // u4 magic;
            dout.writeInt(0xCAFEBABE);
                                        // u2 minor_version;
            dout.writeShort(CLASSFILE_MINOR_VERSION);
                                        // u2 major_version;
            dout.writeShort(CLASSFILE_MAJOR_VERSION);

            cp.write(dout);             // (write constant pool)

                                        // u2 access_flags;
            dout.writeShort(accessFlags);
                                        // u2 this_class;
            dout.writeShort(cp.getClass(dotToSlash(className)));
                                        // u2 super_class;
            dout.writeShort(cp.getClass(superclassName));

                                        // u2 interfaces_count;
            dout.writeShort(interfaces.length);
                                        // u2 interfaces[interfaces_count];
            for (Class<?> intf : interfaces) {
                dout.writeShort(cp.getClass(dotToSlash(intf.getName())));
            }

                                        // u2 fields_count;
            dout.writeShort(fields.size());
                                        // field_info fields[fields_count];
            for (FieldInfo f : fields) {
                f.write(dout);
            }

                                        // u2 methods_count;
            dout.writeShort(methods.size());
                                        // method_info methods[methods_count];
            for (MethodInfo m : methods) {
                m.write(dout);
            }

                                         // u2 attributes_count;
            dout.writeShort(0); // (no ClassFile attributes for proxy classes)

        } catch (IOException e) {
            throw new InternalError("unexpected I/O Exception", e);
        }

        return bout.toByteArray();
    }
}
```

### saveGeneratedFiles

在 `sun.misc.ProxyGenerator` 类当中，定义了 `saveGeneratedFiles` 字段，我们可以设置如下属性：

```text
-Dsun.misc.ProxyGenerator.saveGeneratedFiles=true
```

```java
public class ProxyGenerator {
    /** debugging flag for saving generated class files */
    private final static boolean saveGeneratedFiles =
            java.security.AccessController.doPrivileged(
                    new GetBooleanAction("sun.misc.ProxyGenerator.saveGeneratedFiles")).booleanValue();
}
```

## 总结

![](/assets/images/java/reflection/proxy-and-proxy-generator-jdk08.png)

## Reference

- [OpenJDK: ProxyGenerator.java](https://hg.openjdk.java.net/jdk8/jdk8/jdk/file/tip/src/share/classes/sun/misc/ProxyGenerator.java)
