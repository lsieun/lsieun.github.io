---
title: "如何编写 Shell Script"
sequence: "101"
---

[UP](/bash.html)


一般经过三步：

- 第 1 步，编写 script
- 第 2 步，添加执行权限（Make the script executable）
- 第 2 步，将 script 放到合适的位置（Put the script somewhere the shell can find it）

## Script File Format

File: `hello_world`

```bash
#!/bin/bash
# This is our first script.
echo 'Hello World!'
```

第一行：The `#!` character sequence is, in fact, a special construct called a **shebang**.
The **shebang** is used to tell **the kernel** the name of **the interpreter**
that should be used to execute **the script** that follows.
Every shell script should include this as its first line.

第二行：Everything from the `#` symbol onward on the line is ignored.

## Executable Permissions

```text
$ ls -l hello_world
-rw-r--r-- 1 liusen liusen 60 Mar 31 15:47 hello_world

$ chmod 755 hello_world
$ ls -l hello_world
-rwxr-xr-x 1 liusen liusen 60 Mar 31 15:47 hello_world
```

There are two common permission settings for scripts:
`755` for scripts that everyone can execute and `700` for scripts that only the owner can execute.
Note that **scripts must be readable to be executed**.

## Script File Location

With the permissions set, we can now execute our script.

```text
$ ./hello_world
Hello World!
```

For the script to run, we must precede the script name with an explicit path. If we don't, we get this:

```text
$ hello_world
bash: hello_world: command not found
```

Why is this? What makes our script different from other programs?
As it turns out, nothing. Our script is fine. **Its location is the problem**.

The system searches a list of directories each time it needs to find an executable program,
if no explicit path is specified.

The `/bin` directory is one of the directories that the system automatically searches.
The list of directories is held within an environment variable named `PATH`.
The `PATH` variable contains a colon-separated list of directories to be searched.
We can view the contents of `PATH`.

```text
$ echo $PATH
/home/liusen/bin:/usr/local/bin:/usr/bin:/bin
```

Here we see our list of directories.
If our script were located in any of the directories in the list,
our problem would be solved.
Notice the first directory in the list, `/home/liusen/bin`.
Most Linux distributions configure the `PATH` variable
to contain a `bin` directory in **the user's home directory** to allow users to execute their own programs.
So, if we create the `bin` directory and place our script within it, it should start to work like other programs.

```text
$ mkdir ~/bin
$ mv hello_world ~/bin
$ hello_world
Hello World!
```

If the `PATH` variable does not contain the directory,
we can easily add it by including this line in our `.bashrc` file:

```text
export PATH=~/bin:"$PATH"
```

After this change is made, it will take effect in each new terminal session.
To apply the change to the current terminal session,
we must have the shell reread the `.bashrc` file. This can be done by “sourcing” it.

```text
$ . .bashrc
```
