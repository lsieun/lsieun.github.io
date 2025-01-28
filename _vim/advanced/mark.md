---
title: "mark"
sequence: "105"
---

The strength of Vim's basic movement commands are immediately apparent.
We can jump four words over with `4w` or move to the beginning of a sentence with `(`.
Once these movements are engrained to muscle memory, we can move **within files** with ease.
However, there are **certain limitations** to these basic movement commands;
wouldn't it be great if we could move to different and specific spots **within multiple files**?

Today, we're going to briefly cover a poweful motion strategy: `mark` motion.

## What is a Mark?

**Marks** are essentially **hidden positions** that, when set, allow us to jump back to that specific location or line.
What we mean by **hidden** is that these marks are **not visible by default**;
marks are simply invisible points within a file.

- The `mark` motion command starts with hitting `m` - `m` for mark
- and then setting a **destination marker**
  - either **a lowercase letter** or **uppercase letter**.

We'll introduce the differences among the destination markers soon.

Let's start by covering a simple example of setting **a lowercase mark**.

Example: Moving With A Lowercase Mark

```txt
# ~/example1.txt

Here is Line 3
Here is Line 4
Here is Line 5

# On Line #3, use `mn` to set a mark on the letter `n` within the word `Line`.
# Move around the file.
# Go back to the previous mark by hitting: `n
```

1. First, in **Normal mode**, move to Line `#3`.
   Place your cursor on the letter `n` within the word Line.

2. Next, set a mark by hitting `m` and then the lowercase letter `n`.
   `n` is our lowercase destination marker. Congratulations, we've just set a lowercase mark!
   We could of used any lowercase character, but by using the letter `n`, we've setup a nice mnemonic device.

3. Now move to Line `#5`.
   We're going to move to our mark now.
   Hit `` `n `` - **backtick** and `n`, our previous destination marker.

4. Notice where our cursor is (hint: it should be located on the letter `n` within the word `Line`).
   Huzzah, we are now back to our previous position within the file!

5. Go back to Line #5.

6. Now, hit `'n` - **single quote** and `n`.

7. We are now at the beginning of Line `#3`!

## Jumps, Marks and a Few Commands

We know how to set a mark with `m`, but let's clarify the **two types of mark jumps** and the different types of marks.

### Two Types of Mark Jumps

#### BACKTICK

`` `<mark>`` - **The backtick** places our cursor directly on the mark.

#### SINGLE QUOTE

`'<mark>` - **The single quote** takes us to **the first non-blank character** of the mark's line.

### Three Types of Marks

#### LOWERCASE MARKS

**a - z** - These marks preserve locations within **a single file**.
Each individual file possesses 26 settable lowercase marks.
Lowercase marks are valid as long as the file remains in the buffer list.
Furthermore, lowercase marks can be combined with other operators.
For example, `` c`n ``, will change everything between the cursor to the mark `n`.

#### UPPERCASE MARKS

**A - Z** - These marks preserve locations within **multiple files**.
Also known as **file marks**.
These marks, which are shared among all files within the buffer list, can be used to jump from file to file.
File marks can only be used in combination with operators if the mark is in the current file,
i.e. when the current file opened contains the global file mark.

#### NUMBERED MARKS

**0 - 9** - Numbered marks cannot be set directly,
instead they are created automagically and used by the **viminfo-file** (`:help viminfo-file`).
Essentially, the numbered marks store the location of your cursor after closing Vim.
For example, mark `0` returns the position of the cursor during your last Vim session,
while mark `1` returns the next to last Vim session, and so forth.

### Some Pertinent(相关的) Commands

#### VIEWING CURRENT MARKS

`:marks {argument}` - `:marks` will show you all current marks, their file location and destination marker.
We can pass in an argument to view a range of marks between two marks.

- `:marks aC` - will return all marks that are between `a` and `C`.

#### DELETING MARKS

`:delm[arks] {marks}` - We can use `:delm` or `:delmarks` and then pass in marks that we want to delete.

- `:delm aAbB` - will delete marks labeled `a`, `A`, `b` and `B`.

## Okay, What's So Cool About Marks?

Marks can speed up our navigation workflow! Here are a few examples:

**Discussion: Editing One Large File With Lowercase Marks**

I've found **lowercase marks** extremely useful when editing multiple portions of a file.
Instead of using `CTRL+u`, `CTRL+d`, `H`, or `L` to move up and down the file,
you can set local marks at heavily treaded locations at jump back and forth among them.
Moveover, marks give us the ability to jump to **an exact location** - **backtick** -
or to **the beginning of the line** - **single quote**.

**Example: Editing Multiple Files With Uppercase (File) Marks**

When I first started using Vim (and began programming), I had multiple windows open constantly on the monitor.
Not only does it quickly become cluttered(杂乱的), remembering which file is which becomes hairy(可怕的).

**Files marks** to the rescue!

- Here are three files we are want to work on. Let's add some file marks.
- Just like lowercase marks, the actual uppercase letter we use does not matter as long as it is unique.

```ruby
# ~/sheep.rb

# On the word `speak`, place a file mark with `mS` - `S` for "sheep"
def speak
  puts "Baah! Baah!"
end
```

```ruby
# ~/cat.rb

# On the word `speak`, place a file mark with `mC` - `C` for "cat"
def speak
  puts "Meow! Meow!"
end
```

```ruby
# ~/doge.rb

# On the word `speak`, place a file mark with `mD` - `D` for "doge"
def speak
  puts "Wow! Ahh yes method! Such quality!"
end
```

- If we are in `~/sheep.rb` and want to jump to the speak method defined within `~/cat.rb`,
- we can do so with `` `C ``. Now that we're in `~/cat.rb`,
- let's go to the speak method within `~/doge.rb` with `` `D ``. Pretty sweet, huh?

## “X” Marks the Spot

Hope you enjoyed the basics of Vim marks.
We've only covered the basics here, so if you'd like to learn more check the docs.

```vim
:help mark-motions
```


## Reference

- [Vim: On Your Mark...](https://dockyard.com/blog/2014/04/10/vim-on-your-mark)
