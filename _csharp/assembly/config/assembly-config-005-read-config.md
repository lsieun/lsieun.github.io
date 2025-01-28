---
title: "代码读取配置"
sequence: "105"
---

Currently, all of the `*.config` files shown in this chapter have made use of well-known XML elements
that are read by the CLR to resolve the location of external assemblies.
In addition to these recognized elements,
it is perfectly permissible for a client configuration file to contain **application-specific data**
that has nothing to do with binding heuristics.
Given this, it should come as no surprise that
the .NET Framework provides a namespace
that allows you to programmatically read the data within a client configuration file.

## The System.Configuration Namespace

The `System.Configuration` namespace provides a small set of types
you can use to read custom data from a client's `*.config` file.
These custom settings must be contained within the scope of an `<appSettings>` element.
The `<appSettings>` element contains any number of `<add>` elements
that define key-value pairs to be obtained programmatically. 

### App.config

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
    <startup>
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.7.2" />
    </startup>
    <!-- Custom App settings -->
    <appSettings>
        <add key="TextColor" value="Green" />
        <add key="RepeatCount" value="8" />
    </appSettings>
</configuration>
```

### Program.cs

```csharp
using System;
using System.Configuration;

namespace AppConfigReaderApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("***** Reading <appSettings> Data *****\n");

            // Get our custom data from the *.config file.
            AppSettingsReader ar = new AppSettingsReader();
            int numbOfTimes = (int)ar.GetValue("RepeatCount", typeof(int));
            string textColor = (string)ar.GetValue("TextColor", typeof(string));
            Console.ForegroundColor = (ConsoleColor)Enum.Parse(typeof(ConsoleColor), textColor);

            // Now print a message correctly.
            for (int i = 0; i < numbOfTimes; i++)
            {
                Console.WriteLine("Howdy!");
            }
            Console.ReadLine();
        }
    }
}
```
