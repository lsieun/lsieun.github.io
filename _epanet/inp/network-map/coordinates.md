---
title: "COORDINATES"
sequence: "coordinate"
---

The `[COORDINATES]` assigns map coordinates to network nodes.

**Format**

One line for each node containing:

- Node ID label
- X-coordinate
- Y-coordinate

**Remarks**

- Include one line for each node displayed on the map.
- The coordinates represent the distance from the node to an arbitrary origin at the **lower left of the map**.
  Any convenient units of measure for this distance can be used.
- There is no requirement that all nodes be included in the map, and their locations need not be to actual scale.
- A `[COORDINATES]` section is optional and is not used at all when EPANET is run as a console application.

**Example**

```text
[COORDINATES]
;Node     X-Coord.     Y-Coord
;-------------------------------
  1       10023        128
  2       10056        95
```
