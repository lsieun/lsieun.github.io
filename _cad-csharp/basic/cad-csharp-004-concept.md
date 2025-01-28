---
title: "概念"
sequence: "104"
---

## Database

关于 AutoCAD 数据库的基础知识：

- 表。
  - 表是数据库的组成单位。
  - 一个数据库至少包含 9 个符号表：块表、层表、文字样式表、线型表、视图表、UCS表、视口表、注册应用程序表、标注样式表。
- 记录。
  - 记录是表的组成单位。
  - 一个表可能包含多条记录，也可能不包含任何记录。

```text
数据库 --> 表 --> 记录
```

有两种方法获取数据库，一种是直接通过 `HostApplicationServices` 类的 `WorkingDatabase` 属性获取：

```text
using Autodesk.AutoCAD.DatabaseServices;

Database db = HostApplicationServices.WorkingDatabase;
```

第二种方式是先获取当前活动文档，再通过文档获取对应的数据库：

```text
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;

Document doc = Application.DocumentManager.MdiActiveDocument;
Database db = doc.Database;
```

在 .NET 中，有关数据库的操作都是通过“事务处理”进行的。

启动 AutoCAD 后，其块表中自动生成三条块表记录，分别表示模型空间和两个布局。
它们的名称分别为：`*MODEL_SPACE`，`*PAPER_SPACE` 和 `*PAPER_SPACE0`。

## ObjectId

在 .NET 中，ObjectId 是表示实体对象的最常用的一种方式。
当一个实体被创建时，AutoCAD 图形数据库将自动为这个实体分配一个 ObjectId。
因此，在创建对象时，可以将该对象的 ObjectId 保存起来，
在需要访问该对象时，再根据这个 ObjectId 打开其表示的实体对象，
就可以修改或查询该对象的特性。

当我们获取实体的 ObjectId 后，
可以通过 Transaction （事务处理）类的 GetObject 函数打开 ObjectId 表示的实体对象来进行操作，
因为这些对象是不能直接访问的。

事务处理，对于读/写对象是安全的，
因为在事务处理中打开的对象会在其退出时自动关闭，
但其代价是读/写时间会有所加长。
因此，你可以使用 ObjectId 的 Open 函数和 Entity 的 Close 函数来打开和关闭实体，
这种处理方式类似于C++的编程方法。
当你使用 Open 函数打开对象并进行编辑后，可以使用 Cancel 函数撤销这些编辑操作。

当你使用 Open 函数打开一个对象后，在访问对象结束后，要及时使用 Close 或 Cancel 函数，
不然会导致 AutoCAD 变得不稳定。

