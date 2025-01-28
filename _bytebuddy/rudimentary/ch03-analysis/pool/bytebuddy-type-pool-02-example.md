---
title: "TypePool示例"
sequence: "112"
---

```java
import net.bytebuddy.description.field.FieldDescription;
import net.bytebuddy.description.field.FieldList;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.ClassFileLocator;
import net.bytebuddy.pool.TypePool;

import java.io.File;
import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        String jarPath = "C:\\Users\\liusen\\.m2\\repository\\org\\apache\\commons\\commons-lang3\\3.15.0\\commons-lang3-3.15.0.jar";
        String className = "org.apache.commons.lang3.StringUtils";

        try (
                ClassFileLocator jarFileLocator = ClassFileLocator.ForJarFile.of(new File(jarPath));
                ClassFileLocator systemLocator = ClassFileLocator.ForClassLoader.ofSystemLoader();
                ClassFileLocator compoundLocator = new ClassFileLocator.Compound(jarFileLocator, systemLocator);
        ) {
            TypePool typePool = TypePool.Default.of(compoundLocator);
            TypeDescription typeDescription = typePool.describe(className).resolve();

            System.out.println(typeDescription);

            FieldList<FieldDescription.InDefinedShape> declaredFields = typeDescription.getDeclaredFields();
            for (FieldDescription field : declaredFields) {
                System.out.println(field);
            }
        }
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.ClassFileLocator;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.pool.TypePool;

import java.io.File;
import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        // 1. prepare
        String jarPath = "C:\\Users\\liusen\\.m2\\repository\\org\\apache\\commons\\commons-lang3\\3.15.0\\commons-lang3-3.15.0.jar";
        String className = "org.apache.commons.lang3.StringUtils";

        try (
                ClassFileLocator jarFileLocator = ClassFileLocator.ForJarFile.of(new File(jarPath));
                ClassFileLocator systemLocator = ClassFileLocator.ForClassLoader.ofSystemLoader();
                ClassFileLocator compoundLocator = new ClassFileLocator.Compound(jarFileLocator, systemLocator);
        ) {
            TypePool typePool = TypePool.Default.of(compoundLocator);
            TypeDescription typeDescription = typePool.describe(className).resolve();

            // 2. weave
            ByteBuddy byteBuddy = new ByteBuddy();
            // 这里的重点是：使用了 redefine(TypeDescription type, ClassFileLocator classFileLocator) 方法
            DynamicType.Builder<?> builder = byteBuddy.redefine(typeDescription, compoundLocator);

            // 3. output
            DynamicType.Unloaded<?> unloadedType = builder.make();
            OutputUtils.save(unloadedType, true);
        }
    }
}
```
