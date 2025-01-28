---
title: "@Advice.OnMethodExit"
sequence: "102"
---

## 介绍

- [ ] 出现次数：一次

![](/assets/images/bytebuddy/advice/bytebuddy-method-advice-annotation-on-method-exit-notice.png)

## 示例

### repeatOn

#### 预期目标

```java
public class HelloWorld {
    public static Class<?> getComponentType(Class<?> clazz) {
        if (clazz.isArray()) {
            return clazz.getComponentType();
        }
        else {
            return clazz;
        }
    }
}
```

```text
┌───────────┬─────────┐
│    int    │   int   │
├───────────┼─────────┤
│   int[]   │   int   │
├───────────┼─────────┤
│  int[][]  │  int[]  │
├───────────┼─────────┤
│ int[][][] │ int[][] │
└───────────┴─────────┘
```

#### 编码实现

第一个版本：不使用 `repeatOn`

```java
import net.bytebuddy.asm.Advice;

public class Expert {

    @Advice.OnMethodExit
    static void methodXyz(@Advice.Return(readOnly = false) Class<?> returnValue) {
        Class<?> clazz = returnValue;
        while (clazz.isArray()) {
            clazz = clazz.getComponentType();
        }
        returnValue = clazz;
    }
}
```

第二个版本：使用 `repeatOn`

```java
import net.bytebuddy.asm.Advice;

public class Expert {

    @Advice.OnMethodExit(repeatOn = Advice.OnNonDefaultValue.class)
    static Class<?> methodXyz(@Advice.Return(readOnly = false) Class<?> returnValue,
                              @Advice.Exit(readOnly = false) Class<?> exitValue) {
        if (exitValue == null) {
            exitValue = returnValue;
        }

        if (exitValue.isArray()) {
            exitValue = exitValue.getComponentType();
            return exitValue;
        }
        else {
            returnValue = exitValue;
            return null;
        }
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldRedefine {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz)
                .name(className);

        builder = builder.visit(
                Advice.to(Expert.class).on(ElementMatchers.isMethod())
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

#### 测试

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        Class<?>[] clazzArray = {
                int.class,
                int[].class,
                int[][].class,
                int[][][].class
        };
        int length = clazzArray.length;

        String[][] matrix = new String[length][2];
        for (int i = 0; i < length; i++) {
            Class<?> clazz = clazzArray[i];
            Class<?> componentType = HelloWorld.getComponentType(clazz);
            matrix[i][0] = clazz.getSimpleName();
            matrix[i][1] = componentType.getSimpleName();
        }

        TableUtils.printTable(matrix);
    }
}
```

```text
┌───────────┬─────┐
│    int    │ int │
├───────────┼─────┤
│   int[]   │ int │
├───────────┼─────┤
│  int[][]  │ int │
├───────────┼─────┤
│ int[][][] │ int │
└───────────┴─────┘
```
