---
title: "格式化字符串"
sequence: "102"
---

## Composite format string

语法：

```text
{index[,alignment][:formatString]}
```

### Index component

```text
{index[,alignment][:formatString]}
```

The mandatory `index` component, which is also called a **parameter specifier**,
is a number starting from `0` that identifies a corresponding item in the list of objects.

> 索引从 0 开始

```text
string.Format("Name = {0}, hours = {1:hh}", "Fred", DateTime.Now);
```

```text
string multiple = string.Format("0x{0:X} {0:E} {0:N}", Int64.MaxValue);
Console.WriteLine(multiple);

// The example displays the following output:
//      0x7FFFFFFFFFFFFFFF 9.223372E+018 9,223,372,036,854,775,807.00
```

### Alignment component

```text
{index[,alignment][:formatString]}
```

- 长度
    - 如果 `alignment` 比实际字符串长，则以 `alignment` 为准
    - 如果 `alignment` 比实际字符串短，则以 实际长度 为准
- 对齐方式
    - 如果 `alignment` 为正数，则为右对齐。
    - 如果 `alignment` 为负数，则为左对齐。

示例：

```text
string[] names = { "Adam", "Bridgette", "Carla", "Daniel", "Ebenezer", "Francine", "George" };
decimal[] hours = { 40, 6.667m, 40.39m, 82, 40.333m, 80, 16.75m };

Console.WriteLine("{0,-20} {1,5}\n", "Name", "Hours");

for (int counter = 0; counter < names.Length; counter++)
    Console.WriteLine("{0,-20} {1,5:N1}", names[counter], hours[counter]);
```

输出：

```text
// The example displays the following output:
//      Name                 Hours
//      
//      Adam                  40.0
//      Bridgette              6.7
//      Carla                 40.4
//      Daniel                82.0
//      Ebenezer              40.3
//      Francine              80.0
//      George                16.8
```

### Format string component

```text
{index[,alignment][:formatString]}
```

The optional `formatString` component is a format string
that's appropriate for the type of object being formatted.
You can specify:

- A standard or custom **numeric format string** if the corresponding object is a numeric value.
- A standard or custom **date and time format string** if the corresponding object is a DateTime object.
- An **enumeration format string** if the corresponding object is an enumeration value.

### Escaping braces

```text
{index[,alignment][:formatString]}
```

Opening and closing braces are interpreted as starting and ending a format item.
To display a literal opening brace or closing brace, you must use an escape sequence.

{% highlight text %}
{% raw %}
Specify two opening braces (`{{`) in the fixed text to display one opening brace (`{`),
or two closing braces (`}}`) to display one closing brace (`}`).
{% endraw %}
{% endhighlight %}

Escaped braces with a format item are parsed differently between .NET and .NET Framework.

## String interpolation using `$`

The `$` character identifies a string literal as an **interpolated string**.

**String interpolation** provides a more readable, convenient syntax to format strings.
It's easier to read than **string composite formatting**.

> string interpolation 比 string composite formatting 可读性好

```csharp
var name = "Mark";
var date = DateTime.Now;

// Composite formatting:
Console.WriteLine("Hello, {0}! Today is {1}, it's {2:HH:mm} now.", name, date.DayOfWeek, date);
// String interpolation:
Console.WriteLine($"Hello, {name}! Today is {date.DayOfWeek}, it's {date:HH:mm} now.");
// Both calls produce the same output that is similar to:
// Hello, Mark! Today is Wednesday, it's 19:40 now.
```

### Structure of an interpolated string

To identify a string literal as an interpolated string, prepend it with the `$` symbol.
You **can't have any white space** between the `$` and the `"` that starts a string literal.

The structure of an item with an interpolation expression is as follows:

```text
{<interpolationExpression>[,<alignment>][:<formatString>]}
```

## Reference

- [String interpolation using `$`](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/tokens/interpolated)
- [Composite formatting](https://docs.microsoft.com/en-us/dotnet/standard/base-types/composite-formatting)
