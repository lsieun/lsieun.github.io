---
title: "@Advice.Exit"
sequence: "105"
---

## 介绍

### 作用

`@Advice.Enter` 作用：定义一个局部变量，负责将 `@Advice.OnMethodExit` 方法的『返回值』 传递给 `@Advice.OnMethodExit` 方法。

![](/assets/images/bytebuddy/advice/bytebuddy-method-advice-annotation-exit-illustration.png)


## 示例

### 求和

预期目标：输入一个数 `n`，计算从 `1` 加到 `n` 的和。

修改之前：

```java
public class HelloWorld {
    public int calculate(int n) {
        return n;
    }
}
```

修改之后：

```java
public class HelloWorld {

    public int calculate(int n) {
        int currentValue = 0;                // @Advice.Local("currentValue") int currentValue
        int sum = 0;                         // @Advice.Local("sum") int sum
        int exitValue = 0;                   // @Advice.Exit(readOnly = false) int exitValue

        int returnValue;                     // @Advice.Return(readOnly = false) int returnValue
        do {
            int num = n;
            returnValue = num;               // functional.code
            if (currentValue == 0) {         // advice.code.exit
                currentValue = n;
            } else {
                currentValue = exitValue;
            }

            sum += currentValue;
            exitValue = currentValue - 1;
            if (exitValue == 0) {
                returnValue = sum;
            }                                // advice.code.exit

            exitValue = exitValue;
        } while(exitValue != 0);             // @Advice.OnMethodExit(repeatOn = Advice.OnNonDefaultValue.class)

        return returnValue;
    }
}
```

编码实现：

```java
import net.bytebuddy.asm.Advice;

public class Expert {


    @Advice.OnMethodExit(repeatOn = Advice.OnNonDefaultValue.class)
    static int methodXyz(@Advice.Argument(value = 0) int num,
                         @Advice.Return(readOnly = false) int returnValue,
                         @Advice.Local("currentValue") int currentValue,
                         @Advice.Local("sum") int sum,
                         @Advice.Exit(readOnly = false) int exitValue) {

        // (1) currentValue
        if (currentValue == 0) {
            currentValue = num;
        }
        else {
            currentValue = exitValue;
        }

        // (2) sum
        sum += currentValue;

        // (3) exitValue
        exitValue = currentValue - 1;

        // (4) returnValue
        if (exitValue == 0) {
            returnValue = sum;
        }

        return exitValue;
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
        DynamicType.Builder<?> builder = byteBuddy.redefine(clazz);

        builder = builder.visit(
                Advice.to(Expert.class).on(ElementMatchers.isMethod())
        );


        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

测试：

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        int result = instance.calculate(5);
        System.out.println(result);
    }
}
```
