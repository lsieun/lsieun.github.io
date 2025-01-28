---
title: "Understanding the Role of .NET Attributes"
sequence: "101"
---

.NET attributes are class types that extend the abstract `System.Attribute` base class.

As you explore the .NET namespaces, you will find many **predefined attributes**
that you are able to use in your applications.
Furthermore, you are free to build **custom attributes** to further qualify the behavior of your types
by creating a new type deriving from `Attribute`.

## Attribute Consumers

As you would guess, **the .NET 4.7 Framework SDK ships with numerous utilities**
that are indeed on the lookout for various attributes.
The C# compiler (`csc.exe`) itself has been preprogrammed
to discover the presence of various attributes during the compilation cycle.
For example, if the C# compiler encounters the `[CLSCompliant]` attribute,
it will automatically check the attributed item to ensure it is exposing only CLS-compliant constructs.
By way of another example, if the C# compiler discovers an item attributed with the `[Obsolete]` attribute,
it will display a compiler warning in the Visual Studio Error List window.

```text
.NET 4.7 Framework SDK 会使用 Attribute
```

In addition to development tools, numerous methods in **the .NET base class libraries** are
preprogrammed to reflect over specific attributes.
For example, if you want to persist the state of an object to file,
all you are required to do is annotate your class or structure with the `[Serializable]` attribute.
If the `Serialize()` method of the `BinaryFormatter` class encounters this attribute,
the object is automatically persisted to file in a compact binary format.

```text
.NET base class libraries 会使用 Attribute
```

Finally, you are free to **build applications** that are programmed to reflect over your own custom attributes,
as well as any attribute in the .NET base class libraries.
By doing so, you are essentially able to create a set of “keywords”
that are understood by a specific set of assemblies.

```text
可以自己编写 Application 来使用 Attribute
```

```csharp
namespace ApplyingAttributes
{
    [Serializable, Obsolete("Use another vehicle!")]
    public class HorseAndBuggy
    {
        // ...
    }
}
```

```csharp
using System;

namespace ApplyingAttributes
{
    [Serializable]
    [Obsolete("Use another vehicle!")]
    public class HorseAndBuggy
    {
        // ...
    }
}
```
