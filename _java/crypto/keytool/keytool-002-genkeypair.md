---
title: "keytool -genkeypair"
sequence: "102"
---

[UP](/java-crypto.html)

## 查看帮助

```text
$ keytool -genkeypair --help
keytool -genkeypair [OPTION]...

Generates a key pair

Options:

 -alias <alias>          alias name of the entry to process
 -keyalg <alg>           key algorithm name
 -keysize <size>         key bit size
 -groupname <name>       Group name. For example, an Elliptic Curve name.
 -sigalg <alg>           signature algorithm name
 -dname <name>           distinguished name
 -startdate <date>       certificate validity start date/time
 -ext <value>            X.509 extension
 -validity <days>        validity number of days
 -keypass <arg>          key password
 -keystore <keystore>    keystore name
 -signer <alias>         signer alias
 -signerkeypass <arg>    signer key password
 -storepass <arg>        keystore password
 -storetype <type>       keystore type
 -providername <name>    provider name
 -addprovider <name>     add security provider by name (e.g. SunPKCS11)
   [-providerarg <arg>]    configure argument for -addprovider
 -providerclass <class>  add security provider by fully-qualified class name
   [-providerarg <arg>]    configure argument for -providerclass
 -providerpath <list>    provider classpath
 -v                      verbose output
 -protected              password through protected mechanism

Use "keytool -?, -h, or --help" for this help message
```

### 默认值

The following examples show the defaults for various option values:

```text
-alias "mykey"
 
-keyalg
    "DSA" (when using -genkeypair)
    "DES" (when using -genseckey)
 
-keysize
    2048 (when using -genkeypair and -keyalg is "RSA")
    2048 (when using -genkeypair and -keyalg is "DSA")
    256 (when using -genkeypair and -keyalg is "EC")
    56 (when using -genseckey and -keyalg is "DES")
    168 (when using -genseckey and -keyalg is "DESede")
 
-validity 90
  
-keystore <the file named .keystore in the user's home directory>

-destkeystore <the file named .keystore in the user's home directory>
   
-storetype <the value of the "keystore.type" property in the
    security properties file, which is returned by the static
    getDefaultType method in java.security.KeyStore>
 
-file
    stdin (if reading)
    stdout (if writing)
 
-protected false

```

### keyalg

在使用 `keytool -genkeypair` 命令时，`keyalg` 参数用于指定生成密钥对时要使用的密钥算法。以下是一些常见的可选值：

- `RSA`：用于生成基于 RSA（Rivest-Shamir-Adleman）算法的密钥对。

- `DSA`：用于生成基于 DSA（Digital Signature Algorithm）算法的密钥对。请注意，DSA 在某些国家已经不再推荐使用。

- `EC`：用于生成基于椭圆曲线密码学（Elliptic Curve Cryptography）算法的密钥对。具体的椭圆曲线参数取决于所选择的曲线类型（如
  prime256v1、secp384r1 等）。

- `DiffieHellman`：用于生成 Diffie-Hellman 密钥对，用于密钥交换协议。

这些是 `keyalg` 参数的一些常见选项，实际上还有其他可用的密钥算法。可以根据您的具体需求选择适当的算法。
例如，如果需要更高的性能和强大的安全性，可以选择 EC 算法。另外，还可以通过查看特定 JDK 版本的文档来获取完整的可用算法列表。

### sigalg

When generating a certificate or a certificate request,
the default signature algorithm (`-sigalg` option)
is derived from the algorithm of the underlying private key
to provide an appropriate level of security strength as follows:

<table>
    <thead>
        <tr>
            <th>keyalg</th>
            <th>keysize</th>
            <th>default sigalg</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <p>DSA</p>
            </td>
            <td>
                <p>any size</p>
            </td>
            <td>
                <p>SHA256withDSA</p>
            </td>
        </tr>
        <tr>
            <td>
                <p>RSA</p>
            </td>
            <td>
                <p>&lt;= 3072</p>
                <p>&lt;= 7680</p>
                <p>&gt; 7680</p>
            </td>
            <td>
                <p>SHA256withRSA</p>
                <p>SHA384withRSA</p>
                <p>SHA512withRSA</p>
            </td>
        </tr>
        <tr>
            <td>
                <p>EC</p>
            </td>
            <td>
                <p>&lt;384</p>
                <p>&lt;512</p>
                <p>= 512</p>
            </td>
            <td>
                <p>SHA256withECDSA</p>
                <p>SHA384withECDSA</p>
                <p>SHA512withECDSA</p>
            </td>
        </tr>
    </tbody>
</table>



### storetype

在 `keytool -genkeypair` 命令中，`storetype` 参数用于指定密钥库（KeyStore）的类型。以下是常见的几种可选值：

- `JKS`（Java KeyStore）：默认的密钥库类型，适用于 Java 平台。可以使用 `.jks` 后缀的文件来保存密钥库。例如：`-storetype JKS`。
- `PKCS12`：一种常见的密钥库格式，也称为 PFX。可以使用 `.p12` 或 `.pfx` 后缀的文件来保存密钥库。例如：`-storetype PKCS12`。
- `JCEKS`（Java Cryptography Extension KeyStore）：Java 扩展密钥库，提供了比 JKS 更强的加密功能和安全性。
  可以使用 `.jceks` 后缀的文件来保存密钥库。例如：`-storetype JCEKS`。
- `DKS`（Domain KeyStore）：一种用于管理域级别密钥和证书的 JDK 密钥库类型。
  可以使用 `.dks` 后缀的文件来保存密钥库。例如：`-storetype DKS`。

根据您的需求和应用环境，选择适合的密钥库类型非常重要。通常情况下，`JKS` 和 `PKCS12` 是最常用和广泛支持的两种密钥库类型。
