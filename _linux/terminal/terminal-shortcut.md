---
title: "Terminal 快捷键"
---

[UP](/linux.html)


## 移动

开头和结尾

- `Ctrl+A`: Go to the beginning of the line.
- `Ctrl+E`: Go to the end of the line.

一个字符

- `Ctrl+F`: Go right (forward) one character.
- `Ctrl+B`: Go left (back) one character.

一个单词

- `Ctrl+Left Arrow`: Go right (forward) one word.
- `Ctrl+Right Arrow`: Go left (back) one word.

## 删除

类似于“一刀两段”

- `Ctrl+U`: Cut the part of the line before the cursor, adding it to the clipboard.
- `Ctrl+K`: Cut the part of the line after the cursor, adding it to the clipboard.

删除一个单词（多个字符）

- `Ctrl+W`: Cut the word before the cursor, adding it to the clipboard.
- `Alt+D`: Delete the Word after the cursor.

删除一个字符

- `Ctrl+D` or `Delete`: Delete the character under the cursor.
- `Ctrl+H` or `Backspace`: Delete the character before the cursor.

## 查看

```bash
history
```

## 遍历历史

- `Ctrl+P`: 向上
- `Ctrl+N`: 向下
