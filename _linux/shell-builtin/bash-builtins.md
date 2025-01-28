---
title: "Bash Builtins"
---

[UP](/linux.html)


A **builtin** is a command contained within the Bash tool set, literally **built in**.
This is either for **performance reasons** -- **builtins** execute faster than **external commands**,
which usually require forking off a separate process -- or
because **a particular builtin needs direct access to the shell internals**.

这段理解，builtin command 存在的原因有两个：

- （1） performance reasons -- builtins execute faster than external commands
- （2） a particular builtin needs direct access to the shell internals

```text
$ type echo
echo is a shell builtin
```

## I/O

### echo

prints (to stdout) an expression or variable

```bash
echo Hello
echo $a
```

### printf

The `printf`, formatted print, command is an enhanced `echo`. It is a limited variant of the C language `printf()` library function, and its syntax is somewhat different.

语法：

```bash
printf format-string... parameter...
```

### read

"Reads" the value of a variable from `stdin`, that is, interactively fetches input from the keyboard.

## Filesystem

### cd

The familiar `cd` change directory command finds use in scripts where execution of a command requires being in a specified directory.

- `cd -`: changes to `$OLDPWD`, the previous working directory.

### pwd

Print Working Directory. This gives the user's (or script's) current directory. The effect is identical to reading the value of the builtin variable `$PWD`.

## Variables

### let

The `let` command carries out arithmetic operations on variables. In many cases, it functions as a less complex version of `expr`.

### eval

### set

### unset

### export

The `export` command makes available variables to all child processes of the running script or shell. One important use of the `export` command is in startup files, to initialize and make accessible environmental variables to subsequent user processes.

Unfortunately, **there is no way to export variables back to the parent process**, to the process that called or invoked the script or shell.

## Script Behavior


### exit

Unconditionally terminates a script. The `exit` command may optionally take an integer argument, which is returned to the shell as the "exit status" of the script. It is good practice to end all but the simplest scripts with an `exit 0`, indicating a successful run.

If a script terminates with an `exit` lacking an argument, the exit status of the script is the exit status of the last command executed in the script, not counting the `exit`. This is equivalent to an `exit $?`.

### exec

## Commands

### true

### false

### type [cmd]

Similar to the `which` external command, `type cmd` identifies "cmd." Unlike `which`, `type` is a Bash builtin. The useful `-a` option to `type` identifies `keywords` and `builtins`, and also locates system commands with identical names.

### help

Gets a short usage summary of a shell builtin. This is the counterpart to `whatis`, but for builtins. The display of `help` information got a much-needed update in the **version 4 release of Bash**.

可以通过 `bash --version` 来查看 bash 的版本信息。

## Reference

- [Internal Commands and Builtins](http://tldp.org/LDP/abs/html/internal.html)
