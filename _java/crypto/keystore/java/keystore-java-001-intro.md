---
title: "Intro"
sequence: "101"
---

[UP](/java-crypto.html)

## KeyStore Types

- [KeyStore Types](https://docs.oracle.com/en/java/javase/21/docs/specs/security/standard-names.html#keystore-types)

```java
import java.security.KeyStore;

public class A_KeyStoreType {
    public static void main(String[] args) {
        String defaultType = KeyStore.getDefaultType();
        
        // JDK17: pkcs12
        LogUtils.color("default KeyStore type: {}", defaultType);
    }
}
```

可以修改 JVM 参数：

```text
-Dkeystore.type=pkcs12
```

## KeyStore

### 创建

```java
import java.io.FileOutputStream;
import java.security.KeyStore;

public class B_CreateEmptyKeyStore {
    public static void main(String[] args) throws Exception {
        KeyStore ks = KeyStore.getInstance("pkcs12");

        char[] pwdArray = "myStorePass".toCharArray();
        ks.load(null, pwdArray);

        try (FileOutputStream fos = new FileOutputStream("newKeyStore.pfx")) {
            ks.store(fos, pwdArray);
        }
    }
}
```

### 加载

```java
import java.io.FileInputStream;
import java.security.KeyStore;
import java.util.Enumeration;

public class C_LoadKeyStore {
    public static void main(String[] args) throws Exception {
        char[] pwdArray = "pkcs12StorePass".toCharArray();

        try (
                FileInputStream in = new FileInputStream("newKeyStore.pfx");
        ) {

            KeyStore ks = KeyStore.getInstance("pkcs12");
            ks.load(in, pwdArray);

            Enumeration<String> aliases = ks.aliases();
            while (aliases.hasMoreElements()) {
                String alias = aliases.nextElement();
                System.out.println(alias);
            }
        }
    }
}
```


