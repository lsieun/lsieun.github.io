---
title: "Different Brackets"
sequence: "107"
---

[UP](/bash.html)


## The parentheses (`(` and `)`)

They're used in combination to signify a “group.”

To select that part of the regex separately from the given string.

`/<title>(.*)</title>/` will match `<title>Learn Regex with CodePicky</title>`, but it will also return **Learn Regex with CodePicky** separately.

This is useful when you're interested only in parts of the matching string, but the pattern needed to be bigger to match the relevant stuff.

## The square brackets (`[` and `]`)

They create a group of possible character matchings. If you want to match the letter `a` or the letter `b`, you type `[ab]` or `[ba]`.

They're very powerful as you'll see later.

## The curly braces (`{` and `}`)

They are similar to the **dot** and **plus symbols**, in that they specify how many times an instruction repeats itself.

`/a{1,3}/` means that a might repeat `1` to `3` times, this matches `a`, `aa` and `aaa`.

`/a{1,}/` means that a repeats one or more times. It is equivalent to `+`

`/a{0,}/` means that a repeats zero or more times. It is equivalent to `*`

## The angle brackets (`<` and `>`)

The characters "\<" and "\>" are similar to the "^" and "$" anchors, as they don't occupy a position of a character. They do "anchor" the expression between to only match if it is on a **word boundary**. The pattern to search for the word "the" would be "`\<[tT]he\>`". The character before the "t" must be either a new line character, or anything except a letter, number, or underscore. The character after the "e" must also be a character other than a number, letter, or underscore or it could be the end of line character.
