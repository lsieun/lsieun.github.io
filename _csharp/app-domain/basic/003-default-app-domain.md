---
title: "Default Application Domain"
sequence: "103"
---

Recall that when a .NET executable starts,
the CLR will automatically place it into the default AppDomain of the hosting process.
This is done automatically and transparently, and you never have to author any specific code to do so.
However, it is possible for your application to gain access to this default application domain
using the static `AppDomain.CurrentDomain` property.
After you have this access point, you are able to hook into any events of interest
or use the methods and properties of `AppDomain` to perform some runtime diagnostics.


## 查看基本信息

```csharp
using System;

namespace DefaultAppDomainApp
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with the default AppDomain *****\n");
            DisplayDADStats();
        }

        private static void DisplayDADStats()
        {
            // Get access to the AppDomain for the current thread.
            AppDomain defaultAD = AppDomain.CurrentDomain;

            // Print out various stats about this domain.
            Console.WriteLine("ID                : {0}", defaultAD.Id);
            Console.WriteLine("FriendlyName      : {0}", defaultAD.FriendlyName);
            Console.WriteLine("IsDefaultAppDomain: {0}", defaultAD.IsDefaultAppDomain());
            Console.WriteLine("BaseDirectory     : {0}", defaultAD.BaseDirectory);
        }
    }
}
```

```text
***** Fun with the default AppDomain *****

ID                : 1
FriendlyName      : DefaultAppDomainApp.exe
IsDefaultAppDomain: True
BaseDirectory     : D:\workspace\lab\Lsieun.CSharp\DefaultAppDomainApp\bin\Debug\
```

## 查看加载的 Assembly

```csharp
using System;
using System.Reflection;

namespace DefaultAppDomainApp
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with the default AppDomain *****\n");
            ListAllAssembliesInAppDomain();
        }

        static void ListAllAssembliesInAppDomain()
        {
            // Get access to the AppDomain for the current thread.
            AppDomain defaultAD = AppDomain.CurrentDomain;
        
            // Now get all loaded assemblies in the default AppDomain.
            Assembly[] loadedAssemblies = defaultAD.GetAssemblies();
        
            Console.WriteLine("***** Here are the assemblies loaded in {0} *****\n", defaultAD.FriendlyName);
            foreach (Assembly a in loadedAssemblies)
            {
                Console.WriteLine("-> Name: {0}", a.GetName().Name);
                Console.WriteLine("-> Version: {0}\n", a.GetName().Version);
            }
        }
    }
}
```

```text
***** Fun with the default AppDomain *****

***** Here are the assemblies loaded in DefaultAppDomainApp.exe *****

-> Name   : mscorlib
-> Version: 4.0.0.0

-> Name   : DefaultAppDomainApp
-> Version: 1.0.0.0
```

## Assembly 加载通知

If you want to be informed by the CLR when a new assembly has been loaded into a given application domain,
you may handle the `AssemblyLoad` event.
This event is typed against the `AssemblyLoadEventHandler` delegate,
which can point to any method taking a `System.Object` as the first parameter and
an `AssemblyLoadEventArgs` as the second.

```csharp
using System;
using System.Reflection;

namespace DefaultAppDomainApp
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with the default AppDomain *****\n");
            InitDAD();
        }

        private static void InitDAD()
        {
            // This logic will print out the name of any assembly loaded into the applicaion domain,
            // after it has been created.
            AppDomain defaultAD = AppDomain.CurrentDomain;
            defaultAD.AssemblyLoad += (o, s) =>
            {
                Console.WriteLine("{0} has been loaded!", s.LoadedAssembly.GetName().Name);
            };

            // Load System.Windows.Forms.dll from GAC.
            string displayName = "System.Windows.Forms," +
                          "Version=4.0.0.0," +
                          "PublicKeyToken=b77a5c561934e089," +
                          @"Culture=""";
            Assembly asm = Assembly.Load(displayName);
            Console.WriteLine("Assembly Name: " + asm.GetName());
        }
    }
}
```

```text
***** Fun with the default AppDomain *****

System.Windows.Forms has been loaded!
System has been loaded!
System.Drawing has been loaded!
Assembly Name: System.Windows.Forms, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089
```
