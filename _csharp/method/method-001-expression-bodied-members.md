---
title: "Return Values and Expression Bodied Members"
sequence: "101"
---

C# 6 introduced **expression-bodied members** that shorten the syntax for single-line methods.

```csharp
using System;

namespace FunWithMethods
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            int a = 3;
            int b = 4;
            int result = Add(a, b);
            Console.WriteLine("result = {0}", result);
        }

        static int Add(int x, int y) => x + y;
    }
}
```

This is what is commonly referred to as **syntactic sugar**, meaning that the generated IL is no different.  
It's just another way to write the method.
Some find it easier to read, and others don't, so the choice is yours (or your team's) which style you prefer.

This syntax also works with read-only member properties.

C# 7 expanded this capability to include **single-line constructors, finalizers, and get and set accessors**
on properties and indexers.

Don't be alarmed by the `=>` operator. this is a **lambda operation**.
For now, just consider them a shortcut to writing single-line statements.
