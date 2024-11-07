---
title: ".NET Assembly Namespace"
sequence: "102"
---

While the C# compiler has no problems with a single C# code file containing multiple types,
this could be cumbersome when you want to reuse class definitions in new projects.

```text
一个文件里可以定义多个类
```

## Resolving Name Clashes with Aliases

The C# using keyword also lets you create an alias for a type's fully qualified name.
When you do so, you define a token that is substituted for the type's full name at compile time.
Defining aliases provides a second way to resolve name clashes.

```csharp
using System;
using MyShapes;
using My3DShapes;
// Resolve the ambiguity using a custom alias.
using The3DHexagon = My3DShapes.Hexagon;
namespace CustomNamespaces
{
    class Program
    {
        static void Main(string[] args)
        {
            // This is really creating a My3DShapes.Hexagon class.
            The3DHexagon h2 = new The3DHexagon();
            // ...
        }
    }
}
```

Be aware that overuse of C# aliases can result in a confusing codebase.
If other programmers on your team are unaware of your custom aliases,
they could assume the aliases refer to types in the .Net base class libraries and
become quite confused when they can't find these tokens in the .Net Framework SDK documentation!

## The Default Namespace of Visual Studio

On a final namespace-related note, it is worth pointing out that,
by default, when you create a new C# project using Visual Studio,
the name of your application's default namespace will be identical to the project name.

From this point on, when you insert new code files using the `Project ➤ Add New Item` menu selection,
types will automatically be wrapped within the default namespace.

If you want to change the name of the default namespace,
simply access the "**Default namespace**" option
using the **Application** tab of the project's properties window.

![](/assets/images/csharp/vs/vs-application-default-namespace.png)
