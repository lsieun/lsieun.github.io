---
title: "seq"
sequence: "101"
---

[UP](/bash.html)


Sometimes, you come across a command line tool that offers limited functionality on its own, but when used with other tools, you realize its actual potential.

`seq` command in Linux is used to generate numbers from `FIRST` to `LAST` in steps of `INCREMENT`. It is a very useful command where we had to generate list of numbers in `while`, `for`, `until` loop.

## seq Syntax

Syntax:

```bash
seq [OPTION]... LAST
seq [OPTION]... FIRST LAST
seq [OPTION]... FIRST INCREMENT LAST
```

If `FIRST` or `INCREMENT` is omitted, it defaults to `1`.  That is, an omitted `INCREMENT` defaults to `1` even when `LAST` is smaller than `FIRST`.

- `seq --help` : It displays help information.
- `seq --version` : It displays version information.

## Without Option

### seq LAST

When only one argument is given then it produces numbers from `1` to `LAST` in step increment of `1`. If the `LAST` is less than `1`, then is produces no output.

```bash
$ seq 10
1
2
3
4
5
6
7
8
9
10

$ seq 1
1
```

### seq FIRST LAST

When two arguments are given then it produces numbers from `FIRST` till `LAST` is step increment of `1`. If `LAST` is less than `FIRST`, then it produces no output.

```bash
$ seq 3 9
3
4
5
6
7
8
9
```

### seq FIRST INCREMENT LAST

When three arguments are given then it produces numbers from `FIRST` till `LAST` in step of `INCREMENT`. If `LAST` is less than `FIRST`, then it produces no output.

```bash
$ seq 3 7 30
3
10
17
24

$ seq 10 -3 5
10
7
```

## With Option

### seq -f “FORMAT” FIRST INCREMENT LAST

This command is used to generate sequence in a formated manner. `FIRST` and `INCREMENT` are optional.

```bash
$ seq -f "apple_%02g.jpg" 3 2 8
apple_03.jpg
apple_05.jpg
apple_07.jpg
```

Print all numbers using `FORMAT`. `FORMAT` must contain exactly one of the `printf`-style floating point conversion specifications `%a`, `%e`, `%f`, `%g`, `%A`, `%E`, `%F`, `%G`. The `%` may be followed by zero or more flags taken from the set `-+#0`, then an optional width containing one or more digits, then an optional precision consisting of a `.` followed by zero or more digits. FORMAT may also contain any number of `%%` conversion specifications. All conversion specifications have the same meaning as with `printf`.

The default format is derived from `FIRST`, `STEP`, and `LAST`. If these all use a fixed point decimal representation, the default format is `%.Pf`, where `P` is the minimum precision that can represent the output numbers exactly. Otherwise, the default
format is `%g`.

### seq -s “STRING” FIRST INCREMENT LAST

This command is uses to `STRING` to seprate numbers. **By default** this value is equal to "`\n`". `FIRST` and `INCREMENT` are optional.

```bash
$ seq 5 4 15
5
9
13

$ seq -s " " 5 4 15
5 9 13
```

The following command intends to use a comma (`,`) as a separator:

```bash
$ seq -s, 1 9
1,2,3,4,5,6,7,8,9
```

### seq -w FIRST INCREMENT LAST

This command is used to equalize width by padding with leading zeroes. `FIRST` and `INCREMENT` are optional.

```bash
$ seq -w 1 7 20
01
08
15
```
