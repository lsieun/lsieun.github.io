---
title: "File"
sequence: "102"
---

[UP](/bash.html)


## filename and dirname

### just file name

```bash
echo "$(basename "$0")"
```

### relative dir path

```bash
echo "$(dirname "$0")"
```

### absolute dir path

```bash
echo "$(cd "$(dirname "$0")"; pwd -P)"
```

> Don't forget to quote all the stuff. If you don't understand why, try your program on a file `a  b` (two spaces between `a` and `b`, SO eats one of them).

### absolute file path

```bash
echo "$(cd "$(dirname "$0")"; pwd -P)/$(basename "$0")"
```

> Don't forget to quote all the stuff. If you don't understand why, try your program on a file `a  b` (two spaces between `a` and `b`, SO eats one of them).

拆分一下：

```bash
BASE_NAME=$(basename ${0})
DIR_NAME=$(dirname ${0})
echo "base name: ${BASE_NAME}"
echo " dir name: ${DIR_NAME}"

echo "change directory"
cd ${DIR_NAME}

FULL_DIR_PATH=$(pwd -P)
FULL_FILE_PATH="${FULL_DIR_PATH}/${BASE_NAME}"
echo "full dir path: ${FULL_DIR_PATH}"
echo "full file path: ${FULL_FILE_PATH}"
```

## TEST Operators (bash builtin)

在 `man bash` 的"CONDITIONAL EXPRESSIONS"部分可以查看到相关内容
