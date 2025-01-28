---
title: "Shared Libraries"
sequence: "103"
---

Shared libraries are libraries that are loaded by programs when they start.
When a shared library is installed properly,
all programs that start afterwards automatically use the new shared library.

## Conventions

For shared libraries to support all of these desired properties, a number of conventions and guidelines must be followed.
You need to understand the difference between a library's names,
in particular its '**soname**' and '**real name**' (and how they interact).
You also need to understand where they should be placed in the filesystem.

### Shared Library Names

Every shared library has a special name called the '**soname**'.
The soname has the prefix `lib`, the name of the library, the phrase `.so`,
followed by a period and a version number that is incremented
whenever the interface changes (as a special exception, the lowest-level C libraries don't start with `lib`).

```text
笔记：
soname = lib + name + .so + . + version number
```

A fully-qualified soname includes as a prefix the directory it's in;
on a working system a **fully-qualified soname** is simply a **symbolic link** to the shared library's 'real name'.

```text
fully-qualified soname --> symbolic link --> real name
```

Every shared library also has a 'real name', which is the filename containing the actual library code.
The real name adds to the soname a period, a minor number, another period, and the release number.
The last period and release number are optional.
The minor number and release number support configuration control by letting you know exactly
what version(s) of the library are installed.
Note that these numbers might not be the same as the numbers used to describe the library in documentation,
although that does make things easier.

```text
real name = soname + . + minor number + . + release number
```

In addition, there's another name that the compiler uses when requesting a library, (I'll call it the 'linker name'),
which is simply the soname without any version number.

```text
linker name = soname - version number
```

The key to managing shared libraries is the separation of these names.
Programs, when they internally list the shared libraries they need, should only list the soname they need.
Conversely, when you create a shared library,
you only create the library with a specific filename (with more detailed version information).
When you install a new version of a library,
you install it in one of a few special directories and then run the program `ldconfig`.
`ldconfig` examines the existing files and creates the sonames as symbolic links to the real names,
as well as setting up the cache file `/etc/ld.so.cache`.

`ldconfig` doesn't set up the linker names;
typically this is done during library installation,
and the linker name is simply created as a symbolic link to the 'latest' soname or the latest real name.
I would recommend having the linker name be a symbolic link to the soname,
since in most cases if you update the library you'd like to automatically use it when linking.
I asked H. J. Lu why `ldconfig` doesn't automatically set up the linker names.
His explanation was basically that you might want to run code using the latest version of a library,
but might instead want development to link against an old (possibly incompatible) library.
Therefore, `ldconfig` makes no assumptions about what you want programs to link to,
so installers must specifically modify symbolic links to update what the linker will use for a library.

Thus, `/usr/lib/libreadline.so.3` is a fully-qualified soname,
which `ldconfig` would set to be a symbolic link to some realname like `/usr/lib/libreadline.so.3.0`.
There should also be a linker name, `/usr/lib/libreadline.so`
which could be a symbolic link referring to `/usr/lib/libreadline.so.3`.

### Filesystem Placement

Shared libraries must be placed somewhere in the filesystem.
Most open source software tends to follow the GNU standards;
for more information see the info file documentation at [info:standards#Directory_Variables]().
The GNU standards recommend installing by default all libraries in `/usr/local/lib`
when distributing source code (and all commands should go into `/usr/local/bin`).
They also define the convention for overriding these defaults and for invoking the installation routines.

The Filesystem Hierarchy Standard (FHS) discusses
what should go where in a distribution (see https://www.pathname.com/fhs/).
According to the FHS, most libraries should be installed in `/usr/lib`,
but libraries required for startup should be in `/lib` and
libraries that are not part of the system should be in `/usr/local/lib`.

There isn't really a conflict between these two documents;
the GNU standards recommend the default for **developers of source code**,
while the FHS recommends the default for **distributors**
(who selectively override the source code defaults, usually via the system's package management system).
In practice this works nicely: the 'latest' (possibly buggy!) source code
that you download automatically installs itself in the 'local' directory (`/usr/local`),
and once that code has matured the package managers can trivially override the default
to place the code in the standard place for distributions.
Note that if your library calls programs that can only be called via libraries,
you should place those programs in `/usr/local/libexec` (which becomes `/usr/libexec` in a distribution).
One complication is that Red Hat-derived systems don't include `/usr/local/lib` by default in their search for libraries;
see the discussion below about `/etc/ld.so.conf`.
Other standard library locations include `/usr/X11R6/lib` for X-windows.
Note that `/lib/security` is used for PAM modules, but those are usually loaded as DL libraries.

## How Libraries are Used

On GNU glibc-based systems, including all Linux systems,
starting up an ELF binary executable automatically causes the **program loader** to be loaded and run.
On Linux systems, **this loader** is named `/lib/ld-linux.so.X` (where `X` is a version number).
**This loader**, in turn, **finds and loads all other shared libraries** used by the program.

```text
笔记：program --> loader --> shared libraries
```

```text
$ cd /lib64

$ ls ld-*
ld-2.17.so  ld-linux-x86-64.so.2

$ ls -l ld-*
-rwxr-xr-x. 1 root root 163312 May 18  2022 ld-2.17.so
lrwxrwxrwx. 1 root root     10 Jul 24  2022 ld-linux-x86-64.so.2 -> ld-2.17.so
```

The list of directories to be searched is stored in the file `/etc/ld.so.conf`.
Many Red Hat-derived distributions don't normally include `/usr/local/lib` in the file `/etc/ld.so.conf`.
I consider this a bug, and adding `/usr/local/lib` to `/etc/ld.so.conf` is a common 'fix' required
to run many programs on Red Hat-derived systems.

```text
$ cd /etc
$ ls ld.*
ld.so.cache  ld.so.conf

ld.so.conf.d:
dyninst-x86_64.conf  kernel-3.10.0-957.el7.x86_64.conf  mariadb-x86_64.conf

$ cat ld.so.conf
include ld.so.conf.d/*.conf
```

If you want to just override a few functions in a library, but keep the rest of the library,
you can enter the names of overriding libraries (`.o` files) in `/etc/ld.so.preload`;
these 'preloading' libraries will take precedence over the standard set.
This preloading file is typically used for emergency patches;
a distribution usually won't include such a file when delivered.

Searching all of these directories at program start-up would be grossly inefficient,
so a **caching arrangement** is actually used.
The program `ldconfig` by default reads in the file `/etc/ld.so.conf`,
sets up the appropriate symbolic links in the dynamic link directories (so they'll follow the standard conventions),
and then writes a cache to `/etc/ld.so.cache` that's then used by other programs.
This greatly speeds up access to libraries.
The implication is that `ldconfig` must be run **whenever a DLL is added**, **when a DLL is removed**,
or **when the set of DLL directories changes**;
running `ldconfig` is often one of the steps performed by package managers when installing a library.
On start-up, then, the dynamic loader actually uses the file `/etc/ld.so.cache` and then loads the libraries it needs.


## Environment Variables

Various environment variables can control this process,
and there are environment variables that permit you to override this process.

### LD_LIBRARY_PATH

You can temporarily substitute a different library for this particular execution.
In Linux, the environment variable `LD_LIBRARY_PATH` is a **colon-separated set of directories**
where libraries should be searched for first, before the standard set of directories;
this is useful when debugging a new library or using a nonstandard library for special purposes.

The environment variable `LD_PRELOAD` lists shared libraries
with functions that override the standard set, just as `/etc/ld.so.preload` does.
These are implemented by the loader `/lib/ld-linux.so`.

I should note that, while `LD_LIBRARY_PATH` works on many Unix-like systems, it doesn't work on all;
for example, this functionality is available on HP-UX but as the environment variable `SHLIB_PATH`,
and on AIX this functionality is through the variable `LIBPATH` (with the same syntax, a colon-separated list).

**`LD_LIBRARY_PATH` is handy for development and testing,
but shouldn't be modified by an installation process for normal use by normal users**;
see 'Why LD_LIBRARY_PATH is Bad' at http://www.visi.com/~barr/ldpath.html for an explanation of why.
But it's still useful for development or testing, and for working around problems
that can't be worked around otherwise.

If you don't want to set the `LD_LIBRARY_PATH` environment variable,
on Linux you can even invoke the program loader directly and pass it arguments.
For example, the following will use the given `PATH` instead of the content of
the environment variable `LD_LIBRARY_PATH`, and run the given executable:

```text
/lib/ld-linux.so.2 --library-path PATH EXECUTABLE
```

Just executing `ld-linux.so` without arguments will give you more help on using this,
but again, don't use this for normal use - these are all intended for debugging.

```text
$ /lib64/ld-linux-x86-64.so.2 
Usage: ld.so [OPTION]... EXECUTABLE-FILE [ARGS-FOR-PROGRAM...]
You have invoked `ld.so', the helper program for shared library executables.
This program usually lives in the file `/lib/ld.so', and special directives
in executable files using ELF shared libraries tell the system's program
loader to load the helper program from this file.  This helper program loads
the shared libraries needed by the program executable, prepares the program
to run, and runs it.  You may invoke this helper program directly from the
command line to load and run an ELF executable file; this is like executing
that file itself, but always uses this helper program from the file you
specified, instead of the helper program file specified in the executable
file you run.  This is mostly of use for maintainers to test new versions
of this helper program; chances are you did not intend to run this program.

  --list                list all dependencies and how they are resolved
  --verify              verify that given object really is a dynamically linked
			object we can handle
  --inhibit-cache       Do not use /etc/ld.so.cache
  --library-path PATH   use given PATH instead of content of the environment
			variable LD_LIBRARY_PATH
  --inhibit-rpath LIST  ignore RUNPATH and RPATH information in object names
			in LIST
  --audit LIST          use objects named in LIST as auditors
```

### LD_DEBUG

Another useful environment variable in the GNU C loader is `LD_DEBUG`.
This triggers the `dl*` functions so that they give quite verbose information on what they are doing.
For example:

```text
export LD_DEBUG=files
command_to_run
```

displays the processing of files and libraries when handling libraries,
telling you what dependencies are detected and which SOs are loaded in what order.
Setting `LD_DEBUG` to 'bindings' displays information about symbol binding,
setting it to 'libs' displays the library search paths,
and setting it to 'versions' displays the version dependencies.

Setting `LD_DEBUG` to 'help' and then trying to run a program will list the possible options.
Again, `LD_DEBUG` isn't intended for normal use, but it can be handy when debugging and testing.

### Other Environment Variables

There are actually a number of other environment variables that control the loading process;
their names begin with `LD_` or `RTLD_`.
Most of the others are for low-level debugging of the loader process or for implementing specialized capabilities.
Most of them aren't well-documented;
if you need to know about them, the best way to learn about them is to read the source code of the loader (part of gcc).

Permitting user control over dynamically linked libraries would be disastrous for setuid/setgid programs
if special measures weren't taken.
Therefore, in the GNU loader (which loads the rest of the program on program start-up),
if the program is setuid or setgid these variables (and other similar variables)
are ignored or greatly limited in what they can do.
The loader determines if a program is setuid or setgid by checking the program's credentials;
if the uid and euid differ, or the gid and the egid differ,
the loader presumes the program is setuid/setgid (or descended from one) and
therefore greatly limits its abilities to control linking.
If you read the GNU glibc library source code, you can see this;
see especially the files `elf/rtld.c` and `sysdeps/generic/dl-sysdep.c`.
This means that if you cause the uid and gid to equal the euid and egid,
and then call a program, these variables will have full effect.
Other Unix-like systems handle the situation differently but for the same reason:
a setuid/setgid program should not be unduly affected by the environment variables set.

```text
笔记：这段没有看懂
```

## Reference

- [Shared Libraries](https://tldp.org/HOWTO/Program-Library-HOWTO/shared-libraries.html)

