---
title: "获取 Assembly 的方式"
sequence: "101"
---

## 已经加载

### 通过 Type 类

```text
Type t = typeof(string);
Assembly asm = t.Assembly;
```

- `Assembly.GetAssembly(Type)`: Gets the currently loaded assembly in which the specified type is defined.

### Assembly.Get*Assembly

- `Assembly.GetEntryAssembly()`: 程序入口
- `Assembly.GetCallingAssembly()`: “谁”调用了我
- `Assembly.GetExecutingAssembly()`: 正在执行的“我”

```text
using System;
using System.Reflection;

Assembly entryAsm = Assembly.GetEntryAssembly();
Assembly callingAsm = Assembly.GetCallingAssembly();
Assembly executingAsm = Assembly.GetExecutingAssembly();

Console.WriteLine($"EntryAssembly    : {entryAsm}");
Console.WriteLine($"CallingAssembly  : {callingAsm}");
Console.WriteLine($"ExecutingAssembly: {executingAsm}");
```

### Assembly.GetReferencedAssemblies

- `Assembly.GetReferencedAssemblies`：我调用了“谁”

```text
using System;
using System.Reflection;

Assembly currentAsm = Assembly.GetExecutingAssembly();
AssemblyName[] referencedAsmArray = currentAsm.GetReferencedAssemblies();
foreach (AssemblyName asmName in referencedAsmArray)
{
    string name = asmName.Name;
    Console.WriteLine(name);
}
```

### AppDomain.GetAssemblies

- `AppDomain.GetAssemblies`：当前 AppDomain 中使用的程序集。

```text
using System;
using System.Reflection;

AppDomain currentDomain = AppDomain.CurrentDomain;
Assembly[] asmArray = currentDomain.GetAssemblies();
foreach (Assembly asm in asmArray)
{
    string fullName = asm.FullName;
    Console.WriteLine(fullName);
}
```

## 未加载

### Private Assembly

#### Assembly.Load

第 1 种方式，` Assembly.Load(String)`：

```text
Assembly asm = Assembly.Load("Lsieun.CSharp.CarLibrary");
```

第 2 种方式，`Assembly.Load(Byte[])`

```text
string dllPath = @"D:\workspace\git-repo\learn-csharp-assembly\Lsieun.CSharp.MathLibrary\bin\Debug\Lsieun.CSharp.MathLibrary.dll";
byte[] bytes = File.ReadAllBytes(dllPath);
Assembly asm = Assembly.Load(bytes);
```

#### Assembly.LoadFrom

```text
string dllPath = @"D:\workspace\git-repo\learn-csharp-assembly\Lsieun.CSharp.CarLibrary\bin\Debug\Lsieun.CSharp.CarLibrary.dll";
Assembly asm = Assembly.LoadFrom(dllPath);
```

### Shared Assembly

```text
// Load System.Windows.Forms.dll from GAC.
string displayName = "System.Windows.Forms," +
                     "Version=4.0.0.0," +
                     "PublicKeyToken=b77a5c561934e089," +
                     @"Culture=""";
Assembly asm = Assembly.Load(displayName);
```
