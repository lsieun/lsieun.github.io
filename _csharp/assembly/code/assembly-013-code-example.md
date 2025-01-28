---
title: "Assembly Code Example"
sequence: "113"
---

## Name

- `Assembly.FullName`: Gets the display name of the assembly.

```text
using System;
using System.Reflection;

Type t = typeof(string);
Assembly asm = t.Assembly;
string fullName = asm.FullName;
Console.WriteLine(fullName);
```

```text
mscorlib, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089
```
