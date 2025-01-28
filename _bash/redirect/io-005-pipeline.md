---
title: "Pipelines"
sequence: "105"
---

[UP](/bash.html)


The capability of commands to read data from standard input and send to standard output is utilized by a shell feature called **pipelines**.

Using the pipe operator `|`, the standard output of one command can be piped into the standard input of another.

```bash
command1 | command2
```

```bash
ls -l /usr/bin | less
```

This is extremely handy! Using this technique, we can conveniently examine the output of any command that produces standard output.

以前的时候，我想 `/usr/bin` 能有多少程序呢，还用 less 来查看，真是大惊小怪。后来一看，真是吓一跳。

```bash
$ ls -l /usr/bin | wc -l
2085
```

## Filters

Pipelines are often used to perform **complex operations on data**. It is possible to put **several commands** together into a **pipeline**. Frequently, **the commands** used this way are referred to as **filters**. Filters take input, change it somehow, and then output it.

```bash
ls /bin /usr/bin | sort | less
```

### uniq: Report or Omit Repeated Lines

```bash
$ mkdir dir{a,b}
$ touch dira/{a,b,e,f}
$ touch dirb/{b,c,d,g}

# 查看生成的文件
$ tree dir*
dira
├── a
├── b
├── e
└── f
dirb
├── b
├── c
├── d
└── g

0 directories, 8 files
```

we use `uniq` to remove any duplicates from the output of the `sort` command.

```bash
$ ls ./dira ./dirb | sort | uniq | less

a
b
c
d
./dira:
./dirb:
e
f
g
```

If we want to see **the list of duplicates** instead, we add the `-d` option to `uniq` like so:

```bash
$ ls ./dira ./dirb | sort | uniq -d
b
```

### wc: Print Line, Word, and Byte Counts

```bash
ls /bin /usr/bin | sort | uniq | wc -l
```

### grep: Print Lines Matching a Pattern

```bash
ls /bin /usr/bin | sort | uniq | grep zip
```

There are a couple of handy options for grep .

- `-i` , which causes grep to **ignore case** when performing the search (normally searches are case sensitive)
- `-v` , which tells grep to **print only those lines that do not match the pattern**

### head/tail: Print First/Last Part of Files

```bash
ls /usr/bin | tail -n 5
```

### tee: Read from Stdin and Output to Stdout and Files

The `tee` program reads **standard input** and copies it to both **standard output** (allowing the data to continue down the pipeline) and to **one or more files**. This is useful for capturing a pipeline's contents at an intermediate stage of processing.

```bash
ls /usr/bin | tee ls.txt | grep zip
```
