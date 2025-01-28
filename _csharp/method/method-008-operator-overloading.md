---
title: "Operator Overloading"
sequence: "108"
---

## Overloadability

The C# language gives you the capability to build custom classes and structures
that also respond uniquely to the same set of basic tokens (such as the `+` operator).
While not every possible C# operator can be overloaded, many can.

- `+`, `-`, `!`, `~`, `++`, `--`, `true`, `false`: These unary operators can be overloaded.
- `+`, `-`, `*`, `/`, `%`, `&`, `|`, `^`, `<<`, `>>`: These binary operators can be overloaded.
- `==`,`!=`, `<`, `>`, `<=`, `>=`: These comparison operators can be overloaded.
  C# demands that "like" operators (i.e., `<` and `>`, `<=` and `>=`, `==` and `!=`) are overloaded together.
- `[]`: The `[]` operator cannot be overloaded.
- `()`: The `()` operator cannot be overloaded.
- `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`, `<<=`, `>>=`: Shorthand assignment operators cannot be overloaded.

```csharp
using System;

namespace OverloadedOps
{
    public class Point : IComparable<Point>
    {
        public int X { get; set; }
        public int Y { get; set; }

        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }

        public override string ToString() => $"[{this.X}, {this.Y}]";

        // Overloaded operator +
        public static Point operator +(Point p1, Point p2) => new Point(p1.X + p2.X, p1.Y + p2.Y);

        // Overloaded operator -
        public static Point operator -(Point p1, Point p2) => new Point(p1.X - p2.X, p1.Y - p2.Y);

        public static Point operator +(Point p1, int change) => new Point(p1.X + change, p1.Y + change);
        public static Point operator +(int change, Point p1) => new Point(p1.X + change, p1.Y + change);

        // Add 1 to the X/Y values for the incoming Point.
        public static Point operator ++(Point p1) => new Point(p1.X + 1, p1.Y + 1);

        // Subtract 1 from the X/Y values for the incoming Point.
        public static Point operator --(Point p1) => new Point(p1.X - 1, p1.Y - 1);


        public override bool Equals(object o) => o.ToString() == this.ToString();

        public override int GetHashCode() => this.ToString().GetHashCode();

        // Now let's overload the == and != operators.
        public static bool operator ==(Point p1, Point p2) => p1.Equals(p2);
        public static bool operator !=(Point p1, Point p2) => !p1.Equals(p2);

        public int CompareTo(Point other)
        {
            if (this.X > other.X && this.Y > other.Y)
                return 1;
            if (this.X < other.X && this.Y < other.Y)
                return -1;
            else
                return 0;
        }

        public static bool operator <(Point p1, Point p2) => p1.CompareTo(p2) < 0;
        public static bool operator >(Point p1, Point p2) => p1.CompareTo(p2) > 0;
        public static bool operator <=(Point p1, Point p2) => p1.CompareTo(p2) <= 0;
        public static bool operator >=(Point p1, Point p2) => p1.CompareTo(p2) >= 0;
    }
}
```

## Overloading Binary Operators

To equip a custom type to respond uniquely to intrinsic operators,
C# provides the `operator` keyword, which you can use only in conjunction with the `static` keyword.
When you overload a binary operator (such as `+` and `-`),
you will most often pass in two arguments
that are the same type as the defining class.

```csharp
namespace OverloadedOps
{
    public class Point
    {
        public int X { get; set; }
        public int Y { get; set; }

        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }

        public override string ToString() => $"[{this.X}, {this.Y}]";

        // Overloaded operator +
        public static Point operator +(Point p1, Point p2) => new Point(p1.X + p2.X, p1.Y + p2.Y);

        // Overloaded operator -
        public static Point operator -(Point p1, Point p2) => new Point(p1.X - p2.X, p1.Y - p2.Y);
    }
}
```

```csharp
using System;

namespace OverloadedOps
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Overloaded Operators *****\n");
            
            // Make two points.
            Point ptOne = new Point(100, 100);
            Point ptTwo = new Point(40, 40);
            Console.WriteLine("ptOne = {0}", ptOne);
            Console.WriteLine("ptTwo = {0}", ptTwo);
            
            // Add the points to make a bigger point?
            Console.WriteLine("ptOne + ptTwo: {0} ", ptOne + ptTwo);
            
            // Subtract the points to make a smaller point?
            Console.WriteLine("ptOne - ptTwo: {0} ", ptOne - ptTwo);
            Console.ReadLine();
        }
    }
}
```

```text
***** Fun with Overloaded Operators *****
ptOne = [100, 100]
ptTwo = [40, 40]
ptOne + ptTwo: [140, 140]
ptOne - ptTwo: [60, 60]
```

When you are overloading a binary operator, **you are not required to pass in two parameters of the same type.**
If it makes sense to do so, one of the arguments can differ.

```text
public static Point operator + (Point p1, int change) => new Point(p1.X + change, p1.Y + change);
public static Point operator + (int change, Point p1) => new Point(p1.X + change, p1.Y + change);
```

```csharp
namespace OverloadedOps
{
    public class Point
    {
        public int X { get; set; }
        public int Y { get; set; }

        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }

        public override string ToString() => $"[{this.X}, {this.Y}]";

        // Overloaded operator +
        public static Point operator +(Point p1, Point p2) => new Point(p1.X + p2.X, p1.Y + p2.Y);

        // Overloaded operator -
        public static Point operator -(Point p1, Point p2) => new Point(p1.X - p2.X, p1.Y - p2.Y);
        
        public static Point operator + (Point p1, int change) => new Point(p1.X + change, p1.Y + change);
        public static Point operator + (int change, Point p1) => new Point(p1.X + change, p1.Y + change);
    }
}
```

```csharp
using System;

namespace OverloadedOps
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Overloaded Operators *****\n");
            
            // Make two points.
            Point ptOne = new Point(100, 100);
            Point ptTwo = new Point(40, 40);
            Console.WriteLine("ptOne = {0}", ptOne);
            Console.WriteLine("ptTwo = {0}", ptTwo);
            
            
            // Prints [110, 110].
            Point biggerPoint = ptOne + 10;
            Console.WriteLine("ptOne + 10 = {0}", biggerPoint);
            
            
            // Prints [120, 120].
            Console.WriteLine("10 + biggerPoint = {0}", 10 + biggerPoint);
            Console.WriteLine();
        }
    }
}
```

```text
***** Fun with Overloaded Operators *****
ptOne = [100, 100]
ptTwo = [40, 40]
ptOne + 10 = [110, 110]
10 + biggerPoint = [120, 120]
```

## And What of the += and –= Operators?

If you are coming to C# from a C++ background, you might lament the loss of overloading the shorthand
assignment operators (`+=`, `-=`, and so forth).
Don't despair. In terms of C#, the shorthand assignment
operators are automatically simulated if a type overloads the related binary operator.
Thus, given that the Point structure has already overloaded the `+` and `-` operators, you can write the following:

```csharp
using System;

namespace OverloadedOps
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Overloaded Operators *****\n");
            
            // Make two points.
            Point ptOne = new Point(100, 100);
            Point ptTwo = new Point(40, 40);
            Console.WriteLine("ptOne = {0}", ptOne);
            Console.WriteLine("ptTwo = {0}", ptTwo);
            
            // Freebie +=
            Point ptThree = new Point(90, 5);
            Console.WriteLine("ptThree = {0}", ptThree);
            Console.WriteLine("ptThree += ptTwo: {0}", ptThree += ptTwo);
            
            // Freebie -=
            Point ptFour = new Point(0, 500);
            Console.WriteLine("ptFour = {0}", ptFour);
            Console.WriteLine("ptFour -= ptThree: {0}", ptFour -= ptThree);
            Console.ReadLine();
        }
    }
}
```

```text
***** Fun with Overloaded Operators *****
ptOne = [100, 100]
ptTwo = [40, 40]
ptThree = [90, 5]
ptThree += ptTwo: [130, 45]
ptFour = [0, 500]
ptFour -= ptThree: [-130, 455]
```

## Overloading Unary Operators

C# also allows you to overload various unary operators, such as `++` and `--`.
When you overload a unary operator, you also must use the `static` keyword with the `operator` keyword;
however, in this case you simply pass in a single parameter
that is the same type as the defining class/structure.

```text
// Add 1 to the X/Y values for the incoming Point.
public static Point operator ++(Point p1) => new Point(p1.X + 1, p1.Y + 1);

// Subtract 1 from the X/Y values for the incoming Point.
public static Point operator --(Point p1) => new Point(p1.X - 1, p1.Y - 1);
```

```csharp
namespace OverloadedOps
{
    public class Point
    {
        public int X { get; set; }
        public int Y { get; set; }

        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }

        public override string ToString() => $"[{this.X}, {this.Y}]";

        // Overloaded operator +
        public static Point operator +(Point p1, Point p2) => new Point(p1.X + p2.X, p1.Y + p2.Y);

        // Overloaded operator -
        public static Point operator -(Point p1, Point p2) => new Point(p1.X - p2.X, p1.Y - p2.Y);

        public static Point operator +(Point p1, int change) => new Point(p1.X + change, p1.Y + change);
        public static Point operator +(int change, Point p1) => new Point(p1.X + change, p1.Y + change);

        // Add 1 to the X/Y values for the incoming Point.
        public static Point operator ++(Point p1) => new Point(p1.X + 1, p1.Y + 1);

        // Subtract 1 from the X/Y values for the incoming Point.
        public static Point operator --(Point p1) => new Point(p1.X - 1, p1.Y - 1);
    }
}
```

```csharp
using System;

namespace OverloadedOps
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Overloaded Operators *****\n");

            // Applying the ++ and -- unary operators to a Point.
            Point ptFive = new Point(1, 1);
            Console.WriteLine("++ptFive = {0}", ++ptFive); // [2, 2]
            Console.WriteLine("--ptFive = {0}", --ptFive); // [1, 1]

            // Apply same operators as postincrement/decrement.
            Point ptSix = new Point(20, 20);
            Console.WriteLine("ptSix++ = {0}", ptSix++); // [20, 20]
            Console.WriteLine("ptSix-- = {0}", ptSix--); // [21, 21]

            Console.ReadLine();
        }
    }
}
```

Notice in the preceding code example you are applying the custom `++` and `--` operators in two different manners.
In C++, it is possible to overload pre- and post-increment/decrement operators separately.
This is not possible in C#.
However, the return value of the increment/decrement is automatically handled "correctly" free of charge
(i.e., for an overloaded `++` operator,
`pt++` has the value of the unmodified object as its value within an expression,
while `++pt` has the new value applied before use in the expression).

## Overloading Equality Operators

`System.Object.Equals()` can be overridden to perform value-based
(rather than referenced-based) comparisons between reference types.
If you choose to override `Equals()`
(and the often related `System.Object.GetHashCode()` method),
it is trivial to overload the equality operators (`==` and `!=`).

```text
public override bool Equals(object o) => o.ToString() == this.ToString();
public override int GetHashCode() => this.ToString().GetHashCode();
// Now let's overload the == and != operators.
public static bool operator ==(Point p1, Point p2) => p1.Equals(p2);
public static bool operator !=(Point p1, Point p2) => !p1.Equals(p2);
```

```csharp
namespace OverloadedOps
{
    public class Point
    {
        public int X { get; set; }
        public int Y { get; set; }

        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }

        public override string ToString() => $"[{this.X}, {this.Y}]";

        // Overloaded operator +
        public static Point operator +(Point p1, Point p2) => new Point(p1.X + p2.X, p1.Y + p2.Y);

        // Overloaded operator -
        public static Point operator -(Point p1, Point p2) => new Point(p1.X - p2.X, p1.Y - p2.Y);

        public static Point operator +(Point p1, int change) => new Point(p1.X + change, p1.Y + change);
        public static Point operator +(int change, Point p1) => new Point(p1.X + change, p1.Y + change);

        // Add 1 to the X/Y values for the incoming Point.
        public static Point operator ++(Point p1) => new Point(p1.X + 1, p1.Y + 1);

        // Subtract 1 from the X/Y values for the incoming Point.
        public static Point operator --(Point p1) => new Point(p1.X - 1, p1.Y - 1);
        
        
        public override bool Equals(object o) => o.ToString() == this.ToString();
        public override int GetHashCode() => this.ToString().GetHashCode();
        // Now let's overload the == and != operators.
        public static bool operator ==(Point p1, Point p2) => p1.Equals(p2);
        public static bool operator !=(Point p1, Point p2) => !p1.Equals(p2);
    }
}
```

```csharp
using System;

namespace OverloadedOps
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Overloaded Operators *****\n");

            // Make two points.
            Point ptOne = new Point(100, 100);
            Point ptTwo = new Point(40, 40);
            Console.WriteLine("ptOne = {0}", ptOne);
            Console.WriteLine("ptTwo = {0}", ptTwo);
            
            Console.WriteLine("ptOne == ptTwo : {0}", ptOne == ptTwo);
            Console.WriteLine("ptOne != ptTwo : {0}", ptOne != ptTwo);
            Console.ReadLine();
        }
    }
}
```

As you can see, it is quite intuitive to compare two objects using the well-known `==` and `!=` operators,
rather than making a call to `Object.Equals()`.
If you do overload the equality operators for a given class,
keep in mind that **C# demands that if you override the `==` operator, you must also override the `!=` operator**
(if you forget, the compiler will let you know).

## Overloading Comparison Operators

You can also overload the comparison operators (`<`, `>`, `<=`, and `>=`) for the same class.
As with the equality operators, C# demands that if you overload `<`, you must also overload `>`.
The same holds true for the `<=` and `>=` operators.

```csharp
using System;

namespace OverloadedOps
{
    public class Point : IComparable<Point>
    {
        public int X { get; set; }
        public int Y { get; set; }

        public Point(int x, int y)
        {
            X = x;
            Y = y;
        }

        public override string ToString() => $"[{this.X}, {this.Y}]";

        // Overloaded operator +
        public static Point operator +(Point p1, Point p2) => new Point(p1.X + p2.X, p1.Y + p2.Y);

        // Overloaded operator -
        public static Point operator -(Point p1, Point p2) => new Point(p1.X - p2.X, p1.Y - p2.Y);

        public static Point operator +(Point p1, int change) => new Point(p1.X + change, p1.Y + change);
        public static Point operator +(int change, Point p1) => new Point(p1.X + change, p1.Y + change);

        // Add 1 to the X/Y values for the incoming Point.
        public static Point operator ++(Point p1) => new Point(p1.X + 1, p1.Y + 1);

        // Subtract 1 from the X/Y values for the incoming Point.
        public static Point operator --(Point p1) => new Point(p1.X - 1, p1.Y - 1);


        public override bool Equals(object o) => o.ToString() == this.ToString();

        public override int GetHashCode() => this.ToString().GetHashCode();

        // Now let's overload the == and != operators.
        public static bool operator ==(Point p1, Point p2) => p1.Equals(p2);
        public static bool operator !=(Point p1, Point p2) => !p1.Equals(p2);

        public int CompareTo(Point other)
        {
            if (this.X > other.X && this.Y > other.Y)
                return 1;
            if (this.X < other.X && this.Y < other.Y)
                return -1;
            else
                return 0;
        }

        public static bool operator <(Point p1, Point p2) => p1.CompareTo(p2) < 0;
        public static bool operator >(Point p1, Point p2) => p1.CompareTo(p2) > 0;
        public static bool operator <=(Point p1, Point p2) => p1.CompareTo(p2) <= 0;
        public static bool operator >=(Point p1, Point p2) => p1.CompareTo(p2) >= 0;
    }
}
```

```csharp
using System;

namespace OverloadedOps
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Fun with Overloaded Operators *****\n");

            // Make two points.
            Point ptOne = new Point(100, 100);
            Point ptTwo = new Point(40, 40);
            Console.WriteLine("ptOne = {0}", ptOne);
            Console.WriteLine("ptTwo = {0}", ptTwo);
            
            Console.WriteLine("ptOne < ptTwo : {0}", ptOne < ptTwo);
            Console.WriteLine("ptOne > ptTwo : {0}", ptOne > ptTwo);
            Console.ReadLine();
        }
    }
}
```

## Final Thoughts Regarding Operator Overloading

As you have seen, C# provides the capability to build types
that can respond uniquely to various intrinsic, well-known operators.

```text
C# 提供了“重写” operator 的能力
```

Now, before you go and retrofit all your classes to support such behavior,
you must be sure that the operators you are about to overload
make some sort of logical sense in the world at large.

```text
但是，我们要确保“重写 operator”这个操作是有意义的。
```

For example, let's say you overloaded the multiplication operator for the `MiniVan` class.
What exactly would it mean to multiply two `MiniVan` objects?
Not much. In fact, it would be confusing for teammates to see the following use of `MiniVan` objects:

```text
// Huh?! This is far from intuitive...
MiniVan newVan = myVan * yourVan;
```

Overloading operators is generally useful only when you're building atomic data types.
Text, points, rectangles, fractions, and hexagons make good candidates for operator overloading.
People, managers, cars, database connections, and web pages do not.
As a rule of thumb, if an overloaded operator makes it harder
for the user to understand a type's functionality, don't do it.
Use this feature wisely.
