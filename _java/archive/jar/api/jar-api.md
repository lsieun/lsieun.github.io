---
title: "Jar API"
sequence: "110"
---


## Using the JAR API

Using JAR API is very similar to using the ZIP API,
except that the JAR API includes classes for working with a manifest file.
An object of the `Manifest` class represents a manifest file.
You create a `Manifest` object in your code as follows:

```text
Manifest manifest = new Manifest();
```

There are **two things** you can do with a manifest file: **read entries from it** and **write entries to it**.
There are separate ways to deal with entries in the main and individual sections.

### main section

To add an entry into a **main section**,
get an instance of the `Attributes` class using the `getMainAttributes()` method of the `Manifest` class
and keep adding a name-value pair to it using its `put()` method.
The following snippet of code adds some attributes to the main section of a `Manifest` object.
The known attribute names are defined as constants in the `Attributes.Name` class.
For example, the constant `Attributes.Name.MANIFEST_VERSION` represents the `Manifest-Version` attribute name.

```text
// Create a Manifest object
Manifest manifest = new Manifest();

/* Add main attributes
   1. Manifest Version
   2. Main-Class
   3. Sealed
*/
Attributes mainAttribs = manifest.getMainAttributes();
mainAttribs.put(Attributes.Name.MANIFEST_VERSION, "1.0");
mainAttribs.put(Attributes.Name.MAIN_CLASS, "com.jdojo.intro.Welcome");
mainAttribs.put(Attributes.Name.SEALED, "true");
```

### individual section

Adding **an individual entry** to the manifest file is a little more complex than adding **the main entry**.
Suppose you want to add the following individual entry to a manifest file:

```text
Name: "com/jdojo/archives/"
Sealed: false
```

You need to perform the following steps.

- Get the `Map` object that stores the individual entries for a manifest.
- Create an `Attributes` object.
- Add the name-value pair to the `Attributes` object. You can add as many name-value pairs as you want.
- Add the `Attributes` object to the attribute `Map` using the name of the individual section as the key.

The following snippet of code shows you how to add an individual entry to a `Manifest` object:

```text
// Get the Attribute map for the Manifest
Map<String,Attributes> attribsMap = manifest.getEntries();

// Create an Attributes object
Attributes attribs = new Attributes();

// Create an Attributes.Name object for the "Sealed" attribute
Attributes.Name name = new Attributes.Name("Sealed");

// Add the "name: value" pair (Sealed: false) to the attributes objects
attribs.put(name, "false");

// Add the Sealed: false attribute to the attributes map
attribsMap.put("com/jdojo/archives/", attribs);
```

If you want to add a manifest file to a JAR file,
you can specify it in one of the constructors of the `JarOutputStream` class.
For example, the following snippet of code creates a JAR output stream to create a `test.jar` file with a `Manifest` object:

```text
// Create a Manifest object
Manifest manifest = new Manifest();

// Create a JarOutputStream with a Manifest object
JarOutputStream jos = new JarOutputStream(new BufferedOutputStream(
                          new FileOutputStream("test.jar")), manifest);
```

The following code creates a JAR file that includes a manifest file.
The code is similar to creating a ZIP file.
The `main()` method contains the file names used to create the JAR file.
All files are expected to be in the current working directory.

- It creates a JAR file named `jartest.jar`.
- It adds the `images/logo.bmp` and `com/jdojo/archives/Test.class` files to the `jartest.jar` file.

```text
import java.io.*;
import java.util.Map;
import java.util.jar.Attributes;
import java.util.jar.JarEntry;
import java.util.jar.JarOutputStream;
import java.util.jar.Manifest;
import java.util.zip.Deflater;

public class JARUtility {
    public static void main(String[] args) throws Exception {
        // Create a Manifest object
        Manifest manifest = getManifest();

        // Store jar entries in a String array
        String jarFileName = "jartest.jar";
        String[] entries = new String[2];
        entries[0] = "images/logo.bmp";
        entries[1] = "com/jdojo/archives/Test.class";

        createJAR(jarFileName, entries, manifest);
    }

    public static void createJAR(String jarFileName, String[] jarEntries, Manifest manifest) {
        // Get the current directory for later use
        String currentDirectory = System.getProperty("user.dir");

        // Create the JAR file
        try (JarOutputStream jos = new JarOutputStream(
                new BufferedOutputStream(new FileOutputStream(jarFileName)),
                manifest)) {
            // Set the compression level to best compression
            jos.setLevel(Deflater.BEST_COMPRESSION);

            // Add each entry to JAR file
            for (String jarEntry : jarEntries) {
                // Make sure the entry file exists
                File entryFile = new File(jarEntry);
                if (!entryFile.exists()) {
                    System.out.println("The entry file " + entryFile.getAbsolutePath() + " does not exist");
                    System.out.println("Aborted processing.");
                    System.exit(1);
                }

                // Create a JarEntry object
                JarEntry je = new JarEntry(jarEntry);

                // Add jar entry object to JAR file
                jos.putNextEntry(je);

                // Add the entry's contents to the JAR file
                addEntryContent(jos, jarEntry);

                // Inform the JAR output stream that we are done
                // working with the current entry
                jos.closeEntry();
            }
            System.out.println("Output has been written to " + currentDirectory + File.separator + jarFileName);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void addEntryContent(JarOutputStream jos, String entryFileName) throws IOException {
        // Create an input stream to read data from the entry file
        try (BufferedInputStream bis = new BufferedInputStream(
                new FileInputStream(entryFileName))) {
            byte[] buffer = new byte[1024];
            int count;
            while ((count = bis.read(buffer)) != -1) {
                jos.write(buffer, 0, count);
            }
        }
    }

    public static Manifest getManifest() {
        Manifest manifest = new Manifest();
        /* Add main attributes
         1. Manifest Version
         2. Main-Class
         3. Sealed
         */
        Attributes mainAttribs = manifest.getMainAttributes();
        mainAttribs.put(Attributes.Name.MANIFEST_VERSION, "1.0");
        mainAttribs.put(Attributes.Name.MAIN_CLASS, "com.jdojo.archives.Test");
        mainAttribs.put(Attributes.Name.SEALED, "true");

        /* Add two individual sections */
        /* Do not seal the com/jdojo/archives/ package. Note that you have sealed the whole
           JAR file and to exclude this package you we must add a Sealed: false attribute
           for this package separately.
         */
        Map<String, Attributes> attribsMap = manifest.getEntries();

        // Create an attribute "Sealed : false" and
        // add it for individual entry "Name: com/jdojo/archives/"
        Attributes a1 = getAttribute("Sealed", "false");
        attribsMap.put("com/jdojo/archives/", a1);

        // Create an attribute "Content-Type: image/bmp" and add it for images/logo.bmp
        Attributes a2 = getAttribute("Content-Type", "image/bmp");
        attribsMap.put("images/logo.bmp", a2);
        
        return manifest;
    }

    public static Attributes getAttribute(String name, String value) {
        Attributes a = new Attributes();
        Attributes.Name attribName = new Attributes.Name(name);
        a.put(attribName, value);
        return a;
    }
}
```

### read manifest file

You can read the entries from a JAR file using similar code that reads entries from a ZIP file.
To read the entries from a manifest file of a JAR file,
you need to get the object of the `Manifest` class using the `getManifest()` class of `JarInputStream` as follows:

```text
// Create a JAR input stream object
JarInputStream jis = new JarInputStream(new FileInputStream("jartest.jar"));

// Get the manifest file from the JAR file. Will return null if 
// there is no manifest file in the JAR file.
Manifest manifest = jis.getManifest();

if (manifest != null) {
    // Get the attributes from main section
    Attributes mainAttributes = manifest.getMainAttributes();
    String mainClass = mainAttributes.getValue("Main-Class");

    // Get the attributes from individual section
    Map<String, Attributes> entries = manifest.getEntries();
}
```

This section does not include code examples on reading entries from a JAR file.
Refer to the code in the `UnzipUtility` class, which has the code to read entries from a ZIP file.
The code to read from a JAR file would be similar,
except you would be using JAR-related classes from the `java.util.jar` package instead of
the ZIP-related classes from the `java.util.zip` package.

## Accessing Resources from a JAR File

How would you access the resources stored in a JAR file?
For example, how would you access a file named `images/logo.bmp` in a JAR file,
so that you can display the BMP file as an image in your Java application?
You can construct a `URL` object by using the reference of a resource in a JAR file.
The JAR file `URL` syntax is of the form

```text
jar:<url>!/{entry}
```

The following `URL` refers to an `images/logo.bmp` JAR entry in a `test.jar` file on `www.jdojo.com` using the HTTP protocol:

```text
jar:http://www.jdojo.com/test.jar!/images/logo.bmp
```

The following `URL` refers to an `images/logo.bmp` JAR entry in a `test.jar` file on the local file system
in the `C:\jarfiles\` directory using the `file` protocol:

```text
jar:file:/C:/jarfiles/test.jar!/images/logo.bmp
```
