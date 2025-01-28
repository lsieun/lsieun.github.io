---
title: "java.nio.MappedByteBuffer"
sequence: "103"
---

[UP](/java-nio.html)


Using a `MappedByteBuffer` to read a file:

```java
package lsieun.nio.buffer;

import lsieun.utils.FileUtils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;

public class MappedByteBufferReadFile {
    public static void main(String[] args) throws IOException {
        // reading a file with memoryMapping
        String filepath = FileUtils.getFilePath("sample.txt");
        File file = new File(filepath);

        FileInputStream fis = new FileInputStream(file);

        FileChannel fc = fis.getChannel();

        MappedByteBuffer bb = fc.map(FileChannel.MapMode.READ_ONLY, 0, file.length());

        // bb.flip();  // not needed

        int limit = bb.limit(); // bytes in buffer
        for (int i = 0; i < limit; i++) {
            byte b = bb.get(i);
            System.out.print((char) b);
        }
    }
}
```

Sequentially Reading a File

If your file is **small enough** to fit in your virtual address space all at once,
then you could memory map it,
using a `FileChannel` and `MappedByteBuffer` and leave the OS (Operating System) to figure out
how to do the I/O to read it as needed, or possibly even preemptively read it.

> 如果文件足够小

If you don't want to allocate large hunks of your virtual address space,
you could allocate a smaller `MappedByteBuffer` at some offset in the file other than `0` and read a decently large chunk of it.
When done, allocate a new `MappedByteBuffer`.
You can be considerably more generous in your chunk size than when allocating buffers.

> 如果文件较大，那就分成多次进行读取

Alternatively, you could do your I/O in a more conventional way using `FileChannel.read(ByteBuffer dst)`,
to read the next chunk of the file into a pre-allocated `ByteBuffer`.
This approach is clumbsier than traditional stream I/O, but can be more efficient,
especially when you slew over most of the data, or access it via the backing array.
It will pay off if for example you were processing just a 4-byte field in a 512-byte record,
since only the bytes you need are copied from the buffer, not the entire record.

> 回归使用FileChannel.read(ByteBuffer dst)方法

The effect is even more pronounced with MappedBuffers and large records where pages of records you don't need are not even read into RAM (Random Access Memory).
