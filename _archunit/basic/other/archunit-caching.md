---
title: "Caching"
sequence: "102"
---

## 存在的问题

ArchUnit analyzes all classes that are imported by the `ClassFileImporter`.
The scanning of all classes can quite slow sometimes (especially for larger projects) and
is repeated for every test
when we explicitly include the import for every test:

```text
JavaClasses importedClasses = new ClassFileImporter().importPackages("lsieun.archunit");
```

## 解决方法

If we import classes using `@AnalyzeClasses` and annotate our tests with `@ArchTest` instead of `@Test`:

- 第 1 步，测试类引入 `@AnalyzeClasses` 注解
- 第 2 步，测试方法引入 `@ArchTest` 注解和 `JavaClasses classes` 参数

```java
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition;

@AnalyzeClasses(packages = "lsieun.archunit")
public class ArchUnitCachedTest {
    @ArchTest
    public void doNotCallDeprecatedMethodsFromTheProject(JavaClasses classes) {
        // (1) rule
        ArchRule rule = ArchRuleDefinition.noClasses().should()
                .dependOnClassesThat().areAnnotatedWith(Deprecated.class);

        // (2)
        rule.check(classes);
    }
}
```
