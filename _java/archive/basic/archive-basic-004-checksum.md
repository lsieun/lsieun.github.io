---
title: "Checksum"
sequence: "104"
---


A checksum is an integer that is computed by applying an algorithm on a stream of bytes.
Sometimes, the algorithm to compute an integer from a stream of bytes is also known as **checksum**.

Typically, it is used to **check for errors during data transmission.**
The sender computes a checksum for a packet of data and sends that checksum with the packet to the receiver.
The receiver computes the checksum for the packet of data it receives and
compares it with the checksum it received from the sender.
If the two match, the receiver may assume that there were no errors during the data transmission.
The sender and the receiver must agree to compute the checksum for the data by applying the same algorithm.
Otherwise, the checksum will not match.
Using a checksum is not a data security measure to authenticate the data.
It is used as an error-detection method.
A hacker can alter some bits of the data and you may still get the same checksum as for the original data.

Let's discuss an algorithm to compute a checksum.
The algorithm is called **Adler-32** after its inventor Mark Adler.
Its name has the number 32 in it
because it computes a checksum by computing two 16-bit checksums and concatenating them into a 32-bit integer.
Let's call the two 16-bit checksums A and B, and the final checksum C.
A is the sum of all bytes plus one in the data.
B is the sum of individual values of A from each step.
In the beginning, A is set to 1 and B is set to 0.
A and B are computed based on modulus `65521`.
That is, if the value of A or B exceeds `65521`, their values become their current values modulo `65521`.
The final checksum is computed as follows:

```text
C = B * 65536 + A
```

The final checksum is computed by concatenating the 16-bit B and A values.
You need to multiply the value of B by 65536 and
add the value of A to it to get the decimal value of that 32-bit final checksum number.

Java provides an `Adler32` class in the `java.util.zip` package
to compute the Adler-32 checksum for bytes of data.
You need to call the `update()` method of this class to pass bytes to it.
Once you have passed all bytes to it, call its `getValue()` method to get the checksum.

**CRC32** (Cyclic Redundancy Check 32-bit) is another algorithm to compute a 32-bit checksum.
There is also another class named CRC32 in the same package,
which lets you compute a checksum using the CRC32 algorithm.

Java 9 added a `CRC-32C` class in the `java.util.zip` package.
The class lets you compute CRC-32C of a stream of bytes.
`CRC-32C` is defined in RFC 3720 at `https://www.ietf.org/rfc/rfc3720.txt`.

```java
import java.nio.charset.StandardCharsets;
import java.util.zip.Adler32;
import java.util.zip.CRC32;
import java.util.zip.CRC32C;
import java.util.zip.Checksum;

public class ChecksumTest {
    public static void main(String[] args) throws Exception {
        String str = "HELLO";
        byte[] data = str.getBytes(StandardCharsets.UTF_8);
        System.out.println("Adler32, CRC32, and CRC32C checksums for " + str);

        // Compute Adler32 checksum
        Checksum ad = new Adler32();
        ad.update(data);
        long adler32Checksum = ad.getValue();
        System.out.println("Adler32: " + adler32Checksum);

        // Compute CRC32 checksum
        Checksum crc32 = new CRC32();
        crc32.update(data);
        long crc32Checksum = crc32.getValue();
        System.out.println("CRC32: " + crc32Checksum);

        // Java 9: Compute CRC32C checksum
        Checksum crc32c = new CRC32C();
        crc32c.update(data);
        long crc32cChecksum = crc32c.getValue();
        System.out.println("CRC32C: " + crc32cChecksum);
    }
}
```

Adler32 is faster than CRC32.
However, CRC32 gives a more robust checksum.
Checksum is frequently used to check for data corruption.
`CheckedInputStream` and `CheckedOutputStream` are two concrete decorator classes in the `InputStream`/`OutputStream` class family.
They are in the `java.util.zip` package.
They work with a `Checksum` object.
Note that `Checksum` is an interface, and the `Adler32` and `CRC32` classes implement that interface.
`CheckedInputStream` computes a checksum as you read data from a stream and
`CheckedOutputStream` computes the checksum as you write data to a stream.
The `ZipEntry` class lets you compute the `CRC32` checksum for an entry in a ZIP file using its `getCrc()` method.
