---
title: "@Advice.StubValue"
sequence: "109"
---

## 介绍

### 作用

`@Advice.StubValue` 作用：提供一个方法返回类型的『默认值』。

### 注意事项

- 参数类型：`@Advice.StubValue` 修饰的参数一定要是 `Object` 类型。
- 参数只读：只能进行读取，不能进行修改

## 示例

### 预期目标

预期目标：让 `testXxx()` 方法返回默认值。

```java
public class HelloWorld {
    public int testInt() {
        return 10;
    }

    public boolean testBoolean() {
        return true;
    }

    public Object testObject() {
        return "ABC";
    }

    public void testVoid() {
        System.out.println("test void");
    }
}
```

### 编码实现

```java
import net.bytebuddy.asm.Advice;
import net.bytebuddy.implementation.bytecode.assign.Assigner;

public class Expert {

    @Advice.OnMethodExit
    static void methodXyz(
            @Advice.Return(
                    readOnly = false,
                    typing = Assigner.Typing.DYNAMIC
            ) Object returnValue,
            @Advice.StubValue Object stubValue
    ) {
        returnValue = stubValue;
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

### 测试

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        int intValue = instance.testInt();
        System.out.println("intValue = " + intValue);

        boolean booleanValue = instance.testBoolean();
        System.out.println("booleanValue = " + booleanValue);

        Object objValue = instance.testObject();
        System.out.println("objValue = " + objValue);

        instance.testVoid();;
    }
}
```
