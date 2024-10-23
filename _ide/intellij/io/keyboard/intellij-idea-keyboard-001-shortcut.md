---
title: "键盘：快捷键"
sequence: "101"
---

[UP](/ide/intellij-idea-index.html)


## General

- `Ctrl + Shift + F12`: Toggle maximizing editor
- `Ctrl + Tab`: Switch between tabs and tool window

## Windows

- `Ctrl + Alt + S`: Open Settings dialog

- `Alt + 1`: Project Window
- `Alt + 2`: Bookmarks Window
- `Alt + 6`: Problems Window
- `Alt + 7`: Structure Window
- `Alt + 9`: Version Control Window 我觉得 `9` 像 `git` 的首字母。
- `Alt + F12`: Terminal Window

- `Ctrl + E`: 也可以打开 Project/Favorites 等 Window，它可以进行搜索

### Switch Window

Use `Esc` and `F12` to switch between editor and tool windows:

- `Esc`: Go to editor (from tool window)
- `F12`: Go back to previous tool window

Close an active or all tool windows

- `Ctrl + Shift + F12`: Toggle maximizing editor，再次按下会打开原来的 tool window
- `Ctrl + Alt + F12`: Show In Explorer



### Project Window

- `Alt + 1`: Project Window

Search

- type to search something


- Select Child Node: Right Arrow

For IntelliJ IDEA 2021.2.1 and later versions, use

示例一：按下 `Alt+1` 组合键，打开 Project 工具窗口

- `Ctrl+Alt+Shift+Right` 增加 Project 的宽度
- `Ctrl+Alt+Shift+Left` 减小 Project 的宽度

示例二：按下 `Alt+F12` 组合键，打开 Terminal 工具窗口

- `Ctrl+Alt+Shift+Up` 增加 Project 的高度
- `Ctrl+Alt+Shift+Down` 减小 Project 的高度



### 为 tool window 添加快捷键

按下 `Ctrl+Shift + A`，查找“maven”，然后找到对应的条目，再按下 `Alt + Enter` 就可以为 maven tool window 添加快捷键了。

例如，我用 `Ctrl + Alt + Shift + 3` 来打开 maven tool window，因为我觉得 `3` 和 `m` 有点相近。

按下 `Alt + Home` 会唤起 Navigation Bar，找到某个具体的包下，按下 `Alt + Insert` 可以添加一个新的类。

Navigation between open files

- 按下 `Ctrl + Tab`，打开 Switcher 可以快速查看
- 按下 `Ctrl + E`，打开 Recent Files；如果按下两次 `Ctrl + E`，也是打开 Recent File，但是只显示修改过的文件，不显示未修改的文件
- 按下 `Ctrl + Shift + E`，可以打开最近修改的位置

Modify size of a dialog window

示例一：按下 `Ctrl + Alft + Shift + S` 组合键，打开 Project Structure Dialog

- `Ctrl+Alt+Shift+Right` 增加宽度
- `Ctrl+Alt+Shift+Left` 减小宽度
- `Ctrl+Alt+Shift+Up` 增加高度
- `Ctrl+Alt+Shift+Down` 减小高度

## Find

- `Ctrl + Shift + A`: Find Action

管理界面，使用 `Ctrl + Shift + A`，搜索“View | Appearance”

## Debugging

主要的键盘值：`F7`~`F9`

1、断点

- `Ctrl + F8`: Toggle breakpoint
- `Ctrl + Shift + F8`: View breakpoints

2、单独键：

- `F7`: Step into
- `F8`: Step over
- `F9`: Resume program

3、组合键

- `Shift + F7`: Smart step into
- `Shift + F8`: Smart step out
- `Alt + F8`: Evaluate expression
- `Alt + F9`: Run to cursor

## Bookmark

切换：

- `F11`: Toggle bookmark
- `Ctrl + F11`: Toggle bookmark with mnemonic

切换和跳转：

- `Ctrl + Shift + #[0-9]`: Toggle numbered bookmark
- `Ctrl + #[0-9]`: Go to numbered bookmark

查看：

- `Shift + F11`: Show bookmarks
- `Alt + 2`: Bookmarks tool window

- 添加或移除 Bookmark: `Ctrl + Shift + 数字键 `
- 跳转到指定的 Bookmark: `Ctrl + 数字键 `
- 查看所有的 Bookmarks: `Alt + 2`

## Code

### Hierarchy

- `Ctrl + H`: Type hierarchy
- `Ctrl + Shift + H`: Method hierarchy
- `Ctrl + Alt + H`: Call hierarchy

### Highlighted Error

- `F2`: Next highlighted error
- `Shift + F2`: Previous highlighted error

## Navigation

- `Ctrl + Alt + Left`: Navigate back
- `Ctrl + Alt + Right`: Navigate forward
- `Ctrl + B`: Go to declaration
- `Ctrl + Alt + B`: Go to Implementation(s)
