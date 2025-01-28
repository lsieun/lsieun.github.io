---
title: "线型"
sequence: "101"
---

AutoCAD 提供了大量的标准线型，如虚线、点画线等，但其标准线型与有关的制图标准不尽相同，
因此自定义一套符合自己专业规范要求的线型就显得很有必要。

## AutoCAD

### 线型定义文件

AutoCAD 中的标准线型文件，一共有两个，分别是公制下的 `acadiso.lin` 和 英制下的 `acad.lin`。

在 AutoCAD 2014 中，这两个文件位于：

```text
C:\Users\<当前用户>\AppData\Roaming\Autodesk\AutoCAD 2014\R19.1\enu\Support
```

![](/assets/images/cad/gui/cad-two-standard-line-type-files.png)

打开 `acadiso.lin` 文件，示例如下：

```text
;;
;;  AutoCAD ISO Linetype Definition file
;;  Version 2.0
;;
;;  Copyright 2013 Autodesk, Inc.  All rights reserved.
;;
;;  Use of this software is subject to the terms of the Autodesk license 
;;  agreement provided at the time of installation or download, or which 
;;  otherwise accompanies this software in either electronic or hard copy form.
;;
;;  Note: in order to ease migration of this file when upgrading 
;;  to a future version of AutoCAD, it is recommended that you add
;;  your customizations to the User Defined Linetypes section at the
;;  end of this file.
;;
;;  customized for ISO scaling
;;
*BORDER,Border __ __ . __ __ . __ __ . __ __ . __ __ .
A, 12.7, -6.35, 12.7, -6.35, 0, -6.35 
*BORDER2,Border (.5x) __.__.__.__.__.__.__.__.__.__.__.
A, 6.35, -3.175, 6.35, -3.175, 0, -3.175 
*BORDERX2,Border (2x) ____  ____  .  ____  ____  .  ___
A, 25.4, -12.7, 25.4, -12.7, 0, -12.7 

*CENTER,Center ____ _ ____ _ ____ _ ____ _ ____ _ ____
A, 31.75, -6.35, 6.35, -6.35 
*CENTER2,Center (.5x) ___ _ ___ _ ___ _ ___ _ ___ _ ___
A, 19.05, -3.175, 3.175, -3.175 
*CENTERX2,Center (2x) ________  __  ________  __  _____
A, 63.5, -12.7, 12.7, -12.7 

*DASHDOT,Dash dot __ . __ . __ . __ . __ . __ . __ . __
A, 12.7, -6.35, 0, -6.35 
*DASHDOT2,Dash dot (.5x) _._._._._._._._._._._._._._._.
A, 6.35, -3.175, 0, -3.175 
*DASHDOTX2,Dash dot (2x) ____  .  ____  .  ____  .  ___
A, 25.4, -12.7, 0, -12.7
```

通过将分号（`;`）置于行首，可以在 `.lin` 文件中加入注释。

### 线型格式

在线型定义文件中，用两行文字定义一种线型：

- 第一行，包括线型名称和可选说明
- 第二行，是定义实际线型图案的代码

```text
*BORDER,Border __ __ . __ __ . __ __ . __ __ . __ __ .    # A. 第一行
A, 12.7, -6.35, 12.7, -6.35, 0, -6.35                     # B. 第二行
```

第二行，必须以字母 `A`（对齐）开头，其后是一列图案描述符（笔画），
用于定义提笔长度（空白）、落笔长度（实线）和点。

```text
*线型名称 [, 注释内容]
对齐方式, 笔画1, 笔画2, ...
```

关于线型文件的格式，以下几点需要注意：

- 每种线型的定义必须从星号（`*`）开始，**线型名称**的指定必须符合 AutoCAD 的命名规则，且在同一线型文件中不能有重复的线型名称。
- **注释内容**为可选项，用于对线型的简单描述。描述字母数量在 47 个以内，可以使用点、空白、短线和文字等。
- **对齐方式**，当前 AutoCAD 仅为线型文件提供了一种对齐方式 `A`，该对齐方式能够保证所定义的各段对象首尾相接。
- **笔画1, 笔画2** 等用于定义线型组成对象的长度，可以使用正数、负数或零。
    - 其中，正数表示实线长度，负数表示空白长度，零表示一个点。
    - 笔画数值的绝对值用来定义对象长度，使用绘图单位来定义长度。

如果要创建带有文字的线型，可以在线型的定义中添加下面的字符描述语句：

```text
["text", textstylename, scale, rotation, xoffset, yoffset]
```

其中，

- `text` 是字符串的内容
- `textstylename` 是文字样式的名称
- `scale` 为文字的比例
- `rotation` 为文字的旋转角度
- `xoffset` 代表文字在线型的 X 轴方向上沿直线的移动
- `yoffset` 表示文字在线型的 Y 轴方向垂直于该直线的移动

```text
*GAS_LINE,Gas line ----GAS----GAS----GAS----GAS----GAS----GAS--
A,12.7,-5.08,["GAS",STANDARD,S=2.54,U=0.0,X=-2.54,Y=-1.27],-6.35
```

如果要创建带有特殊符号的复杂线型，则可以在线型中嵌入已经定义的形。
线型说明中的形描述符的语法如下所示：

```text
[shapename, shxfilename]
#或
[shapename, shxfilename, transform]
```

- `shapename` 是要绘制的形的名称
- `shxfilename` 是编译后的形定义文件（`SHX`）的名称
- `transform` 用来定义形的旋转、比例和偏移

```text
*FENCELINE1,Fenceline circle ----0-----0----0-----0----0-----0--
A,6.35,-2.54,[CIRC1,ltypeshp.shx,x=-2.54,s=2.54],-2.54,25.4
```

`ltypeshp.shx` 形定义文件是 AutoCAD 自带的，其共定义了常用的 5 种图案，
分别为圆（`CIRC1`）、矩形（`BOX`）、竖线（`TRACK1`）、S型（`BAT`）和Z字型（`ZIG`）。

`ltypeshp.shx` 位于：

```text
C:\Users\1\AppData\Roaming\Autodesk\AutoCAD 2014\R19.1\enu\Support
```

### 软件界面

第 1 步，选择 `Format` 菜单下的 `LineType...` 命令：

![](/assets/images/cad/gui/gui-menu-format-linetype.png)

第 2 步，在打开的 Linetype Manager 中，会看到 `ByLayer`、`ByBlock` 和 `Continuous` 三种线型：

![](/assets/images/cad/gui/gui-linetype-manager.png)

## 加载线型

每个 AutoCAD 图形会自动加载 3 种线型：`BYBLOCK`、`BYLAYER` 和 `CONTINUOUS`。

通过 `SymbolUtilityService` 类的 `GetLinetypeByBlockId`、`GetLinetypeByLayerId` 和 `GetLinetypeContinuousId` 函数
来获取这 3 种线型的 `ObjectId`。

如果要加载其他的 AutoCAD 标准线型，则需要使用 `Database` 类的 `LoadLineTypeFile` 函数。

## 卸载已有线型

可以使用 `Erase` 函数对图形中已存在的线型进行卸载，但不能卸载如下线型：

- BYBLOCK
- BYLAYER
- CONTINUOUS
- 当前线型
- 已使用的线型
- 外部参照中的线型
- 块定义中的线型

## Line Type

### Scale

### Rotation



