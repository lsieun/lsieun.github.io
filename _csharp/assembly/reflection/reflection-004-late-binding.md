---
title: "Understanding Late Binding"
sequence: "104"
---

Simply put, **late binding** is a technique
in which you are able to **create an instance of a given type** and
**invoke its members at runtime** without having hard-coded compile-time knowledge of its existence.
When you are building an application that binds late to a type in an external assembly,
you have no reason to set a reference to the assembly;
therefore, the caller's manifest has no direct listing of the assembly.

## The System.Activator Class

The `System.Activator` class (defined in `mscorlib.dll`) is the key to the .NET late-binding process.
For the current example, you are interested only in the `Activator.CreateInstance()` method,
which is used to create an instance of a type à la late binding.
This method has been overloaded numerous times to provide a good deal of flexibility.
The simplest variation of the `CreateInstance()` member takes a valid `Type` object
that describes the entity you want to allocate into memory on the fly.

```csharp
using System;
using System.IO;
using System.Reflection;

namespace LateBindingApp
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Late Binding *****");

            // Try to load a local copy of CarLibrary.
            Assembly a = null;
            try
            {
                a = Assembly.Load("CarLibrary");
            }
            catch (FileNotFoundException ex)
            {
                Console.WriteLine(ex.Message);
                return;
            }

            if (a != null)
            {
                CreateUsingLateBinding(a);
            }

            Console.ReadLine();
        }

        static void CreateUsingLateBinding(Assembly asm)
        {
            try
            {
                // Get metadata for the Minivan type.
                Type miniVan = asm.GetType("CarLibrary.MiniVan");

                // Create a Minivan instance on the fly.
                object obj = Activator.CreateInstance(miniVan);
                Console.WriteLine("Created a {0} using late binding!", obj);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
```

## Invoking Methods with No Parameters

```csharp
using System;
using System.IO;
using System.Reflection;

namespace LateBindingApp
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Late Binding *****");

            // Try to load a local copy of CarLibrary.
            Assembly a = null;
            try
            {
                a = Assembly.Load("CarLibrary");
            }
            catch (FileNotFoundException ex)
            {
                Console.WriteLine(ex.Message);
                return;
            }

            if (a != null)
            {
                CreateUsingLateBinding(a);
            }

            Console.ReadLine();
        }

        static void CreateUsingLateBinding(Assembly asm)
        {
            try
            {
                // Get metadata for the Minivan type.
                Type miniVan = asm.GetType("CarLibrary.MiniVan");
                
                // Create the Minivan on the fly.
                object obj = Activator.CreateInstance(miniVan);
                Console.WriteLine("Created a {0} using late binding!", obj);
                
                // Get info for TurboBoost.
                MethodInfo mi = miniVan.GetMethod("TurboBoost");
                
                // Invoke method ('null' for no parameters).
                mi.Invoke(obj, null);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
```

## Invoking Methods with Parameters

```csharp
using System;
using System.IO;
using System.Reflection;

namespace LateBindingApp
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Late Binding *****");

            // Try to load a local copy of CarLibrary.
            Assembly a = null;
            try
            {
                a = Assembly.Load("CarLibrary");
            }
            catch (FileNotFoundException ex)
            {
                Console.WriteLine(ex.Message);
                return;
            }

            if (a != null)
            {
                InvokeMethodWithArgsUsingLateBinding(a);
            }

            Console.ReadLine();
        }

        static void InvokeMethodWithArgsUsingLateBinding(Assembly asm)
        {
            try
            {
                // First, get a metadata description of the sports car.
                Type sport = asm.GetType("CarLibrary.SportsCar");

                // Now, create the sports car.
                object obj = Activator.CreateInstance(sport);

                // Invoke TurnOnRadio() with arguments.
                MethodInfo mi = sport.GetMethod("TurnOnRadio");
                mi.Invoke(obj, new object[] { true, 2 });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
```

