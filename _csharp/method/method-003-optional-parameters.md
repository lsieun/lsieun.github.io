---
title: "Defining Optional Parameters"
sequence: "103"
---

C# allows you to create methods that can take **optional arguments**.
This technique allows the caller to invoke a single method
while omitting arguments deemed unnecessary,
provided the caller is happy with the specified defaults.

```csharp
using System;

namespace FunWithMethods
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Methods *****");

            // B. 调用
            EnterLogData("Oh no! Grid can't find data");
            EnterLogData("Oh no! I can't find the payroll data", "CFO");

            Console.ReadLine();
        }

        // A. 定义
        static void EnterLogData(string message, string owner = "Programmer")
        {
            Console.Beep();
            Console.WriteLine("Error: {0}", message);
            Console.WriteLine("Owner of Error: {0}", owner);
        }
    }
}
```

One important thing to be aware of is that
**the value assigned to an optional parameter must be
known at compile time and cannot be resolved at runtime**
(if you attempt to do so, you'll receive compile- time errors!).
To illustrate, assume you want to update `EnterLogData()` with the following extra optional parameter:

```text
// Error! The default value for an optional arg must be known
// at compile time!
static void EnterLogData(string message,
    string owner = "Programmer", DateTime timeStamp = DateTime.Now)
{
    Console.Beep();
    Console.WriteLine("Error: {0}", message);
    Console.WriteLine("Owner of Error: {0}", owner);
    Console.WriteLine("Time of Error: {0}", timeStamp);
}
```

This will not compile because the value of the `Now` property of the `DateTime` class is resolved at runtime,
not compile time.

Note: **To avoid ambiguity, optional parameters must always be packed onto the end of a method signature.**
it is a compiler error to have **optional parameters** listed before **nonoptional parameters**.

