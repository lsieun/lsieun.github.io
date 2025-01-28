---
title: "javac Multiple Sources"
sequence: "103"
---

- 包含依赖的Jar文件，也是需要考虑的
- 输出目录
- current dir
  - src
  - out

Sometimes, there just a few file, 10 or 20 java files. 安装Ant或Maven等编译工具似乎并不是需要的。

注意，我们执行命令在当前的目录当中

- compile a single file
- compile multiple file in flat directory
- compile multiple file in hierachy directory

```text
$ javac -d ./out/ ./src/com/baeldung/MyClass.java
```

```text
$ javac -d ./out/ \
./src/com/baeldung/MyClass.java \
./src/com/baeldung/YourClass.java \
./src/com/baeldung/HerClass.java \
./src/com/baeldung/HisClass.java
```


```text
$ javac -sourcepath ./src/ -d ./out/ ./src/com/baeldung/Main.java
```

```text
$ javac -implicit:none -sourcepath ./src/ -d ./out/ ./src/com/baeldung/Main.java
```

```text
$ javac -cp ./src/ -d ./out/ ./src/com/baeldung/Main.java
```

```text
$ javac -d ./out/ ./src/com/baeldung/*.java
```

```text
$ javac -d ./out/ \
./src/com/baeldung/*.java \
./src/com/baeldung/spring/*.java \
./src/com/baeldung/summer/*.java \
./src/com/baeldung/autumn/*.java \
./src/com/baeldung/winter/*.java
```

```text
$ find ./src/ -type f -name "*.java" > sources.txt
$ javac -d ./out/ @sources.txt
```

```text
> dir /b /s | findstr /IRC:"\.java" | find /i "\src\" > sources.txt
> javac -d ./out/ @sources.txt
```

```text
javac com/vistas/util/*.java com/vistas/converter/*.java
      com.vistas.LineHelper/*.java com/current/mdcontect/*.java
```

If you can create a list of all the `*.java` files in your project, it's easy:

```text
# Linux / MacOS
$ find -name "*.java" > sources.txt
$ javac @sources.txt
```

```text
:: Windows
> dir /s /B *.java > sources.txt
> javac @sources.txt
```

```text
$ javac @sources.txt
```

The **advantage** is that is is a quick and easy solution.

The **drawback** is that you have to regenerate the `sources.txt` file each time you create a new source or
rename an existing one file which is an easy to forget (thus error-prone) and tiresome task.

When using `javac`, it would be better to specify an output directory.

```text
find -name "*.java" > sources.txt && javac -d bin @sources.txt
```

Otherwise *.class files are saved to the directory where sources are.

## sourcepath

In the usual case where you want to compile your whole project you can simply supply javac with your main class and let it compile all required dependencies:

```text
javac -sourcepath . path/to/Main.java
```


## Linux

### Partial Compiling

If all you want to do is run your main class (without compiling the `.java` files on which the main class doesn't depend), then you can do the following:

```text
javac -cp <root-package-directory> <complete-path-to-main-class>
```

```text
javac -cp ./src/ ./src/path/to/Main.java -d ./out/
```

### find

```text
$ find ./src/ -type f -name "*.java" | xargs javac -cp ./src/ -d ./out/
```

```text
$ find ./src/ -type f -name "*.java" -exec javac -cp ./src/ -d ./out/ '{}' ';'
```

```text
$ find ./src/ -type f -name "*.java" -exec javac -cp ./src/ -d ./out/ '{}' +
```

```text
javac -cp ".:lib/*" -d bin $(find ./src/* | grep .java)
```

There is a way to do this without using a pipe character, which is convenient if you are forking a process from another programming language to do this:

```text
find $JAVA_SRC_DIR -name '*.java' -exec javac -d $OUTPUT_DIR {} +
```

Though if you are in Bash and/or don't mind using a pipe, then you can do:

```text
find $JAVA_SRC_DIR -name '*.java' | xargs javac -d $OUTPUT_DIR
```

```text
find ${PROJECT_DIR} -name "*.java" -print | xargs javac -g -classpath ${BUILT_PRODUCTS_DIR} -d ${BUILT_PRODUCTS_DIR}
```


### globstar

With Bash 4+, you can just enable globstar:

```text
$ shopt -s globstar
```

```text
$ shopt -u globstar
```

and then do:

```text
$ javac -d ./out/ ./src/**/*.java
```

In shell-speak, globbing is what the shell does when you use a wildcard in a command (e.g. `*` or `?`).
Globbing is matching the wildcard pattern and returning the file and directory names
that match and then replacing the wildcard pattern in the command with the matched items.

Bash version 4.0 adds a new globbing option called **globstar** which treats the pattern `**` differently when it's set.

```text
shopt = sh + opt = shell options
```

However, it is disabled by default on most systems.

You can see if globstar is set by issuing the `shopt` command without any arguments:

```text
$ shopt
...
globstar       	off
...
```

```text
$ shopt globstar
globstar       	off
```

If you now set the globstar option with the following command:

```text
$ shopt -s globstar
```

With globstar set, bash recurses all the directories.
Note that this will recurse all directory levels, not just one level.

```text
$ shopt
...
globstar       	off
...
```

[Bash manual](http://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#The-Shopt-Builtin-1) says this about `globstar`:

```text
If set, the pattern '**' used in a filename expansion context will match all files and zero or more directories and subdirectories.
 If the pattern is followed by a '/', only directories and subdirectories match.
```

## Windows

```text
for /f "usebackq" %f in (``dir /s /b *.java``) do javac %f
```

Windows solution: Assuming all files contained in sub-directory 'src', and you want to compile them to 'bin'.

```text
for /r src %i in (*.java) do javac %i -sourcepath src -d bin
```


If src contains a .java file immediately below it then this is faster

```text
javac src\\*.java -d bin
```


