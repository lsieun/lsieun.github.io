---
title: "ZIP File"
sequence: "101"
---


## Working with ZIP File Format

The Java API has direct support for the ZIP file format.
Typically, you would be using the following four classes from the `java.util.zip` package:

- ZipEntry
- ZipInputStream
- ZipOutputStream
- ZipFile

A `ZipEntry` object represents an entry in an archive file in a ZIP file format.
If you archived 10 files in a file called `test.zip`,
each file in the archive is represented by a `ZipEntry` object in your program.
A zip entry may be compressed or uncompressed.
When you read all files from a ZIP file, you read each of them as a `ZipEntry` object.
When you want to add a file to a ZIP file, you add a `ZipEntry` object to the ZIP file.
The `ZipEntry` class has methods to set and get information about an entry in a ZIP file.

`ZipInputStream` is a concrete decorator class in the `InputStream` class family;
you use it to read data from a ZIP file for each entry.
`ZipOutputStream` is a concrete decorator class in the `OutputStream` class family;
you use its class to write data to a ZIP file for each entry.

`ZipFile` is a utility class to read the entries from a ZIP file.
You have the option to use the `ZipInputStream` class or the `ZipFile` class
when you want to read entries from a ZIP file.

## Creating ZIP Files

The following are the steps to create a ZIP file:

- Create a `ZipOutputStream` object.
- Create a `ZipEntry` object to represent an entry in the ZIP file.
- Add the `ZipEntry` to the `ZipOutputStream`.
- Write the contents of the entry to the `ZipOutputStream`.
- Close the `ZipEntry`.
- Repeat the last four steps for each zip entry you want to add to the archive.
- Close the `ZipOutputStream`.

You can create an object of `ZipOutputStream` using the name of the ZIP file.
You need to create a `FileOutputStream` object and wrap it inside a `ZipOutputStream` object as follows:

```text
// Create a zip output stream
ZipOutputStream zos = new ZipOutputStream(new FileOutputStream("ziptest.zip"));
```

You may use any other output stream concrete decorator to wrap your `FileOutputStream` object.
For example, you may want to use `BufferedOutputStream` for a better speed as follows:

```text
ZipOutputStream zos = new ZipOutputStream(new BufferedOutputStream(new FileOutputStream("ziptest.zip")));
```

Optionally, you can set the compression level for the ZIP file entries.
By default, the compression level is set to `DEFAULT_COMPRESSION`.
For example, the following statement sets the compression level to `BEST_COMPRESSION`:

```text
// Set the compression level for zip entries
zos.setLevel(Deflater.BEST_COMPRESSION);
```

You create a `ZipEntry` object using the file path for each entry and
add the entry to the `ZipOutputStream` object using its `putNextEntry()` method, like so:

```text
ZipEntry ze = new ZipEntry("test1.txt")
zos.putNextEntry(ze);
```

Optionally, you can set the storage method for the ZIP entry to indicate
if the ZIP entry is stored compressed or uncompressed.
By default, a ZIP entry is stored in a compressed form.

```text
// To store the zip entry in a compressed form
ze.setMethod(ZipEntry.DEFLATED);

// To store the zip entry in an uncompressed form
ze.setMethod(ZipEntry.STORED);
```

Write the content of the entry you have added in the previous step to the `ZipOutputStream` object.
Since a `ZipEntry` object represents a file, you need to read the file by creating a `FileInputStream` object.

```text
// Create an input stream to read data for the entry file
BufferedInputStream bis = new BufferedInputStream(new FileInputStream("test1.txt"));
byte[] buffer = new byte[1024];
int count;
// Write the data for the entry
while((count = bis.read(buffer)) != -1) {
    zos.write(buffer, 0, count);
}
bis.close(); 
```

Now, close the entry using the `closeEntry()` method of the `ZipOutputStream`.

```text
// Close the zip entry
zos.closeEntry();
```

Repeat the previous steps for each entry that you want to add to the ZIP file.
Finally, you need to close the `ZipOutputStream`.

```text
// Close the zip entry
zos.close()
```

```java
import java.io.*;
import java.util.zip.Deflater;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

public class ZipUtility {
    public static void main(String[] args) {
        // We want to create a ziptest.zip file in the current directory.
        // We want to add two files to this zip file.
        // Both file paths are relative to the current directory.
        String zipFileName = "ziptest.zip";
        String[] entries = new String[2];
        entries[0] = "test1.txt";
        entries[1] = "notes" + File.separator + "test2.txt";
        zip(zipFileName, entries);
    }

    public static void zip(String zipFileName, String[] zipEntries) {
        // Get the current directory for later use
        String currentDirectory = System.getProperty("user.dir");
        try (ZipOutputStream zos = new ZipOutputStream(
                new BufferedOutputStream(new FileOutputStream(zipFileName)))) {
            // Set the compression level to best compression
            zos.setLevel(Deflater.BEST_COMPRESSION);

            // Add each entry to the ZIP file
            for (String zipEntry : zipEntries) {
                // Make sure the entry file exists
                File entryFile = new File(zipEntry);
                if (!entryFile.exists()) {
                    System.out.println("The entry file " + entryFile.getAbsolutePath() + " does not exist");
                    System.out.println("Aborted processing.");
                    System.exit(1);
                }

                // Create a ZipEntry object
                ZipEntry ze = new ZipEntry(zipEntry);

                // Add the zip entry object to the ZIP file
                zos.putNextEntry(ze);

                // Add the contents of the entry to the ZIP file
                addEntryContent(zos, zipEntry);

                // We are done with the current entry
                zos.closeEntry();
            }

            System.out.println("Output has been written to " + currentDirectory + File.separator + zipFileName);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void addEntryContent(ZipOutputStream zos, String entryFileName) {
        // Create an input stream to read data from the entry file
        try (BufferedInputStream bis = new BufferedInputStream(new FileInputStream(entryFileName))) {
            byte[] buffer = new byte[1024];
            int count;
            while ((count = bis.read(buffer)) != -1) {
                zos.write(buffer, 0, count);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

## Reading the Contents of ZIP Files

Reading contents of a ZIP file is just the opposite of writing contents to it.
Here are the steps to read the contents (or extract entries) of a ZIP file.

- Create a `ZipInputStream` object.
- Get a `ZipEntry` from the input stream calling the `getNextEntry()` method of the `ZipInputStream` object.
- Read the data for the `ZipEntry` from the `ZipInputStream` object.
- Repeat the last two steps to read another ZIP entry from the archive.
- Close the `ZipInputStream`.

You can create a `ZipInputStream` object using the ZIP file name as follows:

```text
ZipInputStream zis = new ZipInputStream(
                         new BufferedInputStream(new FileInputStream(zipFileName)));
```

The following snippet of code gets the next entry from the input stream:

```text
ZipEntry entry = zis.getNextEntry();
```

Now, you can read the data from the `ZipInputStream` object for the current ZIP entry.
You can save the data for the ZIP entry in a file or any other storage medium.
You can check if the ZIP entry is a directory by using the `isDirectory()` method of the `ZipEntry` class.

## ZipFile

It is easier to use the `ZipFile` class to read the contents of a ZIP file or list its entries.
For example, a `ZipFile` allows random access to ZIP entries, whereas a `ZipInputStream` allows sequential access.
The `entries()` method of a `ZipFile` object returns an enumeration of all ZIP entries in the file.
The `getInputStream()` method returns the input stream to read the content of a `ZipEntry` object.
The following snippet of code shows how to use the `ZipFile` class.
You can rewrite the code using the `ZipFile` class instead of the `ZipOutputStream` class as an exercise.
The `ZipFile` class comes in handy when you just want to list the entries in a ZIP file.

```text
import java.io.InputStream;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
...
// Create a ZipFile object using the ZIP file name
ZipFile zf = new ZipFile("ziptest.zip");

// Get the enumeration for all zip entries and loop through them
Enumeration<? extends ZipEntry> e = zf.entries();

ZipEntry entry;
while (e.hasMoreElements()) {
    entry = e.nextElement();
    
    // Get the input stream for the current zip entry
    InputStream is = zf.getInputStream(entry);
    
    /* Read data for the entry using the is object */
    // Print the name of the entry
    System.out.println(entry.getName());
}
```

Java 8 added a new `stream()` method to the `ZipFile` class that returns a `Stream<? extends ZipEntry>`.
Let's rewrite the previous snippet of code using the `Stream` class and a lambda expression:

```text
import java.io.IOException;
import java.io.InputStream;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
...

// Create a ZipFile object using the ZIP file name
ZipFile zf = new ZipFile("ziptest.zip");

// Get the Stream of all zip entries and apply some actions on each of them
Stream<? extends ZipEntry> entryStream = zf.stream();

entryStream.forEach(entry -> {    
    try {
        // Get the input stream for the current zip entry
        InputStream is = zf.getInputStream(entry);
        /* Read data for the entry using the is object */
    } catch(IOException e) {
        e.printStackTrace();
    }

    // Print the name of the entry
    System.out.println(entry.getName());
});
```

## Reference

- [Zipping and Unzipping in Java](https://www.baeldung.com/java-compress-and-uncompress)
