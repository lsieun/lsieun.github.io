---
title: "Directory"
sequence: "901"
---

## Current Directory

```csharp
using System;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string currentDirectory = Environment.CurrentDirectory;
            Console.WriteLine("Current Directory: {0}", currentDirectory);
            Console.ReadLine();
        }
    }
}
```

```text
Current Directory: D:\vs-workspace\HelloCSharp\HelloCSharp\bin\Debug
```

## System Directory

```csharp
using System;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string systemDirectory = Environment.SystemDirectory;
            Console.WriteLine("System Directory: {0}", systemDirectory);
            Console.ReadLine();
        }
    }
}
```

```text
System Directory: C:\Windows\system32
```

## Application.StartupPath

```text
string str = Application.StartupPath.SubString(0, Application....);
str += @"\img.jpg";
e.Graphics.DrawImage(Image.FromFile(str), 10, 10, 607,452);
```
