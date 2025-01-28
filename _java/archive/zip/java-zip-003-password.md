---
title: "带密码的 ZIP"
sequence: "103"
---

## pom.xml

```xml
<dependency>
    <groupId>net.lingala.zip4j</groupId>
    <artifactId>zip4j</artifactId>
    <version>2.11.5</version>
</dependency>
```

## 代码

### 加密一个文件

```java
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.model.ZipParameters;
import net.lingala.zip4j.model.enums.CompressionLevel;
import net.lingala.zip4j.model.enums.EncryptionMethod;

import java.io.File;
import java.io.IOException;

public class ZipPassword_A_Zip_Single_File {
    public static void main(String[] args) throws IOException {
        ZipParameters zipParameters = new ZipParameters();
        zipParameters.setEncryptFiles(true);
        zipParameters.setCompressionLevel(CompressionLevel.HIGHER);
        zipParameters.setEncryptionMethod(EncryptionMethod.AES);

        ZipFile zipFile = new ZipFile("compressed.zip", "password".toCharArray());
        zipFile.addFile(new File("aFile.txt"), zipParameters);
        zipFile.close();
    }
}
```

### 加密多个文件

```java
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.model.ZipParameters;
import net.lingala.zip4j.model.enums.EncryptionMethod;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class ZipPassword_B_Zip_Multiple_File {
    public static void main(String[] args) throws IOException {
        ZipParameters zipParameters = new ZipParameters();
        zipParameters.setEncryptFiles(true);
        zipParameters.setEncryptionMethod(EncryptionMethod.AES);

        List<File> filesToAdd = Arrays.asList(
                new File("aFile.txt"),
                new File("bFile.txt")
        );

        ZipFile zipFile = new ZipFile("compressed.zip", "password".toCharArray());
        zipFile.addFiles(filesToAdd, zipParameters);
        zipFile.close();
    }
}
```

### 加密文件夹

```java
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.model.ZipParameters;
import net.lingala.zip4j.model.enums.EncryptionMethod;

import java.io.File;
import java.io.IOException;

public class ZipPassword_C_Zip_Directory {
    public static void main(String[] args) throws IOException {
        ZipParameters zipParameters = new ZipParameters();
        zipParameters.setEncryptFiles(true);
        zipParameters.setEncryptionMethod(EncryptionMethod.AES);

        ZipFile zipFile = new ZipFile("compressed.zip", "password".toCharArray());
        zipFile.addFolder(new File("D:\\git-repo\\learn-java-archive\\target"), zipParameters);
        zipFile.close();
    }
}
```

### 切割大文件

```java
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.model.ZipParameters;
import net.lingala.zip4j.model.enums.EncryptionMethod;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;

public class ZipPassword_D_Split_Zip_File {
    public static void main(String[] args) throws IOException {
        ZipParameters zipParameters = new ZipParameters();
        zipParameters.setEncryptFiles(true);
        zipParameters.setEncryptionMethod(EncryptionMethod.AES);

        ZipFile zipFile = new ZipFile("compressed.zip", "password".toCharArray());
        int splitLength = 1024 * 1024 * 10; //10MB
        zipFile.createSplitZipFile(Arrays.asList(new File("E:\\Software\\MySQL\\mysql-8.2.0-winx64.7z")), zipParameters, true, splitLength);
        zipFile.close();
    }
}
```

### 切割文件夹

```java
import net.lingala.zip4j.ZipFile;
import net.lingala.zip4j.model.ZipParameters;
import net.lingala.zip4j.model.enums.EncryptionMethod;

import java.io.File;
import java.io.IOException;

public class ZipPassword_E_Split_Zip_Directory {
    public static void main(String[] args) throws IOException {
        ZipParameters zipParameters = new ZipParameters();
        zipParameters.setEncryptFiles(true);
        zipParameters.setEncryptionMethod(EncryptionMethod.AES);

        ZipFile zipFile = new ZipFile("compressed.zip", "password".toCharArray());
        int splitLength = 1024 * 1024 * 10; //10MB
        zipFile.createSplitZipFileFromFolder(new File("E:\\Software\\Scala"), zipParameters, true, splitLength);
        zipFile.close();
    }
}
```

### 解密所有文件

```java
import net.lingala.zip4j.ZipFile;

import java.io.IOException;

public class ZipPassword_F_Extract_All {
    public static void main(String[] args) throws IOException {
        ZipFile zipFile = new ZipFile("compressed.zip", "password".toCharArray());
        zipFile.extractAll("D:\\tmp");
        zipFile.close();
    }
}
```

### 解密单个文件

```java
import net.lingala.zip4j.ZipFile;

import java.io.IOException;

public class ZipPassword_G_Extract_Single {
    public static void main(String[] args) throws IOException {
        ZipFile zipFile = new ZipFile("compressed.zip", "password".toCharArray());
        zipFile.extractFile("aFile.txt", "D:\\tmp");
        zipFile.close();
    }
}
```

## Reference

- [How to Create Password-Protected Zip Files and Unzip Them in Java](https://www.baeldung.com/java-password-protected-zip-unzip)
