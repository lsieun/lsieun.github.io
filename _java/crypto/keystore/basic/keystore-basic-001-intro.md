---
title: "Intro"
sequence: "101"
---

[UP](/java-crypto.html)

## 主要作用

KeyStore is a container for Keys.

A **Java KeyStore** is a container of security certificates that we can use when writing Java code.

Java KeyStores hold one or more certificates with their matching private keys and
are created using `keytool` which comes with the JDK.

## 存储格式

- Java 8 及以前的版本，默认使用 JKS 格式。
- Java 9 及以后的版本，默认使用 PKCS#12 格式。

**JKS is a Java-specific file format that was the default format for KeyStores until Java 8.**

**Starting from Java 9, `PKCS#12` is the default KeyStore format.**

Despite `JKS`, `PKCS#12` is a standardized and language-neutral format for storing encrypted data.
The `PKCS#12` format is also known as `PKCS12` or `PFX`.

## 默认存储位置 cacerts - truststore

By default, Java has a keystore file located at `JAVA_HOME/jre/lib/security/cacerts`.
We can access this keystore using the default keystore password `changeit`.

在 JDK 17 中，`cacerts` 位于：

```text
JDK_HOME/lib/security/cacerts
```

第一种方式，查看内容（任意目录）：

```text
$ keytool -list -cacerts
```

第二种方式，在 `JDK_HOME/lib/security/` 目录

```text
$ keytool -list -keystore cacerts
Warning: use -cacerts option to access cacerts keystore
Enter keystore password: changeit
```

## KeyStore 和 TrustStore

In most cases, we use a **keystore** and a **truststore** when our application needs to communicate over SSL/TLS.

### Java KeyStore

**A Java keystore stores private key entries, certificates with public keys, or just secret keys**.
It stores each by an alias for ease of lookup.

Usually, **we'll use a keystore when we're a server and want to use HTTPS.**
During an SSL handshake, the server looks up the private key from the keystore,
and presents its corresponding public key and certificate to the client.

Similarly, if the client also needs to authenticate itself,
a situation called **mutual authentication**,
then the client also has a keystore and also presents its public key and certificate.

**There's no default keystore**, so if we want to use an encrypted channel,
we'll have to set `javax.net.ssl.keyStore` and `javax.net.ssl.keyStorePassword`.
If our keystore format is different from the default,
we could use `javax.net.ssl.keyStoreType` to customize it.

Of course, **we can use these keys to service other needs as well.**
**Private keys** can sign or decrypt data, and **public keys** can verify or encrypt data.
**Secret keys** can perform these functions as well.
A keystore is a place that we can hold onto these keys.

### TrustStore

A truststore is the opposite.
While a **keystore** typically holds onto **certificates** that identify us,
a **truststore** holds onto certificates that identify others.

In Java, we use it to trust the third party we're about to communicate with.

Take our earlier example. If a client talks to a Java-based server over HTTPS,
the **server** will look up the associated key from its **keystore** and
present the **public key** and **certificate** to the client.

```text
server --> keystore --> public key + certificate
```

We, the client, then look up the associated certificate in our **truststore**.
If the certificate or Certificate Authorities presented by the external server isn't in our truststore,
we'll get an `SSLHandshakeException`, and the connection won't be set up successfully.

```text
client --> truststore --> CA public certificate
```

Java has bundled a **truststore** called `cacerts`, and it resides in the `$JAVA_HOME/jre/lib/security` directory.

It contains default, trusted Certificate Authorities:

```text
$ keytool -list -keystore cacerts
Enter keystore password:
Keystore type: JKS
Keystore provider: SUN

Your keystore contains 92 entries

verisignclass2g2ca [jdk], 2018-06-13, trustedCertEntry,
Certificate fingerprint (SHA1): B3:EA:C4:47:76:C9:C8:1C:EA:F2:9D:95:B6:CC:A0:08:1B:67:EC:9D
```

We can see here that the truststore contains 92 trusted certificate entries and
one of the entries is the `verisignclass2gca` entry.
This means that the JVM will automatically trust certificates signed by `verisignclass2g2ca`.

We can override the **default truststore location** via the `javax.net.ssl.trustStore` property.
Similarly, we can set `javax.net.ssl.trustStorePassword` and `javax.net.ssl.trustStoreType`
to specify the truststore password and type.

### 对比

|          | KeyStore                         | TrustStore                         |
|----------|----------------------------------|------------------------------------|
| store    | `javax.net.ssl.keyStore`         | `javax.net.ssl.trustStore`         |
| password | `javax.net.ssl.keyStorePassword` | `javax.net.ssl.trustStorePassword` |
| type     | `javax.net.ssl.keyStoreType`     | `javax.net.ssl.trustStoreType`     |

## Reference

- [Difference Between a Java Keystore and a Truststore](https://www.baeldung.com/java-keystore-truststore-difference)
- [Java KeyStore API](https://www.baeldung.com/java-keystore)
