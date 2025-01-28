---
title: "Compressing Byte Arrays"
sequence: "103"
---


You can use the `Deflater` and `Inflater` classes in the `java.util.zip` package
to compress and decompress data in a byte array, respectively.
These classes are the basic building blocks for compression and decompression in Java.
You may not use them directly very often.
You have other high-level, easy-to-use classes in Java to deal with data compression.
Those classes are `DeflaterInputStream`, `DeflaterOutputStream`,
`GZIPInputStream`, `ZipFile`, `GZIPOutputStream`, `ZipInputStream`, and `ZipOutputStream`.

Using the `Deflater` and `Inflater` classes is not straightforward.

## compress data

You need to use the following steps to compress data in a byte array.

- Create a `Deflater` object.
- Set the input data to be compressed using the `setInput()` method.
- Call the `finish()` method indicating that you have supplied all input data.
- Call the `deflate()` method to compress the input data.
- Call the `end()` method to end the compression process.

You can create an object of the `Deflater` class using one of its constructors.

```text
// Uses the no-args constructor
Deflater compressor = new Deflater();
```

Other constructors of the `Deflater` class let you specify the **level of compression**.
You can specify the compression level using one of the constants in the `Deflater` class.
Those constant are `BEST_COMPRESSION`, `BEST_SPEED`, `DEFAULT_COMPRESSION`, and `NO_COMPRESSION`.
There is a trade-off in choosing between the best compression and the best speed.
The best speed means lower compression ratio and the best compression means slower compression speed.

```text
// Uses the best compression
Deflater compressor = new Deflater(Deflater.BEST_COMPRESSION);
```

By default, the compressed data will be in the ZLIB format.
If you want the compressed data to be in GZIP or PKZIP format,
you need to specify that by using the `boolean` flag as `true` in the constructor.

```text
// Uses the best speed compression and GZIP format
Deflater compressor = new Deflater(Deflater.BEST_SPEED, true);
```

You can supply the input data to the `Deflater` object in a byte array.

```text
byte[] input = /* get a data filled byte array */;
compressor.setInput(input);
```

You call the `finish()` method to indicate that you have supplied all the input data.

```text
compressor.finish();
```

You call the `deflate()` method to compress the input data.
It accepts a byte array as its argument.
It fills the byte array with the compressed data and returns the number of bytes in the byte array it has filled.
After every call to the `deflate()` method,
you need to call the `finished()` method to check if the compression process is over.
Typically, you would place this check in a loop as follows:

```text
// Try to read the compressed data 1024 bytes at a time
byte[] readBuffer = new byte[1024];
int readCount = 0;
while (!compressor.finished()) {
    readCount = compressor.deflate(readBuffer);
    /* At this point, the readBuffer array has the compressed data from index 0 to readCount - 1. */
}
```

You call the `end()` method to release any resources the `Deflater` object has held.

```text
// Indicates that the compression process is over
compressor.end();
```

## decompress data

The following steps are used to decompress data in a byte array.
The steps are just the reverse of what you did to compress a byte array.

- Create an `Inflater` object.
- Set the input data to be decompressed using the `setInput()` method.
- Call the `inflate()` method to decompress the input data.
- Call the `end()` method to end the decompression process.

You can create an object of the `Inflater` class using one of its constructors.

```text
// Uses the no-args constructor
Inflater decompressor = new Inflater();
```

If the compressed data is in GZIP or PKZIP format, you use another constructor and pass true as its argument.

```text
// Creates a decompressor to decompress data that is in GZIP or PKZIP format
Inflater decompressor = new Inflater(true);
```

You set the input for the decompressor, which is the compressed data in a byte array.

```text
byte[] input = /* get the compressed data in the byte array */;
decompressor.setInput(input);
```

You call the `inflate()` method to decompress the input data.
It accepts a byte array as its argument.
It fills the byte array with the decompressed data and returns the number of bytes in the byte array.
After every call to this method, you need to call the `finished()` method to check if the compression process is over.
Typically, you use a loop, as follows:

```text
// Try to read the decompressed data 1024 bytes at a time
byte[] readBuffer = new byte[1024];
int readCount = 0;
while(!decompressor.finished()) {
    readCount = decompressor.inflate(readBuffer);
    /* At this point, the readBuffer array has the decompressed data from index 0 to readCount - 1. */
}
```

You need to call the `end()` method to release any resources held by the `Inflater` object.

```text
// Indicates that the decompression process is over
decompressor.end();
```

```java
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

import static java.util.zip.Deflater.BEST_COMPRESSION;

public class DeflateInflateTest {
    public static void main(String[] args) throws Exception {
        String input = "Hello world!";
        byte[] uncompressedData = input.getBytes(StandardCharsets.UTF_8);
        
        // Compress the data
        byte[] compressedData = compress(uncompressedData, BEST_COMPRESSION, false);
        
        // Decompress the data
        byte[] decompressedData = decompress(compressedData, false);
        String output = new String(decompressedData, StandardCharsets.UTF_8);
        
        // Display the statistics
        System.out.println("Input String: " + input);
        System.out.println("Uncompressed data length: " + uncompressedData.length);
        System.out.println("Compressed data length: " + compressedData.length);
        System.out.println("Decompressed data length: " + decompressedData.length);
        System.out.println("Output String: " + output);
    }

    public static byte[] compress(byte[] input, int compressionLevel, boolean GZIPFormat) {
        // Create a Deflater object to compress data
        Deflater compressor = new Deflater(compressionLevel, GZIPFormat);
        
        // Set the input for the compressor
        compressor.setInput(input);
        
        // Call the finish() method to indicate that we have
        // no more input for the compressor object
        compressor.finish();
        
        // Compress the data
        ByteArrayOutputStream bao = new ByteArrayOutputStream();
        byte[] readBuffer = new byte[1024];
        while (!compressor.finished()) {
            int readCount = compressor.deflate(readBuffer);
            if (readCount > 0) {
                // Write compressed data to the output stream
                bao.write(readBuffer, 0, readCount);
            }
        }
        
        // End the compressor
        compressor.end();
        
        // Return the written bytes from output stream
        return bao.toByteArray();
    }

    public static byte[] decompress(byte[] input, boolean GZIPFormat) throws DataFormatException {
        // Create an Inflater object to compress the data
        Inflater decompressor = new Inflater(GZIPFormat);
        
        // Set the input for the decompressor
        decompressor.setInput(input);
        
        // Decompress data
        ByteArrayOutputStream bao = new ByteArrayOutputStream();
        byte[] readBuffer = new byte[1024];
        while (!decompressor.finished()) {
            int readCount = decompressor.inflate(readBuffer);
            if (readCount > 0) {
                // Write the data to the output stream
                bao.write(readBuffer, 0, readCount);
            }
        }
        
        // End the decompressor
        decompressor.end();

        // Return the written bytes from the output stream 
        return bao.toByteArray();
    }
}
```

You can use `DeflaterInputStream` and `DeflaterOutputStream` to compress data in the input and output streams.
There are also `InflaterInputStream` and `InflaterOutputStream` classes for decompressing data in the input and output streams.
The four classes are concrete decorators in the `InputStream` and `OutputStream` class families.
