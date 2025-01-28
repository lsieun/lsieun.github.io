---
title: "Redirecting Standard Error"
sequence: "103"
---

[UP](/bash.html)


## Redirecting Standard Output to One File

To redirect standard error, we must refer to its **file descriptor**. A program can produce output on any of several numbered file streams. While we have referred to **the first three of these file streams** as **standard input, output, and error**, the shell references them internally as file descriptors `0`, `1`, and `2`, respectively. The shell provides a notation for redirecting files using the file descriptor number. Because **standard error** is the same as file descriptor number `2`, we can redirect standard error with this notation:

```bash
ls -l /bin/usr 2> ls-error.txt
```

The file descriptor `2` is placed immediately before **the redirection operator**(`>`) to perform the redirection of **standard error** to the file `ls-error.txt`.

## Redirecting Standard Output and Standard Error to One File

There are cases in which we may want to capture all of the output of a command to a single file. To do this, we must redirect both **standard output** and **standard error** at the same time. There are two ways to do this.

### The First Way: traditional way

Shown here is the **traditional way**, which works with old versions of the shell:

```bash
ls -l /bin/usr > ls-output.txt 2>&1
```

Using this method, we perform **two redirections**. First we redirect **standard output** to the file `ls-output.txt`, and then we redirect file descriptor `2` (**standard error**) to file descriptor `1` (**standard output**) using the notation `2>&1`.

### The Order of the Redirections Is Significant

The **redirection of standard error** must always occur after **redirecting standard output** or it doesn't work.

The following example redirects standard error to the file `ls-output.txt`:

```bash
>ls-output.txt 2>&1
```

If the order is changed to the following, then standard error is directed to the screen:

```bash
2>&1 >ls-output.txt
```

Redirections are:

- processed from left to right.
- interpreted iteratively:
    - an earlier redirection can affect a later one
    - but not vice versa - a later redirection has no retroactive effect on the the target of an earlier redirection.
- Note, however, that output isn't actually sent until all redirections are in place, and that any redirection-target output files are created or truncated before command execution begins (this is the reason why you can't read from and redirect output to the same file with a single command).

### The Second Way: streamlined way

Recent versions of bash provide a second, more streamlined method for performing this combined redirection, shown here:

```bash
ls -l /bin/usr &> ls-output.txt
```

In this example, we use the single notation `&>` to redirect both **standard output** and **standard error** to the file `ls-output.txt`.

You may also **append** the **standard output** and **standard error** streams to a single file like so:

```bash
ls -l /bin/usr &>> ls-output.txt
```

## Disposing of Unwanted Output

Sometimes “silence is golden” and we don't want output from a command; we just want to throw it away. This applies particularly to error and status messages. The system provides a way to do this by redirecting output to a special file called `/dev/null`. This file is a system device often referred to as a bit bucket, which accepts input and does nothing with it. To suppress error messages from a command, we do this:

```bash
ls -l /bin/usr 2> /dev/null
```
