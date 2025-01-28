---
title: "tar"
sequence: "tar"
---

[UP](/linux.html)


According to Wikipedia, a **tarball** is a computer file format
that can combine multiple files into a single file called "tarball", usually compressed.

> 注：tar 的目的，将一组文件聚合成一个文件

In the past, tar files were created for storing data to tapes and the term **tar** stands for **tape archive**.
Whilst it can still be used for this purpose,
the concept of a tar file is simply a way to group lots of files together in one archive.

> 注：在过去，名字的由来；重申一次 tar 的目的，将一组文件聚合成一个文件

## 1. Quick Start

- `-z`: Filter the archive through gzip.
- `-j`： Filter the archive through bzip2。
- `-t`: List the contents of an archive.
- `-c`: Create a new archive.
- `-C`: Change to DIR before performing any operations.

### 1.1. create

压缩某一类文件：

```bash
tar -zcvf my.tar.gz *.txt
```

### 1.2. view

To view a tar archive, use the `t`(for **tell**) option:

```bash
tar -ztvf my.tar.gz
tar -ztf images.tar.gz
```

### 1.3. extract

```bash
cd test
tar -zxvf my.tar.gz
```

```bash
tar -zxvf idea.jar -C ~/Software/IDEA
```

## 2. Step By Step

### 2.1. How to Create tar.gz Files

A tar file on its own is not compressed.

If you have a folder full of images you can create a tar file for the images using the following command:

```bash
tar -cvf images.tar ~/Pictures
```

Now that you have a single file with all of your images you can now compress it using the `gzip` command:

```bash
gzip images.tar
```

The filename for the images file will now be `images.tar.gz`.

You can create a tar file and compress it using a single command as follows:

```bash
tar -cvzf images.tar.gz ~/Pictures
```

### 2.2. How to Extract tar.gz Files

The first thing to do then to extract a tar.gz file is to decompress the file as follows:

```bash
gunzip images.tar.gz
```

To extract the files from a tar file use the following command:

```bash
tar -xvf images.tar
```

You can, however, decompress the gzip file and extract the files from the tar file using a single command as follows:

```bash
tar -xvzf images.tar.gz
```
