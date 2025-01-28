---
title: "快速开始"
sequence: "101"
---

## 开发环境

### AutoCAD 2014

![](/assets/images/cad/csharp/quick/dev-001-autocad-2014.png)

### Visual Studio 2019

![](/assets/images/cad/csharp/quick/dev-002-visual-studio-2019.png)

## 项目开发

### 创建项目

第 1 步，打开 Visual Studio，选择 **Create a new project**：

![](/assets/images/cad/csharp/quick/dev-003-create-new-project.png)

第 2 步，选择项目类型为 **Class library**：

![](/assets/images/cad/csharp/quick/dev-004-create-class-library.png)

第 3 步，选择项目名称和存放路径：

![](/assets/images/cad/csharp/quick/dev-005-configure.png)

### 添加引用

第 1 步，添加 dll 引用：

- `acmgd.dll`
- `accoremgd.dll`
- `acdbmgd.dll`

注意：这 3 个 dll 都是以 `ac` 开头，以 `mgd.dll` 结尾。

```text
acmgd.dll     = ac +      + mgd.dll
accoremgd.dll = ac + core + mgd.dll
acdbmgd.dll   = ac + db   + mgd.dll
```

![](/assets/images/cad/csharp/quick/dev-006-add-reference.png)

![](/assets/images/cad/csharp/quick/dev-007-browse-dll.png)

第 2 步，将 3 个 dll 属性中的 `Copy Local` 设置为 `False`：

![](/assets/images/cad/csharp/quick/dev-008-dll-copy-local-false.png)


### 编写代码

第 1 步，将 `Class1` 类重命名为 `QuickStart`。

第 2 步，编写代码：

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Basic
{
    public class QuickStart
    {
        [CommandMethod("CmdHello")]
        public void CmdHello()
        {
            Editor editor = Application.DocumentManager.MdiActiveDocument.Editor;
            editor.WriteMessage("Hello AutoCAD 二次开发");
        }
    }
}
```



### 构建项目

第 1 步，选择 `Build -> Build Xxx` 来构建当前项目：

![](/assets/images/cad/csharp/quick/dev-009-build-project.png)

第 2 步，通过查看 `Output`，可以看到生成了 `Xxx.dll` 文件：

![](/assets/images/cad/csharp/quick/dev-010-build-success.png)

## 类库测试

第 1 步，打开 AutoCAD，可以看到下方有命令行窗口。

![](/assets/images/cad/csharp/quick/dev-011-autocad.png)

第 2 步，输入 `NETLOAD` 命令：

![](/assets/images/cad/csharp/quick/dev-012-autocad-netload.png)

第 3 步，选择 dll 文件：

![](/assets/images/cad/csharp/quick/dev-013-autocad-select-dll.png)

第 4 步，选择 **加载** 按钮：

![](/assets/images/cad/csharp/quick/dev-014-autocad-load-dll.png)

第 5 步，输入 `CMDHELLO` 命令：

![](/assets/images/cad/csharp/quick/dev-015-autocad-cmd-hello.png)

第 6 步，查看输出结果：

![](/assets/images/cad/csharp/quick/dev-016-autocad-cmd-hello-output.png)

