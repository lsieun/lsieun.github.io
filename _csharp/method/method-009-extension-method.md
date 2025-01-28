---
title: "Extension Methods"
sequence: "109"
---

.NET 3.5 introduced the concept of **extension methods**,
which allow you to add new methods or properties to a class or structure,
without modifying the original type in any direct manner.

## Defining Extension Methods

When you define extension methods,
the first restriction is that they must be defined within a `static` class;
therefore, each extension method must be declared with the `static` keyword.
The second point is that all extension methods are marked as such
by using the `this` keyword as a modifier on the first (and only the first) parameter of the method in question.
The "this qualified" parameter represents the item being extended.

understand that a given extension method can have multiple parameters,
but only the first parameter can be qualified with `this`.
the additional parameters would be treated as normal incoming parameters for use by the method.

```csharp
using System;
using System.Reflection;

namespace ExtensionMethods
{
    public static class MyExtensions
    {
        // This method allows any object to display the assembly
        // it is defined in.
        public static void DisplayDefiningAssembly(this object obj)
        {
            Console.WriteLine(
                "{0} lives here: => {1}\n",
                obj.GetType().Name,
                Assembly.GetAssembly(obj.GetType()).GetName().Name
            );
        }

        // This method allows any integer to reverse its digits.
        // For example, 56 would return 65.
        public static int ReverseDigits(this int i)
        {
            // Translate int into a string, and then
            // get all the characters.
            char[] digits = i.ToString().ToCharArray();
            
            // Now reverse items in the array
            Array.Reverse(digits);
            
            // Put back into string
            string newDigits = new string(digits);
            
            // Finally, return the modified string back as an int
            return int.Parse(newDigits);
        }
    }
}
```

## Invoking Extension Methods

```csharp
using System;
using System.Data;
using System.Media;

namespace ExtensionMethods
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Extension Methods *****\n");

            // The int has assumed a new identity!
            int myInt = 12345678;
            myInt.DisplayDefiningAssembly();

            // So has the DataSet!
            DataSet d = new DataSet();
            d.DisplayDefiningAssembly();

            // And the SoundPlayer!
            SoundPlayer sp = new SoundPlayer();
            sp.DisplayDefiningAssembly();

            // Use new integer functionality.
            Console.WriteLine("Value of myInt: {0}", myInt);
            Console.WriteLine("Reversed digits of myInt: {0}", myInt.ReverseDigits());
            Console.ReadLine();
        }
    }
}
```

```text
***** Fun with Extension Methods *****
Int32 lives here: => mscorlib
DataSet lives here: => System.Data
SoundPlayer lives here: => System
Value of myInt: 12345678
Reversed digits of myInt: 87654321
```

## Importing Extension Methods

When you define a class containing extension methods, it will no doubt be defined within a .NET namespace.
If this namespace is different from the namespace using the extension methods,
you will need to make use of the expected C# `using` keyword.
When you do, your code file has access to all extension methods for the type being extended.
This is important to remember because if you do not explicitly import the correct namespace,
the extension methods are not available for that C# code file.

In effect, although it can appear on the surface that extension methods are global in nature,
**they are in fact limited to the namespaces** that define them or the namespaces that import them.

It is common practice to not only isolate extension methods into a dedicated .net namespace
but to isolate them into a dedicated class library.
In this way, new applications can "opt in" to extensions
by explicitly referencing the correct library and importing the namespace.

## Extending Types Implementing Specific Interfaces

At this point, you have seen how to extend classes with new functionality via extension methods.

```text
前面的例子：用 extension method 来扩展 class
```

It is also possible to define an extension method
that can only extend a class or structure that implements the correct interface.

```text
现在的例子：只能在实现特定 interface 的类，才能使用 extension method
```

For example, you could say something to the effect of “If a class or structure implements `IEnumerable<T>`,
then that type gets the following new members.”

```csharp
using System;
using System.Collections;

namespace InterfaceExtensions
{
    public static class AnnoyingExtensions
    {
        public static void PrintDataAndBeep(this IEnumerable iterator)
        {
            foreach (var item in iterator)
            {
                Console.WriteLine(item);
                Console.Beep();
            }
        }
    }
}
```

```csharp
using System;
using System.Collections.Generic;

namespace InterfaceExtensions
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Extending Interface Compatible Types *****\n");
            
            // System.Array implements IEnumerable!
            string[] data = { "Wow", "this", "is", "sort", "of", "annoying",
                "but", "in", "a", "weird", "way", "fun!"};
            data.PrintDataAndBeep();
            Console.WriteLine();
            
            // List<T> implements IEnumerable!
            List<int> myInts = new List<int>() {10, 15, 20};
            myInts.PrintDataAndBeep();
            Console.ReadLine();
        }
    }
}
```

**Extension methods play a key role for LINQ APIs.**
In fact, you will see that under the LINQ APIs,
one of the most common items being extended is a class or structure
implementing (surprise!) the generic version of `IEnumerable`.
