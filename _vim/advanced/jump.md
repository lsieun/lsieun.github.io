---
title: "jump"
sequence: "105"
---

## word

- `w` → go to the start of the following word,
- `e` → go to the end of this word.

By default, `word`s are composed of letters and the underscore character.
Let's call a `WORD` a group of letter separated by blank characters.
If you want to consider `WORD`S, then just use uppercase characters:

- `W` → go to the start of the following WORD,
- `E` → go to the end of this WORD.

![](/assets/images/vim/word-moves.jpg)

## bracket

- `%` : Go to the corresponding `(`, `{`, `[`.
- `*` (resp. `#`) : go to next (resp. previous) occurrence of the word under the cursor

## single line

- `0`: go to the first column
- `^`: go to the first non-blank character of the line
- `$`: go to the end of line
- `g_`: go to the last non-blank character of line

Most commands can be used using the following general format:

```text
<start position><command><end position>
```

For example : `0y$` means

- `0` → go to the beginning of this line
- `y` → yank from here
- `$` → up to the end of this line

We also can do things like `ye`, yank from here to the end of the word.
But also `y2/foo` yank up to the second occurrence of “foo”.

But what was true for `y` (yank), is also true for
`d` (delete), `v` (visual select), `gU` (uppercase), `gu` (lowercase), etc…

- `fa` → go to next occurrence of the letter `a` on the line.
- `,` (resp. `;`) will find the next (resp. previous) occurrence.
- `t`, → go to just before the character ,.
- `3fa` → find the 3rd occurrence of a on this line.
- `F` and `T` → like `f` and `t` but backward.

![](/assets/images/vim/line-moves.jpg)

A useful tip is: `dt"` → remove everything until the `"`.

## multiple line

- `NG` → Go to line `N`
- `gg` → shortcut for `1G` - go to the start of the file
- `G` → Go to last line

- `/pattern`: search for pattern

## File Jumps

**File jumps** will navigate you to a location **within the current file**,
regardless if that location is seen or not seen within the window.

### AIN'T NO MOUNTAIN HIGH ENOUGH, AIN'T NO VALLEY LOW ENOUGH…

- `gg` : Will take you to the top of the file.
- `G`  : Will take you to the bottom of the file.

```txt
Listen, baby, ain't no mountain high
Ain't no valley low, ain't no river wide enough, baby
If you need me, call me, no matter where you are
No matter how far, don't worry, baby
Just call my name, I'll be there in a hurry
You don't have to worry

'Cause baby, there ain't no mountain high enough
Ain't no valley low enough, ain't no river wide enough
To keep me from getting to you, baby
```

### SENTENCES AND PARAGRAPHS

- `(`: Move a sentence backwards, can take a prefix argument.
    - `5(` - Navigates you 5 sentences backwards.
- `)` : Move a sentence forward, can take a prefix argument.
    - `10)` - Navigates you 10 sentences forwards.
- `{` : Move a paragraph backward, can take a prefix argument.
    - `5{` - Navigates you 5 paragraphs backwards.
- `}` : Move a paragraph forward, can take a prefix argument.
    - `5}` - Navigates you 5 paragraphs forwards.

### SEARCH AND DESTROY

- `/` : Allows you to search forwards for a desired pattern within the file.
    - `/fishsticks` - Searches for all occurences of `fishsticks` ahead of your current cursor.
- `?` : Allows you to search backwards for a desired pattern within the file.
    - `?catdog` - Searches for all occurences of catdog behind your current cursor.
- `n` : Repeats the last `/` or `?` search.
- `N` : Repeats the last `/` or `?` search in the opposite direction.

## Window Jumps

**Window jumps** allow you to move within **the current scope of the window** or **viewport**.

### HIGH, MIDDLE, AND LOW

- `H` : Jumps your cursor to the highest line of the window.
- `M` : Jumps your cursor to the middle line of the window.
- `L` : Jumps your cursor to the lowest line of the window.

## System Wide Jumps

**System jumps** are special; they have the ability to take us to any previously visited file,
regardless if those files are or are not within the same directory.

This is where jump motion really shines!

### JUMP AROUND

Give these next commands a try:

- `CTRL-O` : Jump to our previous position.
- `CTRL-I` : Jump to our next postion.

By pressing these commands repeatedly, you'll see that you are traversing through your recently visited files.

### JUMP LIST

Our recent jumps are stored on our jump list. We can view all the jumps through Vim's command-line mode.
There are three ways to open up the jump list.

- `:jumps` or `:jump` or `:ju` : Opens up the jump list

![](https://i.imgur.com/mFc1cHz.png)

Above is an example of a jump list. There are four columns: **jump**, **line**, **col** and **file/text**.
The numbers underneath the **jump** column are used to prefix our jump command, `CTRL-O` and `CTRL-I`.
We are also given **the position of our cursor** from the line and column columns.
Lastly, the **file/text** column, gives us either **the file path** or,
if the jump is located in our currently opened file, **the line of text**.

Using our example jump list, if we want to jump to the `4`th jump, located within `~/dir2/file.md`,
we'd prefix our previous jump command with the number `4`, i.e. `4CTRL-O`.

Next if we want to get back to our previous position, the line This is another sentence!
we can cycle back to it with a couple of `CTRL-I`s. Cool!

I find that `jump` motion complements `mark` motion really well.
By setting multiple marks in the current file, and flying to different files with jumps,
my workflow has greatly improved.

Hope you give jump motion a try!


## Reference

- [Vim: Jump, Jump, Jump!](https://dockyard.com/blog/2015/02/04/vim-jump-jump-jump)
