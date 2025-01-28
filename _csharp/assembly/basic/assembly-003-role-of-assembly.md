---
title: "The Role of .NET Assemblies"
sequence: "103"
---


## Assemblies Promote Code Reuse

.NET applications are constructed by piecing together any number of **assemblies**.
Simply put, an assembly is a versioned, self-describing binary file hosted by the CLR.
Now, despite that .NET assemblies have the same file extensions (`*.exe` or `*.dll`) as previous Windows binaries,
they have little in common with those files under the hood.

Do be aware, however, that a **code library** need not take a `*.dll` file extension.
It is perfectly possible (although certainly not common)
for an executable assembly to use types defined within an external executable file.
In this light, a referenced `*.exe` can also be considered a code library.

## Assemblies Establish a Type Boundary

Recall that a type's **fully qualified name** is composed
by prefixing the type's namespace (e.g., System) to its name (e.g., Console).
Strictly speaking, however, the assembly in which a type resides further establishes a type's identity.
For example, if you have two uniquely named assemblies (say, `MyCars.dll` and `YourCars.dll`) that
both define a namespace (`CarLibrary`) containing a class named `SportsCar`,
they are considered unique types in the .NET universe.

## Assemblies Are Versionable Units

.NET assemblies 的版本号由四部分组成：

```text
<major>.<minor>.<build>.<revision>
```

在 Visual Studio 中，版本号的默认值为 `1.0.0.0`。


This number, in conjunction with an optional public key value,
allows multiple versions of the same assembly to coexist in harmony on a single machine.

Formally speaking, assemblies that provide public key information are termed **strongly named**.
By using a strong name, the CLR is able to ensure that the correct version of an
assembly is loaded on behalf of the calling client.

## Assemblies Are Self-Describing

Assemblies are regarded as self-describing,
in part because they record every external assembly
they must have access to in order to function correctly.
Thus, if your assembly requires `System.Windows.Forms.dll` and `System.Core.dll`,
this will be documented in the assembly's **manifest**.

In addition to **manifest data**, an assembly contains **metadata** that describes the composition
(member names, implemented interfaces, base classes, constructors, and so forth) of every contained type.
Because an assembly is documented in such detail,
the CLR does not consult the Windows system registry to resolve its location
(quite the radical departure from Microsoft's legacy COM programming model).

## Assemblies Are Configurable

Assemblies can be deployed as “private” or “shared.”

**Private assemblies** reside in the same directory  
(or possibly a subdirectory) as the client application that uses them.

**Shared assemblies**, on the other hand, are libraries intended to be consumed by numerous applications
on a single machine and are deployed to a
specific directory termed the **global assembly cache**, or **GAC**.

Regardless of how you deploy your assemblies, you are free to author **XML-based configuration files.**
Using these configuration files, you can instruct the CLR to “probe” for assemblies at a specific location,
load a specific version of a referenced assembly for a particular client,
or consult an arbitrary directory on your local machine, your network location, or a web-based URL.
