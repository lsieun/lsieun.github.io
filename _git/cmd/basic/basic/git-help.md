---
title: "Git Help"
sequence: "110"
---

[UP](/git/git-index.html)


```text
$ git
usage: git [--version] [--help] [-C <path>] [-c <name>=<value>]
           [--exec-path[=<path>]] [--html-path] [--man-path] [--info-path]
           [-p | --paginate | -P | --no-pager] [--no-replace-objects] [--bare]
           [--git-dir=<path>] [--work-tree=<path>] [--namespace=<name>]
           [--super-prefix=<path>] [--config-env=<name>=<envvar>]
           <command> [<args>]

These are common Git commands used in various situations:

start a working area (see also: git help tutorial)
   clone             Clone a repository into a new directory
   init              Create an empty Git repository or reinitialize an existing one

work on the current change (see also: git help everyday)
   add               Add file contents to the index
   mv                Move or rename a file, a directory, or a symlink
   restore           Restore working tree files
   rm                Remove files from the working tree and from the index
   sparse-checkout   Initialize and modify the sparse-checkout

examine the history and state (see also: git help revisions)
   bisect            Use binary search to find the commit that introduced a bug
   diff              Show changes between commits, commit and working tree, etc
   grep              Print lines matching a pattern
   log               Show commit logs
   show              Show various types of objects
   status            Show the working tree status

grow, mark and tweak your common history
   branch            List, create, or delete branches
   commit            Record changes to the repository
   merge             Join two or more development histories together
   rebase            Reapply commits on top of another base tip
   reset             Reset current HEAD to the specified state
   switch            Switch branches
   tag               Create, list, delete or verify a tag object signed with GPG

collaborate (see also: git help workflows)
   fetch             Download objects and refs from another repository
   pull              Fetch from and integrate with another repository or a local branch
   push              Update remote refs along with associated objects

'git help -a' and 'git help -g' list available subcommands and some
concept guides. See 'git help <command>' or 'git help <concept>'
to read about a specific subcommand or concept.
See 'git help git' for an overview of the system.
```

```text
$ git --help
```

```text
$ git init --help
```

```text
git help tutorial
git help everyday
git help revisions
git help workflows
```

For a complete (and somewhat daunting) list of `git` subcommands, type `git help --all`.

```text
$ git help --all
$ git help -a
$ git help -g
```

## git command

### git options and subcommand options

As you can see from the usage hint, a small handful of options apply to `git`.
Most options, shown as `[<args>]` in the hint, apply to specific **subcommands**.

For example, the option `--version` affects the `git` command and produces a version number.

```text
$ git --version
git version 2.32.0.windows.1
```

In contrast, `--amend` is an example of an option specific to the `git` subcommand `commit`.

```text
$ git commit --amend
```

Some invocations require both forms of options.
(Here, the extra spaces in the command line merely serve to visually separate the subcommand from the base command and are not required.)

```text
$ git --git-dir=project.git    repack -d
```

For convenience, documentation for each `git` subcommand is available using
`git help subcommand`, `git --help subcommand` or `git subcommand --help`.

### short and long options

Git commands understand both "short" and "long" options.
For example, the `git commit` command treats the following examples as equivalents.

```text
$ git commit -m "Fixed a typo."
$ git commit --message="Fixed a typo."
```

The short form, `-m`, uses a single hyphen, whereas the long form, `--message`, uses two.
(This is consistent with the GNU long options extension.) Some options exist only in one form.

### options and arguments

Finally, you can separate **options** from a list of **arguments** via the "bare double dash" convention.
For instance, use the **double dash** to contrast the **control portion of the command line** from **a list of operands**, such as filenames.

```text
$ git diff -w master origin -- tools/Makefile
```

You may need to use the **double dash** to separate and explicitly identify **filenames**
if they might otherwise be mistaken for another part of the command.
For example, if you happened to have both a file and a tag named `main.c`, then you will get different behavior:

```text
# Checkout the tag named "main.c"
$ git checkout main.c

# Checkout the file named "main.c"
$ git checkout -- main.c
```
