---
title: "Enum Type"
sequence: "105"
---

Do not confuse the term `enum` with `enumerator`; they are completely different concepts.
An `enum` is a custom data type of name-value pairs.
An `enumerator` is a class or structure that implements a .Net interface named `IEnumerable`.

Typically, this interface is implemented on collection classes, as well as the `System.Array` class.
Objects that support `IEnumerable` can work within the `foreach` loop.

```csharp
namespace System
{
    public abstract class Array : 
        ICloneable,
        IList,
        ICollection,
        IEnumerable,    // A. 实现了 IEnumerable
        IStructuralComparable,
        IStructuralEquatable
    {
    }
}
```

```csharp
// A custom enumeration.
public enum EmpType
{
    Manager,         // = 0
    Grunt,           // = 1
    Contractor,      // = 2
    VicePresident    // = 3
}
```

The `EmpType` enumeration defines four named constants, corresponding to discrete numerical values.
By default, the first element is set to the value **zero** (`0`), followed by an `n+1` progression.
You are free to change the initial value as you see fit.

```charp
// Begin with 102.
public enum EmpType
{
    Manager = 102,
    Grunt,           // = 103
    Contractor,      // = 104
    VicePresident    // = 105
}
```

Enumerations do not necessarily need to follow a sequential ordering and do not need to have unique values.
If (for some reason or another) it makes sense to establish your `EmpType` as shown here,
the compiler continues to be happy:

```csharp
// Elements of an enumeration need not be sequential!
enum EmpType
{
    Manager = 10,
    Grunt = 1,
    Contractor = 100,
    VicePresident = 9
}
```

## Controlling the Underlying Storage for an enum

By default, the storage type used to hold the values of an enumeration is a `System.Int32` (the C# `int`);
however, you are free to change this to your liking.
C# enumerations can be defined in a similar manner
for any of the core system types (`byte`, `short`, `int`, or `long`).

```csharp
// This time, EmpType maps to an underlying byte.
enum EmpType : byte
{
    Manager = 10,
    Grunt = 1,
    Contractor = 100,
    VicePresident = 9
}
```

Changing the underlying type of an enumeration can be helpful if you are building a .NET application
that will be deployed to a low-memory device and need to conserve memory wherever possible.
Of course, if you do establish your enumeration to use a byte as storage, each value must be within its range!

```csharp
// Compile-time error! 999 is too big for a byte!
enum EmpType : byte
{
    Manager = 10,
    Grunt = 1,
    Contractor = 100,
    VicePresident = 999
}
```

## Declaring enum Variables

```csharp
using System;

namespace FunWithEnums
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("**** Fun with Enums *****");

            // Make an EmpType variable.
            EmpType emp = EmpType.Contractor;
            AskForBonus(emp);
            Console.ReadLine();
        }

        // Enums as parameters.
        static void AskForBonus(EmpType e)
        {
            switch (e)
            {
                case EmpType.Manager:
                    Console.WriteLine("How about stock options instead?");
                    break;
                case EmpType.Grunt:
                    Console.WriteLine("You have got to be kidding...");
                    break;
                case EmpType.Contractor:
                    Console.WriteLine("You already get enough cash...");
                    break;
                case EmpType.VicePresident:
                    Console.WriteLine("VERY GOOD, Sir!");
                    break;
            }
        }
    }
}
```

## The System.Enum Type

The interesting thing about .NET enumerations is that they gain functionality from the `System.Enum` class type.
This class defines a number of methods that allow you to interrogate and transform a given enumeration.
One helpful method is the static `Enum.GetUnderlyingType()`, which, as the name implies,
returns the data type used to store the values of the enumerated type.

```csharp
using System;

namespace FunWithEnums
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("**** Fun with Enums *****");
            
            // Make a contractor type.
            EmpType emp = EmpType.Contractor;
            
            // Print storage for the enum.
            Console.WriteLine("EmpType uses a {0} for storage", Enum.GetUnderlyingType(emp.GetType()));
            Console.ReadLine();
        }
    }
}
```

```text
**** Fun with Enums *****
EmpType uses a System.Int32 for storage
```

One possible way to obtain metadata (as shown previously) is to use the `GetType()` method,
which is common to all types in the .NET base class libraries.
Another approach is to use the C# `typeof` operator.
One benefit of doing so is that you do not need to have a variable of the entity
you want to obtain a metadata description of.

```csharp
using System;

namespace FunWithEnums
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("**** Fun with Enums *****");
            
            // Make a contractor type.
            EmpType emp = EmpType.Contractor;
            
            // Print storage for the enum.
            // This time use typeof to extract a Type.
            Console.WriteLine("EmpType uses a {0} for storage",
                Enum.GetUnderlyingType(typeof(EmpType)));
            Console.ReadLine();
        }
    }
}
```

## Dynamically Discovering an enum's Name-Value Pairs

Beyond the `Enum.GetUnderlyingType()` method, all C# enumerations support a method named `ToString()`,
which returns the string name of the current enumeration's value.

```csharp
using System;

namespace FunWithEnums
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("**** Fun with Enums *****");
            EmpType emp = EmpType.Contractor;

            // Prints out "emp is a Contractor".
            Console.WriteLine("emp is a {0}.", emp.ToString());
            Console.ReadLine();
        }
    }
}
```

If you are interested in discovering the value of a given enumeration variable, rather than its name,
you can simply cast the enum variable against the underlying storage type.

```csharp
using System;

namespace FunWithEnums
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("**** Fun with Enums *****");
            EmpType emp = EmpType.Contractor;

            Console.WriteLine("{0} = {1}", emp.ToString(), (byte)emp);
            Console.ReadLine();
        }
    }
}
```

`System.Enum` also defines another static method named `GetValues()`.
This method returns an instance of `System.Array`.
Each item in the array corresponds to a member of the specified enumeration.

```csharp
using System;

namespace FunWithEnums
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("**** Fun with Enums *****");

            EmpType e2 = EmpType.Contractor;
            DayOfWeek day = DayOfWeek.Monday;
            ConsoleColor cc = ConsoleColor.Gray;

            EvaluateEnum(e2);
            EvaluateEnum(day);
            EvaluateEnum(cc);
            Console.ReadLine();
        }
        
        // This method will print out the details of any enum.
        static void EvaluateEnum(System.Enum e)
        {
            Console.WriteLine("=> Information about {0}", e.GetType().Name);
            
            Console.WriteLine("Underlying storage type: {0}",
                Enum.GetUnderlyingType(e.GetType()));
            
            // Get all name-value pairs for incoming parameter.
            Array enumData = Enum.GetValues(e.GetType());
            Console.WriteLine("This enum has {0} members.", enumData.Length);
            
            // Now show the string name and associated value, using the D format flag
            for(int i = 0; i < enumData.Length; i++)
            {
                Console.WriteLine("Name: {0}, Value: {0:D}",
                    enumData.GetValue(i));
            }
            Console.WriteLine();
        }
    }
}
```

