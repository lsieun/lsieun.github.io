---
title: "Quick Start: Spring Boot MVC"
sequence: "103"
---

## Example

### LoadTimeAgent

```java
import net.bytebuddy.agent.builder.AgentBuilder;

import java.lang.instrument.Instrumentation;

import static net.bytebuddy.matcher.ElementMatchers.*;

public class LoadTimeAgent {
    private static final String CONTROLLER_NAME = "org.springframework.stereotype.Controller";
    private static final String REST_CONTROLLER_NAME = "org.springframework.web.bind.annotation.RestController";

    public static void premain(String agentArgs, Instrumentation inst) throws Exception {
        AgentBuilder builder = new AgentBuilder.Default()
                .ignore(
                        nameContains("bytebuddy").or(
                                nameContains("springframework")
                        )
                )
                .type(
                        isAnnotatedWith(
                                named(CONTROLLER_NAME).or(named(REST_CONTROLLER_NAME))
                        )
                )
                .transform(new MvcTransformer());

        builder.installOn(inst);
    }
}
```

### MvcTransformer

```java
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.utility.JavaModule;

import java.io.IOException;
import java.security.ProtectionDomain;

import static net.bytebuddy.matcher.ElementMatchers.*;

public class MvcTransformer implements AgentBuilder.Transformer {
    private static final String MAPPING_PKG_PREFIX = "org.springframework.web.bind.annotation.";
    private static final String MAPPING_SUFFIX = "Mapping";

    @Override
    public DynamicType.Builder<?> transform(DynamicType.Builder<?> builder,
                                            TypeDescription typeDescription,
                                            ClassLoader classLoader,
                                            JavaModule module,
                                            ProtectionDomain protectionDomain) {
        String actualName = typeDescription.getActualName();
        System.out.println("actualName = " + actualName);

        DynamicType.Builder<?> newBuilder = builder.method(
                        not(isStatic()).and(
                                isAnnotatedWith(
                                        nameStartsWith(MAPPING_PKG_PREFIX).and(nameEndsWith(MAPPING_SUFFIX))
                                )
                        )
                )
                .intercept(
                        MethodDelegation.to(SpringMvcWorker.class)
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


### SpringMvcWorker

```java
import net.bytebuddy.implementation.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.concurrent.Callable;

public class SpringMvcWorker {
    @RuntimeType
    public static Object doWork(
            @This Object thisObj,
            @Origin Method method,
            @AllArguments Object[] allArgs,
            @SuperCall Callable<?> executable
    ) throws Exception {
        String pos = String.format("%s -> %s", thisObj.getClass().getName(), method.getName());
        System.out.println("Entering: " + pos);
        System.out.println("[Args]: " + Arrays.toString(allArgs));
        Object result = executable.call();
        System.out.println("[Result]: " + result);
        System.out.println("Exiting: " + pos);
        return result;
    }
}
```
