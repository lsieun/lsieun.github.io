---
title: "Jekyll 安装（Win10）"
sequence: "win10"
---

[UP](/jekyll/jekyll-index.html)

https://jekyllrb.com/docs/
https://jekyllrb.com/docs/installation/
https://jekyllrb.com/docs/installation/windows/

## Ruby

第 1 步，下载 RubyInstaller，使用默认选项安装：

```text
https://rubyinstaller.org/downloads/
```

安装 `rubyinstaller-devkit-3.4.2-1-x64.exe` 成功


第 2 步，在安装结束时，进行 `ridk install` 的步骤：

![](/assets/images/jekyll/ruby-setup-ridk-install.png)

查看 Ruby 版本：

```text
ruby -v
```

查看 RubyGems 版本：

```text
gem -v
```

第 3 步，启动新的 CMD 窗口，输入命令：

```text
gem install jekyll bundler
```

第 4 步，检查 Jekyll 是否安装成功：

```text
jekyll -v
```

查看 Bundle 版本：

```text
bundle -v
```
