---
title: "NuGet Repo"
sequence: "nuget"
---

在 Nexus3 安装后，默认有一个 `nuget.org-proxy`:

```text
https://api.nuget.org/v3/index.json
```

![](/assets/images/nexus3/nuget/nuget-repo-nuget-org-proxy.png)

Once complete the V3 entry point for the proxy repository becomes:

```text
<nexus-host>:<nexus-port>/repository/<repository-name>/index.json
```

示例：

```text
http://localhost:8081/repository/nuget-proxy-v3/index.json
https://nexus.lsieun.cn/repository/nuget-group/index.json
```

This is the package source that should be passed to the nuget client in order to work with packages.

## Reference

- [NuGet Proxy Repositories](https://help.sonatype.com/repomanager3/nexus-repository-administration/formats/nuget-repositories/nuget-proxy-repositories)
