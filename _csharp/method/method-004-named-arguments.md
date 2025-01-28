---
title: "Invoking Methods Using Named Parameters"
sequence: "104"
---

Another language feature found in C# is support for **named arguments**.
To be honest, at first glance, this language construct might appear to do little more than result in confusing code.
And to continue being completely honest, this could be the case!
Similar to optional arguments, including support for named parameters is partially motivated
by the desire to simplify the process of working with the COM interoperability layer.

Named arguments allow you to invoke a method by specifying parameter values in any order you choose.
Thus, rather than passing parameters solely by position (as you will do in most cases),
you can choose to **specify each argument by name using a colon operator**.

```csharp
using System;

namespace FunWithMethods
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Methods *****");

            DisplayFancyMessage(message: "Wow! Very Fancy indeed!",
                textColor: ConsoleColor.DarkRed,
                backgroundColor: ConsoleColor.White);

            DisplayFancyMessage(backgroundColor: ConsoleColor.Green,
                message: "Testing...",
                textColor: ConsoleColor.DarkBlue);

            Console.ReadLine();
        }

        static void DisplayFancyMessage(
            ConsoleColor textColor,
            ConsoleColor backgroundColor,
            string message)
        {
            // Store old colors to restore after message is printed.
            ConsoleColor oldTextColor = Console.ForegroundColor;
            ConsoleColor oldbackgroundColor = Console.BackgroundColor;

            // Set new colors and print message.
            Console.ForegroundColor = textColor;
            Console.BackgroundColor = backgroundColor;
            Console.WriteLine(message);

            // Restore previous colors.
            Console.ForegroundColor = oldTextColor;
            Console.BackgroundColor = oldbackgroundColor;
        }
    }
}
```

One minor “gotcha” regarding named arguments is that if you begin to invoke a method using positional parameters,
you must list them before any named parameters.
In other words, named arguments must always be packed onto the end of a method call.
The following code is an example:

```text
// This is OK, as positional args are listed before named args.
DisplayFancyMessage(ConsoleColor.Blue,
  message: "Testing...",
  backgroundColor: ConsoleColor.White);
  
// This is an ERROR, as positional args are listed after named args.
DisplayFancyMessage(message: "Testing...",
  backgroundColor: ConsoleColor.White,
  ConsoleColor.Blue);
```
