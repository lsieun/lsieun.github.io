---
title: "Find Files"
sequence: "105"
---

## commands

### find

```vim
:fin[d][!] [++opt] [+cmd] {file}
```

作用：Find `file` in '`path`' and then `:edit` it.

有两种情况下，无法使用`:find`命令：

- 在Vi编辑器下
- 当Vim编辑器的`+file_in_path`被禁用的时候。可以使用`vim --version | grep "in_path"`查看

### path

查看path的帮助

```vim
:help path
```

查看path的值：

```vim
:echo &path
```

This is **a list of directories** which will be searched
when using the `:find`, `:sfind`, `:tabfind` and other commands,
provided that the file being searched for has a relative path (not starting with "/", "./" or "../").
The directories in the 'path' option may be relative or absolute.

> 这段话包含的三个意思：
> - （1）path包含了一组“目录”信息
> - （2）`:find`, `:sfind`, `:tabfind`会使用`path`内的信息
> - （3）推荐使用相对路径。

Use **commas** to separate directory names:

```vim
:set path=.,/usr/local/include,/usr/include
```

To search **relative to the directory** of **the current file**, use:

```vim
:set path=.
```

You can add `**` to your path:

```vim
set path+=**
```

This way it will find every file recursively based on your current directory.

### wildmenu

When '`wildmenu`' is on, command-line completion operates in an enhanced mode.
On pressing '`wildchar`' (usually `<Tab>`) to invoke completion,
the possible matches are shown **just above the command line**,
with the first match highlighted (overwriting the status line, if there is one).

Keys that show the previous/next match, such as `<Tab>` or `CTRL-P/CTRL-N`,
cause the highlight to move to the appropriate match.

## Practice

```vim
" Search down into subfolders
" Provide tab-completion for all file-related tasks
set path+=**

" Display all matching files when we tab complete
set wildmenu

" Now We can:
" Hit tab to :find by partial match
" Use * to make it fuzzy
```

