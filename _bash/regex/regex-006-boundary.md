---
title: "Boundary"
sequence: "106"
---

[UP](/bash.html)


## Line Boundary

### The caret (`^`)

This specific symbol has two meanings. In short, when added as the first character in a regex pattern, it means “the beginning of the searched string”, however, if it's used between square brackets, it means “everything but“. Both of these are explained later because they need more context.

Given the string: **Alice asked Bob a question**.

`/^Alice/` will match the string because it starts with `Alice`, but:

`/^Bob/` will not match because it's a different position than zero in the given string.

On the other hand, using the same given string:

`/[^a-z]/i` will match the first space in the string, because `[a-z]` means all letters from `a` to `z`, the `i` flag at the end makes `a-z` match `A-Z` too, and the `^` inside square brackets changes the meaning to “everything but letters from a-z”.

### The dollar sign (`$`)

This means “the end of the searched string”.

Give: **Alice and Bob**

`/Alice$/` does not match anything because the string doesn't end in `Alice`.

But `/Bob$/` matches because the string does end in `Bob`.

## Word Boundary

### `\b`

This is an anchor, just like `^` and `$`.

Anchors don't represent characters themselves, they only specify a higher level of detail for the pattern.

This is useful when you want to select something that might be preceded or followed by any other word.

For example, if you wanted to remove the word `pie` from the following sentence:

```txt
Take this sharpie and draw a pie chart.
```

You'd be tempted to replace `/pie/` with something else, but there is a problem with that approach, because the word `sharpie` also contains “pie” and it would match that pattern too, hence you'd end up with a very surprinsing result.

To fix it, you can use **the word boundary anchor**, `\b` as such:

```txt
/\bpie/
```

As you can see, we added the `\b` where we know that the pattern might be interfering with something else, but in most cases, we'd actually use it in both the front and the back, just to be sure we're not missing anything.

`/\bpie\b/` matches `pie`, when it's surrounded by anything in the `\W` class, but it will not match `sharpie` or `piece`.

### `\<` and `\>`

The characters "\<" and "\>" are similar to the "^" and "$" anchors, as they don't occupy a position of a character. They do "anchor" the expression between to only match if it is on a **word boundary**. The pattern to search for the word "the" would be "`\<[tT]he\>`". The character before the "t" must be either a new line character, or anything except a letter, number, or underscore. The character after the "e" must also be a character other than a number, letter, or underscore or it could be the end of line character.
