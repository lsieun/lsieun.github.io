---
title: "Character Count"
sequence: "104"
---

[UP](/bash.html)


## The asterisk or star (`*`)

This is a repetition symbol, stating that the instruction to the left of it might exist `0` or **multiple times**.

It's often used in combination with **the dot symbol** to mean “there might be something here, but I don't know how long or short or if at all.”

In our first example, where we wanted to get the title of web page, we used as example:

```txt
<title>(.*)</title>
```

Which matches anything in between the title attributes.

## The plus (+)

This is basically the same as **the star symbol**, with the only difference that it expects the instruction it represents to repeat **one** or **more times**, instead of zero or more times.

`/abc+/` will match `abc`, `abcc`, but it will not match `ab`.

## The question mark (?)

This symbol means “optional” or “the pattern to my left might or might not exists”.

`/colou?r/` would match both `color` and `colour` in a given string because `?` makes `u` optional.

It also has another meaning. If placed before another set of instructions, it will make it less “greedy”.

Given: **I have an apple & an orange**.

`/I have an.* [a-z]/` might look like it's going to match `I have an a` but, in fact, it will match `I have an apple & an o` because `.*` means “anything that repeats 0 or more times” and the pattern stops in a letter from `a` to `z`, but by default, it will stop in the last letter, not the first.

However, adding `?` after `.*` will specify that it shouldn't stop in the last occurrence of the rest of the pattern, but the first.

`/I have an.*? [a-z]/` will now match `I have an a`.

## The curly braces (`{` and `}`)

They are similar to the **dot** and **plus symbols**, in that they specify how many times an instruction repeats itself.

`/a{1,3}/` means that a might repeat `1` to `3` times, this matches `a`, `aa` and `aaa`.

`/a{1,}/` means that a repeats one or more times. It is equivalent to `+`

`/a{0,}/` means that a repeats zero or more times. It is equivalent to `*`
