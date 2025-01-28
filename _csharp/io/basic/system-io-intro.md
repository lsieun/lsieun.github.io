---
title: "System.IO命名空间"
sequence: "101"
---

C# includes following standard IO (Input/Output) classes to read/write from different sources like files, memory, network, isolated storage, etc.

## Stream

**Stream**: `System.IO.Stream` is an abstract class
that provides standard methods to transfer bytes (read, write, etc.) to the source.
It is like a wrapper class to transfer bytes.
Classes that need to read/write bytes from a particular source must implement the `Stream` class.

The following classes inherit `Stream` class to provide the functionality to Read/Write bytes from a particular source:

- `FileStream` reads or writes bytes from/to a physical file, whether it is a .txt, .exe, .jpg, or any other file. `FileStream` is derived from the `Stream` class.
- `MemoryStream` reads or writes bytes that are stored in memory.
- `BufferedStream` reads or writes bytes from other Streams to improve certain I/O operations' performance.
- `NetworkStream` reads or writes bytes from a network socket.
- `PipeStream` reads or writes bytes from different processes.
- `CryptoStream` is for linking data streams to cryptographic transformations.

![](/assets/images/csharp/stream-classes-heirarchy.png)

```text
          ┌─── file     : FileStream
          │
          ├─── memory   : MemoryStream
          │
          ├─── network  : NetworkStream
Stream ───┤
          ├─── process  : PipeStream
          │
          ├─── crypto   : CryptoStream
          │
          └─── auxiliary: BufferedStream
```

## Stream Readers and Writers

`StreamReader` is a helper class for reading characters from a `Stream` by converting bytes into characters using an encoded value.
It can be used to read strings (characters) from different Streams like `FileStream`, `MemoryStream`, etc.

`StreamWriter` is a helper class for writing a string to a `Stream` by converting characters into bytes.
It can be used to write strings to different Streams such as `FileStream`, `MemoryStream`, etc.

`BinaryReader` is a helper class for reading primitive datatype from bytes.

`BinaryWriter` writes primitive types in binary.

![](/assets/images/csharp/stream-relations.png)
