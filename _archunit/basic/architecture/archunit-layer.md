---
title: "Layer"
sequence: "101"
---

```java
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.library.Architectures;
import org.junit.jupiter.api.Test;

public class LayerArchitectureRuleTest {
    @Test
    void layer_dependencies_are_respected() {
        // (1) classes
        JavaClasses classes = new ClassFileImporter().importPackages("lsieun.arch.theme.layer");

        // (2) rule
        ArchRule rule = Architectures.layeredArchitecture()
                .consideringOnlyDependenciesInLayers()
                // Define layers
                .layer("Controllers").definedBy("lsieun.arch.theme.layer.controller..")
                .layer("Services").definedBy("lsieun.arch.theme.layer.service..")
                .layer("Persistence").definedBy("lsieun.arch.theme.layer.repository..")
                // Add constraints
                .whereLayer("Controllers").mayNotBeAccessedByAnyLayer()
                .whereLayer("Services").mayOnlyBeAccessedByLayers("Controllers")
                .whereLayer("Persistence").mayOnlyBeAccessedByLayers("Services");

        // (3) check
        rule.check(classes);
    }
}
```
