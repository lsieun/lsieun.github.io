---
title: "find"
sequence: "find"
---

[UP](/linux.html)


The beauty of `find` is that it can be used to **identify files that meet specific criteria**.
It does this through the (slightly strange) application of **options**, **tests**, and **actions**.

查找：

- 文件名
- 文件类型
- 逻辑（或、非）：文件名、文件类型
- 时间：访问时间（文件内容）、修改时间（文件内容）、改变时间（元数据：文件名、文件大小、权限等）
- 用户和用户组
- 文件大小

## Tests

### file name

- `-name pattern`: Base of file name.
- `-iname` pattern Like the `-name` test but case-insensitive.

The metacharacters (`*`, `?`, and `[]`) match a `.` at the start of the base name.

按**文件名**查找，默认查找「当前目录及其子目录」，命令如下：

```bash
cd /usr
find /bin -name bash      # 查找特定的文件名
find /bin -name bash*     # 在当前目录查找
find /tmp -name a*        # 在/tmp 目录查找

$ find /bin -name "[a-z]ash"
/bin/bash
/bin/dash
```

### file type

按**文件类型**查找，命令如下：

```bash
find . -type f    # To find all files in a location
find . -type d    # To find all directories in a location
find . -type f,d  # 同时查找普通文件和目录
```

The Common File Type:

- `b`: block (buffered) special
- `c`: character (unbuffered) special
- `d`: directory
- `f`: regular file
- `l`: symbolic  link

下面几个并不常用：

- `p`: named pipe (FIFO)
- `s`: socket
- `D`: door (Solaris)

To search for more than one type at once, you can supply the combined list of type letters separated by a comma `,` (GNU extension).

### file size

- `-size n`: Match files of size n.
- `-empty`: Match empty files and directories.

```bash
find /home -empty         # 查找空文件或文件夹
find /home ! -empty       # 查找不空的文件或文件夹

find /home -size -512k    # 查找小于 512k 的文件
find /home -size +512k    # 查找大于 512k 的文件夹
```

关于 `-size` 选项：

```txt
-size [+-]n[cwbkMG]
```

The leading sign:

- The leading plus sign(`+`) indicates that we are looking for files **larger than** the specified number.
- A leading minus sign(`-`) would change the meaning of the string to be **smaller than** the specified number.
- Using no sign means "match the value exactly."

File uses `n` units of space, rounding up. The following suffixes can be used:

- `b`: for 512-byte blocks (this is the default if no suffix is used)
- `c`: for bytes
- `w`: for two-byte words
- `k`: for Kilobytes (units of 1024 bytes)
- `M`: for Megabytes (units of 1048576 bytes)
- `G`: for Gigabytes (units of 1073741824 bytes)

More Example: 拿着 `find` 命令到处敲敲打打

```bash
find /home -size -25k ! -empty
find /home -size -25k ! -empty -type f
```

### file time

Hi, Hi, Hi!!!`find` 命令可以根据三种访问时间来查找

| 命令选项       | 时间类型   | 时间单位     | 命令说明                      |
|------------|--------|----------|---------------------------|
| `-amin n`  | Access | `n` 分钟    | 查找系统中最后 `n` 分钟访问的文件         |
| `-atime n` | Access | `n*24` 小时 | 查找系统中最后 `n*24` 小时访问的文件      |
| `-mmin n`  | Modify | `n` 分钟    | 查找系统中最后 `n` 分钟被改变文件数据的文件    |
| `-mtime n` | Modify | `n*24` 小时 | 查找系统中最后 `n*24` 小时被改变文件数据的文件 |
| `-cmin n`  | Change | `n` 分钟    | 查找系统中最后 `n` 分钟被改变文件状态的文件    |
| `-ctime n` | Change | `n*24` 小时 | 查找系统中最后 `n*24` 小时被改变文件状态的文件 |

同时要注意：`+n` 和 `-n` 的区别。例如

- 使用 `-amin +5` 表示 5 分钟之前访问的文件
- 使用 `-amin -5` 表示 5 分钟以内访问的文件

与别的文件进行对比：

- `-cnewer file`: Match files or directories whose contents or attributes were last modified more recently than those of `file`.
- `-newer file` Match files and directories whose contents were modified more recently than the specified `file`. This is useful when writing shell scripts that perform file backups. Each time you make a backup, update a file (such as a log) and then use find to determine which files have changed since the last update.

### file user and group

#### user and group

直接根据用户名和用户组进行查询：

```bash
find /home -user liusen    # 根据用户进行查询
find /home -group tomcat   # 根据属组进行查询
```

#### uid and gid

查询用户 ID：

```bash
$ id    # 查询当前用户 ID
uid=1000(liusen) gid=1000(liusen) groups=1000(liusen),10(wheel),977(vboxusers)

$ id liusen    # 查询指定用户名的 ID
uid=1000(liusen) gid=1000(liusen) groups=1000(liusen),10(wheel),977(vboxusers)

$ id root
uid=0(root) gid=0(root) groups=0(root)
```

根据用户 ID 和用户组 ID 查询：

```bash
find ./ -uid 1000
find ./ -gid 1000
```

### file permission

- `-perm mode`: Match files or directories that have permissions set to the specified `mode`. `mode` can be expressed by either **octal or symbolic notation**.
- `-perm -mode`： All of the permission bits mode are set for the file.  Symbolic modes are accepted in this form, and this is usually the way in which you would want to use them. You must specify `u`, `g` or `o` if you use a symbolic mode.

- `-perm -g=w`, which matches any file with **group write** permission.

```bash
$ find . -type f -perm 0755 # <=== 注意：由于是八进制，所以以 0 开头
./function_demo
./sys_info_page

$ find . -type f -perm -u+x # <=== 注意：-u+x 中的"-"不能缺少
./function_demo
./local-vars
./sys_info_page

$ find . -type f -perm -u=rwx
./function_demo
./local-vars
./sys_info_page
```

- `-readable`: Matches files which are readable.
- `-writable`: Matches files which are writable.
- `-executable`: Matches files which are executable and directories which are searchable.

List all executable files:

```bash
$ find . -type f -executable
./function_demo
./local-vars
./sys_info_page
```

## Operators(logical relationships)

Fortunately, `find` provides a way to combine tests using **logical operators** to create more complex logical relationships.

We would look for all the files with permissions that are not `0600` and the directories with permissions that are not `0700`.(注：因为是八进制，所以以 `0` 开头)

```bash
find ~ \( -type f -not -perm 0600 \) -or \( -type d -not -perm 0700 \)
```

Logical Operators

- `-and`: Match if the tests on both sides of the operator are true. This can be shortened to `-a`. Note that when no operator is present, `-and` is implied **by default**.
- `-or`: Match if a test on either side of the operator is true. This can be shortened to `-o`.
- `-not`: Match if the test following the operator is false. This can be abbreviated with an exclamation point (`!`).
- `( )`: Group tests and operators together to form larger expressions. By default, find evaluates from left to right. It is often necessary to override the default evaluation order to obtain the desired result. Even if not needed, it is helpful sometimes to include the grouping characters to improve the readability of the command. Note that since **the parentheses have special meaning to the shell**, **they must be quoted** when using them on the command line to allow them to be passed as arguments to `find`. Usually the **backslash** character is used to escape them.

使用逻辑“或”、“非”

```bash
find /tmp -name "a*" -o -name "b*"     # 查找以 a 开头或 b 开头的文件或目录（逻辑“或”）
find /tmp -name "a*" ! -type f         # 查找以 a 开头的非文件（逻辑“非”）
```

注意，默认情况下就是“且”，例如：

```bash
find /tmp -name "a*" -type f           # 查找以 a 开头的文件（注意：类型是文件）
find /tmp -name "a*" -type s           # 查找以 a 开头的套接字
```

## Actions

### Predefined Actions

Predefined find Actions

- `-delete`: Delete the currently matching file.
- `-ls`: Perform the equivalent of `ls -dils` on the matching file. Output is sent to
  standard output.
- `-print`: Output the full pathname of the matching file to standard output. This is
  **the default action** if no other action is specified.
- `-quit`: Quit once a match has been made.

### User-Defined Actions

In addition to the predefined actions, we can also invoke arbitrary commands.

**The traditional way** of doing this is with the `-exec` action. This action works like this:

```bash
-exec command {} ;
```

Here, `command` is the name of a command, `{}` is a symbolic representation of the current pathname, and the **semicolon** is a required delimiter indicating the end of the command.

Here's an example of using `-exec` to act like the `-delete` action discussed earlier:

```bash
-exec rm '{}' ';'
```

Again, because the **brace** and **semicolon** characters have special meaning to the shell, they must be **quoted** or **escaped**.

It's also possible to execute a user-defined action interactively. By using the `-ok` action in place of `-exec`, the user is prompted before execution of each specified command.

```bash
$ find . -type f -name "foo*" -ok ls -l '{}' ';'
< ls ... ./foo > ? y
-rw-r--r-- 1 liusen liusen 0 Oct 25 02:03 ./foo
< ls ... ./foo.txt > ? y
-rw-r--r-- 1 liusen liusen 0 Oct 25 02:03 ./foo.txt
```

### Improving Efficiency

When the `-exec` action is used, it launches a new instance of the specified command each time a matching file is found. There are times when we might prefer to combine all of the search results and launch a single instance of the command.

For example, rather than executing the commands like this:

```bash
ls -l file1
ls -l file2
```

we may prefer to execute them this way:

```bash
ls -l file1 file2
```

This causes the command to be executed only one time rather than multiple times.

There are two ways we can do this: **the traditional way**, using the external command `xargs`, and **the alternate way**, using a new feature in `find` itself. We'll talk about the alternate way first.

#### the alternate way

By changing the trailing **semicolon** character to a **plus** sign, we activate the capability of `find` to combine **the results of the search** into **an argument list** for a single execution of the desired command.

Returning to our example, this will execute `ls` each time a matching file is found:

```bash
find ~ -type f -name 'foo*' -exec ls -l '{}' ';'
```

By changing the command to the following:

```bash
find ~ -type f -name 'foo*' -exec ls -l '{}' +
```

#### the traditional way: xargs

The `xargs` command performs an interesting function. It accepts **input** from **standard input** and converts it into **an argument list** for a specified command.

With our example, we would use it like this:

```bash
find ~ -type f -name 'foo*' -print | xargs ls -l
```

While the number of arguments that can be placed into a command line is quite large, it's not unlimited. It is possible to create commands that are too long for the shell to accept. When a command line exceeds the maximum length supported by the system, `xargs` executes the specified command with the maximum number of arguments possible and then repeats this process until standard input is exhausted.

To see the maximum size of the command line, execute `xargs` with the `--show-limits` option.

```bash
$ xargs --show-limits
Your environment variables take up 3159 bytes
POSIX upper limit on argument length (this system): 2091945
POSIX smallest allowable upper limit on argument length (all systems): 4096
Maximum length of command we could actually use: 2088786
Size of command buffer we are actually using: 131072
Maximum parallelism (--max-procs must be no greater): 2147483647
```

### Find and Copy

Actually, in two ways you can process `find` command output in `copy` command

If `find` command's output **doesn't contain any space** i.e if file name doesn't contain space in it then you can use below mentioned command:

Syntax: `find <Path> <Conditions> | xargs cp -t <copy file path>`

Example: `find -mtime -1 -type f | xargs cp -t inner/`

But most of the time our production data files **might contain space** in it. So most of time below mentioned command is safer:

Syntax: `find <path> <condition> -exec cp '{}' <copy path> \;`

Example: `find -mtime -1 -type f -exec cp '{}' inner/ \;`

In the second example, last part i.e **semi-colon** is also considered as part of `find` command, that **should be escaped** before press the **enter** button. Otherwise you will get an error something like this

```txt
find: missing argument to `-exec'
```

举例子说明

Run the following command to find and copy all files that matches with extension `.mp3`.

```bash
find . -iname '*.mp3' -exec cp {} /home/sk/test2/ \;
```

Let us break down the above command and see what each option does.

- `find` – It's the command to find files and folders in Unix-like systems.
- `-iname '*.mp3'` – Search for files matching with extension `.mp3`.
- `-exec cp` – Tells you to execute the 'cp' command to copy files from source to destination directory.
- `{}` – is automatically replaced with the file name of the files found by `find` command.
- `/home/sk/test2/` – Target directory to save the matching files.
- `\;` – Indicates it that the commands to be executed are now complete, and to carry out the command again on the next match.

```bash
find . -type f -name "*.mp3" -exec cp {} /tmp/MusicFiles \;
```

As a result, **if there are duplicate file names, some of the files will be lost**.

If you don't want to overwrite existing files, use the `cp -n` command, like this:

```bash
find . -type f -name "*.mp3" -exec cp -n {} /tmp/MusicFiles \;
```

The `-n` option of the `cp` command means "**no clobber**," and you can also type that as `cp --no-clobber` on some systems, such as Linux. (The `-n` option appears to work on MacOS systems, but `--no-clobber` does not.) **Be sure to test this command before using it on something important**; I haven't tested it yet, I just read the man page for the `cp` command.)

### Find and Move

I had a bunch of files (with unique names) in subdirectories, and used this command to copy them all to the current directory:

```bash
find . -type f -exec mv {} . \;
```

As before, this is a dangerous command, so be careful. With this command, if you have **duplicate filenames**, you will **definitely lose data** during the move operations.

## Logical Relationships between Tests and Actions

The following command will look for every regular file (`-type f`) whose name ends with `.bak` (`-name '*.bak'`) and will output the relative pathname of each matching file to standard output (`-print`).

```bash
find ~ -type f -name '*.bak' -print
```

However, the reason the command performs the way it does is determined by the **logical relationships** between each of the **tests** and **actions**.

Remember, there is, by default, an implied `-and` relationship between each **test** and **action**. We could also express the command this way to make the logical relationships easier to see:

```bash
find ~ -type f -and -name '*.bak' -and -print
```

Because the **logical relationship** between the **tests** and **actions** determines which of them are performed, we can see that **the order of the tests and actions is important**. For instance, if we were to reorder the tests and actions so that the `-print` action was the first one, the command would behave much differently.

```bash
find ~ -print -and -type f -and -name '*.bak'
```

This version of the command will **print each file** (the `-print` action always evaluates to `true`) and then **test for file type** and **the specified file extension**.

## Options

Finally, we have the options, which are used to control **the scope** of a `find` search.

Commonly Used find Options:

- `-depth`: Direct `find` to process a directory's files before the directory itself<sub>先处理目录下的文件，再处理目录</sub>. This option is automatically applied when the `-delete` action is specified.
- `-maxdepth levels`: Set the maximum number of levels that find will descend into a directory tree when performing tests and actions.
- `-mindepth levels`: Set the minimum number of levels that find will descend into a directory tree before applying tests and actions.
- `-mount`: Direct `find` not to traverse directories that are mounted on other file systems.
- `-noleaf` Direct `find` not to optimize its search based on the assumption that it is searching a Unix-like file system. This is needed when scanning DOS/Windows file systems and CD-ROMs.

```bash
$ find . -maxdepth 1 -type f -name "*.txt"
./lazy_dog.txt
./url.txt
./foo.txt
```

## Find And Grep

查找所有 `.h` 文件中的含有 `helloworld` 字符串的文件（组合命令）：

```text
find /PATH -name "*.h" -exec grep -in "helloworld" {} \;

find /PATH -name "*.h" | xargs grep -in "helloworld"
```

```text
find ./ -name "*.java" | xargs grep -in "helloworld"
```

查找所有 `.h` 和 `.c` 文件中的含有 `helloworld` 字符串的文件：

```text
find /PATH /( -name "*.h" -or -name "*.c" /) -exec grep -in "helloworld" {} \;
```

查找非备份文件中的含有 `helloworld` 字符串的文件：

```text
find /PATH /( -not -name "*~" /) -exec grep -in "helloworld" {} \;
```

注：`/PATH` 为查找路径，默认为当前路径。带 `-exec` 参数时必须以 `\;` 结尾，否则会提示 “find: 遗漏 -exec 的参数”。

## Examples

```bash
mkdir -p playground/dir-{001..100}
touch playground/dir-{001..100}/file-{A..Z}
```

Count

```bash
find . -type f | wc -l    # To find the number of files in a location
find . -type f | grep "jpg" | wc -l    # To find the number of "jpg" files in a location
```

To find files of size between 1 MB and 2 MB in a location:

```bash
find . -type f -size +1M -size -2M
```

copy all files of size between 1 and 2 MB to another location

```bash
find . -type f -size +1M -size -2M -exec cp {} ~/my_files/ \;
```

Here `{}` contains the results of the `find`. The last `;` is also required and **has to be escaped**.
