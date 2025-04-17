---
title: "powercfg"
sequence: "powercfg"
---

[UP](/windows/windows-index.html)

用管理员身份运行 `cmd` 命令，然后输入：

```text
powercfg -h off
```

即可关闭休眠功能，同时 `hiberfil.sys` 文件也会自动删除。

## Reference

- [Powercfg 命令行选项](https://learn.microsoft.com/zh-cn/windows-hardware/design/device-experiences/powercfg-command-line-options)
