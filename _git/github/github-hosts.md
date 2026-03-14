---
title: "Github Hosts"
sequence: "301"
---

[UP](/git/index.html)

```text
69.16.230.165 www.github.com
20.205.243.166 www.github.com
140.82.116.3 www.github.com
```

```text

```

解决方案：

- 清除本地 DNS 缓存：`ipconfig /flushdns`（Windows）或 `sudo dscacheutil -flushcache`（macOS）。
- 更换 DNS 服务器：
    - Google DNS：`8.8.8.8`, `8.8.4.4`
    - 电信：`114.114.114.114`
    - 阿里：`223.5.5.5`, `223.6.6.6`
    - 百度：`180.76.76.76`
    - 腾讯：`119.29.29.29`, `182.254.116.116`
    - 360 DNS:
        - 电信：首选：`101.226.4.6`
        - 联通：首选：`123.125.81.6`
        - 移动：首选：`101.226.4.6`
        - 铁通：首选：`101.226.4.6`

检查GitHub状态

- 访问 GitHub 的状态页面（`status.github.com` or `www.githubstatus.com`）以查看是否存在系统问题。

使用命令行工具

- 在命令行输入 `nslookup github.com` 检查是否能成功解析。
- 使用 `tracert github.com` 追踪路径，看看是否在某一节点上出现问题。

## Reference

- [Fetch GitHub Hosts](https://hosts.gitcdn.top/) ★★★
- [GitHub-Hosts](https://github.com/maxiaof/github-hosts)
- [DNS在线解析](http://www.ip33.com/dns.html)
