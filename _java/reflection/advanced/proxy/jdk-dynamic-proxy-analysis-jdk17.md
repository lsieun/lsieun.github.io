---
title: "JDK Dynamic Proxy Analysis (Java 17)"
sequence: "103"
---

```text
Object proxy = Proxy.newProxyInstance(classLoader, interfaces, handler);
```

## Proxy

### newProxyInstance

```java
public class Proxy implements java.io.Serializable {
    public static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h) {
        // 第一步，获取 caller
        Class<?> caller = Reflection.getCallerClass();

        // 第二步，获取 proxy class 的 constructor （重点）
        Constructor<?> cons = getProxyConstructor(caller, loader, interfaces);

        // 第三步，创建 instance
        return newProxyInstance(caller, cons, h);
    }

    private static Object newProxyInstance(Class<?> caller, Constructor<?> cons, InvocationHandler h) {
        try {
            return cons.newInstance(new Object[]{h});
        } catch (Exception ex) {
            throw new InternalError(ex.toString(), ex);
        }
    }
}
```

### getProxyConstructor

```java
public class Proxy implements java.io.Serializable {
    private static Constructor<?> getProxyConstructor(Class<?> caller, ClassLoader loader, Class<?>... interfaces)
    {
        // optimization for single interface
        if (interfaces.length == 1) {
            Class<?> intf = interfaces[0];
            if (caller != null) {
                checkProxyAccess(caller, loader, intf);
            }
            return proxyCache.sub(intf).computeIfAbsent(
                    loader,
                    (ld, clv) -> new ProxyBuilder(ld, clv.key()).build()
            );
        } else {
            // interfaces cloned
            final Class<?>[] intfsArray = interfaces.clone();
            if (caller != null) {
                checkProxyAccess(caller, loader, intfsArray);
            }
            final List<Class<?>> intfs = Arrays.asList(intfsArray);
            return proxyCache.sub(intfs).computeIfAbsent(
                    loader,
                    (ld, clv) -> new ProxyBuilder(ld, clv.key()).build()
            );
        }
    }
}
```

### ProxyBuilder

```java
public class Proxy implements java.io.Serializable {
    private static final class ProxyBuilder {
        ProxyBuilder(ClassLoader loader, List<Class<?>> interfaces) {
            this.interfaces = interfaces;
            this.module = mapToModule(loader, interfaces, refTypes);
        }

        Constructor<?> build() {
            // 第一步，获取 proxyClass
            Class<?> proxyClass = defineProxyClass(module, interfaces);

            // 第二步，获取 constructor
            final Constructor<?> cons;
            try {
                cons = proxyClass.getConstructor(constructorParams);
            } catch (NoSuchMethodException e) {
                throw new InternalError(e.toString(), e);
            }

            // 第三步，返回
            return cons;
        }

        private static Class<?> defineProxyClass(Module m, List<Class<?>> interfaces) {
            String proxyPkg = null;     // package to define proxy class in
            int accessFlags = Modifier.PUBLIC | Modifier.FINAL;
            boolean nonExported = false;


            if (proxyPkg == null) {
                // all proxy interfaces are public and exported
                proxyPkg = nonExported ? PROXY_PACKAGE_PREFIX + "." + m.getName() : m.getName();
            } else if (proxyPkg.isEmpty() && m.isNamed()) {
                throw new IllegalArgumentException("Unnamed package cannot be added to " + m);
            }


            /*
             * Choose a name for the proxy class to generate.
             */
            long num = nextUniqueNumber.getAndIncrement();
            String proxyName = proxyPkg.isEmpty()
                    ? proxyClassNamePrefix + num
                    : proxyPkg + "." + proxyClassNamePrefix + num;

            ClassLoader loader = getLoader(m);


            /*
             * Generate the specified proxy class.
             */
            byte[] proxyClassFile = ProxyGenerator.generateProxyClass(loader, proxyName, interfaces, accessFlags);
            try {
                Class<?> pc = JLA.defineClass(loader, proxyName, proxyClassFile, null, "__dynamic_proxy__");
                reverseProxyCache.sub(pc).putIfAbsent(loader, Boolean.TRUE);
                return pc;
            } catch (ClassFormatError e) {
                throw new IllegalArgumentException(e.toString());
            }
        }
    }
}
```

## ProxyGenerator

### generateProxyClass

```java
package java.lang.reflect;

final class ProxyGenerator extends ClassWriter {
    static byte[] generateProxyClass(ClassLoader loader, String name, List<Class<?>> interfaces, int accessFlags) {
        ProxyGenerator gen = new ProxyGenerator(loader, name, interfaces, accessFlags);
        byte[] classFile = gen.generateClassFile();

        if (saveGeneratedFiles) {
            // save generated files
        }

        return classFile;
    }
}
```

### generateClassFile

```java
package java.lang.reflect;

final class ProxyGenerator extends ClassWriter {
    private static final String JLR_PROXY = "java/lang/reflect/Proxy";
    
    private byte[] generateClassFile() {
        // 第一步，添加 access flag、当前类、父类、接口信息
        visit(V14, accessFlags, dotToSlash(className), null, JLR_PROXY, typeNames(interfaces));

        // 第二步，收集 proxy method
        addProxyMethod(hashCodeMethod);
        addProxyMethod(equalsMethod);
        addProxyMethod(toStringMethod);

        /*
         * Accumulate all of the methods from the proxy interfaces.
         */
        for (Class<?> intf : interfaces) {
            for (Method m : intf.getMethods()) {
                if (!Modifier.isStatic(m.getModifiers())) {
                    addProxyMethod(m, intf);
                }
            }
        }
        

        // 第三步，生成构造方法、字段、普通方法、static initializer
        generateConstructor();

        for (List<ProxyMethod> sigmethods : proxyMethods.values()) {
            for (ProxyMethod pm : sigmethods) {
                // add static field for the Method object
                visitField(ACC_PRIVATE | ACC_STATIC | ACC_FINAL, pm.methodFieldName,
                        LJLR_METHOD, null, null);

                // Generate code for proxy method
                pm.generateMethod(this, className);
            }
        }

        generateStaticInitializer();
        generateLookupAccessor();
        
        // 第四步，进行返回
        return toByteArray();
    }
}
```

