---
title: "Shared Assemblies Config"
sequence: "107"
---

## Dynamically Redirecting to Specific Versions of a Shared Assembly



### Single

```text
>>gacutil /l CarLibrary
Microsoft (R) .NET Global Assembly Cache Utility.  Version 4.0.30319.0
Copyright (c) Microsoft Corporation.  All rights reserved.

The Global Assembly Cache contains the following assemblies:
  CarLibrary, Version=1.0.0.0, Culture=neutral, PublicKeyToken=0154117be54bfa1a, processorArchitecture=MSIL
  CarLibrary, Version=2.0.0.0, Culture=neutral, PublicKeyToken=0154117be54bfa1a, processorArchitecture=MSIL

Number of items = 2
```

Update the current configuration file in the application directory of `SharedCarLibClient` named
`SharedCarLibClient.exe.config` that contains the following XML data.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <!--Runtime binding info -->
    <runtime>
        <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
            <dependentAssembly>
                <assemblyIdentity name="CarLibrary" publicKeyToken="0154117be54bfa1a" culture="neutral"/>
                <bindingRedirect oldVersion="1.0.0.0" newVersion="2.0.0.0"/>
            </dependentAssembly>
        </assemblyBinding>
    </runtime>
</configuration>
```

When you want to tell the CLR to load a version of a shared assembly other than the version listed in the manifest,
you can build a `*.config` file that contains a `<dependentAssembly>` element.
When doing so, you will need to create an `<assemblyIdentity>` sub-element
that specifies the friendly name of the assembly listed in the client manifest (`CarLibrary`, for this example) and
an optional culture attribute
(which can be assigned an empty string or omitted altogether if you want to use the default culture for the machine).
Moreover, the `<dependentAssembly>` element will define a `<bindingRedirect>` sub-element to define the
version currently in the manifest (via the `oldVersion` attribute) and the version in the GAC to load instead
(via the `newVersion` attribute).

### Multiple

Multiple `<dependentAssembly>` elements can appear within a client's configuration file.
Although there's no need for this example, assume that the manifest of `SharedCarLibClient.exe`
also references version `2.5.0.0` of an assembly named `MathLibrary`.
If you wanted to redirect to version `3.0.0.0` of `MathLibrary`
(in addition to version `2.0.0.0` of `CarLibrary`),
the `SharedCarLibClient.exe.config` file would look like the following:

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <runtime>
        <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
            <!-- Controls Binding to CarLibrary -->
            <dependentAssembly>
                <assemblyIdentity name="CarLibrary" publicKeyToken="64ee9364749d8328" culture=""/>
                <bindingRedirect oldVersion="1.0.0.0" newVersion="2.0.0.0"/>
            </dependentAssembly>

            <!-- Controls Binding to MathLibrary -->
            <dependentAssembly>
                <assemblyIdentity name="MathLibrary" publicKeyToken="64ee9364749d8328" culture=""/>
                <bindingRedirect oldVersion="2.5.0.0" newVersion="3.0.0.0"/>
            </dependentAssembly>
        </assemblyBinding>
    </runtime>
</configuration>
```

### Range

It is possible to specify a range of old version numbers via the `oldVersion` attribute;

```text
<bindingRedirect oldVersion="1.0.0.0-1.2.0.0" newVersion="2.0.0.0"/>
```


