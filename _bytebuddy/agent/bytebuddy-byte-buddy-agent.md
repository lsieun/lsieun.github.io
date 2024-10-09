---
title: "ByteBuddyAgent"
sequence: "110"
---

```text
Instrumentation inst = ByteBuddyAgent.install();
```

```java
public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) throws Exception {
        ByteBuddyAgent.install();

        AgentBuilder.Transformer transformer = (builder, typeDescription, classLoader, module) -> builder.visit(
                Advice.to(SomeAdvice.class)
                        .on(
                                ElementMatchers.named("toUpperCase").and(
                                        ElementMatchers.isMethod()
                                ).and(
                                        ElementMatchers.takesNoArguments()
                                )
                        )
        );

        new AgentBuilder.Default()
                .with(AgentBuilder.RedefinitionStrategy.REDEFINITION)
                .with(AgentBuilder.Listener.StreamWriting.toSystemOut())
                .ignore(ElementMatchers.none())
                .type(ElementMatchers.named("java.lang.String"))
                .transform(transformer)
                .installOnByteBuddyAgent();
    }
}
```

```text
new AgentBuilder.Default()
```

The `AgentBuilder.Default` is used to instantiate a new instance of the `AgentBuilder` with default configuration.
Default configuration uses `rebase` strategy, and the agent will not instrument the JDK core class.


```text
create database app CHARACTER SET utf8mb4;
use app;

drop table if exists user_info;
CREATE TABLE `user_info` (
    `id` bigint NOT NULL AUTO_INCREMENT COMMENT ' 主键 ',
    `user_name` varchar(50) NOT NULL COMMENT ' 用户名 ',
    `pwd` varchar(50) NOT NULL COMMENT ' 密码 ',
    PRIMARY KEY('id')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT ' 管理员表 ';

insert into user_info(user_name, pwd) values('user1', '123456');
insert into user_info(user_name, pwd) values('user2', '123456');
insert into user_info(user_name, pwd) values('user3', '123456');
insert into user_info(user_name, pwd) values('user4', '123456');
```

```java
import net.bytebuddy.agent.ByteBuddyAgent;
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.asm.Advice;
import net.bytebuddy.implementation.MethodCall;
import net.bytebuddy.implementation.SuperMethodCall;
import net.bytebuddy.matcher.ElementMatchers;

import java.io.PrintStream;
import java.lang.instrument.Instrumentation;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

import static net.bytebuddy.matcher.ElementMatchers.*;

public class LoadTimeAgent {
    public static void premain(String agentArgs, Instrumentation inst) throws Exception {
        ByteBuddyAgent.install();

        AgentBuilder.Transformer transformer = (builder,typeDescription,classLoader,module, protectionDomain) -> builder.visit(
                Advice.to(Expert.class)
                        .on(
                                ElementMatchers.named("toUpperCase").and(
                                        ElementMatchers.isMethod()
                                ).and(
                                        ElementMatchers.takesNoArguments()
                                )
                        )
        );

        new AgentBuilder.Default()
                .with(AgentBuilder.RedefinitionStrategy.REDEFINITION)
                .with(AgentBuilder.Listener.StreamWriting.toSystemOut())
                .ignore(ElementMatchers.none())
                .type(ElementMatchers.named("java.lang.String"))
                .transform(transformer)
                .installOnByteBuddyAgent();
    }

    public static void premain1(String agentArgs, Instrumentation inst) throws Exception {
        Method targetMethod = PrintStream.class.getMethod("println", String.class);
        Field targetField = System.class.getField("out");

        new AgentBuilder.Default()
                .type(hasSuperType(named("my.target.UserType")))
                .transform(
                        (builder, type, classLoader, module, protectionDomain) -> builder
                                .method(any())
                                .intercept(
                                        MethodCall.invoke(targetMethod)
                                                .onField(targetField)
                                                .with("Hello World")
                                                .andThen(SuperMethodCall.INSTANCE)
                                )
                )
                .installOn(inst);
    }

    // Decorating and re-transforming classes using Byte Buddy
    public static void premain2(String agentArgs, Instrumentation inst) {
        new AgentBuilder.Default()
                .type(hasSuperType(named("sample.HelloWorld")))
                .transform(
                        (builder, typeDescription, classLoader, module, protectionDomain) -> builder
                                .visit(Advice.to(Expert.class).on(isMethod()))
                )
                .installOn(inst);
    }

    public static void premain3(String agentArgs, Instrumentation inst) {
        new AgentBuilder.Default()
                .disableClassFormatChanges()
                .with(AgentBuilder.RedefinitionStrategy.RETRANSFORMATION)
                .type(hasSuperType(named("sample.HelloWorld")))
                .transform(
                        (builder, typeDescription, classLoader, module, protectionDomain) -> builder
                                .visit(Advice.to(Expert.class).on(isMethod()))
                )
                .installOn(inst);
    }
}
```

```java
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.NamedElement;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.matcher.ElementMatcher;

import static net.bytebuddy.matcher.ElementMatchers.*;

import java.lang.instrument.Instrumentation;

public class AgentTest {
    private static final String CONTROLLER_NAME = "Controller";
    private static final String REST_CONTROLLER_NAME = "RestController";

    public static void premain(String args, Instrumentation instrumentation) {
        AgentBuilder builder = new AgentBuilder.Default()
                .ignore(
                        nameStartsWith("net.bytebuddy")
                                .or(
                                        nameStartsWith("org.apache")
                                )
                )
                // 哪些类需要拦截
                .type(
                        isAnnotatedWith(named(CONTROLLER_NAME).or(named(REST_CONTROLLER_NAME)))
                )
                .transform(new MyTransformer1())
                .with(new MyListener());
        builder.installOn(instrumentation);

    }

    private static final String CLASS_NAME = "StringUtil";

    public static void premain2(String args, Instrumentation instrumentation) {
        AgentBuilder builder = new AgentBuilder.Default()
                .type(
                        getTypeMatcher()
                )
                .transform(new MyTransformer2());
        builder.installOn(instrumentation);

    }

    private static ElementMatcher<? super TypeDescription> getTypeMatcher() {

//        return named(CLASS_NAME);

        return new ElementMatcher.Junction.AbstractBase<NamedElement>() {

            @Override
            public boolean matches(NamedElement target) {
                return CLASS_NAME.equals(target.getActualName());
            }
        };
    }

    public static void premain3(String args, Instrumentation instrumentation) {
        AgentBuilder builder = new AgentBuilder.Default()
                .type(
                        named(CLASS_NAME)
                )
                .transform(new MyTransformer3());
        builder.installOn(instrumentation);

    }
}
```

```java
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.utility.JavaModule;

import java.security.ProtectionDomain;

import static net.bytebuddy.matcher.ElementMatchers.*;

public class MyTransformer1 implements AgentBuilder.Transformer {
    private static final String MAPPING_PKG_PREFIX = "org.xxx.annotation";
    private static final String MAPPING_SUFFIX = "Mapping";

    @Override
    public DynamicType.Builder<?> transform(DynamicType.Builder<?> builder,
                                            TypeDescription typeDescription,
                                            ClassLoader classLoader,
                                            JavaModule module,
                                            ProtectionDomain protectionDomain) {
        String actualName = typeDescription.getActualName();

        DynamicType.Builder<?> builder2 = builder.method(
                        not(isStatic())
                                .and(isAnnotatedWith(
                                        nameStartsWith(MAPPING_PKG_PREFIX).and(nameEndsWith(MAPPING_SUFFIX))
                                ))
                )
                .intercept(MethodDelegation.to(new SpringMVCInterceptor()));
        return builder2;
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

public class SpringMVCInterceptor {
    @RuntimeType
    public Object interceptor(
            @This Object thisObj,
            @Origin Method method,
            @AllArguments Object[] args,
            @SuperCall Callable<String> executable
            ) {

        long start = System.currentTimeMillis();
        try {
            String result = executable.call();
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        finally {
            long end = System.currentTimeMillis();
            long diff = end - start;
            System.out.println("diff = " + diff);
        }
    }
}
```

```java
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.utility.JavaModule;

public class MyListener implements AgentBuilder.Listener {
    @Override
    public void onDiscovery(String typeName, ClassLoader classLoader, JavaModule module, boolean loaded) {
        System.out.println("onDiscovery - typeName = " + typeName);
    }

    @Override
    public void onTransformation(TypeDescription typeDescription, ClassLoader classLoader, JavaModule module, boolean loaded, DynamicType dynamicType) {
        System.out.println("onTransformation - typeDescription = " + typeDescription);
    }

    @Override
    public void onIgnored(TypeDescription typeDescription, ClassLoader classLoader, JavaModule module, boolean loaded) {
        System.out.println("onIgnored - typeDescription = " + typeDescription);
    }

    @Override
    public void onError(String typeName, ClassLoader classLoader, JavaModule module, boolean loaded, Throwable throwable) {
        System.out.println("typeName = " + typeName);
    }

    @Override
    public void onComplete(String typeName, ClassLoader classLoader, JavaModule module, boolean loaded) {
        System.out.println("typeName = " + typeName);
    }
}
```

```java
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.utility.JavaModule;

import java.security.ProtectionDomain;

import static net.bytebuddy.matcher.ElementMatchers.isStatic;

public class MyTransformer2 implements AgentBuilder.Transformer {
    @Override
    public DynamicType.Builder<?> transform(DynamicType.Builder<?> builder,
                                            TypeDescription typeDescription,
                                            ClassLoader classLoader,
                                            JavaModule module,
                                            ProtectionDomain protectionDomain) {
        return builder.method(
                isStatic()
        )
                .intercept(
                        MethodDelegation.to(new StringUtilsInterceptor())
                )
                ;
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

public class StringUtilsInterceptor {
    @RuntimeType
    public Object interceptor(
            @Origin Method method,
            @AllArguments Object[] args,
            @SuperCall Callable<String> executable
    ) {

        long start = System.currentTimeMillis();
        try {
            String result = executable.call();
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        finally {
            long end = System.currentTimeMillis();
            long diff = end - start;
            System.out.println("diff = " + diff);
        }
    }
}
```

```java
import net.bytebuddy.agent.builder.AgentBuilder;
import net.bytebuddy.description.type.TypeDescription;
import net.bytebuddy.dynamic.DynamicType;
import net.bytebuddy.implementation.MethodDelegation;
import net.bytebuddy.implementation.SuperMethodCall;
import net.bytebuddy.utility.JavaModule;

import java.security.ProtectionDomain;

import static net.bytebuddy.matcher.ElementMatchers.any;

public class MyTransformer3 implements AgentBuilder.Transformer {
    @Override
    public DynamicType.Builder<?> transform(DynamicType.Builder<?> builder,
                                            TypeDescription typeDescription,
                                            ClassLoader classLoader,
                                            JavaModule module,
                                            ProtectionDomain protectionDomain) {
        return builder.constructor(any())
                .intercept(
                        SuperMethodCall.INSTANCE.andThen(
                                MethodDelegation.to(new MyInterceptor())
                        )
                );
    }
}
```

```java
import net.bytebuddy.implementation.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.concurrent.Callable;

public class MyInterceptor {
    @RuntimeType
    public Object interceptor(
            @This Object thisObj,
            @Origin Method method,
            @AllArguments Object[] args,
            @SuperCall Callable<String> executable
    ) {

        long start = System.currentTimeMillis();
        try {
            String result = executable.call();
            return result;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        finally {
            long end = System.currentTimeMillis();
            long diff = end - start;
            System.out.println("diff = " + diff);
        }
    }
}
```

## ByteBuddyAgent.install();

```java
public class HelloWorld {
    public void test() {
        System.out.println("Hello World");
    }
}
```

```java
public class GoodChild {
    public void test() {
        System.out.println("Good Child");
    }
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.agent.ByteBuddyAgent;
import net.bytebuddy.dynamic.loading.ClassReloadingStrategy;

public class Program {
    public static void main(String[] args) {
        HelloWorld instance = new HelloWorld();
        instance.test();


        ByteBuddyAgent.install();
        new ByteBuddy().redefine(GoodChild.class)
                .name(HelloWorld.class.getName())
                .make()
                .load(HelloWorld.class.getClassLoader(), ClassReloadingStrategy.fromInstalledAgent());


        instance.test();
    }
}
```
