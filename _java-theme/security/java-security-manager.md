---
title: "java.security.manager"
sequence: "103"
---

[UP]({% link _java-theme/java-security-index.md %})

在`sun.misc.Launcher`类的构造方法`Launcher()`里，对`java.security.manager`属性进行了设置：

```java
public class Launcher {
    private ClassLoader loader;

    public Launcher() {
        // Create the extension class loader
        ClassLoader extClassLoader;
        try {
            extClassLoader = ExtClassLoader.getExtClassLoader();
        } catch (IOException e) {
            throw new InternalError("Could not create extension class loader", e);
        }

        // Now create the class loader to use to launch the application
        try {
            loader = AppClassLoader.getAppClassLoader(extClassLoader);
        } catch (IOException e) {
            throw new InternalError("Could not create application class loader", e);
        }

        // Also set the context class loader for the primordial thread.
        Thread.currentThread().setContextClassLoader(loader);

        // Finally, install a security manager if requested
        String s = System.getProperty("java.security.manager");
        if (s != null) {
            SecurityManager sm = null;
            if ("".equals(s) || "default".equals(s)) {
                sm = new java.lang.SecurityManager();
            }
            else {
                try {
                    sm = (SecurityManager) loader.loadClass(s).newInstance();
                } catch (IllegalAccessException | InstantiationException |
                        ClassNotFoundException | ClassCastException e) {
                }
            }
            if (sm != null) {
                System.setSecurityManager(sm);
            }
            else {
                throw new InternalError("Could not create SecurityManager: " + s);
            }
        }
    }
}
```

