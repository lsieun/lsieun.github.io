---
title: "macros"
sequence: "105"
---

`qa` do something `q`, `@a`, `@@`

`qa` record your actions in the register `a`.
Then `@a` will replay the macro saved into the register `a` as if you typed it.
`@@` is a shortcut to replay the last executed macro.

Example

On a line containing only the number 1, type this:

- `qaYp<C-a>q` →
    - `qa` start recording.
    - `Yp` duplicate this line.
    - `<C-a>` increment the number.
    - `q` stop recording.
- `@a` → write 2 under the 1
- `@@` → write 3 under the 2
- Now do `100@@` will create a list of increasing numbers until 103.

![](/assets/images/vim/macros.gif)

