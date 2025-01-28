---
title: "用户自定义属性"
sequence: "103"
---

[UP](/java/java-io-index.html)

```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.UserDefinedFileAttributeView;
import java.util.Formatter;
import java.util.List;
import java.util.Scanner;

public class FileCustomAttribute {
    public static void main(String[] args) throws IOException {
        Path path = Path.of("D:/tmp/abc.txt");
        UserDefinedFileAttributeView view = Files.getFileAttributeView(path, UserDefinedFileAttributeView.class);

        System.out.println(usage());

        Scanner scanner = new Scanner(System.in);
        System.out.print("请输入命令：");
        while (scanner.hasNext()) {
            String line = scanner.nextLine();

            if ("exit".equalsIgnoreCase(line)) {
                System.out.println("退出");
                break;
            }

            char ch = line.charAt(0);

            switch (ch) {
                case 'W', 'w' -> {
                    String[] array = line.split(" ");
                    String attrName = array[1];
                    String attrValue = array[2];
                    ByteBuffer attr = Charset.defaultCharset().encode(attrValue);
                    view.write(attrName, attr);
                    System.out.println("写入成功");
                }
                case 'L', 'l' -> {
                    List<String> attrNameList = view.list();
                    if (attrNameList.isEmpty()) {
                        System.out.println("列表为空");
                    }
                    for (String name : attrNameList) {
                        System.out.println("    " + name);
                    }
                }
                case 'R', 'r' -> {
                    String[] array = line.split(" ");
                    String attrName = array[1];

                    int size = view.size(attrName);
                    ByteBuffer buf = ByteBuffer.allocateDirect(size);
                    view.read(attrName, buf);
                    buf.flip();
                    CharBuffer attrValue = Charset.defaultCharset().decode(buf);
                    System.out.println(attrValue);
                }
                case 'D', 'd' -> {
                    String[] array = line.split(" ");
                    String attrName = array[1];

                    view.delete(attrName);
                    System.out.println("删除成功");
                }
            }

            System.out.print("请输入命令：");
        }
    }

    static String usage() {
        Formatter fm = new Formatter();
        fm.format("文件自定义属性:%n")
                .format("    - exit                                      退出%n")
                .format("    - list                                      列表%n")
                .format("    - write  <file.attr.name> <file.attr.value> 写入%n")
                .format("    - read   <file.attr.name>                   读取%n")
                .format("    - delete <file.attr.name>                   删除%n")
                ;
        return fm.toString();
    }
}
```

```text
文件自定义属性:
    - exit                                      退出
    - list                                      列表
    - write  <file.attr.name> <file.attr.value> 写入
    - read   <file.attr.name>                   读取
    - delete <file.attr.name>                   删除

请输入命令：write user.name tomcat
写入成功
请输入命令：write user.age 10
写入成功
请输入命令：list
    user.age
    user.name
请输入命令：read user.name
tomcat
请输入命令：read user.age
10
请输入命令：delete user.age
删除成功
请输入命令：list
    user.name
请输入命令：exit
退出
```

