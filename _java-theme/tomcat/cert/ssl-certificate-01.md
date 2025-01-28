---
title: "SSL Certificates"
sequence: "103"
---

用管理员身份运行：

```text
keytool -genkey -alias lsieun -keyalg RSA -keystore D:\tmp\myStore
```

```text
keytool -list -keystore D:\tmp\myStore
```

```text
keytool -genkeypair  -keyalg RSA -alias lsieun -keypass liusen -dname "CN=Sen Liu, OU=IT, O=JinMa, L=BaoDing, S=HeBei, C=CN" -keystore D:\tmp\myKeyStore -storepass myPassword
```

```text
keytool -importcert -alias lsieun.cn -file D:\workspace\lsieun\cert\fullchain.cer
```