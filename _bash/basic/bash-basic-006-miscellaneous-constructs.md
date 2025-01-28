---
title: "Miscellaneous Constructs"
sequence: "106"
---

[UP](/bash.html)


## Brackets

- `if [ CONDITION ]`: Test construct
- `if [[ CONDITION ]]`: Extended test construct
- `Array[1]=element1`: Array initialization
- `[a-z]`: Range of characters within a Regular Expression

## Curly Brackets

- `${variable}`: Parameter substitution
- `${!variable}`: Indirect variable reference
- `{ command1; command2; . . . commandN; }`: Block of code
- `{string1,string2,string3,...}`: Brace expansion
- `{a..z}`: Extended brace expansion
- `{}`: Text replacement, after `find` and `xargs`

```bash
$ echo {a..z}
a b c d e f g h i j k l m n o p q r s t u v w x y z

$ echo {a,b,c}
a b c
```

## Parentheses

- `( command1; command2 )`: Command group executed within a subshell
- `Array=(element1 element2 element3)`: Array initialization
- `result=$(COMMAND)`: Command substitution, new style
- `>(COMMAND)`: Process substitution
- `<(COMMAND)`: Process substitution

## Double Parentheses

- `(( var = 78 ))`: Integer arithmetic
- `var=$(( 20 + 5 ))`: Integer arithmetic, with variable assignment
- `(( var++ ))`: C-style variable increment
- `(( var-- ))`: C-style variable decrement
- `(( var0 = var1<98?9:21 ))`: C-style ternary operation

## Quoting

- `"$variable"`: "Weak" quoting
- `'string'`: 'Strong' quoting

- [Single Quotes](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#Single-Quotes)

Enclosing characters in single quotes (`'`) preserves the literal value of each character within the quotes.
A single quote may not occur between single quotes, even when preceded by a backslash.

- [Double Quotes](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#Double-Quotes)

Enclosing characters in double quotes (`"`) preserves the literal value of all characters within the quotes,
with the exception of `$`, <code>`</code>, `\`, and, when history expansion is enabled, `!`.

## Back Quotes

- result=`COMMAND`: Command substitution, classic style

## Reference

- [Reference Cards](http://tldp.org/LDP/abs/html/refcards.html)
