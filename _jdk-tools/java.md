---
title:  "java"
sequence: "104"
---


## Locale

```text
$ java -Duser.language=en -help
```

Windows

For me changing the `HKEY_CURRENT_USER\Control Panel\International\LocaleName` to `en-US` did the trick.

原来是`zh-CN`，将其修改为`en-US`

`user.language` and `user.country` work, you can try the following examples:

```text
java -Duser.language=en -Duser.country=US
```

If you want jvm to select it by default, you should set environment variable `JAVA_TOOL_OPTIONS`,
it works on Windows too (except that setting environment variable is a little different on Windows)!

```text
export JAVA_TOOL_OPTIONS="-Duser.language=en -Duser.country=US"
```

[How do I view and change the system locale settings to use my language of choice?](https://www.java.com/en/download/help/locale.html)

