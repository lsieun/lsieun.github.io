---
title: "Intro"
sequence: "101"
---

## 文字类型

AutoCAD 中的文字共分两种：

- 单行文字
- 多行文字

对简短的输入项，使用单行文字；
对于较长而且有内部格式的输入，可以使用多行文字。

### 单行文字

在 .NET 中，DBText 类用来表示单行文字（请注意，不是Text！）。

DBText 类只有一个不带参数的构造函数，其属性设置如下：

- 内容：
    - 文字内容为 `null`
- 大小：
    - 高度为 `0.0`
    - 宽度比例为 `1.0`
- 样式：
    - 文字的样式的 `ObjectId` 为 `ObjectId.Null`
- 对齐：
    - 水平对齐方式为左对齐
    - 垂直对齐方式为基线
- 位置：
  - 插入点和对齐点为 `(0, 0, 0)`
  - 倾斜和旋转角度为 `0.0`、
- 其它：
  - 镜像为 `false`
  - 法向量为 `(0, 0, 1)`
  - 厚度为 `0.0`

因此，创建单行文字后，需要对其插入点、文字内容、文字样式、文字高度、倾斜角度、旋转角度和对齐方式等属性设置。

![](/assets/images/cad/csharp/cad-text-align-position.png)

### 多行文字

在 .NET 中，`MText` 类用来表示多行文字。

创建多行文字的步骤与创建单行文字的步骤基本类似，也是先用不带参数的默认构造函数创建多行文字，
然后对其插入点、文字内容、文字样式、文字宽度等属性进行设置。

注意：多行文字无法直接指定文字的高度，这是因为多行文字各部分文字的高度都可以单独设置。

根据格式代码对多行文字所起的修饰作用，可以将其分为两类：

- 在多行文字中插入特殊字符。例如：`\\` 可以在多行文字中插入反斜杠，`\{...\}`可以在多行文字中插入一对大括号。对这类格式代码去掉一个特殊字符 `\` 即可。
- 修改多行文字的字体、颜色等特性。例如：`\File name;` 用于修改部分文字的字体，`\$...^...;` 用于对指定部分的文字进行堆叠。
  对这类格式代码可以将 `\` 和 `;` 之间的字符从字符串全部删除即可。

AutoCAD 中用于堆叠的特殊字符有：

- 斜杠（`/`）：以垂直方式堆叠文字，由水平线分隔。
- 井号（`#`）：以对角形式堆叠文字，由对角线分隔。
- 插入符（`^`）：创建公差堆叠（垂直堆叠，且不用直线分隔）。

## 特殊字符

有的符号，在键盘上不存在对应的按键，需要特殊的方法进行输入，称为**特殊字符**。

在 AutoCAD 中，可以使用**控制代码**或 Unicode 字符串来表示特殊字符。

### 控制代码

控制代码以 `%%` 开头：

```text
public static readonly string Overline = @"%%o";
public static readonly string Underline = @"%%u";
```

### Unicode

Unicode 字符串的格式为 `\U+nnnn`，其中 `U` 代表 Unicode 字符，
`nnnn` 为四个十六进制数字的 Unicode 编码。

```text
public static readonly string Square = @"\U+00B2";
public static readonly string Cube = @"\U+00B3";
```

### 字体

需要注意的是，使用 Unicode 字符串表示特殊字符时，必须使用支持它们的字体。

根据 AutoCAD 帮助文档，Unicode 字符串适用于下列 TrueType (TTF) 字体 SHX 字体：
Simplex、RomanS、Isocp、Isocp2、Isocp3、Isoct、Isoct2、Isoct3、Isocpeur（仅 TTF 字体）、
Isocpeur italic（仅 TTF 字体）、Isocteur（仅 TTF 字体）、Isocteur italic（仅 TTF 字体）。

## Reference

- [Unicode Converter - encoding / decoding](https://www.coderstool.com/unicode-text-converter)
