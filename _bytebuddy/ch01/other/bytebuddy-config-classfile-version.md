---
title: "ClassFile版本"
sequence: "101"
---


## ClassFileVersion

`net.bytebuddy.ClassFileVersion`

```java
public class ClassFileVersion implements Comparable<ClassFileVersion>, Serializable {
    public static final ClassFileVersion JAVA_V1 = new ClassFileVersion(Opcodes.V1_1);
    // ...
    public static final ClassFileVersion JAVA_V7 = new ClassFileVersion(Opcodes.V1_7);
    public static final ClassFileVersion JAVA_V8 = new ClassFileVersion(Opcodes.V1_8);
    public static final ClassFileVersion JAVA_V9 = new ClassFileVersion(Opcodes.V9);
    public static final ClassFileVersion JAVA_V10 = new ClassFileVersion(Opcodes.V10);
    public static final ClassFileVersion JAVA_V11 = new ClassFileVersion(Opcodes.V11);
    // ...
    public static final ClassFileVersion JAVA_V17 = new ClassFileVersion(Opcodes.V17);
}
```

生成版本为 Java 11 的 `.class` 文件：

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.ClassFileVersion;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy().with(ClassFileVersion.JAVA_V11);
        DynamicType.Builder<?> builder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC)
                .name(className);


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType);
    }
}
```

