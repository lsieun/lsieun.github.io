---
title: "base64"
sequence: "base64"
---

[UP](/linux.html)


```text
$ base64 --help
Usage: base64 [OPTION]... [FILE]
Base64 encode or decode FILE, or standard input, to standard output.

With no FILE, or when FILE is -, read standard input.

Mandatory arguments to long options are mandatory for short options too.
  -d, --decode          decode data
```

```text
$ echo "abc123" | base64 -
YWJjMTIzCg==
```

```text
$ echo "YWJjMTIzCg==" | base64 --decode -
abc123
```
