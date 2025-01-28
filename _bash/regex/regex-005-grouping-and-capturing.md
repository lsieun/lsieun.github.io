---
title: "Grouping and Capturing"
sequence: "105"
---

[UP](/bash.html)


## Grouping

Grouping is used for two reasons.

### To be able to specify the group as optional

If you're grouping something, you can use the `?` symbol to mark it as optional.

Given the word: **Banana**

`/Ban(ana)?/` matches both `Ban` and `Banana`.

### To capture the selection

A group automatically becomes a different result in the final outcome of the matching function.

## Backreferences

You can reference a group in the same regex pattern by using its **index number** and the **backslash**, like so: `\1`.

For example, if you wanted to select the contents of multiple possible HTML tags, you could use:

```txt
/<(title|header|body)>(.*?)<\/\1>/
```

That will match anything between `<title>` and `</title>`, `<header>` and `</header>` or `<body>` and `</body>`.

Note that we're also using **backslash** for the forward slash `/` inside the closing HTML tag(`</title>`), because otherwise that would be treated as the regex delimitator and would result in an error, because there is some other stuff after it that get treated as flags.
