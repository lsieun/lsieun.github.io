---
title: "TXT文件：读取和写入"
sequence: "103"
---

## 读取

### 逐行读取

第一种方式，使用`File.ReadAllLines()`方法：

```csharp
using System;
using System.IO;
using System.Text;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string filepath = "D:\\tmp\\abc.txt";
            string[] lines = File.ReadAllLines(filepath, Encoding.UTF8);
            foreach(string item in lines)
            {
                Console.WriteLine(item);
            }

            Console.ReadKey();
        }
    }
}
```

第二种方式，使用`StreamReader.ReadLine()`方法：

```csharp
using System;
using System.IO;
using System.Text;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string filepath = "D:\\tmp\\abc.txt";
            StreamReader sr = new StreamReader(filepath, Encoding.UTF8);
            string line;
            while ((line = sr.ReadLine()) != null)
            {
                Console.WriteLine(line);
            }
            sr.Close();

            Console.ReadKey();
        }
    }
}
```

## 写入

使用`File.WriteAllText`或`File.WriteAllLines`方法时，如果指定的文件路径不存在，会创建一个新文件；如果文件已经存在，则会覆盖原文件。

### 简单文本

```csharp
using System;
using System.IO;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string filepath = "D:\\tmp\\abc.txt";
            string message = "Good Morning!";
            File.WriteAllText(filepath, message);

            Console.ReadKey();
        }
    }
}
```

指定编码：

```chsharp
using System;
using System.IO;
using System.Text;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string filepath = "D:\\tmp\\abc.txt";
            string message = "Good Morning!";
            File.WriteAllText(filepath, message, Encoding.UTF8);

            Console.ReadKey();
        }
    }
}
```

### 字符串数组

```csharp
using System;
using System.IO;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string filepath = "D:\\tmp\\abc.txt";
            string[] lines = { "Good Morning!", "Good Afternoon!", "Good Evening!" };
            File.WriteAllLines(filepath, lines);

            Console.ReadKey();
        }
    }
}
```

指定编码：

```csharp
using System;
using System.IO;
using System.Text;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string filepath = "D:\\tmp\\abc.txt";
            string[] lines = { "Good Morning!", "Good Afternoon!", "Good Evening!" };
            File.WriteAllLines(filepath, lines, Encoding.UTF8);

            Console.ReadKey();
        }
    }
}
```

### 逐行写入

```csharp
using System;
using System.IO;
using System.Text;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            string filepath = "D:\\tmp\\abc.txt";
            StreamWriter sw = new StreamWriter(filepath, false, Encoding.UTF8);
            string[] lines = {
                "I love three things in this world:",
                "The Sun, the Moon, and You.",
                "The Sun for the day,",
                "The Moon for the night,",
                "And You forever."
            };

            foreach (String item in lines)
            {
                sw.WriteLine(item);
            }

            sw.Flush();
            sw.Close();

            Console.ReadKey();
        }
    }
}
```

