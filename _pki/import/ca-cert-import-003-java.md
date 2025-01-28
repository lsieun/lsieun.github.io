---
title: "Java 导入自定义 CA 证书"
sequence: "103"
---

[UP](/pki.html)

## 问题描述

问题描述：之前的 HTTPS 证书到期了，然后我就替换成了一个自签名的证书，当执行 `mvn dependency:resolve` 命令时，遇到错误

```text
javax.net.ssl.SSLHandshakeException: sun.security.validator.ValidatorException: PKIX path building failed:
sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target.
```

原因分析：Java did not recognize the root certificate authority (CA).

解决方法：update Java to recognize the root CA.

## 解决步骤

第 1 步，找到 `cacerts` 文件的位置。`cacerts` 文件用于存储 root certificates。

- 在默认情况下，位于 `jre/lib/security/cacerts`
- 默认密码：`changeit`

我的电脑上：

- `C:\Program Files\Java\jdk-1.8\jre\lib\security\cacerts`
- `C:\Program Files\Java\jdk-17\lib\security\cacerts`

If you do not want to modify the default JRE store, you can make a copy,
and use the following system properties to specify the location and password.

- `javax.net.ssl.trustStore`
- `javax.net.ssl.trustStorePassword`

Once you have your keystore, dump its contents by using the list option.

```text
keytool -list -v -keystore /path/to/cacerts  > java_cacerts.txt
Enter keystore password:  changeit
```

```text
>keytool -list -v -keystore cacerts > java_certs.txt
```

Take a look at java_cacerts.txt. See if it includes the same certificate that is present in the browser by searching for a matching serial number. In the java_cacerts.txt file, the serial number will be in lowercase and without the “:” colon character. If it is not present, then this could be the reason for the error, and we can fix this by adding the certificate found in the browser.

Back in the browser, export the Root CA. Choose the "X.509 Certificate (DER)" type, so the exported file has a der extension.

Assuming the file is called example.der, pick the alias `example` for this certificate. Next import the file.

```text
keytool -import -alias example -keystore /path/to/cacerts -file example.der
```

```text
keytool -import -alias fruit.com -keystore cacerts -file fruit.der
```

You will be prompted for a password, use `changeit` and respond “yes” on whether to trust this key.

Dump the contents again to verify it contains your new certificate. Restart the JVM and check that it can now access the HTTPS URL. Also remove the java_cacerts.txt dump file.

## Reference

- [PKIX path building failed](https://magicmonster.com/kb/prg/java/ssl/pkix_path_building_failed/)
