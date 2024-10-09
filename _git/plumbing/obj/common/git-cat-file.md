---
title: "查看：git cat-file"
sequence: "101"
---

[UP](/git/git-index.html)


## Options

### type: `-t`

You can have Git tell you **the object type**(blob, tree, commit, tag) of any object in Git, given its SHA-1 key, with `cat-file -t`:

```bash
$ git cat-file -t 3b18e512dba79e4c8300dd08aeb37f8e728b8dad
blob
$ git cat-file -t 68aba62e560c0ebc3396e8ae9335232cd93a3f60
tree
$ git cat-file -t b20e2d02b309ca8edbb0d4d9517a37bc153a6dff
commit
$ git cat-file -t a477406440c34845f3adb87f624365c0af1b982c
tag
```

File: `git-objects-type.sh`

```bash
#!/bin/bash

# 第一步，获取当前目录的绝对路径信息
DIR_NAME=$(cd "$(dirname "$0")"; pwd -P)

# 第二步，检测是否存在.git 文件夹
GIT_DIR="${DIR_NAME}/.git"
[[ -e ${GIT_DIR} && -d ${GIT_DIR} ]] && echo "Find Git Repository: ${GIT_DIR}" || {
    echo "Not a Git Repository: $(pwd)"
    exit 1
}

# 第三步，通过 find .git/objects/ type -f 命令找到所有 git objects 对象
GIT_OBJECTS=$(find "${GIT_DIR}/objects/" -type f)

# 第四步，遍历 git objects 对象，打印信息
for item in ${GIT_OBJECTS}
do
    # 获取某一个具体 object 的 SHA1 值
    object_id="$(basename $(dirname "${item}"))$(basename "${item}")"
    # 打印其 SHA1 值和类型
    echo "${object_id} $(git cat-file -t ${object_id})"
done

echo "DONE"
```

### content: `-p`

Passing `-p` to it instructs the `cat-file` command to figure out the type of content and display it nicely for you:

示例：查看 `blob` 类型的 git object

```text
$ git cat-file -t 3b18e512dba79e4c8300dd08aeb37f8e728b8dad
blob
$ git cat-file -p 3b18e512dba79e4c8300dd08aeb37f8e728b8dad
hello world
```

示例：查看 `tree` 类型的 git object

```bash
$ git cat-file -t 68aba62e560c0ebc3396e8ae9335232cd93a3f60
tree
$ git cat-file -p 68aba62e560c0ebc3396e8ae9335232cd93a3f60
100644 blob 3b18e512dba79e4c8300dd08aeb37f8e728b8dad	hello.txt
```

示例：查看 `commit` 类型的 git object

```bash
$ git cat-file -t b20e2d02b309ca8edbb0d4d9517a37bc153a6dff
commit
$ git cat-file -p b20e2d02b309ca8edbb0d4d9517a37bc153a6dff
tree 492413269336d21fac079d4a4672e55d5d2147ac
author liusen <liusen@centos7.lsieun.com> 1636609788 -0500
committer liusen <liusen@centos7.lsieun.com> 1636609788 -0500

commit a file that says hello
```

示例：查看 `tag` 类型的 git object

```bash
$ git cat-file -t a477406440c34845f3adb87f624365c0af1b982c
tag
$ git cat-file -p a477406440c34845f3adb87f624365c0af1b982c
object b20e2d02b309ca8edbb0d4d9517a37bc153a6dff
type commit
tag V1.0
tagger liusen <liusen@centos7.lsieun.com> 1636621786 -0500

this is a new tag
```

一种特殊的写法：

```bash
$ git cat-file -p master^{tree}
100644 blob a906cb2a4a904a152e80877d4088654daad0c859      README
100644 blob 8f94139338f9404f26296befa88755fc2598c289      Rakefile
040000 tree 99f1a6d12cb4b6f19c8655fca46c3ecf317074e0      lib
```

The `master^{tree}` syntax specifies the `tree` object that is pointed to by the last commit on your `master` branch.
Notice that the `lib` subdirectory isn't a `blob` but a pointer to another tree.
