---
title: "BACKDROP"
sequence: "backdrop"
---

The `[BACKDROP]` identifies a backdrop image and dimensions for the network map.

**Format**:

- `DIMENSIONS`: `LLx LLy URx URy`
- `UNITS`: `FEET`/`METERS`/`DEGREES`/`NONE`
- `FILE`: `filename`
- `OFFSET`: `X Y`

**Definitions**:

**DIMENSIONS** provides the X and Y coordinates of the lower-left and upper-right corners of the map's bounding rectangle.
Defaults are the extents of the nodal coordinates supplied in the `[COORDINATES]` section.

**UNITS** specifies the units that the map's dimensions are given in. Default is `NONE`.

`FILE` is the name of the file that contains the backdrop image.

**OFFSET** lists the X and Y distance that the upper-left corner of the backdrop image is offset from
the upper-left corner of the map's bounding rectangle. Default is **zero** offset.

**Remarks**:

- The `[BACKDROP]` section is optional and is not used at all when EPANET is run as a console application.
- Only Windows Enhanced Metafiles and bitmap files can be used as backdrops.
