---
title: "Properties and IO"
sequence: "103"
---

[UP]({% link _java/properties-index.md %})

## I/O

### InputStream

#### load()

The `load()` method reads the previously saved contents of a `Properties` object from an `InputStream`:

```text
FileInputStream fin;
// ...
Properties props = new Properties()
props.load(fin);
```

### OutputStream

#### save()

You can save a `Properties` table to an `OutputStream` using the `save()` method.
The property information is output in a flat ASCII format. 

```text
public class Properties extends Hashtable<Object,Object> {
    @Deprecated
    public void save(OutputStream out, String comments)  {
        try {
            store(out, comments);
        } catch (IOException e) {
        }
    }

    public void store(OutputStream out, String comments) throws IOException;
}
```

Output the property information using the `System.out` stream as follows:

```text
props.save(System.out, "Application Parameters");
```

`System.out` is a standard output stream that prints to the console or command line of an application.

The previous code outputs something like the following to System.out:

```text
#Application Parameters
#Mon Feb 12 09:24:23 CST 2001
myApp.ysize=79
myApp.xsize=52
```

We could also save the information to a file using a `FileOutputStream` as the first argument to `save()`.
The second argument to `save()` is a `String` that is used as a header for the data.

#### list()

The `list()` method is useful for debugging.
It prints the contents to an Output Stream in a format that is more human-readable but not retrievable by `load()`.
It truncates long lines with an ellipsis (`...`).

```java
import java.util.Properties;

public class HelloWorld {
    public static void main(String[] args) {
        Properties properties = System.getProperties();
        properties.list(System.out);
    }
}
```

Output:

```text
-- listing properties --
java.runtime.name=Java(TM) SE Runtime Environment
sun.boot.library.path=C:\Program Files\Java\jdk1.8.0_301\jr...
java.vm.version=25.301-b09
java.vm.vendor=Oracle Corporation
```

## XML

The `Properties` class also contains `storeToXML()` and `loadFromXML()` methods.
These operate just like the `save()` and `load()` methods but write an XML file like the following:

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
<comment>My Properties</comment>
<entry key="myApp.ysize">79</entry>
<entry key="myApp.xsize">52</entry>
</properties>
```
