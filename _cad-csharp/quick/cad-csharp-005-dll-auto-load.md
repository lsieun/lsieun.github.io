---
title: "DLL 自动加载"
sequence: "105"
---

第 1 步，在 `Autodesk\AutoCAD 2014\Support` 路径下，有一个 `acad2014.lsp` 文件：

![](/assets/images/cad/csharp/quick/dev-038-autocad-support-lsp.png)

第 2 步，在 `acad2014.lsp` 文件结尾处添加如下内容：

```text
(command "netload" "D:\\workspace\\lab\\Lsieun.Cad\\Lsieun.Cad.Bridge\\bin\\Debug\\Lsieun.Cad.Bridge.dll")
```

![](/assets/images/cad/csharp/quick/dev-039-autocad-lsp-netload-dll.png)

第 3 步，添加信任：

![](/assets/images/cad/csharp/quick/dev-040-autocad-trusted-location.png)

第 4 步，启动 AutoCAD，在命令行进行查看：

![](/assets/images/cad/csharp/quick/dev-041-autocad-netloaded-dll.png)

