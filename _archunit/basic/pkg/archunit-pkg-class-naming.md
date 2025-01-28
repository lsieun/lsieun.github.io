---
title: "类的名字与 Pkg"
sequence: "101"
---

## ClassName To Pkg

```java
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;

public class ClassName2PkgTest {
    @Test
    void repository_must_reside_in_a_repository_package() {
        // (1) classes
        JavaClasses classes = new ClassFileImporter().importPackages("lsieun.arch");

        // (2) rule
        ArchRule rule = classes()
                .that().haveNameMatching(".*Repository")
                .should().resideInAPackage("..persistence..")
                .as("DAOs should reside in a package '..dao..'");

        // (3) check
        rule.check(classes);
    }
}
```

## Pkg To ClassName

```java
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;

public class Pkg2ClassNameRuleTest {
    @Test
    void service_should_be_prefixed() {
        // (1) classes
        JavaClasses classes = new ClassFileImporter().importPackages("lsieun.arch.service");

        // (2) rule
        ArchRule rule = classes()
                .that().resideInAPackage("..service..")
                .and().areAnnotatedWith(Component.class)
                .should().haveSimpleNameEndingWith("Service");

        // (3) check
        rule.check(classes);
    }
}
```
