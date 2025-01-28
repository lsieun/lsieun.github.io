---
title: "Mojo: Examples"
sequence: "107"
---

[UP](/maven-index.html)


## pom.xml

### packaging

```xml
<packaging>maven-plugin</packaging>
```

### properties

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <java.version>8</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
</properties>
```

### dependencies

```xml
<dependencies>
    <dependency>
        <!-- plugin interfaces and base classes -->
        <groupId>org.apache.maven</groupId>
        <artifactId>maven-plugin-api</artifactId>
        <version>3.8.5</version>
        <scope>provided</scope>
    </dependency>

    <dependency>
        <!-- annotations used to describe the plugin meta-data -->
        <groupId>org.apache.maven.plugin-tools</groupId>
        <artifactId>maven-plugin-annotations</artifactId>
        <version>3.6.4</version>
        <scope>provided</scope>
    </dependency>


    <dependency>
        <!-- needed when injecting the Maven Project into a plugin  -->
        <groupId>org.apache.maven</groupId>
        <artifactId>maven-core</artifactId>
        <version>3.8.5</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

### 完整 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>hello-examples-maven-plugin</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>maven-plugin</packaging>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>8</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <!-- plugin interfaces and base classes -->
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-plugin-api</artifactId>
            <version>3.8.5</version>
            <scope>provided</scope>
        </dependency>

        <dependency>
            <!-- annotations used to describe the plugin meta-data -->
            <groupId>org.apache.maven.plugin-tools</groupId>
            <artifactId>maven-plugin-annotations</artifactId>
            <version>3.6.4</version>
            <scope>provided</scope>
        </dependency>


        <dependency>
            <!-- needed when injecting the Maven Project into a plugin  -->
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-core</artifactId>
            <version>3.8.5</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

</project>
```

## ZIP

### FileZipMojo.java

```java
package lsieun.mojo;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugins.annotations.LifecyclePhase;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;
import org.apache.maven.project.MavenProject;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Mojo(name = "zip", defaultPhase = LifecyclePhase.NONE)
public class FileZipMojo extends AbstractMojo {
    private static final String FILE_EXTENSION = ".zip";

    @Parameter(required = true)
    private File input;

    @Parameter(property = "project.build.directory", readonly = true)
    private File targetDirectory;

    @Parameter
    private String zipName;

    @Parameter(property = "project", required = true, readonly = true)
    private MavenProject project;

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        // 第一步，打印信息：要打包哪一个文件夹
        String message = String.format("Zipping files in '%s'.", input.getPath());
        getLog().info(message);


        // 第二步，获取所有的文件
        List<File> fileList = readAllFiles(input);
        int size = fileList.size();
        getLog().info("files size: " + size);

        if (size <= 0) {
            return;
        }


        // 第三步，生成 ZIP 文件
        String targetFileName = zipName != null ?
                zipName + FILE_EXTENSION :
                project.getName() + "-" + project.getVersion() + FILE_EXTENSION;
        String targetFilePath = targetDirectory + File.separator + targetFileName;
        getLog().info("FilePath: " + targetFilePath);

        try (
                FileOutputStream fos = new FileOutputStream(targetFilePath);
                ZipOutputStream zipOut = new ZipOutputStream(fos);
        ) {

            int index = input.getPath().length() + 1;

            for (File file : fileList) {
                if (file.isDirectory()) {
                    continue;
                }

                String itemName = file.getPath().substring(index).replace("\\", "/");
                getLog().info("Zipping File " + itemName + " ---> " + file.getPath());

                try (
                        FileInputStream fis = new FileInputStream(file);
                ) {
                    ZipEntry zipEntry = new ZipEntry(itemName);
                    zipOut.putNextEntry(zipEntry);

                    byte[] bytes = new byte[2048];
                    int length;
                    while ((length = fis.read(bytes)) >= 0) {
                        zipOut.write(bytes, 0, length);
                    }
                }


            }
        }
        catch (FileNotFoundException e) {
            throw new MojoExecutionException("No file found", e);
        }
        catch (IOException e) {
            throw new MojoExecutionException("Exception reading files", e);
        }
    }

    private List<File> readAllFiles(File file) {
        List<File> list = new ArrayList<>();
        if (file.isFile()) {
            list.add(file);
        }
        else {
            addFilesToList(list, file);
        }

        return list;
    }

    private void addFilesToList(List<File> list, File dir) {
        File[] files = dir.listFiles();
        if (files == null || files.length == 0) return;

        for (File file : files) {
            if (file.isFile()) {
                list.add(file);
            }
            else if (file.isDirectory()) {
                addFilesToList(list, file);
            }
        }
    }
}
```

### 测试

#### 执行插件 Goal 

```xml
<build>
    <plugins>
        <plugin>
            <groupId>lsieun</groupId>
            <artifactId>hello-examples-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
            <configuration>
                <input>${project.basedir}/src/main/resources</input>
                <zipName>test</zipName>
            </configuration>
        </plugin>
    </plugins>
</build>
```

```text
mvn hello-examples:zip
```

### 结合生命周期

```xml
<build>
    <plugins>
        <plugin>
            <groupId>lsieun</groupId>
            <artifactId>hello-examples-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
            <executions>
                <execution>
                    <id>my-zip</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>
                            zip
                        </goal>
                    </goals>
                    <configuration>
                        <input>${project.basedir}/target/classes</input>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

```text
mvn clean compile
```

## Reference

- [FileZipMojo](https://dzone.com/articles/beginners-guide-to-creating-a-maven-plugin)
- [XmlToJsonMojo](https://medium.com/swlh/step-by-step-guide-to-developing-a-custom-maven-plugin-b6e3a0e09966)
