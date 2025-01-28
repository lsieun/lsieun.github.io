---
title: "CentOS 导入自定义 CA 证书"
sequence: "102"
---

[UP](/pki.html)


添加证书：

```text
$ sudo trust anchor --store mycert.crt
$ sudo update-ca-trust
```

移除证书：

```text
$ sudo trust anchor --remove mycert.crt
$ sudo update-ca-trust
```

## Reference

- [Adding a Self-Signed Certificate to the Trusted List](https://www.baeldung.com/linux/add-self-signed-certificate-trusted-list)
