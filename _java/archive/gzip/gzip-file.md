---
title: "GZIP File"
sequence: "107"
---


The `GZIPInputStream` and `GZIPOutputStream` classes are used to work with the GZIP file format.
They are concrete decorator classes in the `InputStream` and `OutputStream` class families.
Their usage is similar to any other concrete decorator classes for I/O.
You need to wrap your `OutputStream` object in an object of `GZIPOutputStream` to apply GZIP compression to your data.
You need to wrap your `InputStream` object in a `GZIPInputStream` object to apply GZIP decompression.
The following snippet of code illustrates how to use these classes to compress and decompress data:

```text
// Create a GZIPOutputStream object to compress data in GZIP format
// and write it to gziptest.gz file.
GZIPOutputStream gos = new GZIPOutputStream(new FileOutputStream("gziptest.gz"));

// Write uncompressed data to GZIP output stream and it will be 
// compressed and written to gziptest.gz file 
gos.write(byteBuffer);
```

If you want buffered writing for better speed,
you should wrap the `GZIPOutputStream` in a `BufferedOutputStream` and write the data to the `BufferedOutputStream`.

```text
BufferedOutputStream bos = new BufferedOutputStream(new GZIPOutputStream(
                                    new FileOutputStream("gziptest.gz")));
```

## GZIPOutputStream

The Java `GZIPOutputStream` class (`java.util.zip.GZIPOutStream`)
can be used to GZIP compress data and write it to an `OutputStream`.

### Creating a GZIPOutputStream

Before you can use a `GZIPOutputStream` you must create a `GZIPOutputStream` instance

```text
FileOutputStream outputStream     = new FileOutputStream("myfile.zip");
GZIPOutputStream gzipOutputStream = new GZIPOutputStream(outputStream);
```

### Writing Data to a GZIPOutputStream

You can write data to a Java `GZIPOutputStream` just like you write data to any other `OutputStream`:

```text
byte[] data = ... ; // get data from somewhere.

gzipOutputStream.write(data);
```

When you are done writing data to the `GZIPOutputStream` you have to close it.
You close a `GZIPOutputStream` by calling its `close()` method:

```text
gzipOutputStream.close();
```

> 注意1：如果不调用 `close` 方法，就没有办法成功  
> 注意2：如果不调用 `close` 方法，就没有办法成功  
> 注意3：如果不调用 `close` 方法，就没有办法成功  

You can also close a `GZIPOutputStream` using the try-with-resources construct like this:

```text
try(
    FileOutputStream outputStream     = new FileOutputStream("myfile.zip");
    GZIPOutputStream gzipOutputStream = new GZIPOutputStream(outputStream)
    ) {
        byte[] data = ... ; // get data from somewhere.
        gzipOutputStream.write(data);
}
```

When the try-with-resources block exits, the `GZIPOutputStream` and the `FileOutputStream` will be closed.

## GZIPInputStream

The Java `GZIPInputStream` class (`java.util.zip.GZIPInputStream`) can be used to decompress files
that are compressed with the GZIP compression algorithm, for instance via the `GZIPOutputStream` class.

### Creating a GZIPInputStream

To use the Java `GZIPInputStream` you must first create a `GZIPInputStream` instance:

```text
InputStream     fileInputStream = new FileInputStream("myfile.zip");
GZIPInputStream gzipInputStream = new GZIPInputStream(fileInputStream);
```

### Reading Data From a GZIPInputStream

After creating a `GZIPInputStream` you can read the decompressed data from it
just like you would read data from any other `InputStream`:

```text
int data = gzipInputStream.read();
while(data != -1){
    //do something with data
    data = gzipInputStream.read();
}
```

### Closing a GZIPInputStream

When you are finished reading data from the `GZIPInputStream`, you should close it using its `close()` method:

```text
gzipInputStream.close();
```

You can also open a `GZIPInputStream` using the `try-with-resources` construct,
so the `GZIPInputStream` is closed automatically when you are done using it:

```text
try(GZIPInputStream gzipInputStream = new GZIPInputStream(new FileInputStream("myfile.zip"))) {
    int data = gzipInputStream.read();
    while(data != -1){
        //do something with data
        data = gzipInputStream.read();
    }
}
```

## 示例

### compress + serialize

How would you compress an object while serializing it? It is simple.
Just wrap the `GZIPOutputStream` in an `ObjectOutputStream` object.
When you write an object to your `ObjectOutputStream`,
its serialized form will be compressed using a GZIP format.

```text
ObjectOutputStream oos = new ObjectOutputStream(new GZIPOutputStream(
                                   new FileOutputStream("gziptest.ser")));
```

Apply the reverse logic to read the compressed data in GZIP format for decompressing.
The following snippet of code shows how to construct an InputStream object to decompress data,
which is in GZIP format:

```text
// Decompress data in GZIP format from gziptest.gz file and read it
GZIPInputStream gis = new GZIPInputStream(new FileInputStream("gziptest.gz"));

/* Read uncompressed data from GZIP input stream, e.g., gis.read(byteBuffer);*/
// Construct a BufferedInputStream to read data, which is in GZIP format
BufferedInputStream bis = new BufferedInputStream (new GZIPInputStream(
                                  new FileInputStream(gziptest.gz")));

// Construct an ObjectInputStream to read compressed object
ObjectInputStream ois = new ObjectInputStream (new GZIPInputStream(
                new FileInputStream("gziptest.ser")));
```
