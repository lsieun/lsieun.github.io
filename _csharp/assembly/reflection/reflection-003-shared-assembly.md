---
title: "Reflecting on Shared Assemblies"
sequence: "103"
---

The `Assembly.Load()` method has been overloaded a number of times.
One variation allows you to specify a culture value (for **localized assemblies**),
as well as a version number and public key token value (for **shared assemblies**).

Collectively speaking, the set of items identifying an assembly is termed the **display name**.
The format of a display name is a comma-delimited string of name-value pairs
that begins with the friendly name of the assembly, followed by optional qualifiers (that may appear in any order).
Here is the template to follow (optional items appear in parentheses):

```text
Name (,Version = major.minor.build.revision) (,Culture = culture token) (,PublicKeyToken= public key token)
```

When you're crafting a display name, the convention `PublicKeyToken=null` indicates that
binding and matching against a non-strongly named assembly is required.
Additionally, `Culture=""` indicates matching against the default culture of the target machine.
Here's an example:

```text
// Load version 1.0.0.0 of CarLibrary using the default culture.
Assembly a = Assembly.Load(@"CarLibrary, Version=1.0.0.0, PublicKeyToken=null, Culture=""");
```

```csharp
using System;
using System.Linq;
using System.Reflection;

namespace Lsieun.CSharp.SharedAsmReflector
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** The Shared Asm Reflector App *****\n");

            // Load System.Windows.Forms.dll from GAC.
            string displayName = "System.Windows.Forms," +
                                 "Version=4.0.0.0," +
                                 "PublicKeyToken=b77a5c561934e089," +
                                 @"Culture=""";
            Assembly asm = Assembly.Load(displayName);
            
            DisplayInfo(asm);
            Console.WriteLine("Done!");
        }

        private static void DisplayInfo(Assembly asm)
        {
            Console.WriteLine("***** Info about Assembly *****");
            Console.WriteLine("Loaded from GAC? {0}", asm.GlobalAssemblyCache);
            Console.WriteLine("Asm Name: {0}", asm.GetName().Name);
            Console.WriteLine("Asm Version: {0}", asm.GetName().Version);
            Console.WriteLine("Asm Culture: {0}", asm.GetName().CultureInfo.DisplayName);

            Console.WriteLine("\nHere are the public enums:");

            // Use a LINQ query to find the public enums.
            Type[] types = asm.GetTypes();
            var publicEnums = from pe in types
                where pe.IsEnum &&
                      pe.IsPublic
                select pe;
            foreach (var pe in publicEnums)
            {
                Console.WriteLine(pe);
            }
        }
    }
}
```




