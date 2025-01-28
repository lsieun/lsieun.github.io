---
title: "示例"
sequence: "105"
---

[UP](/bash.html)


```bash
#!/bin/bash

# Program to output a system information

title="System Information Report"

echo "<html>"
echo "    <head>"
echo "        <title>$title</title>"
echo "    </head>"
echo "    <body>"
echo "        <h1>$title</h1>"
echo "    </body>"
echo "</html>"
```

By creating a **variable** named `title` and assigning it the value **System Information Report**, we can take advantage of parameter expansion and place the string in multiple locations.

So, how do we create a variable? Simple, we just use it. **When the shell encounters a variable, it automatically creates it**. This differs from many programming languages in which variables must be explicitly declared or defined before use. The shell is very lax(不严格的；松弛的) about this, which can lead to some problems.

A **common convention** is to use **uppercase letters** to designate **constants** and **lowercase letters** for **variables**.

```bash
#!/bin/bash

# Program to output a system information

TITLE="System Information Report For $HOSTNAME"

echo "<html>"
echo "    <head>"
echo "        <title>$TITLE</title>"
echo "    </head>"
echo "    <body>"
echo "        <h1>$TITLE</h1>"
echo "    </body>"
echo "</html>"
```

## Assigning Values to Variables and Constants

Here is where our knowledge of expansion really starts to pay off. As we have seen, variables are assigned values this way:

```txt
variable=value
```

where `variable` is the name of the variable and `value` is a string. Unlike some other programming languages, the shell does not care about the type of data assigned to a variable; it treats them all as **strings**.

Note that in an assignment, there must be **no spaces** between **the variable name**, **the equal sign**, and **the value**. So, what can the value consist of? It can have anything that we can expand into a string.

```txt
a=z                    # Assign the string "z" to variable a.
b="a string"           # Embedded spaces must be within quotes.
c="a string and $b"    # Other expansions such as variables can be
                       # expanded into the assignment.
d="$(ls -l foo.txt)"   # Results of a command.
e=$((5 * 7))           # Arithmetic expansion.
f="\t\ta string\n"     # Escape sequences such as tabs and newlines.
```

During **expansion**, variable names may be surrounded by **optional braces**, `{}`. This is useful in cases where a variable name becomes ambiguous because of its surrounding context.

Multiple variable assignments may be done on a single line.

```txt
a=5 b="a string"
```

**Note**: It's good practice is to enclose variables and command substitutions in **double quotes** to limit the effects of word-splitting by the shell. Quoting is especially important when a variable might contain a filename.

```bash
#!/bin/bash

# Program to output a system information

TITLE="System Information Report For $HOSTNAME"
CURRENT_TIME="$(date +"%x %r %Z")"
TIMESTAMP="Generated $CURRENT_TIME, by $USER"

echo "<html>"
echo "    <head>"
echo "        <title>$TITLE</title>"
echo "    </head>"
echo "    <body>"
echo "        <h1>$TITLE</h1>"
echo "        <p>$TIMESTAMP</p>"
echo "    </body>"
echo "</html>"

```
