---
title: "JVM tuning flags"
sequence: "101"
---

With a few exceptions, the JVM accepts **two kinds of flags**: **boolean flags**, and **flags that require a parameter**.

**Boolean flags** use this syntax: `-XX:+FlagName` enables the flag, and `-XX:-FlagName` disables the flag.

**Flags that require a parameter** use this syntax: `-XX:FlagName=something`,
meaning to set the value of `FlagName` to `something`.
In the text, the value of the flag is usually rendered with something indicating an arbitrary value.
For example, `-XX:NewRatio=N` means that the `NewRatio` flag can be set to an arbitrary value `N`
(where the implications of `N` are the focus of the discussion).

When in doubt, we can use the `-XX:+PrintFlagsFinal` flag (by default, `false`)
to determine the default value for a particular flag in a particular environment,
given a particular command line.
The process of automatically tuning flags based on the environment is called **ergonomics**.

- ergonomics: 工效学（研究如何改善工作条件，提高工作效率）the study of working conditions, especially the design of equipment and furniture, in order to help people work more efficiently
- "scientific study of the efficiency of people in the workplace," coined 1950 from Greek **ergon** "work" (from PIE root *werg- "to do") + second element of **economics**.




