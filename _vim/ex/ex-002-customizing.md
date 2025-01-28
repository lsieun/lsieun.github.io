---
title: "Customizing vi"
sequence: "102"
---

You can **change options** from within `vi` by using the `ex` command `:set`.

## The `:set` Command

There are **two types of options** that can be changed with the `:set` command:

- **toggle options**, which are either `on` or `off`, and
- **options** that take a numeric or string value (such as the location of a margin or the name of a file).

> `:set`有两种类型的options：一种是toggle option，另一种是 value option。

**Toggle options** may be `on` or `off` by default.

```vim
:set option    # To turn a toggle option on
:set nooption  # To turn a toggle option off

:set number
:set nonumber

:set ic        # to specify that pattern searches should ignore case
:set noic      # to return to being case-sensitive in searches
```

**Some options** have a `value` assigned to them.
For example, the `window` option sets the number of lines shown in the screen's “window.”
You set values for these options with an equals sign (`=`):

```vim
:set window=20
```

During a vi session, you can check which options vi is using.

```vim
:set all        # displays the complete list of options, 
                # including options that you have set and defaults that vi has “chosen.”

:set option?    #  find  out  the  current  value  of  any  individual  option  by  name

:set            # shows options that you have specifically changed, or set,
                # either in your .exrc file or during the current session.
```

## config file:

> 在 vi 编辑器当中，可以使用 `:set` 命令改变 vi 的选项。这是第 1 种方法，通过直接修改命令；下面是第 2 种，修改配置文件。

In addition, whenever `vi` is started up,
it reads a file in your **home directory** called `.exrc` for further operating instructions.
By placing `:set` commands in this file, you can modify the way `vi` acts whenever you use it.

> 在 home directory 中的 `.exrc` 文件中可以设置 `:set` 命令。

You can also set up `.exrc` files in **local directories** to initialize various options
that you want to use in different environments.
For example, you might define one set of options for editing English text,
but another set for editing source programs.

> 你也可以在 local directory 中添加 `.exrc` 文件

The `.exrc` file in your **home directory** will be executed first, and then **the one in your current directory**.

> 两者的执行顺序

### The `.exrc` File

The `.exrc` file that controls your own vi environment is in your home directory.
If you don't yet have an `.exrc` file, simply use `vi` to create one.

Enter into this file the `set`, `ab`, and `map` commands
that you want to have in effect whenever you use `vi` or `ex`.
A sample `.exrc` file might look like this:

```txt
set nowrapscan wrapmargin=7
set sections=SeAhBhChDh nomesg
map q :w^M:n^M
map v dwElp
ab ORA O'Reilly Media, Inc.
```

