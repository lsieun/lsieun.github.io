---
title: "TypeVariableSource"
sequence: "TypeVariableSource"
---

## API 设计

```java
public interface TypeVariableSource extends ModifierReviewable.OfAbstraction {
    TypeList.Generic getTypeVariables();

    TypeVariableSource getEnclosingSource();

    boolean isInferrable();

    TypeDescription.Generic findVariable(String symbol);

    TypeDescription.Generic findExpectedVariable(String symbol);

    <T> T accept(Visitor<T> visitor);

    boolean isGenerified();
}
```

### 类继承层级

```text

```
