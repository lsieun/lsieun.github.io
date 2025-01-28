---
title: "Array Intro"
sequence: "104"
---

```csharp
using System;

namespace FunWithArrays
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Arrays *****");
            SimpleArrays();
            Console.ReadLine();
        }

        static void SimpleArrays()
        {
            Console.WriteLine("=> Simple Array Creation.");

            // Create and fill an array of 3 Integers
            int[] myInts = new int[3];
            myInts[0] = 100;
            myInts[1] = 200;
            myInts[2] = 300;

            // Now print each value.
            foreach (int i in myInts)
            {
                Console.WriteLine(i);
            }

            Console.WriteLine();
        }
    }
}
```

Do be aware that if you declare an array but do not explicitly fill each index,
each item will be set to the default value of the data type
(e.g., an array of `bool`s will be set to `false` or an array of `int`s will be set to `0`).

## C# Array Initialization Syntax

In addition to filling an array element by element,
you are able to fill the items of an array using **C# array initialization syntax**.
To do so, specify each array item within the scope of curly brackets (`{}`).
This syntax can be helpful when you are creating an array of a known size and
want to quickly specify the initial values.

```csharp
using System;

namespace FunWithArrays
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Arrays *****");
            ArrayInitialization();
            Console.ReadLine();
        }

        static void ArrayInitialization()
        {
            Console.WriteLine("=> Array Initialization.");

            // Array initialization syntax using the new keyword.
            string[] stringArray = new string[] { "one", "two", "three" };
            Console.WriteLine("stringArray has {0} elements", stringArray.Length);

            // Array initialization syntax without using the new keyword.
            bool[] boolArray = { false, false, true };
            Console.WriteLine("boolArray has {0} elements", boolArray.Length);

            // Array initialization with new keyword and size.
            int[] intArray = new int[4] { 20, 22, 23, 0 };
            Console.WriteLine("intArray has {0} elements", intArray.Length);
        }
    }
}
```

## Implicitly Typed Local Arrays

Recall that the `var` keyword allows you to define a variable, whose underlying type is determined by the compiler.
In a similar vein, the `var` keyword can be used to define **implicitly typed local arrays**.
Using this technique, you can allocate a new array variable
without specifying the type contained within the array itself
(note you must use the `new` keyword when using this approach).

```csharp
using System;

namespace FunWithArrays
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Arrays *****");
            DeclareImplicitArrays();
            Console.ReadLine();
        }

        static void DeclareImplicitArrays()
        {
            Console.WriteLine("=> Implicit Array Initialization.");

            // a is really int[].
            var a = new[] { 1, 10, 100, 1000 };
            Console.WriteLine("a is a: {0}", a.ToString());

            // b is really double[].
            var b = new[] { 1, 1.5, 2, 2.5 };
            Console.WriteLine("b is a: {0}", b.ToString());

            // c is really string[].
            var c = new[] { "hello", null, "world" };
            Console.WriteLine("c is a: {0}", c.ToString());
        }
    }
}
```

```text
***** Fun with Arrays *****
=> Implicit Array Initialization.
a is a: System.Int32[]
b is a: System.Double[]
c is a: System.String[]
```

Of course, just as when you allocate an array using explicit C# syntax,
the items in the array's initialization list must be of the same underlying type
(e.g., all `int`s, all `string`s, or all `SportsCar`s).
Unlike what you might be expecting, **an implicitly typed local array does not default to `System.Object`**;
thus, the following generates a compile-time error:

```text
// Error! Mixed types!
var d = new[] { 1, "one", 2, "two", false };
```

## Defining an Array of Objects

In most cases, when you define an array,
you do so by specifying the explicit type of item that can be within the array variable.
While this seems quite straightforward, there is **one notable twist**.

```text
one notable twist
```

`System.Object` is the ultimate base class to every type (including fundamental data types) in the .NET type system.
Given this fact, if you were to define an array of `System.Object` data types,
the subitems could be anything at all.

```csharp
using System;

namespace FunWithArrays
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Arrays *****");
            ArrayOfObjects();
            Console.ReadLine();
        }

        static void ArrayOfObjects()
        {
            Console.WriteLine("=> Array of Objects.");

            // An array of objects can be anything at all.
            object[] myObjects = new object[4];
            myObjects[0] = 10;
            myObjects[1] = false;
            myObjects[2] = new DateTime(1969, 3, 24);
            myObjects[3] = "Form & Void";

            foreach (object obj in myObjects)
            {
                // Print the type and value for each item in array.
                Console.WriteLine("Type: {0}, Value: {1}", obj.GetType(), obj);
            }
        }
    }
}
```

```text
***** Fun with Arrays *****
=> Array of Objects.
Type: System.Int32, Value: 10
Type: System.Boolean, Value: False
Type: System.DateTime, Value: 1969/3/24 0:00:00
Type: System.String, Value: Form & Void
```

## 多维数组

In addition to the single-dimension arrays you have seen thus far,
C# also supports two varieties of multidimensional arrays.

### Rectangular Array

The first of these is termed a **rectangular array**, which is simply an array of multiple dimensions,
where each row is of the same length.

```csharp
using System;

namespace FunWithArrays
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Arrays *****");
            RectMultidimensionalArray();
        }

        static void RectMultidimensionalArray()
        {
            Console.WriteLine("=> Rectangular multidimensional array.");

            // A rectangular MD array.
            int[,] myMatrix;
            myMatrix = new int[3, 4];

            int row = myMatrix.GetLength(0);
            int col = myMatrix.GetLength(1);
            
            // Populate (3 * 4) array.
            for (int i = 0; i < row; i++)
            {
                for (int j = 0; j < col; j++)
                {
                    myMatrix[i, j] = i * j;
                }
            }

            // Print (3 * 4) array.
            for (int i = 0; i < row; i++)
            {
                for (int j = 0; j < col; j++)
                {
                    Console.Write(myMatrix[i, j] + "\t");
                }

                Console.WriteLine();
            }
        }
    }
}
```

```text
***** Fun with Arrays *****
=> Rectangular multidimensional array.
0       0       0       0
0       1       2       3
0       2       4       6
```

### Jagged Array

The second type of multidimensional array is termed a **jagged array**.
As the name implies, jagged arrays contain some number of inner arrays,
each of which may have a different upper limit.

```csharp
using System;

namespace FunWithArrays
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Arrays *****");
            JaggedMultidimensionalArray();
            Console.ReadLine();
        }

        static void JaggedMultidimensionalArray()
        {
            Console.WriteLine("=> Jagged multidimensional array.");

            // A jagged MD array (i.e., an array of arrays).
            // Here we have an array of 5 different arrays.
            int[][] myJagArray = new int[5][];

            // Create the jagged array.
            for (int i = 0; i < myJagArray.Length; i++)
            {
                myJagArray[i] = new int[i + 7];
            }

            // Print each row (remember, each element is defaulted to zero!).
            for (int i = 0; i < 5; i++)
            {
                for (int j = 0; j < myJagArray[i].Length; j++)
                {
                    Console.Write(myJagArray[i][j] + " ");
                }

                Console.WriteLine();
            }
        }
    }
}
```

```text
***** Fun with Arrays *****
=> Jagged multidimensional array.
0 0 0 0 0 0 0
0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0
```

## The System.Array Base Class

Every array you create gathers much of its functionality from the `System.Array` class.
Using these common members, you are able to operate on an array using a consistent object model.

- `Clear()`: This static method sets a range of elements in the array to empty values  
  (0 for numbers, null for object references, false for Booleans).
- `CopyTo()`: This method is used to copy elements from the source array into the destination array.
- `Length`: This property returns the number of items within the array.
- `Rank`: This property returns the number of dimensions of the current array.
- `Reverse()`: This static method reverses the contents of a one-dimensional array.
- `Sort()`: This static method sorts a one-dimensional array of intrinsic types.
  If the elements in the array implement the `IComparer` interface, you can also sort your custom types.

```csharp
using System;

namespace FunWithArrays
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Arrays *****");
            SystemArrayFunctionality();
            Console.ReadLine();
        }

        static void SystemArrayFunctionality()
        {
            Console.WriteLine("=> Working with System.Array.");

            // Initialize items at startup.
            string[] gothicBands = { "Tones on Tail", "Bauhaus", "Sisters of Mercy" };

            // Print out names in declared order.
            Console.WriteLine("-> Here is the array:");
            for (int i = 0; i < gothicBands.Length; i++)
            {
                // Print a name.
                Console.Write(gothicBands[i] + ", ");
            }

            Console.WriteLine("\n");

            // Reverse them...
            Array.Reverse(gothicBands);
            Console.WriteLine("-> The reversed array");

            // ... and print them.
            for (int i = 0; i < gothicBands.Length; i++)
            {
                // Print a name.
                Console.Write(gothicBands[i] + ", ");
            }

            Console.WriteLine("\n");

            // Clear out all but the first member.
            Console.WriteLine("-> Cleared out all but one...");
            Array.Clear(gothicBands, 1, 2);
            for (int i = 0; i < gothicBands.Length; i++)
            {
                // Print a name.
                Console.Write(gothicBands[i] + ", ");
            }
        }
    }
}
```

```text
***** Fun with Arrays *****
=> Working with System.Array.
-> Here is the array:
Tones on Tail, Bauhaus, Sisters of Mercy,
-> The reversed array
Sisters of Mercy, Bauhaus, Tones on Tail,
-> Cleared out all but one...
Sisters of Mercy, , ,
```