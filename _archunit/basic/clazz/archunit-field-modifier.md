---
title: "字段修饰符"
sequence: "102"
---

```java
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;


public class FieldModifierRuleTest {
    @Test
    void loggers_should_be_private_static_final() {
        // (1) classes
        JavaClasses classes = new ClassFileImporter().importPackages("lsieun.arch.service");

        // (2) rule
        ArchRule rule = ArchRuleDefinition.fields()
                .that().haveRawType(Logger.class)
                .should().bePrivate()
                .andShould().beStatic()
                .andShould().beFinal()
                .because("we agreed on this convention");

        // (3) check
        rule.check(classes);
    }
}
```
