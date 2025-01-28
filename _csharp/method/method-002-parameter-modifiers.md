---
title: "Method Parameter Modifiers: out, ref, params"
sequence: "102"
---

The default manner in which a parameter is sent into a function is **by value**.
Simply put, if you do not mark an argument with a parameter modifier,
a copy of the data is passed into the function.
Exactly what is copied will depend on whether the parameter is **a value type** or **a reference type**.


<table>
    <thead>
    <tr>
        <th>Parameter Modifier</th>
        <th>Meaning in Life</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>(None)</td>
        <td>
            If a parameter is not marked with a parameter modifier,
            it is assumed to be passed by value,
            meaning the called method receives <b>a copy of the original data</b>.
        </td>
    </tr>
    <tr>
        <td>out</td>
        <td>
            Output parameters must be assigned by the method being called and, therefore,
            are passed <b>by reference</b>.
            If the called method fails to assign output parameters,
            you are issued a compiler error.
        </td>
    </tr>
    <tr>
        <td>ref</td>
        <td>
            The value is initially assigned by the caller and may be optionally modified by
            the called method (as the data is also passed <b>by reference</b>).
            No compiler error is generated if the called method fails to assign a <code>ref</code> parameter.
        </td>
    </tr>
    <tr>
        <td>params</td>
        <td>
            This parameter modifier allows you to send in <b>a variable number of arguments</b>
            as <b>a single logical parameter</b>.
            A method can have only a single <code>params</code> modifier,
            and it must be the final parameter of the method.
            In reality, you might not need to use the <code>params</code> modifier all too often;
            however, be aware that numerous methods within the base class libraries
            do make use of this C# language feature.
        </td>
    </tr>
    </tbody>
</table>

## The out Modifier

Methods that have been defined to take output parameters (via the `out` keyword)
are under obligation to assign them to an appropriate value before exiting the method scope
(if you fail to do so, you will receive compiler errors).

```csharp
using System;

namespace FunWithMethods
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            int a = 3;
            int b = 4;
            
            // B. 调用
            Add(a, b, out int ans);
            Console.WriteLine("{0} + {1} = {2}", a, b, ans);
        }

        // A. 定义
        static void Add(int x, int y, out int ans)
        {
            ans = x + y;
        }
    }
}
```

Calling a method with output parameters also requires the use of the `out` modifier.
However, the local variables that are passed as output variables
are not required to be assigned before passing them in as output arguments
(if you do so, the original value is lost after the call).
The reason the compiler allows you to send in seemingly unassigned data is
because the method being called must make an assignment.

Starting with C# 7, `out` parameters do not need to be declared before using them.
In other words, they can be declared inside the method call, like this:

```text
Add(90, 90, out int ans);
```

### Multiple Outputs

The previous example is intended to be illustrative in nature;
you really have no reason to return the value of your summation using an output parameter.
However, the C# out modifier does serve a useful purpose:
it allows the caller to **obtain multiple outputs from a single method invocation**.

```csharp
using System;

namespace FunWithMethods
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Methods *****");

            int i;
            string str;
            bool b;
            FillTheseValues(out i, out str, out b);

            Console.WriteLine("Int is: {0}", i);
            Console.WriteLine("String is: {0}", str);
            Console.WriteLine("Boolean is: {0}", b);
            Console.ReadLine();
        }

        // Returning multiple output parameters.
        static void FillTheseValues(out int a, out string b, out bool c)
        {
            a = 9;
            b = "Enjoy your string.";
            c = true;
        }
    }
}
```

Note: **C# 7 introduces tuples, which are another way to return multiple values out of a method call.**

### Valid Value

**Always remember that a method that defines output parameters
must assign the parameter to a valid value before exiting the method scope.**
Therefore, the following code will result in a compiler error, as the
output parameter has not been assigned within the method scope:

```text
static void ThisWontCompile(out int a)
{
    Console.WriteLine("Error! Forgot to assign output arg!");
}
```

### discard

Finally, if you don't care about the value of an out parameter, you can use a **discard** as a placeholder.
For example, if you want to determine whether a string is a valid date format
but don't care about the parsed date, you could write the following code:

```text
if (DateTime.TryParse(dateString, out _))
{
  //do something
}
```

## The ref Modifier

Now consider the use of the C# `ref` parameter modifier.
**Reference parameters** are necessary when you want to allow a method to operate on
(and usually change the values of) various data points declared in the caller's scope
(such as a sorting or swapping routine).

Note the distinction between **output** and **reference parameters**.

- **Output parameters** do not need to be initialized before they are passed to the method.
  The reason for this is that the method must assign output parameters before exiting.
- **Reference parameters** must be initialized before they are passed to the method.
  The reason for this is that you are passing a reference to an existing variable.
  If you don't assign it to an initial value, that would be the equivalent of operating on an unassigned local variable.

```csharp
using System;

namespace FunWithMethods
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Methods *****");

            string str1 = "Flip";
            string str2 = "Flop";
            Console.WriteLine("Before: {0}, {1} ", str1, str2);

            SwapStrings(ref str1, ref str2);
            Console.WriteLine("After: {0}, {1} ", str1, str2);

            Console.ReadLine();
        }

        // Reference parameters.
        public static void SwapStrings(ref string s1, ref string s2)
        {
            string tempStr = s1;
            s1 = s2;
            s2 = tempStr;
        }
    }
}
```

```text
***** Fun with Methods *****
Before: Flip, Flop
After: Flop, Flip
```

```csharp
using System;

namespace FunWithMethods
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Methods *****");

            string str1 = "Flip";
            string str2 = "Flop";
            Console.WriteLine("Before: {0}, {1} ", str1, str2);

            SwapStrings(ref str1, ref str2);
            Console.WriteLine("After: {0}, {1} ", str1, str2);

            Console.ReadLine();
        }

        // Reference parameters.
        public static void SwapStrings(ref string s1, ref string s2)
        {
            // 这里可以写成这样
            (s1, s2) = (s2, s1);
        }
    }
}
```

### ref Locals and Returns

In addition to modifying parameters with the `ref` keyword,
C# 7 introduces the ability to use and return references to variables defined elsewhere.

Before showing how that works, let's look at the following method:

```csharp
using System;

namespace FunWithMethods
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Methods *****");

            #region Ref locals and params

            string[] stringArray = { "one", "two", "three" };
            int pos = 1;
            Console.WriteLine("=> Use Simple Return");
            Console.WriteLine("Before: {0}, {1}, {2} ", stringArray[0], stringArray[1], stringArray[2]);
            
            var output = SimpleReturn(stringArray, pos);
            output = "new";
            
            Console.WriteLine("After: {0}, {1}, {2} ", stringArray[0], stringArray[1], stringArray[2]);

            #endregion

            // Console.ReadLine();
        }

        // Returns the value at the array position.
        public static string SimpleReturn(string[] strArray, int position)
        {
            return strArray[position];
        }
    }
}
```

A string array is passed in (**by value**), along with a position value.
Then the value of the array at that position is returned.
If the string that is returned from the method is modified outside of this method,
you would expect the array to still hold the original values.

```text
***** Fun with Methods *****
=> Use Simple Return
Before: one, two, three
After: one, two, three    // A. 这里仍然是 two
```

But what if you didn't want the value of the array position but instead a reference to the array position?
This could certainly be achieved prior to C# 7,
but the new capabilities using the `ref` keyword makes it much simpler.

There are two changes that need to be made to the simple method.
The first is that instead of a straight `return [value to be returned]`,
the method must do a `return ref [reference to be returned]`.
The second change is that the method declaration must also include the `ref` keyword.
Create a new method called SampleRefReturn like this:

```text
// Returning a reference.
public static ref string SampleRefReturn(string[] strArray, int position)
{
    return ref strArray[position];
}
```

This is essentially the same method as before, with the addition of the two instances of the `ref` keyword.
This now returns a reference to the position in the array, instead of the value held in the position of the array.
**Calling this method** also requires the use of the `ref` keyword,
both for the return variable and for the method call itself, like this:

```text
ref var refOutput = ref SampleRefReturn(stringArray, pos);
```

```csharp
using System;

namespace FunWithMethods
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Methods *****");

            #region Ref locals and params

            string[] stringArray = { "one", "two", "three" };
            int pos = 1;
            Console.WriteLine("=> Use Simple Return");
            Console.WriteLine("Before: {0}, {1}, {2} ", stringArray[0], stringArray[1], stringArray[2]);

            // B. 调用
            ref var refOutput = ref SampleRefReturn(stringArray, pos);
            refOutput = "new";

            Console.WriteLine("After: {0}, {1}, {2} ", stringArray[0], stringArray[1], stringArray[2]);

            #endregion

            // Console.ReadLine();
        }

        // A. 定义
        // Returning a reference.
        public static ref string SampleRefReturn(string[] strArray, int position)
        {
            return ref strArray[position];
        }
    }
}
```

```text
***** Fun with Methods *****
=> Use Simple Return
Before: one, two, three
After: one, new, three    // A. 变成了 new
```

There are some rules around this new feature that are worth noting here:

- Standard method results cannot be assigned to a `ref` local variable.
  The method must have been created as a `ref` return method.
- A local variable inside the `ref` method can't be returned as a `ref` local variable.  
  The following code does not work:

```text
ThisWillNotWork(string[] array)
{
  int foo = 5;
  return ref foo;
}
```

- This new feature doesn't work with `async` methods

## The params Modifier

The `params` keyword allows you to pass into a method **a variable number of identically typed parameters**
(or classes related by inheritance) as **a single logical parameter**.
As well, **arguments** marked with the `params` keyword can be processed
if the caller sends in a strongly typed array or a comma-delimited list of items.

```csharp
using System;

namespace FunWithMethods
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Methods *****");

            // Pass in a comma-delimited list of doubles...
            double average;
            average = CalculateAverage(4.0, 3.2, 5.7, 64.22, 87.2);
            Console.WriteLine("Average of data is: {0}", average);

            // ...or pass an array of doubles.
            double[] data = { 4.0, 3.2, 5.7 };
            average = CalculateAverage(data);
            Console.WriteLine("Average of data is: {0}", average);

            // Average of 0 is 0!
            Console.WriteLine("Average of data is: {0}", CalculateAverage());
            Console.ReadLine();
        }

        // Return average of "some number" of doubles.
        static double CalculateAverage(params double[] values)
        {
            Console.WriteLine("You sent me {0} doubles.", values.Length);
            double sum = 0;
            if (values.Length == 0)
            {
                return sum;
            }

            for (int i = 0; i < values.Length; i++)
            {
                sum += values[i];
            }

            return (sum / values.Length);
        }
    }
}
```

```text
***** Fun with Methods *****
You sent me 5 doubles.
Average of data is: 32.864
You sent me 3 doubles.
Average of data is: 4.3
You sent me 0 doubles.
Average of data is: 0
```

■ Note: **To avoid any ambiguity, C# demands a method support only a single `params` argument,
which must be the final argument in the parameter list.**

As you might guess, this technique is nothing more than a convenience for the caller,
given that the array is created by the CLR as necessary.
By the time the array is within the scope of the method being called,
you are able to treat it as a full-blown .NET array
that contains all the functionality of the `System.Array` base class library type.



