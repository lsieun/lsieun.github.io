---
title: "echo and pwd"
sequence: "104"
---

`:echo` takes a **Vimscript expression**, whereas `:!` takes an **external command**,
which is a special case for a filename, which is accepted by `:edit` et al.

For **external commands** and **filenames**,
there are special characters such as `%` and `#`, described under `:help cmdline-special`.
This also includes this crucial sentence:

## 查看当前文件的名称

In contrast, `:echo` does not take a filename, but **an expression**.
There are several ways to resolve the current filename; the most direct is via `expand()`:

```vim
:echo expand('%')
```

Alternatively, as the current filename is also stored in a special register `%`,
and registers are addressed via the `@` sign:

```vim
:echo @%
```

- `:ec[ho] {expr1} ..`:	Echoes each `{expr1}`, with a space in between.
    - `:echo expand("%:p")`: Make file name a full path.
    - `:echo expand("%:h")`: Head of the file name 文件所在目录
- `:cd[!] {path}`: Change the current directory to `{path}`.
    - `:cd %:h`: To change to the directory of the current file.
    - `:cd[!] -`: Change to the previous current directory
- `:pw[d]`: Print the current directory name.  {Vi: no pwd}


## `:!cmd`：执行一次Shell

`:!{cmd}`: Execute `{cmd}` with the shell.
See also the 'shell' and 'shelltype' option.

If `{cmd}` contains "`%`" it is expanded to **the current file name**.
Special characters are not escaped, use quotes to avoid their special meaning:

```vim
:!ls "%"
```

`:!!`: Repeat last ":!{cmd}".

## shell

`:sh[ell]`: This command starts a shell.
When the shell exits (after the "`exit`" command) you return to Vim.


## Ex special characters

Vim命令：`:help cmdline-special`

These are **special characters** in **the executed command line**.

> 注意：这里是在 ex 模式下的特殊字符。

If you want to insert **special things** while typing you can use the `CTRL-R` command.
For example, "`%`" stands for **the current file name**,
while `CTRL-R %` inserts the current file name right away.  See |`c_CTRL-R`|.

> 在 Ex 和 Insert 模式下，输入 `CTRL-R %` 能够输入当前文件的名称

In `Ex` commands, at places where a file name can be used,
the following characters have a special meaning.
These can also be used in the expression function |`expand()`|.

```
	%	Is replaced with the current file name.		  *:_%* *c_%*
	#	Is replaced with the alternate file name.	  *:_#* *c_#*
		This is remembered for every window.
	#n	(where n is a number) is replaced with		  *:_#0* *:_#n*
		the file name of buffer n.  "#0" is the same as "#".     *c_#n*
	##	Is replaced with all names in the argument list	  *:_##* *c_##*
		concatenated, separated by spaces.  Each space in a name
		is preceded with a backslash.
	#<n	(where n is a number > 0) is replaced with old	  *:_#<* *c_#<*
		file name n.  See |:oldfiles| or |v:oldfiles| to get the
		number.							*E809*
		{only when compiled with the |+eval| and |+viminfo| features}
```

## expr-register

Vim命令：`:help expr-register`

- `@r`: contents of register 'r'

The result is the contents of **the named register**, as a single string.
Newlines are inserted where required.  
To get the contents of **the unnamed register** use `@"` or `@@`.
See |`registers`| for an explanation of the available registers.

## registers

Vim命令：`:help registers`

There are ten types of registers:

1. The **unnamed** register `""`
2. **10 numbered** registers `"0` to `"9`
3. The small delete register `"-`
4. 26 named registers `"a` to `"z` or `"A` to `"Z`
5. three read-only registers `":`, `".`, `"%`
6. alternate buffer register `"#`
7. the expression register `"=`
8. The selection and drop registers `"*`, `"+` and `"~`
9. The black hole register `"_`
10. Last search pattern register `"/`

