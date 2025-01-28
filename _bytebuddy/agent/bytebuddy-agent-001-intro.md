---
title: "ByteBuddy Agent: Intro"
sequence: "101"
---


An agent builder provides a convenience API for defining a Java agent.
By default, this transformation is applied by **rebasing** the type if not specified
otherwise by setting a `AgentBuilder.TypeStrategy`.

```java
public interface AgentBuilder {
    interface TypeStrategy {
        enum Default implements TypeStrategy {
            REBASE,
            REDEFINE,
            REDEFINE_FROZEN,
            DECORATE;
        }
    }
}
```

When defining several `AgentBuilder.Transformer`s,
the agent builder always applies the transformers that were supplied with the last applicable matcher.
Therefore, more general transformers should be defined first.

Note: Any transformation is performed using the `java.security.AccessControlContext` of an agent's creator.

Important: **Types that implement lambda expressions (functional interfaces) are not instrumented by default**
but only when enabling the builder's `AgentBuilder.LambdaInstrumentationStrategy`.





