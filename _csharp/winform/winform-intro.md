---
title: "C# WinForm Intro"
sequence: "201"
---

- 控件
- 事件处理 Event
- 控件的布局
  - Anchor
  - Dock
- 布局器
  - LayoutEngine，在Form或Panel当中可以设置LayoutEngine
  - SimpleLayoutPanel/AfDockLayout
  - FlowLayoutPanel
  - TableLayoutPanel
- 常用控件
- 图片
- 资源管理
- 对话框
- 系统对话框：打开文件OpenFileDialog、保存文件SaveFileDialog、目录选择FolderBrowserDialog、颜色选择ColorDialog、字段选择FontDialog
- 菜单栏、工具栏、右键菜单


工具-->选项-->Windows窗体设计器|常规-->自动填充工具箱：True

```text
MessageBox.Show("Hello");
btn.Click += new EventHandler(this.onTest);
public void test(object sender, EventArgs e) {
    // show message
}

string timeStr = DateTime.NOW.ToString("yyyy-MM-dd HH:mm:ss");

int index = listBox1.IndexFromPoint(e.Location);
```





