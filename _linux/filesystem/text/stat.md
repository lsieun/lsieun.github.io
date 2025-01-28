---
title: "stat"
sequence: "stat"
---

[UP](/linux.html)


`stat` is a command-line utility that displays detailed information about given files or file systems.

## Using the stat Command

The syntax for the `stat` command is as follows:

```text
stat [OPTION]... FILE...
```

`stat` accepts one or more input `FILE` names and includes a number of options that control the command behavior and output.

Let's take a look at the following example:

```bash
$ stat abc.txt
```

The output will look something like this:

```text
  File: 'abc.txt'
  Size: 31        	Blocks: 8          IO Block: 4096   regular file
Device: fd00h/64768d	Inode: 95342       Links: 1
Access: (0664/-rw-rw-r--)  Uid: ( 1000/  liusen)   Gid: ( 1000/  liusen)
Access: 2021-11-14 04:56:41.379582107 -0500
Modify: 2021-11-14 04:56:34.387124458 -0500
Change: 2021-11-14 04:56:34.388124523 -0500
 Birth: -
```

When invoked without any options, `stat` displays the following file information:

- File - The name of the file.
- Size - The size of the file in bytes.
- Blocks - The number of allocated blocks the file takes.
- IO Block - The size in bytes of every block.
- File type - (ex. regular file, directory, symbolic link.)
- Device - Device number in hex and decimal.
- Inode - Inode number.
- Links - Number of hard links.
- Access - File permissions in the numeric and symbolic methods.
- Uid - User ID and name of the owner .
- Gid - Group ID and name of the owner.
- Context - The SELinux security context.
- Access - The last time the file was accessed.
- Modify - The last time the file's content was modified.
- Change - The last time the file's attribute or content was changed.
- Birth - File creation time (not supported in Linux).

## Displaying Information About the File System

To get information about the **file system** where the given file resides,
instead of information about the **file** itself, use the `-f`, (`--file-system`) option:

```bash
$ stat -f abc.txt
```

The output of the command will look like this:

```text
  File: "abc.txt"
    ID: fd0000000000 Namelen: 255     Type: xfs
Block size: 4096       Fundamental block size: 4096
Blocks: Total: 4452864    Free: 3936230    Available: 3936230
Inodes: Total: 8910848    Free: 8852124
```

When `stat` is invoked with the `-f` option, it shows the following information:

- File - The name of the file.
- ID - File system ID in hex.
- Namelen - Maximum length of file names.
- Fundamental block size - The size of each block on the file system.
- Blocks:
  - Total - Number of total blocks in the file system.
  - Free - Number of free blocks in the file system.
- Available - Number of free blocks available to non-root users.
- Inodes:
  - Total - Number of total inodes in the file system.
  - Free - Number of free inodes in the file system.

## Inode

Every file and directory has an **inode**.
The **inode** holds metadata about the file,
such as which filesystem blocks it occupies, and the date stamps associated with the file.
The inode is like a library card for the file.
But `ls` will only show you some information.
To see everything, we need to use the `stat` command.
