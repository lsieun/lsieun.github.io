---
title: "New Application Domains"
sequence: "104"
---

## 创建新的 Application Domains

Recall that a single process is capable of hosting multiple application domains
via the static `AppDomain.CreateDomain()` method.

```csharp
using System;
using System.Linq;

namespace CustomAppDomains
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Custom AppDomains *****\n");

            // Show all loaded assemblies in default AppDomain.
            AppDomain defaultAD = AppDomain.CurrentDomain;
            ListAllAssembliesInAppDomain(defaultAD);

            // Make a new AppDomain.
            MakeNewAppDomain();
        }

        private static void MakeNewAppDomain()
        {
            // Make a new AppDomain in the current process and list loaded assemblies.
            AppDomain newAD = AppDomain.CreateDomain("SecondAppDomain");
            ListAllAssembliesInAppDomain(newAD);
        }

        static void ListAllAssembliesInAppDomain(AppDomain ad)
        {
            // Now get all loaded assemblies in the default AppDomain.
            var loadedAssemblies = from a in ad.GetAssemblies()
                orderby a.GetName().Name
                select a;

            Console.WriteLine("***** Here are the assemblies loaded in {0} *****\n", ad.FriendlyName);
            foreach (var a in loadedAssemblies)
            {
                Console.WriteLine("-> Name: {0}", a.GetName().Name);
                Console.WriteLine("-> Version: {0}\n", a.GetName().Version);
            }
        }
    }
}
```

```text
***** Fun with Custom AppDomains *****

***** Here are the assemblies loaded in CustomAppDomains.exe *****

-> Name: CustomAppDomains
-> Version: 1.0.0.0

-> Name: mscorlib
-> Version: 4.0.0.0

-> Name: System
-> Version: 4.0.0.0

-> Name: System.Core
-> Version: 4.0.0.0

***** Here are the assemblies loaded in SecondAppDomain *****

-> Name: mscorlib
-> Version: 4.0.0.0
```

## 在 AppDomain 中加载 Assembly

The CLR will always load assemblies into the default application domain when required.
However, if you do ever manually create new AppDomains,
you can load assemblies into said AppDomain using the `AppDomain.Load()` method.
Also, be aware that the `AppDomain.ExecuteAssembly()` method can be called
to load an `*.exe` assembly and execute the `Main()` method.

```csharp
using System;
using System.IO;
using System.Linq;

namespace CustomAppDomains
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Custom AppDomains *****\n");

            // Show all loaded assemblies in default AppDomain.
            AppDomain defaultAD = AppDomain.CurrentDomain;
            ListAllAssembliesInAppDomain(defaultAD);

            // Make a new AppDomain.
            MakeNewAppDomain2();
        }

        private static void MakeNewAppDomain2()
        {
            // Make a new AppDomain in the current process.
            AppDomain newAD = AppDomain.CreateDomain("SecondAppDomain");
            try
            {
                // Now load CarLibrary.dll into this new domain.
                newAD.Load("CarLibrary");
            }
            catch (FileNotFoundException ex)
            {
                Console.WriteLine(ex.Message);
            }
        
            // List all assemblies.
            ListAllAssembliesInAppDomain(newAD);
        }

        static void ListAllAssembliesInAppDomain(AppDomain ad)
        {
            // Now get all loaded assemblies in the default AppDomain.
            var loadedAssemblies = from a in ad.GetAssemblies()
                orderby a.GetName().Name
                select a;

            Console.WriteLine("***** Here are the assemblies loaded in {0} *****\n", ad.FriendlyName);
            foreach (var a in loadedAssemblies)
            {
                Console.WriteLine("-> Name   : {0}", a.GetName().Name);
                Console.WriteLine("-> Version: {0}\n", a.GetName().Version);
            }
        }
    }
}
```

```text
***** Fun with Custom AppDomains *****

***** Here are the assemblies loaded in CustomAppDomains.exe *****

-> Name   : CustomAppDomains
-> Version: 1.0.0.0

-> Name   : mscorlib
-> Version: 4.0.0.0

-> Name   : System
-> Version: 4.0.0.0

-> Name   : System.Core
-> Version: 4.0.0.0

***** Here are the assemblies loaded in SecondAppDomain *****

-> Name   : CarLibrary
-> Version: 3.0.0.0

-> Name   : mscorlib
-> Version: 4.0.0.0
```

## 卸载 AppDomain

The .NET platform does not allow you to unload a specific assembly from memory.
The only way to programmatically unload libraries is
to tear down the hosting application domain via the `Unload()` method.

It is important to point out that the CLR does not permit unloading individual .NET assemblies.
However, using the `AppDomain.Unload()` method,
you are able to selectively unload a given application domain from its hosting process.
When you do so, the application domain will unload each assembly in turn.

Recall that the `AppDomain` type defines the `DomainUnload` event,
which is fired when a custom application domain is unloaded from the containing process.
Another event of interest is the `ProcessExit` event,
which is fired when the default application domain is unloaded from the process
(which obviously entails the termination of the process itself).

```csharp
using System;
using System.IO;
using System.Linq;

namespace CustomAppDomains
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Custom AppDomains *****\n");

            // Show all loaded assemblies in default AppDomain.
            AppDomain defaultAD = AppDomain.CurrentDomain;
            defaultAD.ProcessExit += (o, s) =>
            {
                Console.WriteLine("Default AD unloaded!");
            };
            
            ListAllAssembliesInAppDomain(defaultAD);

            // Make a new AppDomain.
            MakeNewAppDomain3();
        }

        private static void MakeNewAppDomain3()
        {
            // Make a new AppDomain in the current process.
            AppDomain newAD = AppDomain.CreateDomain("SecondAppDomain");
            newAD.DomainUnload += (o, s) =>
            {
                Console.WriteLine("The second AppDomain has been unloaded!");
            };
            
            try
            {
                // Now load CarLibrary.dll into this new domain.
                newAD.Load("CarLibrary");
            }
            catch (FileNotFoundException ex)
            {
                Console.WriteLine(ex.Message);
            }
        
            // List all assemblies.
            ListAllAssembliesInAppDomain(newAD);
            
            // Now tear down this AppDomain.
            AppDomain.Unload(newAD);
        }

        static void ListAllAssembliesInAppDomain(AppDomain ad)
        {
            // Now get all loaded assemblies in the default AppDomain.
            var loadedAssemblies = from a in ad.GetAssemblies()
                orderby a.GetName().Name
                select a;

            Console.WriteLine("***** Here are the assemblies loaded in {0} *****\n", ad.FriendlyName);
            foreach (var a in loadedAssemblies)
            {
                Console.WriteLine("-> Name   : {0}", a.GetName().Name);
                Console.WriteLine("-> Version: {0}\n", a.GetName().Version);
            }
        }
    }
}
```

```text
***** Fun with Custom AppDomains *****

***** Here are the assemblies loaded in CustomAppDomains.exe *****

-> Name   : CustomAppDomains
-> Version: 1.0.0.0

-> Name   : mscorlib
-> Version: 4.0.0.0

-> Name   : System
-> Version: 4.0.0.0

-> Name   : System.Core
-> Version: 4.0.0.0

***** Here are the assemblies loaded in SecondAppDomain *****

-> Name   : CarLibrary
-> Version: 3.0.0.0

-> Name   : CustomAppDomains
-> Version: 1.0.0.0

-> Name   : mscorlib
-> Version: 4.0.0.0

The second AppDomain has been unloaded!
Default AD unloaded!
```

