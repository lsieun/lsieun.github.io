---
title: "生成自签名证书"
sequence: "103"
---

[UP](/java-crypto.html)

## Creating a Self-Signed Certificate

In order to **generate the certificate**, we're going to use `keytool` command with the `-genkeypair` option:

```text
$ keytool -genkeypair -keyalg RSA -keysize 2048 -alias <alias> -keypass <keypass> -validity <validity> -storepass <storepass>
```

- `alias` – the name for our certificate
- `keypass` – the password of the certificate. We'll need this password to have access to the private key of our certificate
- `validity` – the time (in days) of the validity of our certificate
- `storepass` – the password for the keystore. This will be the password of the keystore if the store doesn't exist

```text
# JKS
# OK: Java 8
$ keytool -genkeypair -keyalg RSA -keysize 2048 -alias lsieun.com -keypass myKeyPass -validity 365 -storepass myStorePass -keystore myKeystore.jks
```

```text
# PKCS12
# OK: Java 8
# 在 PKCS12 中，不支持 -keypass 参数
$ keytool -genkeypair -keyalg RSA -keysize 2048 -alias lsieun.com -validity 365 -storepass myStorePass -keystore myKeystore.p12 -storetype PKCS12
```

```text
$ keytool -genkeypair -keyalg RSA
Enter keystore password: abcdef 
Re-enter new password: abcdef
What is your first and last name?
  [Unknown]:  Sen Liu
What is the name of your organizational unit?
  [Unknown]:  IT
What is the name of your organization?
  [Unknown]:  Fruit Ltd
What is the name of your City or Locality?
  [Unknown]:  BaoDing
What is the name of your State or Province?
  [Unknown]:  HeBei
What is the two-letter country code for this unit?
  [Unknown]:  CN
Is CN=Sen Liu, OU=IT, O=Fruit Ltd, L=BaoDing, ST=HeBei, C=CN correct?
  [no]:  yes

Generating 2,048 bit RSA key pair and self-signed certificate (SHA256withRSA) with a validity of 90 days
	for: CN=Sen Liu, OU=IT, O=Fruit Ltd, L=BaoDing, ST=HeBei, C=CN
```

## 查看证书列表

查看 KeyStore 中的证书列表：

```text
$ keytool -list -v -keystore /path/to/keystore

# 指定 KeyStore 的密码
$ keytool -list -v -keystore /path/to/keystore -storepass <storepass>
```

示例：

```text
# JKS
# OK: Java 8
$ keytool -list -v -keystore myKeystore.jks -storepass myStorePass

# PKCS12
# OK: Java 8
$ keytool -list -v -keystore myKeystore.p12 -storepass myStorePass
```

## 导出和导入

导出：

```text
# JKS
# OK: Java 8
$ keytool -export -alias "lsieun.com" -keystore myKeystore.jks -rfc -file "lsieun.com".cer

# PKCS12
# OK: Java 8
$ keytool -export -alias "lsieun.com" -keystore myKeystore.p12 -rfc -file "lsieun.com".cer
```

导入：

```text
# JKS
# OK: Java 8
$ keytool -import -alias "lsieun.com" -file "lsieun.com".cer -keystore myTruststore.jks

# PKCS12
# OK: Java 8
$ keytool -import -alias "lsieun.com" -file "lsieun.com".cer -keystore myTruststore.p12
```
