---
title: "FileChannel"
sequence: "112"
---

[UP](/java-nio.html)


The `FileChannel` class can do normal read and write as well as **scatter/gather**.
It also provides lots of new methods specific to files.
Many of these methods are familiar file operations; others may be new to you.

```java
public abstract class AbstractInterruptibleChannel implements Channel, InterruptibleChannel {
    //
}
```

```java
public abstract class FileChannel extends AbstractInterruptibleChannel
    implements SeekableByteChannel, GatheringByteChannel, ScatteringByteChannel {
    //
}
```

**File channels are always blocking and cannot be placed into nonblocking mode.**
Modern operating systems have sophisticated caching and prefetch algorithms
that usually give local disk I/O very low latency.
Network filesystems generally have higher latencies but often benefit from the same optimizations.
The nonblocking paradigm of **stream-oriented I/O** doesn't make as much sense for file-oriented operations
because of the fundamentally different nature of **file I/O**.
For **file I/O**, the true winner is **asynchronous I/O**,
which lets **a process request one or more I/O operations from the operating system but does not wait for them to complete**.
**The process is notified at a later time that the requested I/O has completed.**
**Asynchronous I/O** is an advanced capability not available on many operating systems.
It is under consideration as a future NIO enhancement.

`FileChannel` objects cannot be created directly.
A `FileChannel` instance can be obtained only by calling `getChannel()` on an open file object
(`RandomAccessFile`, `FileInputStream`, or `FileOutputStream`).
Calling the `getChannel()` method returns a `FileChannel` object connected to the same file,
with the same access permissions as the file object.
You can then use the channel object to make use of the powerful `FileChannel` API:

```text
                                     ┌─── position()
                                     │
               ┌─── index ───────────┼─── position(long newPosition)
               │                     │
               │                     └─── size()
               │
               │                     ┌─── truncate(long size)
               ├─── data ────────────┤
               │                     └─── force(boolean metaData)
               │
               │                                   ┌─── read(ByteBuffer dst)
               │                                   │
               │                                   ├─── read(ByteBuffer dst, long position)
               │                     ┌─── read ────┤
               │                     │             ├─── read(ByteBuffer[] dsts)
               │                     │             │
               │                     │             └─── read(ByteBuffer[] dsts, int offset, int length)
               │                     │
FileChannel ───┤                     │             ┌─── write(ByteBuffer src)
               │                     │             │
               ├─── transfer data ───┤             ├─── write(ByteBuffer src, long position)
               │                     ├─── write ───┤
               │                     │             ├─── write(ByteBuffer[] srcs)
               │                     │             │
               │                     │             └─── write(ByteBuffer[] srcs, int offset, int length)
               │                     │
               │                     │             ┌─── transferFrom(ReadableByteChannel src, long position, long count)
               │                     │             │
               │                     └─── other ───┼─── transferTo(long position, long count, WritableByteChannel target)
               │                                   │
               │                                   └─── map(MapMode mode, long position, long size)
               │
               │                     ┌─── lock()
               │                     │
               │                     ├─── lock(long position, long size, boolean shared)
               └─── lock ────────────┤
                                     ├─── tryLock()
                                     │
                                     └─── tryLock(long position, long size, boolean shared)
```

**Like most channels, `FileChannel` attempts to use native I/O services when possible.**
The `FileChannel` class itself is `abstract`;
the actual object you get from `getChannel()` is an instance of a concrete subclass
that may implement some or all of these methods using native code.

**`FileChannel` objects are thread-safe.**
Multiple threads can concurrently call methods on the same instance without causing any problems,
but not all operations are multithreaded.
**Operations that affect the channel's position or the file size are single-threaded.**
Threads attempting one of these operations will wait
if another thread is already executing an operation that affects the channel position or file size.
Concurrency behavior can also be affected by the **underlying operating system or filesystem**.

Like most I/O-related classes, `FileChannel` is an abstraction that reflects **a concrete object external to the JVM**.
The `FileChannel` class guarantees that all instances within the same JVM will see **a consistent view of a given file**.
But the JVM cannot make guarantees about factors beyond its control.
The view of a file seen through a `FileChannel` instance may or may not be consistent with
the view of that file seen by an external, non-Java processes.
**The semantics of concurrent file access by multiple processes
is highly dependent on the underlying operating system and/or filesystem.**
Concurrent access to the same file by `FileChannel` objects running in different JVMs will,
generally, be consistent with concurrent access between non-Java processes.

## Accessing Files

Each `FileChannel` object has a one-to-one relationship with a **file descriptor**,
so it comes as no surprise that the API methods listed here
correspond closely to common file I/O system calls on your favorite POSIX-compliant operating system.
The names may be different, but the usual suspects have been rounded up.
You may also note the similarities to methods of the `RandomAccessFile` class from the `java.io` package.
`RandomAccessFile` provides essentially the same abstraction.
Until the advent of channels, this was how low-level file operations were performed.
`FileChannel` models the same services, so its API is naturally similar.

File I/O API comparison chart

```text
| FileChannel                | RandomAccessFile | POSIX system call |
|----------------------------|------------------|-------------------|
| read()                     | read()           | read()            |
| write()                    | write()          | write()           |
| size()                     | length()         | fstat()           |
| position()                 | getFilePointer() | lseek()           |
| position(long newPosition) | seek()           | lseek()           |
| truncate()                 | setLength()      | ftruncate()       |
| force()                    | getFD().sync()   | fsync()           |
```

Like the underlying **file descriptor**, each `FileChannel` object has a notion of file position.
The position determines the location in the file where data will next be read or written.
In this respect, the `FileChannel` class is similar to buffers,
and the `MappedByteBuffer` class makes it possible to access file data through the `ByteBuffer` API.

As you can see in the preceding listing, there are two forms of the `position()` method.
The first, which takes no arguments, returns the current file position.
The value returned is a `long` and represents the current byte position within the file.

The second form of `position()` takes a `long` argument and sets the channel position to the given value.
Attempting to set the `position` to a negative value will result in a `java.lang.IllegalArgumentException`,
but it's OK to set the `position` beyond the end of the file.
Doing so sets the `position` to the requested value but does not change the file size.
If a `read()` is performed after setting the `position` beyond the current file size,
the end-of-file condition is returned.
Doing a `write()` with the position set beyond the file size
will cause the file to grow to accommodate the new bytes written.
The behavior is identical to that for an absolute `write()` and may result in a file hole.

What the Heck Is a File Hole?

A file hole occurs when the space on disk allocated for a file is less than the file size.
Most modern filesystems provide for sparsely populated files,
allocating space on disk only for the data actually written
(more properly, allocating only those filesystem pages to which data was written).
If data is written to the file in noncontiguous locations,
this can result in areas of the file that logically contain no data (holes).

### Read And Write

Attempting an **absolute read** beyond the end of the file, as returned by `size()`, will return end-of-file.
Doing an absolute `write()` at a position beyond the file size
will cause the file to grow to accommodate the new bytes being written.
The values of bytes in locations between the previous end-of-file position and
the newly added bytes are unspecified by the `FileChannel` class
but will in most cases reflect the underlying filesystem semantics.
Depending on the operating-system and/or the filesystem type, this may result in a hole in the file.

### truncate()

When it's necessary to reduce the size of a file, `truncate()` chops off any data beyond the new size you specify.
- If the current size is greater than the new size, all bytes beyond the new size are discarded.
- If the new size provided is greater than or equal to the current file size, the file is not modified.

A side effect of `truncate()` in either case is that it sets the **file position** to the new size provided.

### force

```text
public abstract class FileChannel 
        extends AbstractChannel 
        implements ByteChannel, GatheringByteChannel, ScatteringByteChannel 
{ 
        // This is a partial API listing 
 
        public abstract void truncate (long size) 
        public abstract void force(boolean metaData);
}
```

The last method listed above is `force()`.
This method tells the channel to force any pending modifications made to the file out to disk.
All modern filesystems cache data and defer disk updates to boost performance.
Calling the `force()` method requests that all pending modifications to the file be synchronized to disk immediately.

> 与输出到disk相关

If the file resides on a **local filesystem**, then upon returning from `force()`,
it's guaranteed that all modifications to the file since the channel was created (or the last call to `force()`) have been written to disk.
This is important for critical operations, such as transaction processing, to insure data integrity and reliable recovery.

> local filesystem

However, this guarantee of synchronization to permanent storage cannot be made
if the file resides on a **remote filesystem**, such as NFS.
The same may be true for other filesystems, depending on implementation.
The JVM can't make promises the operating system or filesystem won't keep.
If your application must maintain data integrity in the face of system failures,
verify that the operating system and/or filesystem you're using are dependable in that regard.

> remote filesystem

For applications in which confidence in data integrity are essential,
verify the capabilities of the operating environment on which you plan to deploy.

The `boolean` argument to `force()` indicates
whether **metadata** about the file should also be synchronized to disk before returning.
Metadata represents things such as file ownership, access permissions, last modification time, etc.
**In most cases, this information is not critical for data recovery.**

> 解释force(boolean metaData)方法中metaData参数的作用

Passing `false` to `force()` indicates that only the file data need be synchronized before returning.
In most cases, synchronizing the metadata will require at least one additional
low-level I/O operation by the operating system.
Some high-volume transactional applications may gain a moderate performance increase
without sacrificing data integrity by not requiring metadata updates on each call to `force()`.

> 这里还是推荐使用false的

## File Locking

Until 1.4, a feature sorely lacking from the Java I/O model was **file locking**.
While most modern operating systems have long had file-locking capabilities of one form or another,
file locks have not been available to Java programmers until the JDK 1.4 release.
**File locking is essential for integration with many non-Java applications.**
It can also be valuable for arbitrating access among multiple Java components of a large system.

**Locks can be shared or exclusive.**
**The file-locking features** described in this section **depend heavily on the native operating-system implementation.**
Not all operating systems and filesystems support **shared file locks**.
For those that don't, a request for **a shared lock** will be silently promoted to **an exclusive-lock** request.
This guarantees correctness but may impact performance considerably.
For example, employing only exclusive locks would serialize all the reader processes in Figure 1-7.
Be sure you understand file-locking behavior on the operating system and filesystem(s) on which you plan to deploy;
it could seriously affect your design choices.

> file locking的功能依赖于native operating-system implementation

Additionally, **not all platforms implement basic file locking in the same way.**
File-locking semantics may vary between operating systems and even different filesystems on the same operating system.
Some operating systems provide only **advisory locking**, some only **exclusive locks**, and some may provide both.
You should always manage file locks as if they were **advisory**, which is the safest approach.
But it's also wise to be aware of how locks are implemented in the underlying operating system.
For example, if all locks are mandatory,
the locks you obtain may impact other applications running on the same system if you don't release them in a timely manner.

> 不同的platform对于basic file locking的实现不同

An important caveat regarding the file-locking model implemented by `FileChannel` is that
locks are applied **per file**, not per channel or per thread.
This means that file locks are not appropriate for coordinating access between threads in the same JVM.

> lock是建立在per file基础上

If one thread acquires an exclusive lock on a given file,
and a second thread requests an exclusive lock for the same file region using an independently opened channel,
the second thread will be granted access.
If the two threads are running in different JVMs,
the second thread would block,
because locks are ultimately arbitrated by the operating system or filesystem almost always at the **process** rather than thread level.
Locks are associated with a file, not with individual file handles or channels.

> 不太理解

Locks are associated with files, not channels.
Use locks to coordinate with external processes, not between threads in the same JVM.

> lock是基于file的，而不是基于channel的；lock用来协调多个process，而不是同一个JVM当中的多个thread

**File locks** are intended for arbitrating file access at the **process level**,
such as between major application components
or when integrating with components from other vendors.
If you need to control concurrent access between **multiple Java threads**,
you may need to implement your own, lightweight locking scheme.
Memory-mapped files (described later in this chapter) may be an appropriate choice for that case.

> 还是强调lock是协调process的

### lock

Let's take a look at the `FileChannel` API methods related to file locking:

```java
public abstract class FileChannel extends AbstractChannel 
        implements ByteChannel, GatheringByteChannel, ScatteringByteChannel 
{
    // This is a partial API listing 

    public final FileLock lock();
    public abstract FileLock lock(long position, long size, boolean shared);

    public final FileLock tryLock();
    public abstract FileLock tryLock(long position, long size, boolean shared);
}
```

This time, let's look first at the form of `lock()` that takes arguments.
Locks are obtained on regions of files.
Calling `lock()` with arguments specifies the beginning `position` within the file where the locked region should begin
and the `size` of the region to lock.
The third argument, `shared`, indicates whether you want the lock to be shared (`true`) or exclusive (`false`).
To obtain a **shared lock**, you must have opened the file with **read permission**.
**Write permission** is required for an **exclusive lock**.
The `position` and `size` you provide must be nonnegative.

> 介绍lock()方法的参数

The lock region does not need to be constrained to the file size;
**a lock can extend beyond the end of the file.**
Therefore, it is possible to lock an area of a file before writing data there.
It's also possible to lock a region that doesn't even overlap any of the file content,
such as beyond the last byte of the file.
If the file grows into that region, then your lock would cover that new area of the file.
Conversely, if you lock a region of a file, and the file grows beyond your locked area,
the new file content would not be protected by your lock.

> lock()的区域，并不受文件大小的约束

The simple form of `lock()`, which takes no arguments,
is a convenience method for requesting an exclusive lock on an entire file,
up to the maximum size it can attain. It's equivalent to:

```text
fileChannel.lock(0L, Long.MAX_VALUE, false);
```

The `lock()` method will block if the lock range you are requesting is valid,
but it must wait for a preexisting lock to be released.
If your thread is suspended in this situation,
it's subject to interrupt semantics similar to those discussed in Section 3.1.3.
If the channel is closed by another thread,
the suspended thread will resume and receive an `AsynchronousCloseException`.
If the suspended thread is interrupted directly (by calling its `interrupt()` method),
it will wake with a `FileLockInterruptionException`.
This exception will also be thrown immediately
if the thread's interrupt status is already set when `lock()` is invoked.

### tryLock

In the above API listing, the two methods named `tryLock()` are nonblocking variants of `lock()`.
They function the same as `lock()` but return `null` if the requested lock cannot be acquired immediately.

### FileLock

As you can see, `lock()` and `tryLock()` return a `FileLock` object.
Here is the complete API of `FileLock`:

```java
public abstract class FileLock 
{
    public final FileChannel channel();

    public final long position();
    public final long size();
    public final boolean isShared();

    public final boolean overlaps(long position, long size);
    public abstract boolean isValid();
    public abstract void release() throws IOException;
}
```



The `FileLock` class encapsulates a locked file region.
`FileLock` objects are created by `FileChannel` objects and are always associated with that specific channel instance.
You can query a lock object to determine which channel created it by calling the `channel()` method.

```text
            ┌─── channel ───┼─── channel()
            │
            │               ┌─── position()
            │               │
            ├─── lock ──────┼─── size()
FileLock ───┤               │
            │               └─── isShared()
            │
            ├─── unlock ────┼─── release()
            │
            │               ┌─── overlaps(long position, long size)
            └─── other ─────┤
                            └─── isValid()
```

A `FileLock` object is valid when created and remains so until its `release()` method is called,
the channel it's associated with is closed, or the JVM shuts down.
The validity of a lock can be tested by invoking its `isValid()` boolean method.
A lock's validity may change over time, but its other properties
— **position**, **size**, and **exclusivity** — are set at creation time and are immutable.

You can test a lock to determine if it is shared or exclusive by invoking `isShared()`.
If shared locks are not supported by the underlying operating system or filesystem,
this method will always return `false`,
even if you passed `true` when requesting the lock.
If your application depends on shared-locking behavior,
test the returned lock to be sure you got the type you requested.
`FileLock` objects are thread-safe; multiple threads may access a lock object concurrently.

> isShared()

Finally, a `FileLock` object can be queried to determine if it overlaps a given file region by calling its `overlaps()` method.
This will let you quickly determine if a lock you hold intersects with a region of interest.
A return of `false` does not guarantee that you can obtain a lock on the desired region.
One or more locks may be held elsewhere in the JVM or by external processes.
Use `tryLock()` to be sure.

> overlaps() + tryLock()

Although a `FileLock` object is associated with a specific `FileChannel` instance,
the lock it represents is associated with an underlying file, not the channel.
This can cause conflicts, or possibly deadlocks, if you don't release a lock when you're finished with it.
Carefully manage file locks to avoid such problems.
Once you've successfully obtained a file lock, be sure to release it if subsequent errors occur on the channel.
A code pattern similar to the following is recommended:

```text
FileLock lock = fileChannel.lock();
try {
    // perform read/write/whatever on channel
}
catch (IOException ex) {
    // <handle unexpected exception
}
finally {
    lock.release();
}
```


## File

### Read File

### Write File
