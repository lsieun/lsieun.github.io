---
title: "Split"
sequence: "104"
---

```csharp
string phrase = "The quick brown fox jumps over the lazy dog.";
string[] words = phrase.Split(' ');

foreach (var word in words)
{
    System.Console.WriteLine($"<{word}>");
}
```

## 移除空项

```csharp
char[] delimiterChars = { ' ', ',', '.', ':', '\t' };
string phrase = "The quick brown    fox     jumps over the lazy dog.";
string[] words = phrase.Split(delimiterChars, StringSplitOptions.RemoveEmptyEntries);

foreach (var word in words)
{
    System.Console.WriteLine($"<{word}>");
}
```

## Reference

- [How to separate strings using String.Split in C#](https://learn.microsoft.com/en-us/dotnet/csharp/how-to/parse-strings-using-split)
