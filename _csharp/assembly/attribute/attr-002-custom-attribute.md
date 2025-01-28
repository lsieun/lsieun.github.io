---
title: "Custom Attributes"
sequence: "102"
---

## 自定义 Attribute 类型

```csharp
using System;

namespace AttributedCarLibrary
{
    public sealed class VehicleDescriptionAttribute : Attribute
    {
        public string Description { get; set; }
        public VehicleDescriptionAttribute(string vehicalDescription) => Description = vehicalDescription;

        public VehicleDescriptionAttribute()
        {
        }
    }
}
```

For security reasons, it is considered a .NET best practice to design all custom attributes as `sealed`. 

## 使用自定义 Attribute

```csharp
using System;

namespace AttributedCarLibrary
{
    [Serializable]
    [VehicleDescription(Description = "My rocking Harley")]
    public class Motorcycle
    {
    }

    [Serializable]
    [Obsolete("Use another vehicle!")]
    [VehicleDescription("The old gray mare, she ain't what she used to be...")]
    public class HorseAndBuggy
    {
    }

    [VehicleDescription("A very long, slow, but feature-rich auto")]
    public class Winnebago
    {
    }
}
```

## Restricting Attribute Usage

```csharp
using System;

namespace AttributedCarLibrary
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct, Inherited = false)]
    public sealed class VehicleDescriptionAttribute : Attribute
    {
        public string Description { get; set; }
        public VehicleDescriptionAttribute(string vehicalDescription) => Description = vehicalDescription;

        public VehicleDescriptionAttribute()
        {
        }
    }
}
```
