---
title: "git config"
---

[UP](/git/git-index.html)


```text
# 设置用户名和邮箱（全局）
git config --global user.name "xxxxxx"
git config --global user.email jmxxxxxx@163.com

# 查看用户名和邮箱（全局）
git config --global user.name
git config --global user.email

# 设置用户名和邮箱（局部）
git config --local user.name "xxxxxx"
git config --local user.email jmxxxxxx@163.com

# 查看用户名和邮箱（局部）
git config --local user.name
git config --local user.email

# 查看所有配置
git config --list

# 查看帮助
git config --help
```

## 基本用法

### 查看列表

```bash
$ git config --list
```

### 添加



## 选项

### 作用范围

When you run `git config --global user.name "Tom Cat"`,
a file named `.gitconfig` is created (or modified if it exists) in your `$HOME` directory.

```text
$ git config --global user.name "Mike McQuaid"
$ git config --global user.email mike@mikemcquaid.com
$ git config --global user.email
mike@mikemcquaid.com
```



## 举例

### 用户信息

```bash
$ git config --global user.name "liusen"
$ git config --global user.email "liusen@example.com"
```

## Setting the configuration for all repositories

You wish to set your Git username in your global Git configuration:

- You don't need to change to the directory of a particular or any Git repository.
- Run `git config --global user.name "Mike McQuaid"`

This sets the following value in my home directory: `/Users/mike/.gitconfig` (see the
note “Where is the $HOME directory?”).



WHERE IS THE `$HOME` DIRECTORY?
The `$HOME` directory is often signified with the tilde (`~`) character.
If your username is mike, the `$HOME` directory typically resides in `C:\Users\mike` on Windows,
`/Users/mike` on OS X, and `/home/mike` on Linux/Unix.

The filename is prefixed with a dot,
and this means on OS X and Linux that it may be hidden by default in graphical file browsers or file dialogs.
If you run `cat ~/.gitconfig` in a terminal, you can see the contents.

You can read values from the configuration file by omitting the value argument.

```text
$ git config --global user.name
Mike McQuaid
```

The `git config` command takes arguments in the format `git config --global section.key value`.
If you ran this command again with the same `section.key` but a different `value`,
it would alter the current value rather than creating a new line.

This  `~/.gitconfig` file is used to set your preferred configuration settings
to be shared among all your repositories on your current machine.
You could even share this file between machines to allow these settings to be used everywhere.

Options can also be unset by using the `unset` flag.
For example, to unset the `git rerere` setting, you would run

```text
git config --global --unset rerere.enabled
```

Now that you've seen how to set and read some configuration settings for all repositories,
let's see how to do it for a single one.

## Setting the configuration for a single repository

There are times when you may want to use different configuration settings for different repositories on the same computer.
For example, in the past I've used one email address when committing to open source repositories and
another email address when committing to my employer's repositories.
If you wanted to do both of these on the same computer,
you could set a different `user.email` value in the single repository configuration file
to be used in preference to the global `~/.gitconfig`.

Recall that whenever you've used `git config` previously, you've always used the `--global` flag.
But you can use **four different flags** to affect the location of the configuration file that's used:

- `--global`: Uses the `~/.gitconfig` file in your `$HOME` directory.
  For example, if your `$HOME` was `/Users/mike`, then the global file would be at `/Users/mike/.gitconfig`.
- `--system`: Uses the `etc/gitconfig` file under wherever Git was installed.
  For example, if Git was installed into `/usr/local/`, the system file would be at `/usr/local/etc/gitconfig`;
  or if installed into `/usr/`, the system file would be at `/etc/gitconfig`.
- `--local`: Uses the `.git/config` file in a Git repository.
  For example, if a Git repository was at `/Users/mike/GitInPracticeRedux/.git`,
  then the local file would be at `/Users/mike/GitInPracticeRedux/.git/config`.
  `.git/config` is the **default** if no other configuration location flags are provided.
- `--file` (or `-f`): Takes another argument to specify a file path to write to.
  For example, you could specify a file using `git config --file /Users/mike/Documents/git.cfg`.

You wish to set your Git user email in your repository Git configuration:

- Change to the directory containing your repository
- Run `git config user.email mike.mcquaid@github.com`

The email address doesn't need to be surrounded with quotes because it has no spaces,
unlike a name such as "Mike McQuaid".

This sets the value in the `.git/config` file in the repository. You can query it as follows:

```text
git config --local user.email
mike.mcquaid@github.com
```

If you used `--global`, you'd instead see the value that was set in the global configuration file.
If you omit `--local` and `--global`, Git uses the same default priority as when reading configuration settings for its own use.
The **priority** for deciding which configuration file to read from is as follows:

- 1. The argument following `--file` (if provided)
- 2. The local configuration file (`.git/config`)
- 3. The global configuration file (`~/.gitconfig`)
- 4. The system configuration file (`etc/gitconfig` under where Git was installed)

If a value is set for a key in a higher-priority file, Git's commands use that instead.
This lets you override the individual configuration among different repositories, users, and systems.

Although the global `~/.gitconfig` file isn't created until you set some values,
on creation every repository contains a `~/.git/config` file.

When you do a `git push --set-upstream`, Git sets values in a branch section in the `.git/config` file.
This section specifies where to push and pull from when on a certain branch.

## Useful configuration settings


## Ignoring files across all repositories: global ignore file

```text
git config --global core.excludesfile ~/.gitignore
```

```bash
$ git config --global init.defaultBranch <name>
```

```bash
$ git init
hint: Using 'master' as the name for the initial branch. This default branch name
hint: is subject to change. To configure the initial branch name to use in all
hint: of your new repositories, which will suppress this warning, call:
hint: 
hint: 	git config --global init.defaultBranch <name>
hint: 
hint: Names commonly chosen instead of 'master' are 'main', 'trunk' and
hint: 'development'. The just-created branch can be renamed via this command:
hint: 
hint: 	git branch -m <name>
```

```bash
$ git config --local --list
core.repositoryformatversion=0
core.filemode=true
core.bare=false
core.logallrefupdates=true
$ cat .git/config 
[core]
	repositoryformatversion = 0
	filemode = true
	bare = false
	logallrefupdates = true
```
