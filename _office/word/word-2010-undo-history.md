---
title: "Word 2010 无法撤销"
sequence: "101"
---

Word 2010 无法撤销解决方法可以通过修改注册表来解决。

第一步，打开注册表编辑器。

按 `Win+R`，在运行框中键入 `regedit`，然后单击“确定”。

![](/assets/images/office/word/word-2010-undo-history-001.png)

第二步，在注册表编辑器中，展开到下列注册表子项：

```text
计算机\HKEY_CURRENT_USER\SOFTWARE\Microsoft\Office\15.0\Word\Options
```

第三步，在“编辑”菜单上，指向“新建”，然后单击“DWORD（32位）值”。选择上更改“新值 #1”，键入 `UndoHistory`，然后按 确认。

![](/assets/images/office/word/word-2010-undo-history-002.png)

![](/assets/images/office/word/word-2010-undo-history-003.png)

第四步，修改 `UndoHistory` 项的值，介于 `0` 和 `100` 之间的值，单击“确定”，然后退出注册表编辑器。 
这个值是 Undo（可撤销）的次数，不建议设置的太大，一般设成 `20` 即可，太大会占用较多的内存资源。

![](/assets/images/office/word/word-2010-undo-history-004.png)
