---
title: "Redirecting Standard Output"
sequence: "102"
---

[UP](/bash.html)


```bash
ls -l /usr/bin > ls-output.txt
```

## empty file

```bash
$ > ls-output.txt
```

Simply using the redirection operator with no command preceding it will **truncate an existing file** or** create a new, empty file**.

## appended file

```bash
$ ls -l /usr/bin >> ls-output.txt
```

Using the `>>` operator will result in the output being appended to the file. **If the file does not already exist**, it is created just as though the `>` operator had been used.
