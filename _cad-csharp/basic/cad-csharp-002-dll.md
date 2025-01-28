---
title: "AutoCAD DLL 文件"
sequence: "102"
---

## 关于 DLL 引用的问题

The AutoCAD .NET API is made up of different DLL files
that contain a wide range of classes, structures, methods, and events 
that provide access to objects in a drawing file or the application. 
Each DLL file defines different namespaces 
which are used to organize the components of the libraries based on functionality.

The main DLL files of the AutoCAD .NET API that you will frequently use are:

- `AcCoreMgd.dll`. Use when working within the editor, publishing and plotting, and defining commands and functions that can be called from AutoLISP.
- `AcDbMgd.dll`. Use when working with objects stored in a drawing file.
- `AcMgd.dll`. Use when working with the application and user interface.
- `AcCui.dll`. Use when working with customization files.

```text
accoremgd = AutoCAD Core Managed
```

通常需要引用下面 3 个类库：


- `acmgd.dll`：包含 ObjectARX 托管类，它与 AutoCAD 应用程序有关。
- `accoremgd.dll`：当使用自定义文件时，使用这个 DLL 文件
- `acdbmgd.dll`：包含 ObjectDBX 托管类，用于 AutoCAD 数据库服务和操作 DWG 文件。

```text
accoremgd.dll is only needed for AutoCAD2013 or later.
For Acad2012, you only need acdbmgd.dll and acmgd.dll.
```

## Reference an AutoCAD .NET API DLL

Before classes, structures, methods, and events found in one of the AutoCAD .NET API related DLLs can be used,
you must reference the DLL to a project. 
After a DLL is referenced to a project, you can utilize the namespaces and the components in the DLL file in your project.

Once a AutoCAD .NET API DLL is referenced, you must set the **Copy Local** property of the referenced DLL to `False`. 
The **Copy Local** property determines if Microsoft Visual Studio creates a copy of the referenced DLL file and 
places it in the same directory as the assembly file (or executable file) that is generated when building the project. 
Since the referenced files already ship with the product, 
creating copies of the referenced DLL files can cause unexpected results when you load your assembly file.

An assembly file is the source code from an Intermediate Language (IL) based program and 
is executed by invoking the .NET runtime; called the CLR, Common Language Runtime. 
The CLR compiles an assembly into native code right before it is executed by the operating system or another application. 
The process of compiling at runtime just before execution is often referred to as Just-In-Time (JIT) compiling. 
You can pre-compile an assembly using `NGEN` to create a native executable. 
Using `NGEN` can make your assembly more secure since it cannot be viewed using an IL disassembler.

## Location of AutoCAD .NET API DLL Files

The AutoCAD .NET API DLL files can be located at `<drive>:\Program Files\Autodesk\<release>`.


## 命名空间

一些常用的命名空间引用：

```text
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;
using Autodesk.AutoCAD.Colors;
```

`Autodesk.AutoCAD.DatabaseServices`：组成 AutoCAD 图形数据库的元素，
包括有图形界面的对象（也就是实体如直线、圆等）和非图形界面对象（如图层、线型和文字样式等）。

`Autodesk.AutoCAD.Runtime`：提供了系统级别的功能，如 DLL 初始化和运行时类的注册与确认。

`Autodesk.AutoCAD.ApplicationServices`：用来定义和注册新的 AutoCAD 命令，命令的行为方式与 AutoCAD 本身的命令一样。
该命名空间，还包含了一系列用来监视 AutoCAD 命令行的状态变化和诸如开始、终止或取消命令时通知程序的事件。

`Autodesk.AutoCAD.EditorInput`：提供了与用户交互有关的类。

`Autodesk.AutoCAD.Colors`：提供了与颜色有关的类。

`Autodesk.AutoCAD.Geometry`：被 DatabaseServices 命名空间中的类用来执行常见的 2D 及 3D 的几何操作，
它提供了一系列的工具类，如向量、矩阵、基本的几何对象（如点、曲线和面）。

`Autodesk.AutoCAD.GraphicsInterface`：表示绘制 AutoCAD 实体所使用的图形接口。
这些类用于实体对象（Entity 类）的成员函数 WorldDraw、ViewportDraw 和 SaveAs，它们都是标准实体接口的组成部分。

`Autodesk.AutoCAD.PlottingServices`：用于打印。

`Autodesk.AutoCAD.Windows`：用来访问 AutoCAD 的对话框（如线形和颜色对话框），
它还提供了一些接口用于 AutoCAD 可扩展的用户界面对象如面板、托盘项和状态栏。
还可以通过 `Autodesk.AutoCAD.Windows.Visuals` 类来获取 AutoCAD 中表示“拾取点”、“拾取对象”及 AutoCAD Logo 标志的图片。

## Reference

- [Components of the AutoCAD .NET API (.NET)](https://help.autodesk.com/view/OARX/2024/ENU/?guid=GUID-8657D153-0120-4881-A3C8-E00ED139E0D3)
