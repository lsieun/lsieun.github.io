---
title: "Special Characters: $ and @"
sequence: "103"
---

## $ - string interpolation

The `$` special character identifies a string literal as an interpolated string.
An interpolated string is a string literal that might contain interpolation expressions.
When an interpolated string is resolved to a result string,
items with interpolation expressions are replaced by the string representations of the expression results.

This feature is available starting with C# 6.

String interpolation provides a more readable, convenient syntax to format strings. It's easier to read than string composite formatting.

```csharp
using System;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string name = "Mark";
            var date = DateTime.Now;

            // Composite formatting:
            Console.WriteLine("Hello, {0}! Today is {1}, it's {2:HH:mm} now.", name, date.DayOfWeek, date);
            // String interpolation:
            Console.WriteLine($"Hello, {name}! Today is {date.DayOfWeek}, it's {date:HH:mm} now.");

            Console.ReadKey();
        }
    }
}
```

## @

The `@` special character serves as a verbatim identifier.

### 变量名

第一种场景

To enable C# keywords to be used as identifiers.
The `@` character prefixes a code element that the compiler is to interpret as an identifier rather than a C# keyword.

```csharp
using System;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string[] @for = { "John", "James", "Joan", "Jamie" };
            for (int ctr = 0; ctr < @for.Length; ctr++)
            {
                Console.WriteLine($"Here is your gift, {@for[ctr]}!");
            }

            Console.ReadKey();
        }
    }
}
```

### 路径

第二种场景

To indicate that a string literal is to be interpreted verbatim.
The `@` character in this instance defines a verbatim string literal.

Simple escape sequences (such as `\\` for a backslash),
hexadecimal escape sequences (such as `\x0041` for an uppercase A),
and Unicode escape sequences (such as `\u0041` for an uppercase A) are interpreted literally.

Only a quote escape sequence (`""`) is not interpreted literally; it produces one double quotation mark.

Additionally, in case of a verbatim interpolated string brace escape sequences are not interpreted literally;
they produce single brace characters.

```csharp
using System;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string filename1 = @"c:\documents\files\u0066.txt";
            string filename2 = "c:\\documents\\files\\u0066.txt";

            Console.WriteLine(filename1);
            Console.WriteLine(filename2);

            Console.ReadKey();
        }
    }
}
```

```text
c:\documents\files\u0066.txt
c:\documents\files\u0066.txt
```

```csharp
using System;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string s1 = "He said, \"This is the last \u0063hance\x0021\"";
            string s2 = @"He said, ""This is the last \u0063hance\x0021""";

            Console.WriteLine(s1);
            Console.WriteLine(s2);

            Console.ReadKey();
        }
    }
}
```

```text
He said, "This is the last chance!"
He said, "This is the last \u0063hance\x0021"
```

### 属性名

To enable the compiler to distinguish between attributes in cases of a naming conflict.
An attribute is a class that derives from `Attribute`.
Its type name typically includes the suffix Attribute, although the compiler does not enforce this convention.
The attribute can then be referenced in code either by its full type name (for example, `[InfoAttribute]` or
its shortened name (for example, `[Info]`).

However, a naming conflict occurs if two shortened attribute type names are identical,
and one type name includes the Attribute suffix but the other does not.

```csharp
using System;

namespace HelloCSharp
{
    // [Info("A simple executable.")]
    // Generates compiler error CS1614. Ambiguous Info and InfoAttribute.
    // Prepend '@' to select 'Info' ([@Info("A simple executable.")]).
    // Specify the full name 'InfoAttribute' to select it.
    [@Info("A simple executable.")] 
    class Program
    {
        [InfoAttribute("The entry point.")]
        static void Main(string[] args)
        {
            string s1 = "He said, \"This is the last \u0063hance\x0021\"";
            string s2 = @"He said, ""This is the last \u0063hance\x0021""";

            Console.WriteLine(s1);
            Console.WriteLine(s2);

            Console.ReadKey();
        }
    }

    [AttributeUsage(AttributeTargets.Class)]
    public class Info : Attribute
    {
        private string information;

        public Info(string info)
        {
            information = info;
        }
    }

    [AttributeUsage(AttributeTargets.Method)]
    public class InfoAttribute : Attribute
    {
        private string information;

        public InfoAttribute(string info)
        {
            information = info;
        }
    }
}
```

## Reference

- [@ (C# Reference)](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/verbatim)
- [$ - string interpolation (C# reference)](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/interpolated)

