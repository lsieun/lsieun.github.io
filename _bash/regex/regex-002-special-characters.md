---
title: "Special Characters"
sequence: "102"
---

[UP](/bash.html)


## The period or dot (`.`)

This matches every single character in the searched string, except for a new line. It is one of the most commonly used special characters in regex, because of its specific ability to match (almost) anything.

`/./` in Alice will match the first letter, A.

You can make it match the new line as well, if you pass in the specific flag. That flag is `s` or `g`, depending of the regex flavour that your programming language uses.

You would use it as such: `/./s` or `/./g`

## The vertical bar or pipe (`|`)

This means “or” and it's used only in combination with other identifiers.

Given: **Alice is the only one in the sentence**.

`/Alice|Bob/` will match and return `Alice`, because `Alice` exists in the sentence and `Bob` does not.

In a scenario where both are present, it will only match the first one.

Given: **Bob is before Alice in this sentence**.

`/Alice|Bob/` will match `Bob`, because it shows up first in the sentence.

## The backslash (`\`)

This is used when you actually want to match the special symbol in a text. Think of the backslash as the ability to cancel out another special character's ability.

`/a+/` will match `a`, `aa`, `aaa … ` and so on.

But if you use the **backslash** before the `+`:

`/a\+/` it will only match `a+`

## Non-Printable Identifiers

### Predefined

`\t` = a tab (0x09)

`\r` = a carriage return (0x0D)

`\n` = a carriage return (0x0A)

`\a` = a bell (0x07)

`\e` = an escape (0x1B)

`\f` = a form feed (0x0C)

A short reminder here that Windows terminates lines with `\r\n`, whereas Linux and Unix use `\n`.

### Encoded

If your flavor of regex supports unicode, you can use `\uFFFF` or `\xFFFF` to match the ASCII representation of `U+FFFF`.
