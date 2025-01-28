---
title: "gzip"
sequence: "gzip"
---

[UP](/linux.html)


The `gzip` command is a common way of compressing files within Linux and
therefore it is worth knowing how to compress files using this tool.

## 1. Command Basic: Compresse And Uncompress

### 1.1. How to Compress a File Using gzip

The simplest way to compress a single file using `gzip` is to run the following command:

```bash
gzip filename
```

Imagine now that you wanted to compress all of the images in a folder. You could use the following command:

```bash
gzip *.png *.jpg *.bmp
```

### 1.2. How to Keep the Uncompressed File

By default when you compress a file using the `gzip` command you end up with a new file with the extension `.gz`.

If you want to compress the file and keep the original file you have to run the following command:

```bash
gzip -k filename
```

### 1.3. How to decompress a File Using the gzip Command

If you have a file that has already been compressing you can use the following command to decompress it.

```bash
gzip -d filename.gz
```

或者

```bash
gunzip filename.gz
```

## 2. Command Advanced

### 2.1. Get Some Stats About How Much Space You Saved

The whole point of compressing files is about saving disk space or
to reduce the size of a file prior to sending it over a network.

It would be good therefore to see how much space was saved when you use the `gzip` command.

The `gzip` command provides the kind of statistics you require when checking for compression performance.

To get the list of statistics run the following command:

```bash
gzip -l filename.gz
```

The information returned by the above command is as follows:

- Compressed size;
- Uncompressed size;
- Ratio as a percentage;
- Uncompressed filename.

### 2.2. Compress Every File in a Folder and Subfolders

You can compress every file in a folder and its subfolders by using the following command:

```bash
gzip -r foldername
```

This doesn't create one file called `foldername.gz`.
Instead, it traverses the directory structure and compresses each file in that folder structure.

### 2.3. How to Test the Validity of a Compressed File

If you want to check that a file is valid, you can run the following command:

```bash
gzip -t filename
```

If the file is valid there will be no output.

### 2.4. How to Change the Compression Level

You can compress a file in different ways.
For instance, you can go for a smaller compression which will work faster or
you can go for maximum compression which has the tradeoff of taking longer to run.

To get **minimum compression** at the fastest speed run the following command:

```bash
gzip -1 filename
```

To get **maximum compression** at the slowest speed run the following command:

```bash
gzip -9 filename
```

You can vary the speed and compression level by picking different numbers between `1` and `9`.

## 3. Compress Info

### 3.1. compress target

The `gzip` command will only attempt to compress regular files and folders.
Therefore if you try and compress a symbolic link it will not work and it really doesn't make sense to do so.

### 3.2. compress filename

By default when you compress a file or folder using the `gzip` command
it will have the same file name as it did before but now it will have the extension `.gz`.

> 一般性的命名规则

In some cases, it isn't possible to keep the same name especially if the file name is incredibly long.
In these circumstances, it will try to truncate it.

> 特殊性的命名规则

### 3.3. compress ratio

Some files compress better than others.
For example documents, text files, bitmap images,
certain audio and video formats such as WAV and MPEG compress very well.

> 文件类型不同，压缩比率也不同。

Other file types such as JPEG images and MP3 audio files do not compress at all well and
the file may actually increase in size after running the `gzip` command against it.

> 压缩比例较低的文件

The reason for this is that JPEG images and MP3 audio files are already compressed and
therefore the `gzip` command simply adds to it rather than compressing it.

> 解释原因
