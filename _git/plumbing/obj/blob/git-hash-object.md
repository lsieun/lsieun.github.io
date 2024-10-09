---
title: "git hash-object"
sequence: "101"
---

[UP](/git/git-index.html)


```bash
$ echo "hello world" > hello.txt
$ git hash-object hello.txt 
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
```

```bash
$ echo "hello world" | git hash-object --stdin
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
```


```bash
$ echo "hello world" | git hash-object -w --stdin
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
```

The `-w` tells `hash-object` to store the object; otherwise, the command simply tells you what the key would be.
`--stdin` tells the command to read the content from stdin; if you don't specify this, `hash-object` expects a file path at the end.
The output from the command is a 40-character checksum hash.
This is the SHA-1 hash – a checksum of the content you're storing plus a header, which you'll learn about in a bit.
Now you can see how Git has stored your data:

```bash
$ echo "hello world" > hello.txt
$ git hash-object hello.txt 
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ find .git/objects/
.git/objects/
.git/objects/pack
.git/objects/info
$ git hash-object -w hello.txt 
3b18e512dba79e4c8300dd08aeb37f8e728b8dad
$ find .git/objects/
.git/objects/
.git/objects/pack
.git/objects/info
.git/objects/3b
.git/objects/3b/18e512dba79e4c8300dd08aeb37f8e728b8dad
```
