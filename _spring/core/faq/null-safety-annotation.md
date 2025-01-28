---
title: "Spring's Null-Safety Annotations"
sequence: "101"
---

## Null-Safety Annotations in Spring

在 `spring-core.jar` 的 `org.springframework.lang` 包中，有 4 个注解：

- @NonNull
- @NonNullFields
- @Nullable
- @NonNullApi

```text
                               ┌─── @NonNullApi
               ┌─── package ───┤
               │               └─── @NonNullFields
               │
               │               ┌─── @NonNull
Null Safety ───┼─── field ─────┤
               │               └─── @Nullable
               │
               │               ┌─── @NonNull
               │               │
               └─── method ────┼─── @Nullable
                               │
                               │                 ┌─── @NonNull
                               └─── parameter ───┤
                                                 └─── @Nullable
```

```text
                                      ┌─── field
                                      │
               ┌─── @NonNull ─────────┼─── method
               │                      │
               │                      └─── method parameter
               │
               │                      ┌─── field
               │                      │
Null Safety ───┼─── @Nullable ────────┼─── method
               │                      │
               │                      └─── method parameter
               │
               ├─── @NonNullApi ──────┼─── package
               │
               └─── @NonNullFields ───┼─── package
```

这 4 个注解，有三层递进的意思：

- 第一，先有 `@NonNull`，它用来表示某一个field、method parameter、method return value 是不为 `null` 的。
- 第二，`@NonNullFields` 和 `@NonNullApi` 是对 `@NonNull` 的延伸
    - `@NonNullFields` 是指某一个 package 下的所有 field 都是 `@NonNull`
    - `@NonNullApi` 是指某一个 package 下的所有 method parameter 和 method return value 都是 `@NonNull`
- 第三，`@Nullable` 则是对前三个注解添加例外。

## IDE Configuration

Please note that not all development tools can show these compilation warnings.
If you don't see the relevant warning, check the compiler settings in your IDE.

### IntelliJ IDEA

For IntelliJ, we can activate the annotation checking:

```text
Settings --> Build, Execution, Deployment --> Compiler
```

![](/assets/images/intellij/compiler/intellij-idea-setting-compiler-runtime-assertions-for-not-null.png)

## Automated Build Checks

So far, we are discussing how modern IDEs make it easier to write null-safe code.
However, if we want to have some automated code checks in our build pipeline,
that's also doable to some extent.

[SpotBugs][spotbugs-url] (the reincarnation of the famous but abandoned [FindBugs][findbugs-url] project)
offers a Maven/Gradle plugin that can detect code smells due to nullability.
Let's see how we can use it.

For a Maven project, we need to update the pom.xml to add the [SpotBugs Maven Plugin][spotbugs-maven-url]:

```xml
<plugin>
    <groupId>com.github.spotbugs</groupId>
    <artifactId>spotbugs-maven-plugin</artifactId>
    <version>4.5.2.0</version>
    <dependencies>
        <!-- overwrite dependency on spotbugs if you want to specify the version of spotbugs -->
        <dependency>
            <groupId>com.github.spotbugs</groupId>
            <artifactId>spotbugs</artifactId>
            <version>4.5.3</version>
        </dependency>
    </dependencies>
</plugin>
```

After building the project, we can use the following goals from this plugin:

- the `spotbugs` goal analyzes the target project.
- the `check` goal runs the `spotbugs` goal and makes the build fail if it finds any bugs.

```text
mvn spotbugs:check
mvn spotbugs:gui
```

## Reference

- [Null-safety][spring-io-url]
- [Protect Your Code from NullPointerExceptions with Spring's Null-Safety Annotations][reflectoring-io-url]
- [Spring Null-Safety Annotations][baeldung-url]

[spring-io-url]: https://docs.spring.io/spring-framework/reference/core/null-safety.html

[reflectoring-io-url]: https://reflectoring.io/spring-boot-null-safety-annotations

[baeldung-url]: https://www.baeldung.com/spring-null-safety-annotations

[spotbugs-url]: https://spotbugs.github.io/

[findbugs-url]: http://findbugs.sourceforge.net/

[spotbugs-maven-url]: https://spotbugs.readthedocs.io/en/latest/maven.html
