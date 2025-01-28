---
title: "Script Examples"
sequence: "110"
---

[UP](/bash.html)


File: `printf_in_action.sh`

```bash
#!/bin/bash
# printf demo

PI=3.14159265358979

echo

printf "Pi to 2 decimal places = %1.2f" $PI
echo
printf "Pi to 9 decimal places = %1.9f" $PI  # It even rounds off correctly.
printf "\n"                                  # Prints a line feed,
                                             # Equivalent to 'echo' . . .

```

File: `read_in_action.sh`

```bash
#!/bin/bash
# "Reading" variables.

echo -n "Enter the value of variable 'var1': "
# The -n option to echo suppresses newline.

read var1
# Note no '$' in front of var1, since it is being set.

echo "var1 = $var1"


echo

# A single 'read' statement can set multiple variables.
echo -n "Enter the values of variables 'var2' and 'var3' "
echo =n "(separated by a space or tab): "
read var2 var3
echo "var2 = $var2      var3 = $var3"
#  If you input only one value,
#+ the other variable(s) will remain unset (null).

exit 0
```
