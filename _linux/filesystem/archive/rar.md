---
title: "rar"
sequence: "rar"
---

[UP](/linux.html)


URL:

- https://superuser.com/questions/1072342/how-to-open-rar-file-in-fedora-23

Install the `unar` package.

```bash
$ sudo dnf info unar
...
Name         : unar
Version      : 1.10.1
Release      : 7.fc28
Arch         : x86_64
Size         : 4.8 M
Source       : unar-1.10.1-7.fc28.src.rpm
Repo         : @System
From repo    : fedora
Summary      : Multi-format extractor
URL          : http://unarchiver.c3.cx/commandline
License      : LGPLv2+
Description  : The command-line utilities lsar and unar are capable of listing and extracting
             : files respectively in several formats including RARv5, RAR support includes
             : encryption and multiple volumes, unar can serve as a free and open source
             : replacement of unrar.

$ sudo dnf install unar
```

The Archive Manager (gui application) will be able to open `.rar` files.

```bash
$ sudo apt install unrar rar
```

## Create

```bash
$ rar a myfile hello.txt
```

> 注意：myfile 不需要添加 `.rar` 的后缀

## Extract

```bash
$ rar x myfile.rar
```
