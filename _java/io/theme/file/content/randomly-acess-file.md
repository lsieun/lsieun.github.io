---
title: "自由读取文件"
sequence: "101"
---

[UP](/java/java-io-index.html)


```java
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.channels.SeekableByteChannel;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.EnumSet;

public class RandomlyAccessingFile {
    final static int RECLEN = 50;

    public static void main(String[] args) throws IOException {
        Path path = Path.of("D:/tmp/xyz.txt");
        FileChannel fileChannel = FileChannel.open(
                path,
                StandardOpenOption.CREATE,
                StandardOpenOption.WRITE,
                StandardOpenOption.SYNC
        ).position(RECLEN * 2);

        byte[] bytes = "Good Morning".getBytes(StandardCharsets.UTF_8);
        ByteBuffer buffer = ByteBuffer.wrap(bytes);
        fileChannel.write(buffer);
        fileChannel.close();

        buffer.clear();
        SeekableByteChannel sbc = Files.newByteChannel(
                path,
                EnumSet.of(
                        StandardOpenOption.READ
                )
        ).position(RECLEN * 2);
        sbc.read(buffer);
        sbc.close();
        String text = new String(buffer.array(), StandardCharsets.UTF_8);
        System.out.println(text);
    }
}
```
