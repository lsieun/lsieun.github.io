---
title: "Character Classes"
sequence: "103"
---

[UP](/bash.html)


Also called character sets, these are groups of characters from wich only one is matched in the given string.

`/gr[ae]y/` where `[ae]` is the character set, will match both grey and gray.

`/[0\\]x[a-fA-F0-9]{2}/` will match any HEX encoded char if it starts with `0x` or `\x`.

## 1. The square brackets (`[` and `]`)

### 1.1. Negated Classes

The same classes, if we add `^` at the beginning, will express the opposite.

`/[^a-z]/` will match any character that is not a letter from `a` to `z`.

### 1.2. Special Symbols Inside Classes

The special characters inside character do not have special effects.

`/[.]/` will only match `.`

`/[+]/` will match only `+`

… and so on.

Because `-` acts as an interval middle-man, if you want to look for a hyphen inside your class, you need to add it either **at the very beginning**, or **at the very end**:

`/[a-z-]/` and `/[-a-z]/` will match a letter from `a` to `z` or a **hyphen**.

### 1.3. Repeated and Optional Classes

You can combine `?`, `*`, `+` and `{X,Y}` to classes to make them repeat or optional.

`/[a-z]+/` will match anything made out of letters from `a` to `z`.

## 2. pre-defined Character Classes

### 2.1. Shorthands for Character Classes

There are a few pre-defined shorthands for commonly-used classes.

`/\d/` is an alias of `/[0-9]/` and it matches a digit.

`/\w/` is an alias of `/[a-zA-Z0-9_]/` and it matches a “word character”.

`/\s/` is an alias of `/[ \t\r\n\f]/` and it matches any type of **space**, including **new lines**.

### 2.2. Negated shorthands

We also have available their counterparts that select the opposite characters as do the ones above.

`/\D/` is the same thing as `/[^\d]/` and it matches anything but a digit character.

`/\W/` is the same thing as `/[^\w]/` and it matches anything but a word character.

`/\S/` is the same thing as `/[^\s]/` and it matches anything but a space character.

Because, if you remember, the `^` means “anything but”.
