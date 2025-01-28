---
title: "hexdump"
sequence: "hexdump"
---

[UP](/linux.html)


`hexdump` - display file contents in hexadecimal, decimal, octal, or ascii



```bash
hexdump options file ...
```

查看帮助：

```bash
$ man hexdump
```

## 举例

```bash
$ echo -e "The quick brown \nFox jumped over \nThe lazy dog." > dummy.txt
```

### One-byte: octal display

The following hexdump command will print the input data in hexadecimal format.
In the output, each line contains 16 space-separated bytes of input data, each having 3 columns and zero-filled, in octal.

```bash
$ hexdump -b <input_file_content>
```

```bash
$ hexdump -b dummy.txt 
0000000 124 150 145 040 161 165 151 143 153 040 142 162 157 167 156 040
0000010 012 106 157 170 040 152 165 155 160 145 144 040 157 166 145 162
0000020 040 012 124 150 145 040 154 141 172 171 040 144 157 147 056 012
0000030
```

### One-byte: character display

The following hexdump command will display the input data in hexadecimal format.
In the output, each line contains 16 space-separated characters of input data, each having 3 columns and space-filled.

```bash
$ hexdump -c <input_file_content>
```

```bash
$ hexdump -c dummy.txt 
0000000   T   h   e       q   u   i   c   k       b   r   o   w   n    
0000010  \n   F   o   x       j   u   m   p   e   d       o   v   e   r
0000020      \n   T   h   e       l   a   z   y       d   o   g   .  \n
0000030
```

### One-byte: Canonical hex + ASCII display

The following hexdump command will display the input data in hexadecimal.
In the output, each line contains 16 space-separated hexadecimal bytes, each having 2 columns.
The following content will be the same bytes in %_p format enclosed in “|” characters.

```bash
$ hexdump -C <input_file_content>
```

```bash
$ hexdump -C dummy.txt 
00000000  54 68 65 20 71 75 69 63  6b 20 62 72 6f 77 6e 20  |The quick brown |
00000010  0a 46 6f 78 20 6a 75 6d  70 65 64 20 6f 76 65 72  |.Fox jumped over|
00000020  20 0a 54 68 65 20 6c 61  7a 79 20 64 6f 67 2e 0a  | .The lazy dog..|
00000030
```

### Two-byte: decimal display

The following hexdump command will display the input data in hexadecimal format.
In the output, each line contains 8 space-separated 2 bytes units of input data, each having 5 columns and zero-filled, in unsigned decimal.

```bash
$ hexdump -d <input_file_content>
```

```bash
$ hexdump -d dummy.txt 
0000000   26708   08293   30065   25449   08299   29282   30575   08302
0000010   17930   30831   27168   28021   25968   08292   30319   29285
0000020   02592   26708   08293   24940   31098   25632   26479   02606
0000030
```

### Two-byte: octal display

The following hexdump command will print the input data in hexadecimal format.
In the output, each line contains 8 space-separated 2 bytes of input data, each with 6 columns and zero-filled, in octal.

```bash
$ hexdump -o <input_file_content>
```

```bash
$ hexdump -o dummy.txt 
0000000  064124  020145  072561  061551  020153  071142  073557  020156
0000010  043012  074157  065040  066565  062560  020144  073157  071145
0000020  005040  064124  020145  060554  074572  062040  063557  005056
0000030
```

### Two-byte: hexadecimal display

The following hexdump command will print the input data in hexadecimal format.
In the output, each line contains 8 space-separated 2 bytes of input data, each with 4 columns and zero-filled, in hexadecimal.

```bash
$ hexdump -x <input_file_content>
```

```bash
$ hexdump -x dummy.txt 
0000000    6854    2065    7571    6369    206b    7262    776f    206e
0000010    460a    786f    6a20    6d75    6570    2064    766f    7265
0000020    0a20    6854    2065    616c    797a    6420    676f    0a2e
0000030
```

### Limit amount of bytes

```bash
$ hexdump -n length <input_file_content>
```

```bash
$ hexdump -n 5 -C dummy.txt 
00000000  54 68 65 20 71                                    |The q|
00000005
```
