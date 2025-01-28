---
title: "类与类的依赖（Pkg）"
sequence: "102"
---

```java
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

public class ClassDependencyRuleTest {
    @Test
    void services_should_not_access_controllers() {
        // (1) classes
        JavaClasses classes = new ClassFileImporter().importPackages("lsieun.arch.theme.layer");

        // (2) rule
        ArchRule rule = noClasses()
                .that().resideInAPackage("..service..")
                .should().accessClassesThat()
                .resideInAPackage("..controller..");

        // (3) check
        rule.check(classes);
    }

    @Test
    public void controllers_should_not_access_controllers() {
        // (1) classes
        JavaClasses classes = new ClassFileImporter().importPackages("lsieun.arch.theme.layer.controller");

        // (2) rule
        ArchRule apiRule= noClasses()
                .should().accessClassesThat()
                .resideInAPackage("lsieun.arch.theme.layer.repository");

        // (3) check
        apiRule.check(classes);
    }
}
```
