---
title: "Convert KeyStore Formats"
sequence: "110"
---

[UP](/java-crypto.html)


## PKCS#12 to JKS

```text
$ keytool -importkeystore -srckeystore signed_certificate.pfx -srcstoretype pkcs12 -deststoretype jks -destkeystore signed_certificate.jks
```

## JKS to PKCS#12

```text
keytool -importkeystore -srckeystore signed_certificate.jks -destkeystore signed_certificate.jks -deststoretype pkcs12
```
