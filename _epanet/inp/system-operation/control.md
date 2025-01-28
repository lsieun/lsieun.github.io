---
title: "CONTROLS"
sequence: "control"
---

The `[CONTROLS]` defines simple controls that modify links based on a single condition.

**Format**:

One line for each control which can be of the form:

| 1    | 2      | 3      | 4   | 5         | 6      | 7           | 8     |
|------|--------|--------|-----|-----------|--------|-------------|-------|
| LINK | linkID | status | IF  | NODE      | nodeID | ABOVE/BELOW | value |
| LINK | linkID | status | AT  | TIME      | time   |             |       |
| LINK | linkID | status | AT  | CLOCKTIME | time	  | AM/PM       |       |

where:

- `linkID` = a link ID label
- `status` = `OPEN` or `CLOSED`, **a pump speed setting**, or **a control valve setting**
- `nodeID` = a node ID label
- `value` = a **pressure** for a **junction** or a **water level** for a **tank**
- `time` = a time since the start of the simulation in decimal hours or in `hours:minutes` format
- `time` = a 12-hour clock time (`hours:minutes`)

Remarks:

- Simple controls are used to change **link status or settings**
  based on **tank water level**, **junction pressure**, **time into the simulation or time of day**.
- See the notes for the `[STATUS]` section for conventions used in specifying **link status and setting**,
  particularly for **control valves**.

