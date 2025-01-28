---
title: "${parameter:-word}"
sequence: "104"
---

[UP](/bash.html)


- `${parameter:-word}`

If `parameter` is unset or null, the expansion of `word` is substituted.
Otherwise, the value of `parameter` is substituted.

```text
$ v=123
$ echo ${v-unset}
123
$ echo ${v:-unset}
123
```

```text
$ v=""
$ echo ${v:-unset}
unset
$ echo ${v-unset}

```

- `${parameter:=word}`

If `parameter` is unset or null, the expansion of `word` is assigned to parameter.
The value of `parameter` is then substituted.
Positional parameters and special parameters may not be assigned to in this way.

```text
$ var=
$ : ${var:=DEFAULT}
$ echo $var
DEFAULT
```

- `${parameter:?word}`

If `parameter` is null or unset, the expansion of `word`
(or a message to that effect if word is not present) is written to the standard error and the shell,
if it is not interactive, exits.
Otherwise, the value of `parameter` is substituted.

```text
$ var=
$ : ${var:?var is unset or null}
bash: var: var is unset or null
```

- `${parameter:+word}`

If `parameter` is null or unset, nothing is substituted, otherwise the expansion of `word` is substituted.

```text
$ var=123
$ echo ${var:+var is set and not null}
var is set and not null
```

## Default Values

Default value handling is done by parameter of the form: `${parameter:[-=?+]word}`

- `${parameter:-word}` to use a default value
- `${parameter:=word}` to assign a default value
- `${parameter:?word}` to display an error if unset or null
- `${parameter:+word}` to use an alternate value

## 示例

### somecommand.sh

File: `somecommand.sh`

```bash
#!/usr/bin/env bash

ARG1=${1:-foo}
ARG2=${2:-'bar is'}
ARG3=${3:-1}
ARG4=${4:-$(date)}

echo "$ARG1"
echo "$ARG2"
echo "$ARG3"
echo "$ARG4"
```

```text
$ chmod u+x somecommand.sh
```

```text
$ ./somecommand.sh
foo
bar is
1
Fri Mar  8 20:04:42 CST 2024

$ ./somecommand.sh ez
ez
bar is
1
Fri Mar  8 20:05:58 CST 2024

$ ./somecommand.sh able was i
able
was
i
Fri Mar  8 20:06:23 CST 2024

$ ./somecommand.sh "able was i"
able was i
bar is
1
Fri Mar  8 20:06:55 CST 2024

$ ./somecommand.sh "able was i" super
able was i
super
1
Fri Mar  8 20:07:23 CST 2024

$ ./somecommand.sh "" "super duper"
foo
super duper
1
Fri Mar  8 20:07:44 CST 2024

$ ./somecommand.sh "" "super duper" hi you
foo
super duper
hi
you
```

## Reference

- [How-To: Bash Parameter Expansion and Default Values](https://www.debuntu.org/how-to-bash-parameter-expansion-and-default-values/)
- [Shell Parameter Expansion](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#Shell-Parameter-Expansion)
