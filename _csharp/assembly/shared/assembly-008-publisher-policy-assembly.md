---
title: "Publisher Policy Assemblies"
sequence: "108"
---

Publisher policy allows the publisher of a given assembly (you, your department, your company, or what have you)
to ship a binary version of a `*.config` file that is installed into the GAC along with the newest
version of the associated assembly.
The benefit of this approach is that client application directories do not need to contain specific `*.config` files.
Rather, the CLR will read the current manifest and attempt to find the requested version in the GAC.
However, if the CLR finds a publisher policy assembly,
it will read the embedded XML data and perform the requested redirection at the level of the GAC.

Publisher policy assemblies are created at the command line using a .NET utility named `al.exe` (the assembly linker).
Though this tool provides many options,
building a publisher policy assembly requires passing in only the following input parameters:

- The location of the `*.config` or `*.xml` file containing the redirecting instructions
- The name of the resulting publisher policy assembly
- The location of the `*.snk` file used to sign the publisher policy assembly
- The version numbers to assign the publisher policy assembly being constructed

If you wanted to build a publisher policy assembly that controls `CarLibrary.dll`,
the command set would be as follows (which must be entered on a single line within the command window):

File: `CarLibraryPolicy.xml`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <runtime>
        <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
            <dependentAssembly>
                <assemblyIdentity name="CarLibrary"
                                  publicKeyToken="0154117be54bfa1a"
                                  culture="neutral"/>
                <!-- Redirecting to version 2.0.0.0 of the assembly. -->
                <bindingRedirect oldVersion="1.0.0.0-2.0.0.0"
                                 newVersion="3.0.0.0"/>
            </dependentAssembly>
        </assemblyBinding>
    </runtime>
</configuration>
```

```text
al /link:CarLibraryPolicy.xml /out:policy.1.0.CarLibrary.dll /keyfile:C:\MyKey\myKey.snk /v:1.0.0.0
```

```text
al /link:CarLibraryPolicy.xml /out:policy.1.0.CarLibrary.dll /keyfile:D:\workspace\lab\Lsieun.CSharp\CarLibrary\myKeyPair.snk /v:1.0.0.0
```

![](/assets/images/csharp/cmd/al-car-lib-dll-policy-explorer.png)

![](/assets/images/csharp/ildasm/car-lib-policy-dll-manifest-resource-xml.png)


Here, the XML content is contained within a file named `CarLibraryPolicy.xml`.
The name of the output file (which must be in the format `policy.<major>.<minor>.assemblyToConfigure`)
is specified using the obvious `/out` flag.
In addition, note that the name of the file containing the public/private key pair will
also need to be supplied via the `/keyf` option.
Remember, publisher policy files are shared and, therefore, must have strong names!

Once the `al.exe` tool has executed, the result is a new assembly
that can be placed into the GAC to force all clients to bind to version 2.0.0.0 of `CarLibrary.dll`,
without the use of a specific client application configuration file.
Using this technique, you can design a machine-wide redirection for all applications
using a specific version (or range of versions) of an existing assembly.

```text
gacutil /i publisherPolicyAssemblyFile
```

```text
>gacutil /i policy.1.0.CarLibrary.dll
Microsoft (R) .NET Global Assembly Cache Utility.  Version 4.0.30319.0
Copyright (c) Microsoft Corporation.  All rights reserved.

Assembly successfully added to the cache
```

## Disabling Publisher Policy

In such a case, it is possible to build a configuration file for a specific troubled client
that instructs the CLR to ignore the presence of any publisher policy files installed in the GAC.

To disable publisher policy on a client-by-client basis, author a (properly named)
`*.config` file that uses the `<publisherPolicy>` element and set the `apply` attribute to `no`.
When you do so, the CLR will load the version of the assembly originally listed in the client's manifest.

File: `SharedCarLibClient.exe.config`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <runtime>
        <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
            <publisherPolicy apply="no"/>
        </assemblyBinding>
    </runtime>
</configuration>
```





## Reference

- [How to: Create a Publisher Policy](https://learn.microsoft.com/en-us/dotnet/framework/configure-apps/how-to-create-a-publisher-policy)
- [Al.exe (Assembly Linker)](https://learn.microsoft.com/en-us/dotnet/framework/tools/al-exe-assembly-linker)
