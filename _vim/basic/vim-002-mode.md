---
title: "Three Modes: Normal/Insert/Visual Mode"
sequence: "102"
---

- Normal Mode
- Insert Mode
- Visual Mode

- `i`: **Insert mode**. Type `ESC` to return to **Normal mode**.

```text
vim  ---> 
             normal mode
                            ---> insert mode
                            <---
             normal mode
exit <---
```  

## 进入 Insert Mode

- `a`: insert after the cursor
- `o`: insert a new line after the current one
- `O`: insert a new line before the current one
- `cw`: replace from the cursor to the end of the word

## Load/Save/Quit/Change File (Buffer)

- `:e <path/to/file>`: open
- `:w`: save
- `:saveas <path/to/file>`: save to <path/to/file>
- `:x`, `ZZ` or `:wq`: save and quit (:x only save if necessary)
- `:q!`: quit without saving, also: :qa! to quit even if there are modified hidden buffers.
- `:bn` (resp. `:bp`): show next (resp. previous) file (buffer)
