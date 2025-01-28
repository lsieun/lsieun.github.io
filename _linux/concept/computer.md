---
title: "Computer"
sequence: "computer"
---

[UP](/linux.html)


## Inner Workings of a Computer: the Different Layers Involved

A computer is often considered as something rather abstract,
and the externally visible interface is much simpler than its internal complexity.
Such complexity comes in part from the number of pieces involved.
However, these pieces can be viewed in layers, where a layer only interacts with those immediately above or below.

这段理解：

- 第一，“计算机的内部” 要比 “计算机的外部” 更加复杂
- 第二，“计算机的内部”所表现出的“复杂”是可能通过 layers 视角来理解的
- 第三，对于每一层 layer 来说，它只与相邻的 layer 进行交互

An end-user can get by without knowing these details... as long as everything works.
When confronting a problem such as, “The internet doesn't work!”,
the first thing to do is to identify in which layer the problem originates.
Is the network card (hardware) working?
Is it recognized by the computer?
Does the Linux kernel see it?
Are the network parameters properly configured?
All these questions isolate **an appropriate layer** and focus on a potential source of the problem.

> 这段理解：使用 layers 的视角来理解计算机，是有助于发现问题的原因。

### The Deepest Layer: the Hardware

Let us start with a basic reminder that **a computer is**, first and foremost, **a set of hardware elements**.
There is generally a **main board** (known as the **motherboard**),
with one (or more) processor(s), some RAM, **device controllers**,
and extension slots for **option boards** (for other device controllers).
Most noteworthy among these **controllers** are IDE (Parallel ATA), SCSI and Serial ATA,
for connecting to storage devices such as hard disks.
**Other controllers** include USB,
which is able to host a great variety of devices
(ranging from webcams to thermometers, from keyboards to home automation systems) and IEEE 1394 (Firewire).
These controllers often allow connecting several devices
so the **complete subsystem handled by a controller** is therefore usually known as a “**bus**”.
**Option boards** include graphics cards (into which monitor screens will be plugged), sound cards,
network interface cards, and so on.
Some main boards are pre-built with these features, and don't need option boards.

这段理解：

- 第一， computer = a set of hardware elements = main board + processor + RAM + **device controller** + extension slots for **option boards**
- 第二，接下来又强调了 device controller 和 option board
- 第三，device controller 举了两种类型的例子，一种是 storage devices 「硬盘」，另一种是可插拔的 USB 设备「摄像头、键盘」
- 第四，借助于 device controller，形象的解释了一下 bus 的概念
- 第五，option board 包括 graphics cards/sound cards/network interface cards

The main difference between **device driver** and **device controller** is that
the **device driver** is a **software**;
Whereas, the **device controller** is a **hardware** component.
A **device driver** is specific to an operating system and it is hardware dependent.
It provides interrupt handling required for necessary asynchronous time-dependent hardware interface.
On the other hand, **device controller** is a circuit board between the device and the operating system.

#### Checking that the hardware works

Checking that a piece of hardware works can be tricky.
On the other hand, proving that it doesn't work is sometimes quite simple.

这段理解：

- 1、要验证一个 hardware 能够正常工作，比较难；但要证明它不正常工作，却很简单。
- 2、下面举了三个例子：硬盘、网卡、主板

A hard disk drive is made of spinning platters and moving magnetic heads.
When a hard disk is powered up, the platter motor makes a characteristic whir.
It also dissipates energy as heat.
Consequently, a hard disk drive that stays cold and silent when powered up is broken.

- dissipate：（使）消散，消失；驱散 to gradually become or make sth become weaker until it disappears

Network cards often include LEDs displaying the state of the link.
If a cable is plugged in and leads to a working network hub or switch, at least one LED will be on.
If no LED lights up, either the card itself, the network device, or the cable between them, is faulty.
The next step is therefore testing each component individually.

Some option boards — especially 3D video cards — include cooling devices, such as heat sinks and/or fans.
If the fan does not spin even though the card is powered up, a plausible explanation is the card overheated.
This also applies to the main processor(s) located on the main board.

### The Starter: the BIOS or UEFI

Hardware, on its own, is unable to perform useful tasks without a corresponding piece of software driving it.
Controlling and interacting with the hardware is the purpose of the operating system and applications.
These, in turn, require functional hardware to run.

这段理解：

- 1、只有 Hardware，并不能解决多少问题，需要与 Software 合作，才能做更多的事情。
- 2、Software 的概念，包括了 operating system 和 applications

**This symbiosis between hardware and software** does not happen on its own.
When the computer is first powered up, some **initial setup** is required.
This role is assumed by the `BIOS` or `UEFI`,
a piece of **software** embedded into the **main board** that runs automatically upon power-up.
Its primary task is searching for software it can hand over control to.
Usually, in the `BIOS` case,
this involves looking for **the first hard disk** with a **boot sector**
(also known as the **master boot record** or `MBR`), loading that boot sector, and running it.
From then on, the BIOS is usually not involved (until the next boot).
In the case of `UEFI`, the process involves **scanning disks**
to find a dedicated **EFI partition** containing further **EFI applications** to execute.

这段理解：

- 1、main board-->BIOS or UEFI-->initial setup
- 2、BIOS-->the first hard disk-->boot sector
- 3、UEFI-->scanning disks-->EFI partition-->EFI applications

The **boot sector** (or the **EFI partition**), in turn, contains another piece of software, called the `bootloader`,
whose purpose is to find and run an **operating system**.
Since this bootloader is not embedded in the **main board** but loaded from **disk**,
it can be smarter than the `BIOS`, which explains why the `BIOS` does not load the operating system by itself.
For instance, the `bootloader` (often `GRUB` on Linux systems)
can list the available **operating systems** and ask the user to choose one.
Usually, a time-out and default choice is provided.
Sometimes the user can also choose to add parameters to pass to the kernel, and so on.
Eventually, a kernel is found, loaded into memory, and executed.

这段理解：

- 1、BIOS 或 UEFI 是位于 main board 上的，而 boot sector 或 EFI partition 是位于 disk 上的
- 2、boot sector/EFI partition(disk) --> bootloader(disk) --> operating system(disk)

The `BIOS/UEFI` is also in charge of **detecting and initializing a number of devices**.
Obviously, this includes the IDE/SATA devices (usually hard disk(s) and CD/DVD-ROM drives), but also PCI devices.
Detected devices are often listed on screen during the boot process.
If this list goes by too fast, use the Pause key to freeze it for long enough to read.
Installed PCI devices that don't appear are a bad omen.
At worst, the device is faulty.
At best, it is merely incompatible with the current version of the BIOS or main board.
PCI specifications evolve, and old main boards are not guaranteed to handle newer PCI devices.

PCI(Peripheral Component Interconnect)是一种由英特尔（Intel）公司 1991 年推出的用于定义局部总线的标准。此标准允许在计算机内安装多达 10 个遵从 PCI 标准的扩展卡。

#### Setup, the BIOS/UEFI configuration tool

The `BIOS/UEFI` also contains a piece of software called `Setup`, designed to allow configuring aspects of the computer.
In particular, it allows choosing which **boot device** is preferred (for instance, the floppy disk or CD-ROM drive),
setting the system clock, and so on.

Starting `Setup` usually involves pressing a key very soon after the computer is powered on.
This key is often `Del` or `Esc`, sometimes `F2` or `F10`.
Most of the time, the choice is flashed on screen while booting.

#### UEFI, a modern replacement to the BIOS

`UEFI` is a relatively recent development.
Most new computers will support `UEFI` booting,
but usually they also support `BIOS` booting alongside for backwards compatibility with **operating systems**
that are not ready to exploit `UEFI`.

This new system gets rid of some of the limitations of `BIOS` booting:
with the usage of a dedicated partition,
the **bootloaders** no longer need special tricks to fit in a tiny **master boot record** and
then discover the **kernel** to boot.
Even better, with a suitably built Linux kernel,
`UEFI` can directly boot the **kernel** without any intermediary **bootloader**.
`UEFI` is also the basic foundation used to deliver **Secure Boot**,
a technology ensuring that you run only software validated by your operating system vendor.

### The Kernel

Both the `BIOS/UEFI` and the **bootloader** only run for a few seconds each;
now we are getting to **the first piece of software that runs for a longer time**, the **operating system kernel**.
This kernel assumes the role of a conductor in an orchestra, and ensures coordination between hardware and software.
This role involves several tasks including:
**driving hardware**, **managing processes**, **users and permissions**, the **filesystem**, and so on.
The **kernel** provides a common base to all other **programs** on the system.

这段理解：

- 1、BIOS/UEFI 和 bootloader 的运行只有几秒钟，第一个开始长时间运行的软件就是 operating system kernel
- 2、kernel 的作用：**driving hardware**, **managing processes**, **users and permissions**, the **filesystem**, and so on
- 3、kernel 为 program 提供了一个共同的基础

### The User Space (brief)

Although everything that happens outside of the kernel can be lumped together under “**user space**”,
we can still separate it into **software layers**.
However, their interactions are more complex than before, and the classifications may not be as simple.
An application commonly uses libraries, which in turn involve the kernel,
but the communications can also involve other programs, or even many libraries calling each other.

## Some Tasks Handled by the Kernel

### Driving the Hardware

The **kernel** is, first and foremost, tasked with controlling the **hardware** parts,
detecting them, switching them on when the computer is powered on, and so on.
It also makes them available to **higher-level software** with **a simplified programming interface**,
so applications can take advantage of devices without having to worry about details such as
which extension slot the option board is plugged into.
The **programming interface** also provides **an abstraction layer**;
this allows video-conferencing software, for example, to use a webcam independently of its make and model.
The software can just use the Video for Linux (V4L) interface,
and the **kernel** translates the **function calls of this interface** into
the **actual hardware commands** needed by the specific webcam in use.

这段理解：

- 1、hardware --> kernel (simplified programming interface) --> higher-level software
- 2、programming interface --> an abstraction layer

The **kernel** exports many details about **detected hardware** through the `/proc/` and `/sys/` virtual filesystems.
Several tools summarize those details.
Among them, `lspci` (in the `pciutils` package) lists PCI devices,
`lsusb` (in the `usbutils` package) lists USB devices,
and `lspcmcia` (in the `pcmciautils` package) lists PCMCIA cards.
These tools are very useful for identifying the exact model of a device.
This identification also allows more precise searches on the web, which in turn, lead to more relevant documents.

These programs have a `-v` option, that lists much more detailed (but usually not necessary) information.
Finally, the `lsdev` command (in the `procinfo` package) lists communication resources used by devices.

Applications often access **devices** by way of special files created within `/dev/`.
These are special files that represent **disk drives** (for instance, `/dev/hda` and `/dev/sdc`),
**partitions** (`/dev/hda1` or `/dev/sdc3`), **mice** (`/dev/input/mouse0` ), **keyboards** (`/dev/input/event0`),
**soundcards** ( `/dev/snd/*` ), **serial ports** ( `/dev/ttyS*` ), and so on.

### Filesystems

Filesystems are one of the most prominent aspects of the kernel.
Unix systems merge **all the file stores** into **a single hierarchy**,
which allows users (and applications) to **access data** simply by **knowing its location within that hierarchy**.

The starting point of this hierarchical tree is called the root, `/`.
This directory can contain named subdirectories.
For instance, the home subdirectory of `/` is called `/home/`.
This subdirectory can, in turn, contain other subdirectories, and so on.
Each directory can also contain files, where the actual data will be stored.
Thus, the `/home/rmas/Desktop/hello.txt` name refers to a file named `hello.txt`
stored in the `Desktop` subdirectory of the `rmas` subdirectory of the `home` directory present in the root.
The **kernel** translates between **this naming system** and **the actual, physical storage on a disk**.

Unlike other systems, there is **only one such hierarchy**, and it can **integrate data from several disks**.
**One of these disks** is used as the **root**,
and the others are “mounted” on directories in the hierarchy (the Unix command is called `mount`);
these other disks are then available under these “mount points”.
This allows storing **users' home directories** (traditionally stored within `/home/` ) on **a second hard disk**,
which will contain the `rhertzog` and `rmas` directories.
Once the disk is mounted on `/home/` , these directories become accessible at their usual locations,
and paths such as `/home/rmas/Desktop/hello.txt` keep working.

There are **many filesystem formats**, corresponding to **many ways of physically storing data on disks**.
The most widely known are `ext2`, `ext3` and `ext4`, but others exist.
For instance, `vfat` is the system that was historically used by DOS and Windows operating systems,
which allows using hard disks under Debian as well as under Windows.
In any case, **a filesystem** must be prepared on **a disk**
before it can be mounted and this operation is known as “formatting”.
Commands such as `mkfs.ext3` (where `mkfs` stands for MaKe FileSystem) handle formatting.
These commands require, as a parameter, **a device file**
representing the partition to be formatted (for instance, `/dev/sda1`).
This operation is destructive and should only be run once,
except if one deliberately wishes to wipe a filesystem and start afresh.

There are also **network filesystems**, such as `NFS`, where data is not stored on a local disk.
Instead, data is transmitted through the network to a server that stores and retrieves them on demand.
The filesystem abstraction shields users from having to care:
files remain accessible in their usual hierarchical way.

### Shared Functions

**Since a number of the same functions are used by all software, it makes sense to centralize them in the kernel.**

For instance, shared filesystem handling allows any application to simply open a file by name,
without needing to worry where the file is stored physically.
The file can be stored in several different slices on a hard disk,
or split across several hard disks, or even stored on a remote file server.

Shared communication functions are used by applications
to exchange data independently of the way the data is transported.
For instance, transport could be over any combination of local or wireless networks, or over a telephone landline.

### Managing Processes

A process is a running instance of a program.
This requires **memory** to store both **the program itself** and **its operating data**.
The **kernel** is in charge of creating and tracking them.
When a program runs, the **kernel** first sets aside **some memory**,
then loads the **executable code** from the filesystem into it, and then starts the code running.
It keeps information about this process,
the most visible of which is an identification number known as `pid` (**process identifier**).

这段理解：

- 1、process 的本质，就是 kernel 分配 some memory，然后将 executable code 加载进 memory 中，接着进行执行。
- 2、kernel 保存着 process 的相关信息，其中最显著的就是 pid

Unix-like kernels (including Linux), like most other modern operating systems, are capable of “multi-tasking”.
In other words, they allow running many processes “at the same time”.
**There is actually only one running process at any one time,
but the kernel cuts time into small slices and runs each process in turn**.
Since these time slices are very short (in the millisecond range),
they create the illusion of processes running in parallel,
although they are actually only active during some time intervals and idle the rest of the time.
The kernel's job is to adjust its scheduling mechanisms to keep that illusion,
while maximizing the global system performance.
If the time slices are too long, the application may not appear as responsive as desired.
Too short, and the system loses time switching tasks too frequently.
These decisions can be tweaked with **process priorities**.
High-priority processes will run for longer and with more frequent time slices than low-priority processes.

Of course, the kernel allows running several independent instances of the same program.
But each can only access its own time slices and memory.
Their data thus remain independent.

#### Multi-processor systems (and variants)

The limitation described above of only one process being able to run at a time, doesn't always apply.
The actual restriction is that there can only be one running process per processor core at a time.
Multi-processor, multi-core or “hyper-threaded” systems allow several processes to run in parallel.
The same time-slicing system is still used,
though, so as to handle cases where there are more active processes than available processor cores.
This is far from unusual: a basic system, even a mostly idle one, almost always has tens of running processes.

### Rights Management

Unix-like systems are also multi-user. 
They provide a **rights management system** that supports separate users and groups;
it also allows control over actions based on permissions.
The kernel manages data for each process, allowing it to control permissions.
Most of the time, a process is identified by the user who started it.
That process is only permitted to take those actions available to its owner.
For instance, trying to open a file requires the kernel to check the process identity against access permissions.

## The User Space

“**User space**” refers to the **runtime environment of normal** (as opposed to kernel) **processes**.
This does not necessarily mean these processes are actually started by users
because a standard system normally has several “daemon” (or background) processes running
before the user even opens a session.
**Daemon processes** are also considered **user-space processes**.

### Process

When the **kernel** gets past its **initialization phase**, it starts the very first process, `init`.
Process `#1` alone is very rarely useful by itself, and Unix-like systems run with many additional processes.

```bash
$ ps aux | head -n 2
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.0 204700  7000 ?        Ss   10:46   0:01 /sbin/init
```

First of all, **a process can clone itself** (this is known as a **fork**).
The **kernel** allocates **a new (but identical) process memory space**, and another process to use it.
At this time, the only difference between these two processes is their `pid`.
The new process is usually called **a child process**,
and the original process whose pid doesn't change, is called the **parent process**.

这段理解：

- 1、process 可以克隆自己，这种操作称之为“fork”。 kernel 会分配一块新的、大小相同的内存空间。
- 2、第一种情况：child process 和 parent process 运行相同的 program 和使用相同的 data，唯一的不同就是 pid。

Sometimes, the child process continues to lead its own life independently from its parent,
with its own data copied from the parent process.
In many cases, though, this child process executes another program.
With a few exceptions, its memory is simply replaced by that of the new program,
and execution of this new program begins.
This is the mechanism used by the `init` process (with process number `1`)
to start additional services and execute the whole startup sequence.
At some point, one process among `init`'s offspring starts a **graphical interface** for users to log in to.

这段理解：

- 1、第二种情况，child process 复制了 parent process 的 data，但却运行了其它的 program
- 2、第三种情况，child process 从 data 和 program 两方面都与 parent process 不同
- 3、kernel 启动的第 1 个 `init` process 的工作方式就是第三个情况，就是 `init` process 可以启动别的 service
- 4、一个例子就是，`init` process 会启动 GUI 的程序，让用户实现登录

When a process finishes the task for which it was started, it terminates.
The kernel then recovers the memory assigned to this process, and stops giving it slices of running time.
The parent process is told about its child process being terminated,
which allows a process to wait for the completion of a task it delegated to a child process.
This behavior is plainly visible in commandline interpreters (known as **shells**).
When a command is typed into a shell, the prompt only comes back when the execution of the command is over.
Most **shells** allow for **running the command in the background**,
it is a simple matter of adding an `&` to the end of the command.
The prompt is displayed again right away, which can lead to problems if the command needs to display data of its own.

### Daemons

A “daemon” is a process started automatically by the boot sequence.
It keeps running (in the background) to perform maintenance tasks or provide services to other processes.
This “background task” is actually arbitrary, and does not match anything particular from the system's point of view.
They are simply processes, quite similar to other processes, which run in turn when their time slice comes.
The distinction is only in the human language:
a process that runs with no interaction with a user (in particular, without any graphical interface)
is said to be running “in the background” or “as a daemon”.

Daemon, demon, a derogatory term?

- derogatory
    - 贬低的；贬义的 showing a critical attitude towards sb

- daemon
    - （古希腊神话中的）半神半人的精灵 a spirit in ancient Greek stories that is less important than a god or that protects a particular person or place

- demon
    - 恶魔；魔鬼 an evil spirit

Although **daemon** term shares its Greek etymology with **demon**,
the former does not imply diabolical evil, instead,
it should be understood as a kind of **helper spirit**.
This distinction is subtle enough in English;
it is even worse in other languages where the same word is used for both meanings.

- subtle
    - intelligent, experienced, or sensitive enough to make refined judgments and distinctions

- friend
    - 朋友；友人 a person you know well and like, and who is not usually a member of your family

- fiend
    - an evil supernatural being, especially a devil from hell
    - 恶魔般的人；残忍的人；令人憎恶的人 a very cruel or unpleasant person

### Inter-Process Communications

An isolated process, whether a daemon or an interactive application, is rarely useful on its own,
which is why there are several methods allowing separate processes to communicate together,
either to exchange data or to control one another.
The generic term referring to this is **inter-process communication**, or `IPC` for short.

这段理解：

- 1、一个孤立的 process，能够做的事情是很有限的，因此需要不同的 process 进行合作才能做更大的事情
- 2、IPC = Inter-Process Communications

The simplest `IPC` system is to use **files**.
The process that wishes to send data writes it into a file (with a name known in advance),
while the recipient only has to open the file and read its contents.

> 最简单的 IPC 形式就是使用文件。

In the case where you do not wish to store data on disk, you can use a **pipe**,
which is simply an object with **two ends**;
bytes written in one end are readable at the other.
If **the ends** are controlled by **separate processes**,
this leads to **a simple and convenient inter-process communication channel**.
**Pipes** can be classified into **two categories**: **named pipes**, and **anonymous pipes**.
A **named pipe** is represented by an entry on the filesystem (although the transmitted data is not stored there),
so both processes can open it independently if the location of the named pipe is known beforehand.
In cases where the communicating processes are related (for instance, a parent and its child process),
the parent process can also create an **anonymous pipe** before forking, and the child inherits it.
Both processes will then be able to exchange data through the pipe without needing the filesystem.

> 另一种 IPC 的形式是使用 pipe。

Not all inter-process communications are used to move **data** around, though.
In many situations, the only information that needs to be transmitted are **control messages**
such as “pause execution” or “resume execution”.
Unix (and Linux) provides a mechanism known as **signals**,
through which a process can simply send a specific signal
(chosen from a predefined list of signals) to another process.
The only requirement is to know the `pid` of the target.

> IPC，除了传递 data，也可以传递 signal。我的理解，signal 就是一种特殊的数据。

For more complex communications,
there are also mechanisms
allowing a process to **open access, or share, part of its allocated memory** to other processes.
Memory now shared between them can be used to move data between the processes.

> 共用内存

Finally, **network connections** can also help processes communicate;
these processes can even be running on different computers, possibly thousands of kilometers apart.

> 网络传输

It is quite standard for a typical Unix-like system to make use of all these mechanisms to various degrees.

#### A concrete example

Let's describe in some detail what happens when a complex command (a pipeline ) is run from a shell.
We assume we have a **bash process** (the standard user shell on Debian), with pid `4374`;
into this shell, we type the command: `ls | sort`.

The shell first interprets the command typed in.
In our case, it understands there are two programs ( `ls` and `sort` ),
with a data stream flowing from one to the other (denoted by the `|` character, known as **pipe** ).
`bash` first creates **an unnamed pipe** (which initially exists only within the **bash process** itself).

Then the shell clones itself; this leads to a new bash process, with pid `#4521`
(pids are abstract numbers, and generally have no particular meaning).
Process `#4521` inherits the pipe, which means it is able to write in its “input” side;
bash redirects its **standard output stream** to this pipe's input.
Then it executes (and replaces itself with) the `ls` program, which lists the contents of the current directory.
Since `ls` writes on its standard output,
and this output has previously been redirected, the results are effectively sent into the pipe.

A similar operation happens for the second command:
bash clones itself again, leading to a new bash process with pid `#4522`.
Since it is also a child process of `#4374`, it also inherits the pipe;
bash then connects its standard input to the pipe output,
then executes (and replaces itself with) the `sort` command,
which sorts its input and displays the results.

All the pieces of the puzzle are now set up:
`ls` reads the current directory and writes the list of files into the `pipe`;
`sort` reads this list, sorts it alphabetically, and displays the results.
Processes numbers `#4521` and `#4522` then terminate,
and `#4374` (which was waiting for them during the operation),
resumes control and displays the prompt to allow the user to type in a new command.

### Libraries

**Function libraries** play a crucial role in a Unix-like operating system.
They are not proper programs, since **they cannot be executed on their own, but collections of code fragments**
that can be used by standard programs.
Among the common libraries, you can find:

- the standard C library (glibc), which contains basic functions such as ones to open files or network connections,
  and others facilitating interactions with the kernel
- graphical toolkits, such as Gtk+ and Qt, allowing many programs to reuse the graphical objects they provide
- the `libpng` library, that allows loading, interpreting and saving images in the PNG format.

Thanks to those libraries, applications can reuse existing code.
Application development is simplified since many applications can reuse the same functions.
With libraries often developed by different persons,
the global development of the system is closer to Unix's historical philosophy.

Moreover, these libraries are often referred to as “**shared libraries**”,
since the kernel is able to only load them into memory once,
even if several processes use the same library at the same time.
This allows saving memory, when compared with the opposite (hypothetical) situation
where the code for a library would be loaded as many times as there are processes using it.

#### The Unix Way: one thing at a time

One of the fundamental concepts that underlies the Unix family of operating systems is that
**each tool should only do one thing, and do it well**;
applications can then reuse these tools to build more advanced logic on top.
This philosophy can be seen in many incarnations.

Shell scripts may be the best example:
they assemble complex sequences of very simple tools
(such as `grep` , `wc` , `sort` , `uniq` and so on).

Another implementation of this philosophy can be seen in code libraries:
the `libpng` library allows reading and writing PNG images,
with different options and in different ways, but it does only that;
no question of including functions that display or edit images.
