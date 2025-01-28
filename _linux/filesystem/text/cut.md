---
title: "cut"
sequence: "cut"
---

[UP](/linux.html)


`cut` is a command-line utility that allows you
to cut parts of lines from specified files or piped data and
print the result to standard output.
It can be used to cut parts of a line by **delimiter**, **byte position**, and **character**.

## How to Use the cut Command

The syntax for the `cut` command is as follows:

```text
cut OPTION... [FILE]...
```

### FILE

The `cut` command can accept zero or more input FILE names.

If no `FILE` is specified, or when `FILE` is `-`, `cut` will read from the standard input.

### OPTION：分隔符

- `-d` (`--delimiter`) - Specify a delimiter that will be used instead of the default "TAB" delimiter.
- `--output-delimiter` - The default behavior of `cut` is to use the input delimiter as the output delimiter.
  This option allows you to specify a different output delimiter string.



### OPTION：输出（三选其一）

The options that tell `cut` whether to use a **delimiter**, **byte position**, or **character**
when cutting out selected portions the lines are as follows:

- `-f` (`--fields=LIST`) - Select by specifying a field, a set of fields, or a range of fields. This is the most commonly used option.
- `-b` (`--bytes=LIST`) - Select by specifying a byte, a set of bytes, or a range of bytes.
- `-c` (`--characters=LIST`) - Select by specifying a character, a set of characters, or a range of characters.

You can use one, and only one of the options listed above.

The `LIST` argument passed to the `-f`, `-b`, and `-c` options
can be **an integer**, **multiple integers separated by commas**,
**a range of integers** or **multiple integer ranges separated by commas**.
Each range can be one of the following:

- `N` the Nth field, byte or character, starting from 1.
- `N-` from the Nth field, byte or character, to the end of the line.
- `N-M` from the Nth to the Mth field, byte, or character.
- `-M` from the first to the Mth field, byte, or character.

### OPTION：输出（无分隔符）

- `-s` (`--only-delimited`) - By default cut prints the lines that contain no delimiter character.
  When this option is used, `cut` doesn't print lines not containing delimiters.

### OPTION：输出（反选）

Other options are:

- `--complement` - Complement the selection.
  When using this option `cut` displays all bytes, characters, or fields except the selected.

## 举例

```bash
$ echo -e "245:789 4567\tM:4540\tAdmin\t01:10:1980\n535:763 4987\tM:3476\tSales\t11:04:1978" > test.txt
$ cat test.txt 
245:789 4567	M:4540	Admin	01:10:1980
535:763 4987	M:3476	Sales	11:04:1978
```

### 分隔符

To `cut` based on a delimiter, invoke the command with the `-d` option, followed by the delimiter you want to use.

For example, to display the 1st and 3rd fields using ":" as a delimiter, you would type:

```bash
$ cut test.txt -d ':' -f 1,3
245:4540	Admin	01
535:3476	Sales	11
```

You can use any single character as a delimiter.
In the following example, we are using the **space character** as a delimiter and printing the 2nd field:

```bash
$ echo "the quick brown fox jumps over a lazy dog" | cut -d ' ' -f 2
quick
```

### 分隔符（替换）

To specify the output delimiter use the `--output-delimiter` option.
For example, to set the output delimiter to `_` you would use:

```bash
$ cat test.txt 
245:789 4567	M:4540	Admin	01:10:1980
535:763 4987	M:3476	Sales	11:04:1978

$ cut test.txt -f 1,3 --output-delimiter='_'
245:789 4567_Admin
535:763 4987_Sales
```

### 输出列（正向选择）

To specify the fields that should be cut invoke the command with the `-f` option. When not specified, the default delimiter is “TAB”.

For example, to display the 1st and the 3rd field you would use:

```bash
$ cut test.txt -f 1,3
245:789 4567	Admin
535:763 4987	Sales
```

Or if you want to display from the 1st to the 4th field:

```bash
$ cut test.txt -f -4
245:789 4567	M:4540	Admin	01:10:1980
535:763 4987	M:3476	Sales	11:04:1978
```



### 输出列（反向选择）

To complement the selection field list use `--complement` option. This will print only those fields that are not selected with the `-f` option.

The following command will print all field except the 1st and 3rd:

```bash
$ cat test.txt 
245:789 4567	M:4540	Admin	01:10:1980
535:763 4987	M:3476	Sales	11:04:1978
$ cut test.txt -f 1,3 --complement
M:4540	01:10:1980
M:3476	11:04:1978
```
