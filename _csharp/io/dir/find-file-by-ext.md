---
title: "查找文件：文件扩展名"
sequence: "101"
---

```text
using System.IO;
using System.Linq;

...

string directoryPath = "目录路径"; // 替换为你的目录路径

List<string> dllFiles = Directory.GetFiles(directoryPath, "*.dll")
                                .Select(Path.GetFileName)
                                .ToList();
```
