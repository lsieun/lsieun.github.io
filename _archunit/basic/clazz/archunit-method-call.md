---
title: "方法调用"
sequence: "103"
---

## 方法调用

```java
import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import com.tngtech.archunit.lang.syntax.ArchRuleDefinition;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

class MethodCallRuleTest {
    @Test
    void instantiateLocalDateTimeWithClock() {
        // (1) classes
        JavaClasses importedClasses = new ClassFileImporter().importPackages("lsieun.arch.theme.clazz.method");

        // (2) rule
        ArchRule rule = ArchRuleDefinition.noClasses()
                .should().callMethod(LocalDateTime.class, "now")
                .because("We recommend to use 'LocalDateTime.now(Clock clock)'");

        // (3) check
        rule.check(importedClasses);
    }

    @Test
    public void doNotCallBigDecimalConstructorWithDouble() {
        JavaClasses importedClasses = new ClassFileImporter().importPackages("lsieun.arch.theme.clazz.method");
        ArchRule rule = ArchRuleDefinition.noClasses()
                .should().callConstructor(BigDecimal.class, double.class);
        rule.check(importedClasses);
    }
}
```
