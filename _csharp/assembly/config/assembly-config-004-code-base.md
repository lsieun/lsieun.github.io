---
title: "codeBase"
sequence: "104"
---

The `<codeBase>` element can be used to instruct the CLR to probe for dependent assemblies
located at arbitrary locations
(such as network endpoints or an arbitrary machine path outside a client's application directory).

## Remote Machine

If the value assigned to a `<codeBase>` element is located on a remote machine,
the assembly will be downloaded on demand to a specific directory in the GAC termed the download cache.

Given what you have learned about deploying assemblies to the GAC,
it should make sense that assemblies loaded from a `<codeBase>` element will need to be assigned a strong name
(after all, how else could the CLR install remote assemblies to the GAC?).
If you are interested, you can view the content of your machine's download cache
by supplying the `/ldl` option to `gacutil.exe`, like so:

```text
gacutil /ldl
```

### Relative

Technically speaking, the `<codeBase>` element can be used to probe for **assemblies that do not have strong names**.
However, the assembly's location must be relative to the client's application directory
(and, thus, is little more than an alternative to the `<privatePath>` element).

## 代码

```csharp
using System;
using CarLibrary;

namespace CodeBaseClient
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with CodeBases *****");
            
            SportsCar c = new SportsCar();
            c.TurboBoost();
            Console.WriteLine("Sports car has been allocated.");
            Console.ReadLine();
        }
    }
}
```

## Config

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <runtime>
        <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
            <dependentAssembly>
                <assemblyIdentity name="CarLibrary" publicKeyToken="0154117be54bfa1a" culture="neutral"/>
                <codeBase version="3.0.0.0" href="file:///D:/tmp/CSharp/CarLibrary.dll"/>
            </dependentAssembly>
        </assemblyBinding>
    </runtime>
</configuration>
```

As you can see, the `<codeBase>` element is nested within the `<assemblyIdentity>` element,
which makes use of the `name` and `publicKeyToken` attributes
to specify the friendly name and associated `publicKeyToken` values.
The `<codeBase>` element itself specifies the version and location (via the `href` property) of the assembly to load.
If you were to delete version `2.0.0.0` of `CarLibrary.dll` from the GAC,
this client would still run successfully, as the CLR is able to locate the external assembly under `C:\MyAsms`.

## Remote Machine

The `<codeBase>` element can also be helpful when referencing assemblies located on a remote networked machine.

To download the remote `*.dll` to the GAC's download cache on your local machine,
you could update the `<codeBase>` element as follows:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <runtime>
        <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
            <dependentAssembly>
                <assemblyIdentity name="CarLibrary" publicKeyToken="0154117be54bfa1a" culture="neutral"/>
                <codeBase version="3.0.0.0" href="https://blog.lsieun.cn/Assemblies/CarLibrary.dll"/>
            </dependentAssembly>
        </assemblyBinding>
    </runtime>
</configuration>
```

```text
没有测试成功
```
