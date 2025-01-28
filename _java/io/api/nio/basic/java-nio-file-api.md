---
title: "java.nio.file"
sequence: "101"
---

[UP](/java/java-io-index.html)


- `java.nio.file`: access file systems and their files.
- `java.nio.file.attribute`: access file system attributes.
- `java.nio.file.spi`: create a file system implementation.

## Classic I/O 中 File 的缺陷

The File-based file system interface is problematic.
Several problems are listed here:

- Many methods return Boolean values rather than throw  
  exceptions. As a result, you don't know why an
  operation fails. For example, when the `delete()` method
  returns `false`, you don't know why the file could not be
  deleted (such as the file not existing or the user not having
  the appropriate permission to perform the deletion).

- File doesn't support file system-specific symbolic links and hard links.
- File provides access to a limited set of file attributes.

- File doesn't support efficient file-attribute access.
  Every query results in a call to the underlying operating system.
- File doesn't scale to large directories. Requesting a
  large directory listing over a server can result in a hung
  application. Large directories can also cause memory
  resource problems, resulting in a denial of service.
- File is limited to the default file system (the file system
  that is accessible to the Java Virtual Machine — JVM). It
  doesn't support alternatives, such as a memory-based
  file system.
- File doesn't offer a file-copy or a file-move capability.
  The `renameTo()` method, which is often used in a
  file-move context, doesn't work consistently across
  operating systems.

## NIO.2 的改进

NIO.2 provides an improved file system interface
that offers solutions to the previous problems.
Some of its features are listed here:

- Methods throwing exceptions
- Support for symbolic links
- Broad and efficient support for file attributes
- Directory streams
- Support for alternative file systems via custom file system providers
- Support for file copying and file moving
- Support for walking the file tree/visiting files and watching directories
