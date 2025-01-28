---
title: "Entry 新增读取删除"
sequence: "102"
---

[UP](/java-crypto.html)

## 保存数据

In the keystore, we can store three different kinds of entries, each under its alias:

- Symmetric Keys (referred to as Secret Keys in the JCE)
- Asymmetric Keys (referred to as Public and Private Keys in the JCE)
- Trusted Certificates

### Symmetric Key

To save a symmetric key, we'll need three things:

- **an alias** – this is simply the name that we'll use in the future to refer to the entry
- **a key** – which is wrapped in a `KeyStore.SecretKeyEntry`
- **a password** – which is wrapped in what is called a `ProtectionParam`

```java
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.security.KeyStore;
import java.util.Enumeration;

public class D_Store_01_SymmetricKey {
    public static void main(String[] args) throws Exception {
        char[] pwdArray = "pkcs12StorePass".toCharArray();

        try (
                FileInputStream in = new FileInputStream("newKeyStore.pfx");
        ) {
            KeyStore ks = KeyStore.getInstance("pkcs12");

            // 加载
            ks.load(in, pwdArray);

            // SymmetricKey
            KeyGenerator keygen = KeyGenerator.getInstance("HmacSHA256");
            SecretKey secretKey = keygen.generateKey();
            KeyStore.SecretKeyEntry secret = new KeyStore.SecretKeyEntry(secretKey);
            KeyStore.ProtectionParameter password = new KeyStore.PasswordProtection(pwdArray);

            // 设置
            ks.setEntry("db-encryption-secret", secret, password);

            // 遍历
            Enumeration<String> aliases = ks.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                System.out.println(alias);
            }

            // 保存
            try (FileOutputStream fos = new FileOutputStream("newKeyStore.pfx")) {
                ks.store(fos, pwdArray);
            }
        }
    }
}
```

### Asymmetric Keys

So to save an asymmetric key, we'll need four things:

- **an alias**
- **a private key** – because we aren't using the generic method, the key won't get wrapped. Also, in our case, it should be an instance of `PrivateKey`.
- **a password** – used to access the entry. This time, the password is mandatory.
- **a certificate chain** – this certifies the corresponding public key

```java
import sun.security.util.DerOutputStream;
import sun.security.util.KnownOIDs;
import sun.security.util.ObjectIdentifier;
import sun.security.x509.*;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.Date;
import java.util.Enumeration;

public class D_Store_02_PrivateKey {
    public static void main(String[] args) throws Exception {
        char[] pwdArray = "pkcs12StorePass".toCharArray();

        try (
                FileInputStream in = new FileInputStream("newKeyStore.pfx");
        ) {
            KeyStore ks = KeyStore.getInstance("pkcs12");

            // 加载
            ks.load(in, pwdArray);

            // Generate the key pair
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(1024);
            KeyPair keyPair = keyPairGenerator.generateKeyPair();


            // Generate a self signed certificate
            X509Certificate certificate = generateSelfSignedCertificate(keyPair);

            X509Certificate[] certificateChain = new X509Certificate[1];
            certificateChain[0] = certificate;
            ks.setKeyEntry("myPrivateKey", keyPair.getPrivate(), "abc123".toCharArray(), certificateChain);

            // 遍历
            Enumeration<String> aliases = ks.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                System.out.println(alias);
            }

            // 保存
            try (FileOutputStream fos = new FileOutputStream("newKeyStore.pfx")) {
                ks.store(fos, pwdArray);
            }
        }
    }

    private static X509Certificate generateSelfSignedCertificate(KeyPair keyPair) throws Exception {
        X509CertInfo certInfo = new X509CertInfo();
        // Serial number and version
        certInfo.set(X509CertInfo.SERIAL_NUMBER, new CertificateSerialNumber(new BigInteger(64, new SecureRandom())));
        certInfo.set(X509CertInfo.VERSION, new CertificateVersion(CertificateVersion.V3));

        // Subject & Issuer
        X500Name owner = new X500Name("CN=LSIEUN, OU=IT, O=Fruit, L=BaoDing, ST=HeBei, C=CN");
        certInfo.set(X509CertInfo.SUBJECT, owner);
        certInfo.set(X509CertInfo.ISSUER, owner);

        // Key and algorithm
        certInfo.set(X509CertInfo.KEY, new CertificateX509Key(keyPair.getPublic()));
        AlgorithmId algorithm = new AlgorithmId(ObjectIdentifier.of(KnownOIDs.SHA1withRSA));
        certInfo.set(X509CertInfo.ALGORITHM_ID, new CertificateAlgorithmId(algorithm));

        // Validity
        Date validFrom = new Date();
        Date validTo = new Date(validFrom.getTime() + 50L * 365L * 24L * 60L * 60L * 1000L); //50 years
        CertificateValidity validity = new CertificateValidity(validFrom, validTo);
        certInfo.set(X509CertInfo.VALIDITY, validity);

        GeneralNameInterface dnsName = new DNSName("lsieun.com");
        DerOutputStream dnsNameOutputStream = new DerOutputStream();
        dnsName.encode(dnsNameOutputStream);

        GeneralNameInterface ipAddress = new IPAddressName("127.0.0.1");
        DerOutputStream ipAddressOutputStream = new DerOutputStream();
        ipAddress.encode(ipAddressOutputStream);

        GeneralNames generalNames = new GeneralNames();
        generalNames.add(new GeneralName(dnsName));
        generalNames.add(new GeneralName(ipAddress));

        CertificateExtensions ext = new CertificateExtensions();
        ext.set(SubjectAlternativeNameExtension.NAME, new SubjectAlternativeNameExtension(generalNames));

        certInfo.set(X509CertInfo.EXTENSIONS, ext);

        // Create certificate and sign it
        X509CertImpl cert = new X509CertImpl(certInfo);
        cert.sign(keyPair.getPrivate(), "SHA1withRSA");

        // Since the SHA1withRSA provider may have a different algorithm ID to what we think it should be,
        // we need to reset the algorithm ID, and resign the certificate
        AlgorithmId actualAlgorithm = (AlgorithmId) cert.get(X509CertImpl.SIG_ALG);
        certInfo.set(CertificateAlgorithmId.NAME + "." + CertificateAlgorithmId.ALGORITHM, actualAlgorithm);
        X509CertImpl newCert = new X509CertImpl(certInfo);
        newCert.sign(keyPair.getPrivate(), "SHA1withRSA");

        return newCert;
    }
}
```

### Trusted Certificates

Storing trusted certificates is quite simple. It only requires the **alias** and the **certificate** itself,
which is of type `Certificate`

```java
import sun.security.util.DerOutputStream;
import sun.security.util.KnownOIDs;
import sun.security.util.ObjectIdentifier;
import sun.security.x509.*;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.math.BigInteger;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.Date;
import java.util.Enumeration;

public class D_Store_03_TrustedCertificate {
    public static void main(String[] args) throws Exception {
        char[] pwdArray = "pkcs12StorePass".toCharArray();

        try (
                FileInputStream in = new FileInputStream("newKeyStore.pfx");
        ) {
            KeyStore ks = KeyStore.getInstance("pkcs12");

            // 加载
            ks.load(in, pwdArray);

            // Generate the key pair
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(1024);
            KeyPair keyPair = keyPairGenerator.generateKeyPair();

            // Generate a self signed certificate
            X509Certificate certificate = generateSelfSignedCertificate(keyPair);

            ks.setCertificateEntry("myCertificate", certificate);

            // 遍历
            Enumeration<String> aliases = ks.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                System.out.println(alias);
            }

            // 保存
            try (FileOutputStream fos = new FileOutputStream("newKeyStore.pfx")) {
                ks.store(fos, pwdArray);
            }
        }
    }

    private static X509Certificate generateSelfSignedCertificate(KeyPair keyPair) throws Exception {
        X509CertInfo certInfo = new X509CertInfo();
        // Serial number and version
        certInfo.set(X509CertInfo.SERIAL_NUMBER, new CertificateSerialNumber(new BigInteger(64, new SecureRandom())));
        certInfo.set(X509CertInfo.VERSION, new CertificateVersion(CertificateVersion.V3));

        // Subject & Issuer
        X500Name owner = new X500Name("CN=LSIEUN, OU=IT, O=Fruit, L=BaoDing, ST=HeBei, C=CN");
        certInfo.set(X509CertInfo.SUBJECT, owner);
        certInfo.set(X509CertInfo.ISSUER, owner);

        // Key and algorithm
        certInfo.set(X509CertInfo.KEY, new CertificateX509Key(keyPair.getPublic()));
        AlgorithmId algorithm = new AlgorithmId(ObjectIdentifier.of(KnownOIDs.SHA1withRSA));
        certInfo.set(X509CertInfo.ALGORITHM_ID, new CertificateAlgorithmId(algorithm));

        // Validity
        Date validFrom = new Date();
        Date validTo = new Date(validFrom.getTime() + 50L * 365L * 24L * 60L * 60L * 1000L); //50 years
        CertificateValidity validity = new CertificateValidity(validFrom, validTo);
        certInfo.set(X509CertInfo.VALIDITY, validity);

        GeneralNameInterface dnsName = new DNSName("lsieun.com");
        DerOutputStream dnsNameOutputStream = new DerOutputStream();
        dnsName.encode(dnsNameOutputStream);

        GeneralNameInterface ipAddress = new IPAddressName("127.0.0.1");
        DerOutputStream ipAddressOutputStream = new DerOutputStream();
        ipAddress.encode(ipAddressOutputStream);

        GeneralNames generalNames = new GeneralNames();
        generalNames.add(new GeneralName(dnsName));
        generalNames.add(new GeneralName(ipAddress));

        CertificateExtensions ext = new CertificateExtensions();
        ext.set(SubjectAlternativeNameExtension.NAME, new SubjectAlternativeNameExtension(generalNames));

        certInfo.set(X509CertInfo.EXTENSIONS, ext);

        // Create certificate and sign it
        X509CertImpl cert = new X509CertImpl(certInfo);
        cert.sign(keyPair.getPrivate(), "SHA1withRSA");

        // Since the SHA1withRSA provider may have a different algorithm ID to what we think it should be,
        // we need to reset the algorithm ID, and resign the certificate
        AlgorithmId actualAlgorithm = (AlgorithmId) cert.get(X509CertImpl.SIG_ALG);
        certInfo.set(CertificateAlgorithmId.NAME + "." + CertificateAlgorithmId.ALGORITHM, actualAlgorithm);
        X509CertImpl newCert = new X509CertImpl(certInfo);
        newCert.sign(keyPair.getPrivate(), "SHA1withRSA");

        return newCert;
    }
}
```

## 读取

### 读取一项

```java
import java.io.FileInputStream;
import java.security.Key;
import java.security.KeyStore;
import java.security.cert.Certificate;

public class E_Read_01_SingleEntry {
    public static void main(String[] args) throws Exception {
        char[] pwdArray = "pkcs12StorePass".toCharArray();

        try (
                FileInputStream in = new FileInputStream("newKeyStore.pfx");
        ) {

            KeyStore ks = KeyStore.getInstance("pkcs12");
            ks.load(in, pwdArray);

            Key key = ks.getKey("db-encryption-secret", pwdArray);
            System.out.println(key);

            Certificate cert = ks.getCertificate("myCertificate");
            System.out.println(cert);
        }
    }
}
```

### 是否存在

```java
import java.io.FileInputStream;
import java.security.KeyStore;

public class E_Read_02_ContainsAlias {
    public static void main(String[] args) throws Exception {
        char[] pwdArray = "pkcs12StorePass".toCharArray();

        try (
                FileInputStream in = new FileInputStream("newKeyStore.pfx");
        ) {

            KeyStore ks = KeyStore.getInstance("pkcs12");
            ks.load(in, pwdArray);

            boolean flag1 = ks.containsAlias("widget-api-secret");
            System.out.println("flag1 = " + flag1);

            boolean flag2 = ks.containsAlias("myCertificate");
            System.out.println("flag2 = " + flag2);
        }
    }
}
```

### 判断类型

```java
import java.io.FileInputStream;
import java.security.KeyStore;

public class E_Read_03_CheckEntryKind {
    public static void main(String[] args) throws Exception {
        char[] pwdArray = "pkcs12StorePass".toCharArray();

        try (
                FileInputStream in = new FileInputStream("newKeyStore.pfx");
        ) {

            KeyStore ks = KeyStore.getInstance("pkcs12");
            ks.load(in, pwdArray);

            boolean flag = ks.entryInstanceOf(
                    "myPrivateKey",
                    KeyStore.PrivateKeyEntry.class
            );
            System.out.println("flag = " + flag);
        }
    }
}
```

## 删除

```java
import java.io.FileInputStream;
import java.security.KeyStore;

public class F_DeleteEntry {
    public static void main(String[] args) throws Exception {
        char[] pwdArray = "pkcs12StorePass".toCharArray();

        try (
                FileInputStream in = new FileInputStream("newKeyStore.pfx");
        ) {
            KeyStore ks = KeyStore.getInstance("pkcs12");
            ks.load(in, pwdArray);

            ks.deleteEntry("myPrivateKey");
        }
    }
}
```

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.security.KeyStore;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;

public class F_Delete_02_AllEntry {
    public static void main(String[] args) throws Exception {
        char[] pwdArray = "pkcs12StorePass".toCharArray();

        try (
                FileInputStream in = new FileInputStream("newKeyStore.pfx");
        ) {
            KeyStore ks = KeyStore.getInstance("pkcs12");
            ks.load(in, pwdArray);

            Enumeration<String> aliases = ks.aliases();
            List<String> aliasList = new ArrayList<>();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                System.out.println("alias = " + alias);
                aliasList.add(alias);
            }

            for (String alias : aliasList) {
                ks.deleteEntry(alias);
            }

            // 保存
            try (FileOutputStream fos = new FileOutputStream("newKeyStore.pfx")) {
                ks.store(fos, pwdArray);
            }
        }
    }
}
```

