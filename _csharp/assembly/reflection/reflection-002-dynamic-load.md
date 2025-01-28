---
title: "Dynamically Loading Assemblies"
sequence: "102"
---

`System.Reflection` defines a class named `Assembly`.

Using this class, you are able to dynamically load an assembly,
as well as discover properties about the assembly itself.
Using the `Assembly` type, you are able to dynamically load **private or shared assemblies**,
as well as load an assembly located at an arbitrary location.
In essence, the `Assembly` class provides methods (`Load()` and `LoadFrom()`, in particular)
that allow you to programmatically supply the same sort of information found in a `client-side*.config` file.

```csharp
using System;
using System.Reflection;

namespace ExternalAssemblyReflector
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** External Assembly Viewer *****");
            
            string asmName = "";
            Assembly asm = null;
            
            do
            {
                Console.WriteLine("\nEnter an assembly to evaluate");
                Console.Write("or enter Q to quit: ");
                
                // Get name of assembly.
                asmName = Console.ReadLine();
                
                // Does user want to quit?
                if (asmName.Equals("Q",StringComparison.OrdinalIgnoreCase))
                {
                    break;
                }
                
                // Try to load assembly.
                try
                {
                    // asm = Assembly.Load(asmName);
                    asm = Assembly.LoadFrom(asmName);
                    DisplayTypesInAsm(asm);
                }
                catch
                {
                    Console.WriteLine("Sorry, can't find assembly.");
                }
            } while (true);
        }

        static void DisplayTypesInAsm(Assembly asm)
        {
            Console.WriteLine("\n***** Types in Assembly *****");
            Console.WriteLine("->{0}", asm.FullName);
            Type[] types = asm.GetTypes();
            foreach (Type t in types)
            {
                Console.WriteLine("Type: {0}", t);
            }

            Console.WriteLine("");
        }
    }
}
```




