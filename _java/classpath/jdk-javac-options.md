---
title: "JDK_JAVAC_OPTIONS"
---

A launcher environment variable, `JDK_JAVAC_OPTIONS`,
was introduced in JDK 9 that prepended its content to the command line to `javac`.

The content of the `JDK_JAVAC_OPTIONS` environment variable,
separated by white-spaces (` `) or white-space characters (`\n`, `\t`, `\r`, or `\f`)
is prepended to the command line arguments passed to `javac` as a list of arguments.

The encoding requirement for the environment variable is the same as the `javac` command line on the system.
`JDK_JAVAC_OPTIONS` environment variable content is treated in the same manner as that specified in the command line.

Single quotes (`'`) or double quotes (`"`) can be used to enclose arguments that contain **whitespace characters**.
All content between the open quote and the first matching close quote are preserved by simply removing the pair of quotes.
In case a matching quote is not found, the launcher will abort with an error message.

> 如果遇到 whitespace，需要用 quotes 来解决

`@files` are supported as they are specified in the command line. However, as in `@files`, use of a **wildcard**(`*`) is not supported.

Examples of quoting arguments containing **white spaces**:

```text
export JDK_JAVAC_OPTIONS='@"C:\white spaces\argfile"'

export JDK_JAVAC_OPTIONS='"@C:\white spaces\argfile"'

export JDK_JAVAC_OPTIONS='@C:\"white spaces"\argfile'
```

