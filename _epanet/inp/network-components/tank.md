---
title: "TANKS"
sequence: "tank"
---

The `[TANKS]` defines all tank nodes contained in the network.

```text
                          ┌─── name
                          │
                          ├─── description
        ┌─── node ────────┤
        │                 │                                      ┌─── x
        │                 │                   ┌─── coordinate ───┤
        │                 └─── position ──────┤                  └─── y
        │                                     │
        │                                     └─── elevation
        │
        │                 ┌─── diameter
        │                 │
        │                 │                ┌─── initial level
        │                 │                │
        │                 ├─── depth ──────┼─── minimum level
TANK ───┼─── hydraulic ───┤                │
        │                 │                └─── maximum level
        │                 │
        │                 │                ┌─── minimum volume
        │                 │                │
        │                 └─── volume ─────┼─── volume curve
        │                                  │
        │                                  └─── can overflow
        │
        │                                  ┌─── initial quality
        │                 ┌─── quality ────┤
        │                 │                └─── source  quality
        └─── quality ─────┤
                          │                ┌─── mixing model
                          │                │
                          └─── reaction ───┼─── mixing fraction
                                           │
                                           └─── reaction coefficient
```

**Format:**

One line for each tank containing:

- ID label
- Bottom elevation, (m)
- Initial water level, (m)
- Minimum water level, (m)
- Maximum water level, (m)
- Nominal diameter, (m)
- Minimum volume, (cubic meters)
- Volume curve ID (optional)
- Overflow indicator (`YES` / `NO`) (optional)

**Remarks**:

- Water surface elevation equals bottom elevation plus water level.
- Non-cylindrical tanks can be modeled by specifying a curve of volume versus water depth in the `[CURVES]` section.
- If a volume curve is supplied, the `diameter` value can be any non-zero number
- Minimum volume (tank volume at minimum water level) can be zero for a cylindrical tank or if a volume curve is supplied.
- If the overflow indicator is `YES` then the tank is allowed to overflow once it reaches it maximum water level.
  The default is no overflow.
- If the tank does not use a volume curve then an asterisk (`*`) can be used as a placeholder for it
  if an overflow indicator is specified.
- A network must contain at least one tank or reservoir.

**Example**:

```text
[TANKS]
;ID   Elev.  InitLvl  MinLvl  MaxLvl  Diam  MinVol  VolCurve
;-----------------------------------------------------------
;Cylindrical tank
T1    100     15       5       25     120    0
;Non-cylindrical tank with arbitrary diameter
T2    100     15       5       25      1     0      VC1
```

```text
[TANKS] 
;ID   Elev.  InitLvl  MinLvl  MaxLvl  Diam  MinVol  VolCurve  Overflow 
;--------------------------------------------------------------------- 
;Cylindrical tank that can overflow
T1    100     15       5       25     120   0       *          YES 

;Non-cylindrical tank with arbitrary diameter
T2   100     15       5       25     1     0        VC1
```

