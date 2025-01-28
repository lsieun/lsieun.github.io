---
title: "Nullable Types"
sequence: "110"
---

```csharp
namespace NullableTypes
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            // Compiler errors!
            // Value types cannot be set to null!
            bool myBool = null;
            int myInt = null;

            // OK! Strings are reference types.
            string myString = null;
        }
    }
}
```

```text
static void LocalNullableVariables()
{
    // Define some local nullable variables.
    int? nullableInt = 10;
    double? nullableDouble = 3.14;
    bool? nullableBool = null;
    char? nullableChar = 'a';
    int?[] arrayOfNullableInts = new int?[10];

    // Error! Strings are reference types!
    string? s = "oops";
}
```

In C#, the `?` suffix notation is a shorthand for
creating an instance of the generic `System.Nullable<T>` structure type.
It is important to understand that the `System.Nullable<T>` type provides a set of members
that all nullable types can make use of.

For example, you are able to programmatically discover whether the nullable variable indeed has been
assigned a `null` value using the `HasValue` property or the `!=` operator.
The assigned value of a nullable type may be obtained directly or via the `Value` property.
In fact, given that the `?` suffix is just a shorthand for using `Nullable<T>`,
you could implement your LocalNullableVariables() method as follows:

```text
static void LocalNullableVariablesUsingNullable()
{
    // Define some local nullable types using Nullable<T>.
    Nullable<int> nullableInt = 10;
    Nullable<double> nullableDouble = 3.14;
    Nullable<bool> nullableBool = null;
    Nullable<char> nullableChar = 'a';
    Nullable<int>[] arrayOfNullableInts = new Nullable<int>[10];
}
```

## Working with Nullable Types

Now, assume the following `Main()` method, which invokes each member of the `DatabaseReader` class
and discovers the assigned values using the `HasValue` and `Value` members, as well as using the C# equality
operator (not equal, to be exact):

```csharp
using System;

namespace NullableTypes
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Nullable Data *****\n");
            DatabaseReader dr = new DatabaseReader();

            // Get int from "database".
            int? i = dr.GetIntFromDatabase();
            if (i.HasValue)    // A.
            {
                Console.WriteLine("Value of 'i' is: {0}", i.Value);    // B.
            }
            else
            {
                Console.WriteLine("Value of 'i' is undefined.");
            }

            // Get bool from "database".
            bool? b = dr.GetBoolFromDatabase();
            if (b != null)    // C.
            {
                Console.WriteLine("Value of 'b' is: {0}", b.Value);
            }
            else
            {
                Console.WriteLine("Value of 'b' is undefined.");
            }
        }

        class DatabaseReader
        {
            // Nullable data field.
            public int? numericValue = null;
            public bool? boolValue = true;

            // Note the nullable return type.
            public int? GetIntFromDatabase()
            {
                return numericValue;
            }

            // Note the nullable return type.
            public bool? GetBoolFromDatabase()
            {
                return boolValue;
            }
        }
    }
}
```

## The Null Coalescing Operator

The next aspect to be aware of is any variable that might have a `null` value
(i.e., a reference-type variable or a nullable value-type variable) can make use of the C# `??` operator,
which is formally termed the **null coalescing operator**.
This operator allows you to assign a value to a nullable type if the retrieved value is in fact null.
For this example, assume you want to assign a local nullable integer to 100 if the value returned
from `GetIntFromDatabase()` is `null`.

```csharp
using System;

namespace NullableTypes
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Nullable Data *****\n");
            DatabaseReader dr = new DatabaseReader();

            // If the value from GetIntFromDatabase() is null,
            // assign local variable to 100.
            int myData = dr.GetIntFromDatabase() ?? 100;
            Console.WriteLine("Value of myData: {0}", myData);
        }

        class DatabaseReader
        {
            // Nullable data field.
            public int? numericValue = null;
            public bool? boolValue = true;

            // Note the nullable return type.
            public int? GetIntFromDatabase()
            {
                return numericValue;
            }

            // Note the nullable return type.
            public bool? GetBoolFromDatabase()
            {
                return boolValue;
            }
        }
    }
}
```

The benefit of using the `??` operator is that it provides a more compact version of a traditional if/else condition.

```text
// Long-hand notation not using ?? syntax.
int? moreData = dr.GetIntFromDatabase();
if (!moreData.HasValue)
{
    moreData = 100;
}
Console.WriteLine("Value of moreData: {0}", moreData);
```

## The Null Conditional Operator

With the current release of the C# language, it is now possible to leverage the **null conditional operator** token
(a question mark placed after a variable type but before an access operator) to simplify error checking.

Rather than explicitly building a conditional statement to check for `null`, you can now write the following:

```text
static void TesterMethod(string[] args)
{
  // We should check for null before accessing the array data!
  Console.WriteLine($"You sent me {args?.Length} arguments.");
}
```

In this case, you are not using a conditional statement.
Rather, you are suffixing the `?` operator directly after the string array variable.
If this is `null`, its call to the `Length` property will not throw a runtime error.  
If you want to print an actual value,
you could leverage the null coalescing operator to assign a default value as so:

```text
Console.WriteLine($"You sent me {args?.Length ?? 0} arguments.");
```
