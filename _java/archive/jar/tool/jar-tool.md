---
title: "Jar Tool"
sequence: "109"
---


To create a JAR file using the `jar` tool, many command-line options are available.
There are four basic operations that you perform using the `jar` tool.

- Create a JAR file.
- Update a JAR file.
- Extract entries from a JAR file.
- List the contents of a JAR file.

The GNU-style options were added in JDK9.
For the complete list of all options for the `jar` tool and the tool's usage,
run the tool with the `--help` or `--help-extra` option, like so:

```text
jar --help
jar --help-extra
```

| Option                                  | Description                                                                                                                                                                                   |
|-----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-c`, `--create`                        | Create a new JAR file.                                                                                                                                                                        |
| `-u`, `--update`                        | Update an existing JAR file.                                                                                                                                                                  |
| `-x`, `--extract`                       | Extract a named file or all files from a JAR file.                                                                                                                                            |
| `-t`, `--list`                          | List the table of contents of a JAR file.                                                                                                                                                     |
| `-f`, `--file=FILE`                     | Specify the JAR file name.                                                                                                                                                                    |
| `-m`, `--manifest=FILE`                 | Include the manifest information from the specified file.                                                                                                                                     |
| `-M`, `--no-manifest`                   | Do not create a manifest file.                                                                                                                                                                |
| `-i`, `--generate-index=FILE`           | Generate index information for the specified JAR file. It creates an INDEX.LIST file in JAR file under the META-INF directory.                                                                |
| `-0`, `--no-compress`                   | Do not compress the entries in the JAR file. Only store them. The option value is zero, which means zero compression.                                                                         |
| `-e`, `--main-class=CLASSNAME`          | Add the specified class name as the value for the Main-Class entry in the main section of the manifest file.                                                                                  |
| `-v`, `--verbose`                       | Generate verbose output on the standard output.                                                                                                                                               |
| `-C DIR`                                | Change to the specified directory and include the following files in a JAR file. Note that the option is in uppercase (C). The lowercase (-c) is used to indicate the create JAR file option. |
| `--release VERSION`                     | Place all following files in a versioned directory of the JAR (i.e., META-INF/versions/VERSION/).                                                                                             |
| `-d`, `--describe-module`               | Print the module descriptor, or automatic module name.                                                                                                                                        |
| `--module-version=VERSION`              | The module version when creating a modular JAR or updating a non-modular JAR.                                                                                                                 |
| `--hash-modules=PATTERN`                | Compute and record the hashes of modules matched by the given pattern and that depend directly or indirectly on a modular JAR being created or a non-modular JAR being updated.               |
| `-p`, `--module-path`                   | Location of module dependence for generating the hash.                                                                                                                                        |
| `--version`                             | Print the program version.                                                                                                                                                                    |
| `-h`, `--help[:compat]`, `--help-extra` | Print help for the jar tool.                                                                                                                                                                  |

## Creating a JAR File

Use the following command to create a `test.jar` JAR file with two class files called `A.class` and `B.class`:

```text
jar --create --file test.jar A.class B.class
```

In the above command, the `--create` option indicates that you are creating a new JAR file and
the `--file test.jar` option indicates that you are specifying the new JAR file name as `test.jar`.
At the end of the command, you can specify one or more file names or directory names to include in the JAR file.

To view the contents of the `test.jar` file, you can execute the following command:

```text
jar --list --file test.jar
```

```text
META-INF/
META-INF/MANIFEST.MF
A.class
B.class
```

The `--list` option in this command indicates that you are interested in the table of contents of a JAR file.
The `--file` option specifies the JAR file name, which is `test.jar` in this case.
Note that when you created the `test.jar` file, the jar tool automatically created two extra entries for you:
one directory called `META-INF` and a file named `MANIFEST.MF` in the `META-INF` directory.
You see these entries when you list the contents of the JAR file.

The following command will create a `test.jar` file by including everything in the current working directory.
Note the use of an **asterisk** as the wildcard character to denote everything in the current working directory.

```text
jar --create --file test.jar *
```

The following command will create a JAR file with all class files in the `book/archives` directory and
all images from the `book/images` directory.
Here, `book` is a subdirectory in the current working directory.

```text
jar --create --file test.jar book/archives/*.class book/images
```

You can specify **a manifest file** using the command-line option while creating a JAR file.
The manifest file you specify will be a text file that contains all manifest entries for your JAR file.
**Note that your manifest file must have a blank line at the end of the file.**
Otherwise, the last entry in the manifest file will not be processed.

The following command will use a `manifest.txt` file while creating the `test.jar` file,
including all files and sub-directories in the current directory.
Note the use of the option `m`.

```text
jar --create --file test.jar --manifest manifest.txt *
```

## Updating a JAR File

Use the option `--update` to update an existing JAR file entries or its manifest file.
The following command will add a `C.class` file to an existing `test.jar` file:

```text
jar --update --file test.jar C.class
```

Suppose you have a `test.jar` file and
you want to change the `Main-Class` entry in its manifest file to `pkg.HelloWorld` class.
You can do that by using the following command:

```text
jar --update --file test.jar --main-class pkg.HelloWorld
```

## Indexing a JAR File

You can generate an index file for your JAR file.
It is used to speed up class loading.
Use the `--generate-index` option with the `jar` command in a separate command, after you have created a JAR file:

```text
jar --generate-index test.jar
```

This command will add a `META-INF/INDEX.LIST` file to the `test.jar` file.
You can verify it by listing the table of contents of the `test.jar` file using the following command:

```text
jar --list --file test.jar
```

```text
META-INF/INDEX.LIST
META-INF/
META-INF/MANIFEST.MF
A.class
B.class
manifest.txt
```

The generated `INDEX.LIST` file contains location information for all packages in all JAR files
listed in the `Class-Path` attribute of the `test.jar` file.

You can include an attribute called `Class-Path` in the manifest file of a JAR file.
It is a space-separated list of JAR files.
The attribute value is used to search and load classes when you run the JAR file.

## Extracting an Entry from a JAR File

You can extract all or some entries from a JAR file using the option `--extract` with the `jar` command.
To extract all entries from a `test.jar` file, you use

```text
jar --extract --file test.jar
```

This command extracts all entries from `test.jar` file in the current working directory.
It creates the same directory structure as in the `test.jar` file.
**Any existing file during the extraction of an entry is overwritten.**
The JAR file, `test.jar` in this example, is unchanged by this command.

To **extract individual entries** from a JAR file, you need to list them at the end of the command.
**The entries should be separated by a space.**
The following command will extract `A.class` and `book/HelloWorld.class` entries from a `test.jar` file:

```text
jar --extract --file test.jar A.class book/HelloWorld.class
```

To extract all class files from a `book` directory, you can use the following command:

```text
jar --extract --file test.jar book/*.class
```

## Listing the Contents of a JAR File

Use the option `t` with the `jar` command to list the table of contents of a JAR file on the standard output:

```text
jar --list --file test.jar
```

## The Manifest File

A JAR file differs from a ZIP file in that
it may optionally contain a manifest file named `MANIFEST.MF` in the `META-INF` directory.
The manifest file contains information about the JAR file and its entries.
It can contain information about the `CLASSPATH` setting for the JAR file.
Its main entry class is a class with the “public static void main(String[])” method
to start a stand-alone application, version information about packages, etc.

**A manifest file** is divided into **sections** separated by a **blank line**.
Each section contains name-value pairs.
A new line separates each name-value pair.
A colon separates a name and its corresponding value.  
**A manifest file must end with a new line.**
The following is a sample of the content of a manifest file:

```text
Manifest-Version: 1.0
Created-By: 1.8.0_20-ea-b05 (Oracle Corporation)
Main-Class: com.jdojo.intro.Welcome
Multi-Release: true
```

This manifest file has one section with four attributes:

- Manifest-Version
- Created-By
- Main-Class
- Multi-Release

There are **two kinds of sections** in a manifest file: **the main section** and **the individual section**.
**A blank line must separate any two sections.**
Entries in the main section apply to the entire JAR file.
Entries in the individual section apply to a particular entry.
An attribute in an individual section overrides the same attribute in the main section.
An individual entry starts with a `Name` attribute,
whose value is the name of the entry in the JAR file and is followed by other attributes for that entry.
For example, suppose you have a manifest file with the following contents:

```text
Manifest-Version: 1.0
Created-By: 1.6.0 (Sun Microsystems Inc.)
Main-Class: com.jdojo.chapter2.Welcome
Sealed: true

Name: book/data/
Sealed: false

Name: images/logo.bmp
Content-Type: image/bmp

```

The manifest file contains three sections: one main section and two individual sections.
The first individual section indicates that the package `book/data` is not sealed.
This individual section attribute of `Sealed: false` will override the main section's attribute of `Sealed: true`.
Another individual section is for an entry called `images/logo.bmp`.
It states that the content type of the entry is an image of bmp type.

The `jar` command can create a default manifest file and add it to the JAR file.
The default manifest file contains only two attributes: `Manifest-Version` and `Created-By`.
You can use the option `--no-manifest` to tell the `jar` tool to omit the default manifest file.
The following command will create a `test.jar` file without adding a default manifest file:

```text
jar --create --no-manifest --file test.jar book/*.class
```

The `jar` command gives you an option to customize the contents of the manifest file.
You can use the `--manifest` option to specify your file that contains the contents for the manifest file.
The `jar` command will read the name-value pairs from the specified manifest file and add them to the `MANIFEST.MF` file.
Suppose you have a file named `manifest.txt` with one attribute entry in it.
**Make sure to add a new line at the end of the file.**
The file's contents are as follows:

```text
Main-Class: com.jdojo.intro.Welcome

```

To add the `Main-Class` attribute value from `manifest.txt` file in a new `test.jar` file
by including all class files in the current working directory, you execute the following command:

```text
jar --create --manifest manifest.txt --file test.jar *.class
```

This command will add a manifest file with the following contents to the `test.jar` file:

```text
Manifest-Version: 1.0
Created-By: 9.0.1 (Oracle Corporation)
Main-Class: com.jdojo.intro.Welcome
```

If you do not specify the `Manifest-Version` and `Created-By` attributes in your manifest file, the tool adds them.
The `Manifest-Version` defaults to `1.0` and the `Created-By` defaults to the JDK version you use.

You can also add the `Main-Class` attribute value in the manifest file without creating your own manifest file.
Use the option `--main-class` with the `jar` tool when you create/update a JAR file.
The following command will add `com.jdojo.intro.Welcome` as
the value of the `Main-Class` in the `MANIFEST.MF` file in the `test.jar` file:

```text
jar --create --main-class com.jdojo.intro.Welcome --file test.jar *.class
```

You can set the `CLASSPATH` for a JAR file in its manifest file.
The attribute name is called `Class-Path`, which you must specify in a custom manifest file.
**It is a space-separated list of JAR files, ZIP files, and directories.**
The `Class-Path` attribute in a manifest file looks like this

```text
Class-Path: chapter8.jar file:/c:/book/ http://www.jdojo.com/jutil.jar
```

This entry has three items for the `CLASSPATH`: a JAR file named `chapter8.jar`,
a directory using the file protocol `file:/c:/book/`,
and another JAR file using the HTTP protocol `http://www.jdojo.com/jutil.jar`.
Note that **the directory name** must end with a **forward slash**.
Suppose this `Class-Path` setting is included in the manifest file for the `test.jar` file.
When you run the `test.jar` file using the following `java` command,
this `CLASSPATH` will be used to search and load classes.

```text
java –jar test.jar
```

When you run a JAR file with the `–jar` option using the `java` command,
any `CLASSPATH` setting outside the manifest file of the JAR file (`test.jar` file in this case) is ignored.
Another use of the `Class-Path` attribute is to generate an index of all packages using the `--generate-index` option of the `jar` tool.

## Sealing a Package in a JAR File

You can seal a package in a JAR file.
**Sealing a package in a JAR file means that all classes declared in that package must be archived in the same JAR file.**
Typically, you seal a package to easily maintain versions of the package.
If you change anything in the package, you just recreate a JAR file.
To seal a package in a JAR file, you need to include two attributes: `Name` and `Sealed`.
The value for the `Name` attribute is the name of the package and the `Sealed` attribute has a `true` value.
The following entries in a manifest file will seal a package named `com.jdojo.archives`.
Note that **the package name** must end with a forward slash (`/`).

```text
Name: com/jdojo/archives/
Sealed: true
```

**By default, packages in a JAR file are not sealed.**
If you want to **seal the JAR file itself**, you can include a `Sealed` attributed, as shown:

```text
Sealed: true
```

**Sealing the JAR file will seal all packages in that JAR file.**
However, you can override it by not sealing a package individually.
The following entries in a manifest file will seal all packages in the JAR file,
except the `book/chapter8/` package:

```text
Sealed: true

Name: book/chapter8/
Sealed: false
```
