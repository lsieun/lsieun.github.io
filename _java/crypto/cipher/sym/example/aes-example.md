---
title: "AES 示例"
sequence: "101"
---

```java
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;


public class HelloCryptoSym {
    public static void main(String[] args) throws Exception {
        // 第 1 步，准备参数
        String algorithm = "AES/CBC/PKCS5Padding";

        String password = "0123456789ABCDEF";
        byte[] passwordBytes = password.getBytes(StandardCharsets.UTF_8);
        SecretKey secret = new SecretKeySpec(passwordBytes, "AES");

        String initialVector = "0123456789ABCDEF";
        byte[] iv = initialVector.getBytes(StandardCharsets.UTF_8);
        IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);

        // 第 2 步，进行加密和解密
        String input = "这是一段重要的信息";
        byte[] originBytes = input.getBytes(StandardCharsets.UTF_8);
        byte[] encryptedBytes = encrypt(algorithm, originBytes, secret, ivParameterSpec);
        byte[] decryptedBytes = decrypt(algorithm, encryptedBytes, secret, ivParameterSpec);

        // 第 3 步，进行验证
        boolean equals = Arrays.equals(originBytes, decryptedBytes);
        System.out.println("equals = " + equals);
    }

    public static byte[] encrypt(String algorithm, byte[] bytes, SecretKey key, IvParameterSpec iv) throws Exception {
        Cipher cipher = Cipher.getInstance(algorithm);
        cipher.init(Cipher.ENCRYPT_MODE, key, iv);
        return cipher.doFinal(bytes);
    }

    public static byte[] decrypt(String algorithm, byte[] bytes, SecretKey key, IvParameterSpec iv) throws Exception {
        Cipher cipher = Cipher.getInstance(algorithm);
        cipher.init(Cipher.DECRYPT_MODE, key, iv);
        return cipher.doFinal(bytes);
    }
}
```
