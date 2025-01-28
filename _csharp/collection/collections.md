---
title: "System.Collections"
sequence: "104"
---

## List<T> Class

```csharp
using System;
using System.Collections.Generic;

namespace HelloCSharp
{
    class Program
    {
        static void Main(string[] args)
        {
            // 添加数据
            List<string> dinosaurs = new List<string>();
            dinosaurs.Add("Tyrannosaurus");
            dinosaurs.Add("Amargasaurus");
            dinosaurs.Add("Mamenchisaurus");
            dinosaurs.Add("Deinonychus");
            dinosaurs.Add("Compsognathus");

            // 打印Capacity和Count
            Console.WriteLine("Capacity: {0}", dinosaurs.Capacity);
            Console.WriteLine("Count: {0}", dinosaurs.Count);

            // 遍历数据
            Console.WriteLine();
            foreach (string dinosaur in dinosaurs)
            {
                Console.WriteLine(dinosaur);
            }

            // 单条数据
            Console.WriteLine();
            Console.WriteLine("dinosaurs[3]: {0}", dinosaurs[3]);

            // 移除数据
            bool flag = dinosaurs.Remove("Compsognathus");
            Console.WriteLine();
            foreach (string dinosaur in dinosaurs)
            {
                Console.WriteLine(dinosaur);
            }

            // 清空数据
            dinosaurs.Clear();
            Console.WriteLine();
            Console.WriteLine("Capacity: {0}", dinosaurs.Capacity);
            Console.WriteLine("Count: {0}", dinosaurs.Count);

            Console.ReadKey();
        }
    }
}
```

## Reference

- [System.Collections.Generic Namespace](https://docs.microsoft.com/en-us/dotnet/api/system.collections.generic?view=net-6.0)
