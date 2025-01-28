---
title: "Cipher 示例"
sequence: "101"
---

```java
import java.security.Provider;
import java.security.Security;
import java.util.Arrays;
import java.util.List;

public class HelloCrypto {
    public static void main(String[] args) {
        List<String> algorithms = Arrays.stream(Security.getProviders())
                .flatMap(provider -> provider.getServices().stream())
                .filter(service -> "Cipher".equals(service.getType()))
                .map(Provider.Service::getAlgorithm)
                .toList();
        for (String name : algorithms) {
            System.out.println(name);
        }
    }
}
```

```text
PBEWithMD5AndDES
PBEWithHmacSHA512/256AndAES_256
AES/GCM/NoPadding
PBEWithSHA1AndRC2_128
AES_192/ECB/NoPadding
AES_128/KW/NoPadding
PBEWithSHA1AndRC2_40
PBEWithSHA1AndRC4_128
DESedeWrap
AES_256/KW/NoPadding
AES/KW/NoPadding
PBEWithSHA1AndDESede
PBEWithSHA1AndRC4_40
AES_192/KWP/NoPadding
PBEWithHmacSHA224AndAES_128
AES
PBEWithHmacSHA512/256AndAES_128
AES_192/OFB/NoPadding
AES_192/CFB/NoPadding
AES_192/KW/NoPadding
AES_192/GCM/NoPadding
AES_192/CBC/NoPadding
AES_128/KW/PKCS5Padding
DESede
AES_256/KW/PKCS5Padding
AES_128/ECB/NoPadding
AES_256/ECB/NoPadding
ChaCha20-Poly1305
AES/KW/PKCS5Padding
ARCFOUR
AES_256/GCM/NoPadding
RC2
RSA
AES_128/CFB/NoPadding
AES_128/KWP/NoPadding
AES_128/OFB/NoPadding
AES_256/KWP/NoPadding
ChaCha20
PBEWithHmacSHA224AndAES_256
DES
AES_256/CBC/NoPadding
PBEWithHmacSHA256AndAES_256
PBEWithHmacSHA256AndAES_128
AES/KWP/NoPadding
AES_192/KW/PKCS5Padding
PBEWithHmacSHA512/224AndAES_128
AES_256/CFB/NoPadding
PBEWithHmacSHA512AndAES_128
PBEWithHmacSHA1AndAES_128
PBEWithHmacSHA512/224AndAES_256
PBEWithHmacSHA512AndAES_256
AES_128/CBC/NoPadding
AES_256/OFB/NoPadding
PBEWithHmacSHA1AndAES_256
PBEWithHmacSHA384AndAES_256
AES_128/GCM/NoPadding
PBEWithHmacSHA384AndAES_128
Blowfish
PBEWithMD5AndTripleDES
RSA/ECB/PKCS1Padding
RSA
```
