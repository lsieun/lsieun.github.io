---
title: "I/O Concepts"
sequence: "103"
---

[UP](/java-nio.html)


The Java platform provides a rich set of I/O metaphors.
Some of these metaphors are more abstract than others.
With all abstractions, the further you get from hard, cold reality, the tougher it becomes to connect cause and effect.
The NIO packages of JDK 1.4 introduce a new set of abstractions for doing I/O.
Unlike previous packages, these are focused on shortening the distance between abstraction and reality.
The NIO abstractions have very real and direct interactions with real-world entities.
Understanding these new abstractions and, just as importantly, the I/O services they interact with,
is key to making the most of I/O-intensive Java applications.

It's important to understand the following topics:  

- Buffer handling
- Kernel versus user space
- Virtual memory
- Paging
- File-oriented versus stream I/O
- Multiplexed I/O (readiness selection)

## Buffer Handling

Buffers, and how buffers are handled, are the basis of all I/O.
The very term "input/output" means nothing more than moving data in and out of buffers.

> IO = data --> buffer --> data

Processes perform I/O by requesting of the operating system
that data be drained from a buffer (write) or that a buffer be filled with data (read).
That's really all it boils down to.
All data moves in or out of a process by this mechanism.
The machinery inside the operating system
that performs these transfers can be incredibly complex,
but conceptually, it's very straightforward.

> 进程I/O操作是通过OS来实现


Note the concepts of **user space** and **kernel space**.
**User space** is where regular processes live.
The JVM is a regular process and dwells in user space.
User space is a nonprivileged area: code executing there cannot directly access hardware devices, for example.
**Kernel space** is where the operating system lives.
Kernel code has special privileges:
it can communicate with device controllers, manipulate the state of processes in user space, etc.
Most importantly, all I/O flows through kernel space, either directly or indirectly.

> 介绍两个概念User Space和Kernel Space

When a process requests an I/O operation,
it performs a system call, sometimes known as a trap, which transfers control into the kernel.
The low-level `open()`, `read()`, `write()`, and `close()` functions so familiar to C/C++ coders
do nothing more than set up and perform the appropriate system calls.
When the kernel is called in this way,
it takes whatever steps are necessary to find the data
the process is requesting and transfer it into the specified buffer in user space.
The kernel tries to cache and/or prefetch data,
so the data being requested by the process may already be available in kernel space.
If so, the data requested by the process is copied out.
If the data isn't available, the process is suspended while the kernel goes about bringing the data into memory.

It's probably occurred to you that copying from kernel space to the final user buffer seems like extra work.
Why not tell the disk controller to send it directly to the buffer in user space?
There are a couple of problems with this.
First, hardware is usually not able to access user space directly.
Second, block-oriented hardware devices such as disk controllers operate on fixed-size data blocks.
The user process may be requesting an oddly sized or misaligned chunk of data.
The kernel plays the role of intermediary, breaking down and reassembling data
as it moves between user space and storage devices.

### Scatter/gather

Many operating systems can make the assembly/disassembly process even more efficient.
The notion of **scatter/gather** allows **a process to pass a list of buffer addresses to the operating system in one system call**.
The kernel can then fill or drain the multiple buffers in sequence,
scattering the data to multiple user space buffers on a read,
or gathering from several buffers on a write.

This saves the user process from making several system calls (which can be expensive) and
allows the kernel to optimize handling of the data because it has information about the total transfer.
If multiple CPUs are available, it may even be possible to fill or drain several buffers simultaneously.

## Virtual Memory

All modern operating systems make use of virtual memory.
Virtual memory means that artificial, or virtual, addresses are used in place of physical (hardware RAM) memory addresses.
This provides many advantages, which fall into two basic categories:

- 1. More than one virtual address can refer to the same physical memory location.
- 2. A virtual memory space can be larger than the actual hardware memory available.

The previous section said that device controllers cannot do DMA directly into user space,
but the same effect is achievable by exploiting item 1 above.
By mapping a kernel space address to the same physical address as a virtual address in user space,
the DMA hardware (which can access only physical memory addresses) can fill a buffer
that is simultaneously visible to both the kernel and a user space process.

> DMA = Direct Memory Access

This is great because it eliminates copies between kernel and user space,
but requires the kernel and user buffers to share the same page alignment.
Buffers must also be a multiple of the block size used by the disk controller (usually 512 byte disk sectors).
Operating systems divide their memory address spaces into pages,
which are fixed-size groups of bytes.
These memory pages are always multiples of the disk block size and are usually powers of 2 (which simplifies addressing).
Typical memory page sizes are 1,024, 2,048, and 4,096 bytes.
The virtual and physical memory page sizes are always the same.
Figure 1-4 shows how virtual memory pages from multiple virtual address spaces can be mapped to physical memory.

## Memory Paging

To support the second attribute of virtual memory (having an addressable space larger than physical memory),
it's necessary to do virtual memory paging
(often referred to as swapping, though true swapping is done at the process level, not the page level).
This is a scheme whereby the pages of a virtual memory space can be persisted to external disk storage
to make room in physical memory for other virtual pages.
Essentially, physical memory acts as a cache for a paging area,
which is the space on disk where the content of memory pages is stored when forced out of physical memory.

Aligning memory page sizes as multiples of the disk block size
allows the kernel to issue direct commands to the disk controller hardware to write memory pages to disk or reload them when needed.
It turns out that **all disk I/O is done at the page level**.
This is the only way data ever moves between disk and physical memory in modern, paged operating systems.

Modern CPUs contain a subsystem known as the Memory Management Unit (MMU).
This device logically sits between the CPU and physical memory.
It contains the mapping information needed to translate virtual addresses to physical memory addresses.
When the CPU references a memory location,
the MMU determines which page the location resides in (usually by shifting or masking the bits of the address value) and
translates that virtual page number to a physical page number (this is done in hardware and is extremely fast).
If there is no mapping currently in effect between that virtual page and a physical memory page,
the MMU raises a **page fault** to the CPU.

A **page fault** results in a trap, similar to a system call,
which vectors control into the kernel along with information about which virtual address caused the fault.
The kernel then takes steps to validate the page.
The kernel will schedule a pagein operation to read the content of the missing page back into physical memory.
This often results in another page being stolen to make room for the incoming page.
In such a case, if the stolen page is dirty (changed since its creation or last pagein)
a pageout must first be done to copy the stolen page content to the paging area on disk.

If the requested address is not a valid virtual memory address
(it doesn't belong to any of the memory segments of the executing process),
the page cannot be validated, and a segmentation fault is generated.
This vectors control to another part of the kernel and usually results in the process being killed.

Once the faulted page has been made valid,
the MMU is updated to establish the new virtual-to-physical mapping
(and if necessary, break the mapping of the stolen page),
and the user process is allowed to resume.
The process causing the page fault will not be aware of any of this; it all happens transparently.

This dynamic shuffling of memory pages based on usage is known as **demand paging**.
Some sophisticated algorithms exist in the kernel to optimize this process and to prevent thrashing(翻来覆去),
a pathological(不理智的) condition in which paging demands become so great that nothing else can get done.

## File I/O

**File I/O** occurs within the context of a **filesystem**.
A **filesystem** is a very different thing from a **disk**.
Disks store data in sectors, which are usually 512 bytes each.
They are hardware devices that know nothing about the semantics of files.
They simply provide a number of slots where data can be stored.
In this respect, the sectors of a disk are similar to memory pages;
all are of uniform size and are addressable as a large array.

**A filesystem is a higher level of abstraction.**
Filesystems are a particular method of arranging
and interpreting data stored on a disk (or some other random-access, block-oriented device).
**The code** you write almost always interacts with a **filesystem**, not with the **disks** directly.
It is the **filesystem** that defines the abstractions of filenames, paths, files, file attributes, etc.

The previous section mentioned that **all I/O is done** via **demand paging**.
You'll recall that **paging is very low level** and always happens as direct transfers of disk sectors into and out of memory pages.
So how does this low-level paging translate to file I/O, which can be performed in arbitrary sizes and alignments?

A filesystem organizes a sequence of uniformly sized data blocks.
Some blocks store **meta information** such as maps of free blocks, directories, indexes, etc.
Other blocks contain **file data**.
The **meta information** about individual files describes
which blocks contain the **file data**, where the data ends, when it was last updated, etc.

When a request is made by a **user process** to read file data,
the **filesystem** implementation determines exactly where on disk that data lives.
It then takes action to bring those disk sectors into memory.
In older operating systems, this usually meant issuing a command directly to the disk driver to read the needed disk sectors.
But in modern, paged operating systems, the filesystem takes advantage of **demand paging** to bring data into memory.

**Filesystems** also have a notion of **pages**, which may be the same size as a basic memory page or a multiple of it.
Typical filesystem page sizes range from 2,048 to 8,192 bytes and will always be a multiple of the basic memory page size.

How a paged filesystem performs I/O boils down to the following:

- Determine which filesystem page(s) (group of disk sectors) the request spans.
 The file content and/or metadata on disk may be spread across multiple filesystem pages, and those pages may be noncontiguous.  
- Allocate enough memory pages in kernel space to hold the identified filesystem pages.  
- Establish mappings between those memory pages and the filesystem pages on disk.  
- Generate **page faults** for each of those memory pages.
- The virtual memory system traps the **page faults** and schedules pageins to validate those pages by reading their contents from disk.  
- Once the pageins have completed, the filesystem breaks down the raw data to extract the requested file content or attribute information. 

Note that this filesystem data will be cached like other memory pages.
On subsequent I/O requests, some or all of the file data may still be present in physical memory and can be reused without rereading from disk.

**Most filesystems also prefetch extra filesystem pages**
on the assumption that the process will be reading the rest of the file.
If there is not a lot of contention for memory, these filesystem pages could remain valid for quite some time.
In which case, it may not be necessary to go to disk at all
when the file is opened again later by the same, or a different, process.
You may have noticed this effect when repeating a similar operation, such as a grep of several files.
It seems to run much faster the second time around.

Similar steps are taken for **writing file data**,
whereby changes to files (via `write()`) result in dirty filesystem pages
that are subsequently paged out to synchronize the file content on disk.
Files are created by establishing mappings to empty filesystem pages
that are flushed to disk following the write operation.

### Memory-mapped files

For conventional file I/O, in which user processes issue `read()` and `write()` system calls to transfer data,
there is almost **always one or more copy operations** to move the data
between these filesystem pages in kernel space and a memory area in user space.
This is because there is not usually a one-to-one alignment between filesystem pages and user buffers.
There is, however, a special type of I/O operation supported by most operating systems
that allows user processes to take maximum advantage of the page-oriented nature of system I/O and completely avoid buffer copies.

Memory-mapped I/O uses the filesystem to establish a virtual memory mapping
from user space directly to the applicable filesystem pages.
This has several advantages:

- The user process sees the file data as memory, so there is no need to issue `read()` or `write()` system calls.
- As the user process touches the mapped memory space,
  page faults will be generated automatically to bring in the file data from disk.
  If the user modifies the mapped memory space, the affected page is automatically marked as dirty and
  will be subsequently flushed to disk to update the file.  
- The virtual memory subsystem of the operating system will perform intelligent caching of the pages, automatically managing memory according to system load.
- The data is always page-aligned, and no buffer copying is ever needed.
- Very large files can be mapped without consuming large amounts of memory to copy the data.

Virtual memory and disk I/O are intimately linked and, in many respects, are simply two aspects of the same thing.
Keep this in mind when handling large amounts of data.
Most operating systems are far more effecient when handling data buffers that are page-aligned and are multiples of the native page size.

### File locking

File locking is a scheme by which one process can prevent others
from accessing a file or restrict how other processes access that file.
Locking is usually employed to control how updates are made to shared information or as part of transaction isolation.
File locking is essential to controlling concurrent access to common resources by multiple entities.
Sophisticated applications, such as databases, rely heavily on file locking.

> file locking是指不同的process间的

While the name "file locking" implies locking an entire file (and that is often done),
locking is usually available at a finer-grained level.
File regions are usually locked, with granularity down to the byte level.
Locks are associated with a particular file,
beginning at a specific byte location within that file and running for a specific range of bytes.
This is important because it allows many processes to coordinate access to specific areas of a file
without impeding other processes working elsewhere in the file.

> file locking有不同的粒度

File locks come in two flavors: **shared** and **exclusive**.
**Multiple shared locks** may be in effect for the same file region at the same time.
**Exclusive locks**, on the other hand, demand that no other locks be in effect for the requested region.

The classic use of shared and exclusive locks is to control updates to a shared file
that is primarily used for read access.
A process wishing to read the file would first acquire a shared lock on that file or on a subregion of it.
A second wishing to read the same file region would also request a shared lock.
Both could read the file concurrently without interfering with each other.
However, if a third process wishes to make updates to the file,
it would request an exclusive lock.
That process would block until all locks (shared or exclusive) are released.
Once the exclusive lock is granted, any reader processes asking for shared locks would block until the exclusive lock is released.
This allows the updating process to make changes to the file without any reader processes seeing the file in an inconsistent state.

File locks are either **advisory** or **mandatory**.
**Advisory locks** provide information about current locks to those processes that ask,
but such locks are not enforced by the operating system.
It is up to the processes involved to cooperate and pay attention to the advice the locks represent.
**Most Unix and Unix-like operating systems provide advisory locking.**
Some can also do **mandatory** locking or a combination of both.

**Mandatory locks** are enforced by the operating system and/or the filesystem and will prevent processes,
whether they are aware of the locks or not, from gaining access to locked areas of a file.
**Usually, Microsoft operating systems do mandatory locking.**
It's wise to assume that all locks are advisory and to use file locking consistently across all applications accessing a common resource.
Assuming that all locks are advisory is the only workable cross-platform strategy.
Any application depending on mandatory file-locking semantics is inherently nonportable.

## Stream I/O

Not all I/O is block-oriented, as described in previous sections.
There is also stream I/O, which is modeled on a pipeline.
The bytes of an I/O stream must be accessed sequentially.
TTY (console) devices, printer ports, and network connections are common examples of streams.

> File I/O是block的，而Stream I/O是nonblock的。

Streams are generally, but not necessarily, slower than block devices and are often the source of intermittent(断断续续的) input.
Most operating systems allow **streams** to be placed into **nonblocking mode**,
which permits a process to check if input is available on the stream without getting stuck if none is available at the moment.
Such a capability allows a process to handle input as it arrives but perform other functions while the input stream is idle.

A step beyond **nonblocking mode** is the ability to do **readiness selection**.
This is similar to nonblocking mode (and is often built on top of nonblocking mode),
but offloads the checking of whether a stream is ready to the operating system.
The operating system can be told to watch a collection of streams and
return an indication to the process of which of those streams are ready.
This ability permits a process to **multiplex** many active streams
using common code and a single thread by leveraging the readiness information returned by the operating system.
This is widely used in network servers to handle large numbers of network connections.
**Readiness selection** is essential for high-volume scaling.
