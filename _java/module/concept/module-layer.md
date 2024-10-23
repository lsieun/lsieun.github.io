---
title: "ModuleLayer"
sequence: "103"
---

```java
public class HelloWorld {
    public static void main(String[] args) {
        printLayer(Object.class);
        printLayer(HelloWorld.class);
    }

    public static void printLayer(Class<?> clazz) {
        Module module = clazz.getModule();
        System.out.println(module.getName());

        ModuleLayer layer = module.getLayer();
        System.out.println(layer);
    }
}
```

```java
public class HelloWorld {
    public static void main(String[] args) {
        ModuleLayer bootLayer = ModuleLayer.boot();
        System.out.println(bootLayer);
    }
}
```

```java
import java.util.Set;

public class HelloWorld {
    public static void main(String[] args) {
        ModuleLayer bootLayer = ModuleLayer.boot();
        Set<Module> modules = bootLayer.modules();
        for (Module m : modules) {
            System.out.println(m.getName());
        }
    }
}
```

