---
title: "@SuperCall = @This + @SuperMethod + @AllArguments"
sequence: "139"
---

```text
@SuperCall = @This + @SuperMethod + @AllArguments
```

```java
public class Parent {
    public void sayHello() {
        System.out.println("Hello");
    }
}
```

```java
import java.util.Base64;
import java.util.Date;

public class HelloWorld {
    public String test(String name, int age, Date date) {
        String str = String.format("%s:%s:%s", name, age, date);
        byte[] bytes = str.getBytes();
        return Base64.getEncoder().encodeToString(bytes);
    }
}
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        String str = instance.test();
        System.out.println(str);
        instance.sayHello();
    }
}
```



```java
import net.bytebuddy.implementation.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

public class HardWorker {

    @RuntimeType
    public static Object doWork(
            @Super Parent zuper,
            @SuperMethod Method superMethod,
            @SuperCall Callable<Object> instrumentedMethod,

            @This Object target,
            @Origin Method method
    ) throws Throwable {
        long startTime = System.currentTimeMillis();

        System.out.println("@Super      : " + zuper.getClass().getName());
        System.out.println("@SuperMethod: " + superMethod.getName());
        System.out.println("@SuperCall  : " + instrumentedMethod.getClass().getName());
        System.out.println("@This       : " + target.getClass().getName());
        System.out.println("@Origin     : " + method.getName());

        Object result = instrumentedMethod.call();

        long endTime = System.currentTimeMillis();
        long diff = endTime - startTime;
        System.out.println("Execution Time: " + diff);
        return result;
    }

}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.File;
import java.util.Map;

public class HelloWorldTransform {
    public static void main(String[] args) {
        // 1. prepare
        String className = "sample.HelloWorld";
        Class<?> clazz = ClassUtils.loadClass(className);

        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();
        DynamicType.Builder<?> builder = byteBuddy.rebase(clazz);

        builder = builder.method(
                ElementMatchers.named("test")
        ).intercept(
                MethodDelegation.to(HardWorker.class)
        );

        // 3. output
        DynamicType.Unloaded<?> unloadedType = builder.make();
        Map<TypeDescription, File> map = unloadedType.saveIn(FileUtils.OUTPUT_DIR);
        for (Map.Entry<TypeDescription, File> entry : map.entrySet()) {
            String type = entry.getKey().getName();
            String path = entry.getValue().getPath().replace("\\", "/");
            ASMUtils.removeSynthetic(path);
            String message = String.format("%s: file:///%s", type, path);
            System.out.println(message);
        }
    }
}
```

```text
@Super      : sample.HelloWorld$auxiliary$Parent
@SuperMethod: test$original$ABC$accessor$XYZ
@SuperCall  : sample.HelloWorld$auxiliary$Invoke
@This       : sample.HelloWorld
@Origin     : test
```

