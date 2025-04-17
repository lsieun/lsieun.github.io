---
title: "Win10 关闭搜索广告"
sequence: "101"
---

[UP](/windows/windows-index.html)

第 1 步，按下 `Win + R`

第 2 步，输入 `cmd` 命令，并按下 `Ctrl + Shift + Enter`，以管理员身份打开

第 3 步，输入命令：

```text
reg add HKCU\Software\Policies\Microsoft\Windows\explorer /v DisableSearchBoxSuggestions /t reg_dword /d 1 /f
```

第 4 步，重启电脑
