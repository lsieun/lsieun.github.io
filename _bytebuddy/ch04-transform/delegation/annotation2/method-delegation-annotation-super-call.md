---
title: "@SuperCall"
sequence: "119"
---

Using the `@SuperCall` annotation, an invocation of the super implementation of a method can be executed
even from outside the dynamic class.

## Callable

### 预期目标

预期目标：

- 第一步，打印 `Do Something Before` 语句
- 第二步，执行 `HelloWorld::test` 方法
- 第三步，打印 `Do Something After` 语句

```java
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        return String.format("Name: %s, Age: %s, Date: %s", name, age, date);
    }
}
```

```java
import java.util.Date;

public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String message = instance.test("Tom", 10, new Date());
        System.out.println(message);
    }
}
```


### SubClass

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

public class HelloWorldSubClass {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String className = "sample.HelloWorld";
        Class<?> clazz = Class.forName(className);


        // 第二步，生成类
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.subclass(clazz).name("sample.HelloWorldChild");

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(LazyWorker.class)
        );


        // 第三步，输出结果
        DynamicType.Unloaded<?> unloadedType = builder.make();
        OutputUtils.save(unloadedType, true);
    }
}
```

### LazyWorker

```java
import net.bytebuddy.implementation.bind.annotation.SuperCall;

import java.util.concurrent.Callable;

public class LazyWorker {
    public static String test(@SuperCall Callable<String> executable) throws Exception {
        String result = executable.call();
        return "message from LazyWorker: " + result;
    }
}
```

```java
public class HelloWorldChild extends HelloWorld {
    public String test(String var1, int var2, Date var3) {
        return LazyWorker.test(new HelloWorldChild$auxiliary$SuperCall(this, var1, var2, var3));
    }

    final String test$accessor$H9OCOLGd(String var1, int var2, Date var3) {
        return super.test(var1, var2, var3);
    }
}
```

```java
class HelloWorldChild$auxiliary$SuperCall implements Runnable, Callable {
    private HelloWorldChild argument0;
    private String argument1;
    private int argument2;
    private Date argument3;

    HelloWorldChild$auxiliary$SuperCall(HelloWorldChild var1, String var2, int var3, Date var4) {
        this.argument0 = var1;
        this.argument1 = var2;
        this.argument2 = var3;
        this.argument3 = var4;
    }
    
    public Object call() throws Exception {
        return this.argument0.test$accessor$H9OCOLGd(this.argument1, this.argument2, this.argument3);
    }

    public void run() {
        this.argument0.test$accessor$H9OCOLGd(this.argument1, this.argument2, this.argument3);
    }
}
```

## Runable

Finally, note that the `@SuperCall` annotation can also be used on the `Runnable` type
where the original method's return value is however dropped.

### LazyWorker

## AuxiliaryType

```text
HelloWorld$auxiliary$<random>
```

This helper class is called an `AuxiliaryType` within Byte Buddy's terminology.

Auxiliary types are created on demand by Byte Buddy and are directly accessible from the `DynamicType` interface after a class was created.

```java
public interface DynamicType {
    TypeDescription getTypeDescription();

    byte[] getBytes();
    
    Map<TypeDescription, byte[]> getAuxiliaryTypes();

    Map<TypeDescription, byte[]> getAllTypes();
}
```

```text
getAllTypes() = currentType + getAuxiliaryTypes()

currentType = getTypeDescription() + getBytes()
```

```java
public interface DynamicType {
    class Default implements DynamicType {
        protected final TypeDescription typeDescription;
        protected final byte[] binaryRepresentation;

        protected final List<? extends DynamicType> auxiliaryTypes;

        public TypeDescription getTypeDescription() {
            return typeDescription;
        }

        public Map<TypeDescription, byte[]> getAllTypes() {
            Map<TypeDescription, byte[]> allTypes = new LinkedHashMap<TypeDescription, byte[]>();
            allTypes.put(typeDescription, binaryRepresentation);
            for (DynamicType auxiliaryType : auxiliaryTypes) {
                allTypes.putAll(auxiliaryType.getAllTypes());
            }
            return allTypes;
        }

        public byte[] getBytes() {
            return binaryRepresentation;
        }

        public Map<TypeDescription, byte[]> getAuxiliaryTypes() {
            Map<TypeDescription, byte[]> auxiliaryTypes = new HashMap<TypeDescription, byte[]>();
            for (DynamicType auxiliaryType : auxiliaryTypes) {
                auxiliaryTypes.put(auxiliaryType.getTypeDescription(), auxiliaryType.getBytes());
                auxiliaryTypes.putAll(auxiliaryType.getAuxiliaryTypes());
            }
            return auxiliaryTypes;
        }
    }
}
```

Because of such auxiliary types,
the manual creation of one dynamic type might result in the creation of several additional types
which aid the implementation of the original class.
