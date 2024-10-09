---
title: "Quick Start: MySQL"
sequence: "104"
---


## Example

### LoadTimeAgent

```java
import net.bytebuddy.agent.builder.AgentBuilder;

import java.lang.instrument.Instrumentation;

import static net.bytebuddy.matcher.ElementMatchers.nameContains;
import static net.bytebuddy.matcher.ElementMatchers.named;

public class LoadTimeAgent {
    private static final String CLIENT_PS_NAME = "com.mysql.cj.jdbc.ClientPreparedStatement";
    private static final String SERVER_PS_NAME = "com.mysql.cj.jdbc.ServerPreparedStatement";

    public static void premain(String agentArgs, Instrumentation inst) throws Exception {
        AgentBuilder builder = new AgentBuilder.Default()
                .ignore(
                        nameContains("bytebuddy").or(
                                nameContains("springframework")
                        )
                )
                .type(
                        named(CLIENT_PS_NAME).or(named(SERVER_PS_NAME))
                )
                .transform(new MySQLTransformer());

        builder.installOn(inst);
    }
}
```

### MySQLTransformer

```java
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.utility.JavaModule;

import java.io.IOException;
import java.security.ProtectionDomain;

import static net.bytebuddy.matcher.ElementMatchers.named;

public class MySQLTransformer implements AgentBuilder.Transformer {
    @Override
    public DynamicType.Builder<?> transform(DynamicType.Builder<?> builder,
                                            TypeDescription typeDescription,
                                            ClassLoader classLoader,
                                            JavaModule module,
                                            ProtectionDomain protectionDomain) {
        String actualName = typeDescription.getActualName();
        System.out.println("actualName = " + actualName);

        DynamicType.Builder<?> newBuilder = builder
                .method(
                        named("execute")
                                .or(named("executeUpdate"))
                                .or(named("executeQuery"))
                )
                .intercept(
                        MethodDelegation.to(MySQLWorker.class)
                );

        DynamicType.Unloaded<?> unloadedType = newBuilder.make();
        try {
            OutputUtils.save(unloadedType);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return newBuilder;
    }
}
```

### MySQLWorker

```java
import net.bytebuddy.implementation.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.concurrent.Callable;

public class MySQLWorker {
    @RuntimeType
    public static Object doWork(
            @This Object thisObj,
            @Origin Method method,
            @AllArguments Object[] allArgs,
            @SuperCall Callable<?> executable
    ) {
        Class<?>[] parameterTypes = method.getParameterTypes();
        String pos = String.format("%s.%s(%s)",
                thisObj.getClass().getName(),
                method.getName(),
                Arrays.toString(parameterTypes)
        );
        System.out.println("[Entering]: " + pos);
        System.out.println("    [Args  ]: " + Arrays.toString(allArgs));

        try {
            Object result = executable.call();
            System.out.println("    [Result]: " + result);
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            System.out.println("[Exiting ]: " + pos);
        }
    }
}
```
