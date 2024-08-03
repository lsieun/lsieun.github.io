---
title: "NamingStrategy 源码解析"
sequence: "102"
---

```java
package net.bytebuddy;

public interface NamingStrategy {
    String BYTE_BUDDY_RENAME_PACKAGE = "net.bytebuddy.renamed";

    String NO_PREFIX = "";

    String subclass(TypeDescription.Generic superClass);

    String redefine(TypeDescription typeDescription);

    String rebase(TypeDescription typeDescription);
}
```

```text
                  ┌─── String subclass(TypeDescription.Generic superClass)
                  │
NamingStrategy ───┼─── String redefine(TypeDescription typeDescription)
                  │
                  └─── String rebase(TypeDescription typeDescription)
```

```text
                                               ┌─── PrefixingRandom (C)
NamingStrategy (I) ───┼─── AbstractBase (A) ───┤
                                               └─── Suffixing (C) ─────────┼─── SuffixingRandom (C)
```

## AbstractBase

```java
public interface NamingStrategy {
    abstract class AbstractBase implements NamingStrategy {
        public String subclass(TypeDescription.Generic superClass) {
            return name(superClass.asErasure());
        }

        protected abstract String name(TypeDescription superClass);

        public String redefine(TypeDescription typeDescription) {
            return typeDescription.getName();
        }

        public String rebase(TypeDescription typeDescription) {
            return typeDescription.getName();
        }
    }
}
```
