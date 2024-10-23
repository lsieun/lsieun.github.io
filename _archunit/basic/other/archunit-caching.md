---
title: "Caching"
sequence: "102"
---

ArchUnit analyzes all classes that are imported by the `ClassFileImporter`.
The scanning of all classes can quite sometimes (especially for larger projects) and is repeated for every test
when we explicitly include the import for every test:

```text
JavaClasses importedClasses = new ClassFileImporter().importPackages("io.reflectoring.archunit");
```

If we import classes using `@AnalyzeClasses` and annotate our tests with `@ArchTest` instead of `@Test`:

```java

@AnalyzeClasses(packages = "io.reflectoring.archunit")
public class ArchUnitCachedTest {
    @ArchTest
    public void doNotCallDeprecatedMethodsFromTheProject(JavaClasses classes) {
        JavaClasses importedClasses = classes;
        ArchRule rule = noClasses().should()
                .dependOnClassesThat().areAnnotatedWith(Deprecated.class);
        rule.check(importedClasses);
    }

    @ArchTest
    public void doNotCallConstructorCached(JavaClasses classes) {
        JavaClasses importedClasses = classes;
        ArchRule rule = noClasses().should()
                .callConstructor(BigDecimal.class, double.class);
        rule.check(importedClasses);
    }
}
```
