---
title: "Input File"
sequence: "101"
---

The Input file is a standard EPANET input data file that describes the system being analyzed.

> 作用

The file is organized by sections where each section begins with a keyword enclosed in brackets.

> 组织方式：section

| Network Components | System Operation | Water Quality | Options & Reporting |
|--------------------|------------------|---------------|---------------------|
| [Title]            | [Curves]         | [Quality]     | [Options]           |
| [Junctions]        | [Patterns]       | [Reactions]   | [Times]             |
| [Reservoirs]       | [Energy]         | [Sources]     | [Report]            |
| [Tanks]            | [Status]         | [Mixing]      |                     |
| [Pipes]            | [Controls]       |               |                     |
| [Pumps]            | [Rules]          |               |                     |
| [Valves]           | [Demands]        |               |                     |
| [Emitters]         |                  |               |                     |

The order of sections is not important.
However, whenever a node or link is referred to in a section
it must have already been defined in the
`[JUNCTIONS]`, `[RESERVOIRS]`, `[TANKS]`, `[PIPES]`, `[PUMPS]`, or `[VALVES]` sections.
Thus it is recommended that these sections be placed first.

> 顺序不重要，但最好先放物理组件

Each section can contain one or more lines of data.

- Blank lines can appear anywhere in the file and
- the semicolon (`;`) can be used to indicate that what follows on the line is a comment, not data.
- A maximum of 1024 characters can appear on a line.

> 空行、注释、最大字符数

The ID labels used to identify nodes, links, curves and patterns
can be any combination of up to 31 characters and numbers.

> ID 的最大长度为 31

The input file for command line EPANET is organized in sections, where each section begins with a keyword enclosed in brackets.

<table>
    <caption>EPANET Input File Format</caption>
    <thead>
    <tr>
        <th>
            <p><em>Network</em></p>
            <p><em>Components</em></p>
        </th>
        <th>
            <p><em>System</em></p>
            <p><em>Operation</em></p>
        </th>
        <th>
            <p><em>Water</em></p>
            <p><em>Quality</em></p>
        </th>
        <th><em>Options</em></th>
        <th>
            <p><em>Network</em></p>
            <p><em>Map/Tags</em></p>
        </th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>
            <p>[TITLE]</p>
            <p>[JUNCTIONS]</p>
            <p>[RESERVOIRS]</p>
            <p>[TANKS]</p>
            <p>[PIPES]</p>
            <p>[PUMPS]</p>
            <p>[VALVES]</p>
            <p>[EMITTERS]</p>
        </td>
        <td>
            <p>[CURVES]</p>
            <p>[PATTERNS]</p>
            <p>[ENERGY]</p>
            <p>[STATUS]</p>
            <p>[CONTROLS]</p>
            <p>[RULES]</p>
            <p>[DEMANDS]</p>
        </td>
        <td>
            <p>[QUALITY]</p>
            <p>[REACTIONS]</p>
            <p>[SOURCES]</p>
            <p>[MIXING]</p>
        </td>
        <td>
            <p>[OPTIONS]</p>
            <p>[TIMES]</p>
            <p>[REPORT]</p>
        </td>
        <td>
            <p>[COORDINATES]</p>
            <p>[VERTICES]</p>
            <p>[LABELS]</p>
            <p>[BACKDROP]</p>
            <p>[TAGS]</p>
        </td>
    </tr>
    </tbody>
</table>

The order of sections is not important.
However, whenever a node or link is referred to in a section
it must have already been defined in the `[JUNCTIONS]`, `[RESERVOIRS]`,
`[TANKS]`, `[PIPES]`, `[PUMPS]`, or `[VALVES]` sections.
Therefore, it is recommended that these sections be placed first,
right after the `[TITLE]` section.
**The network map and tags sections**（上表当中的第五列） are not used by command line EPANET
and can be eliminated from the file.

> section的顺序不重要

Each section can contain one or more lines of data.
**Blank lines** can appear anywhere in the file and
**the semicolon** (`;`) can be used to indicate that what follows on the line is a comment, not data.
**A maximum of 255 characters** can appear on a line.
The `ID` labels used to identify **nodes**, **links**, **curves** and **patterns**
can be any combination of up to 31 characters and numbers.

> 每一个section的要求

在每一行数据当中，

- 空行：可以出现在任何地方
- 分号：后面的数据是注释，不用考虑
- 一行字符的最大数量：255
- ID的最大字符数：31

```text
[TITLE]
EPANET TUTORIAL

[JUNCTIONS]
;ID   Elev   Demand
;------------------
2     0      0
3     710    650
4     700    150
5     695    200
6     700    150

[RESERVOIRS]
;ID   Head
;---------
1     700

[TANKS]
;ID  Elev  InitLvl  MinLvl  MaxLvl  Diam  Volume
;-----------------------------------------------
7    850   5        0       15      70    0

[PIPES]
;ID  Node1  Node2  Length  Diam  Roughness
;-----------------------------------------
1    2      3      3000    12    100
2    3      6      5000    12    100
3    3      4      5000    8     100
4    4      5      5000    8     100
5    5      6      5000    8     100
6    6      7      7000    10    100

[PUMPS]
;ID  Node1  Node2  Parameters
;---------------------------------
7    1      2      HEAD  1

[PATTERNS]
;ID   Multipliers
;-----------------------
1       0.5  1.3  1  1.2

[CURVES]
;ID  X-Value  Y-Value
;--------------------
1    1000     200

[QUALITY]
;Node InitQual
;-------------
1     1

[REACTIONS]
Global Bulk -1
Global Wall 0

[TIMES]
Duration           24:00
Hydraulic Timestep 1:00
Quality Timestep   0:05
Pattern Timestep   6:00

[REPORT]
Page      55
Energy    Yes
Nodes     All
Links     All

[OPTIONS]
Units           GPM
Headloss        H-W
Pattern         1
Quality         Chlorine mg/L
Tolerance       0.01

[END]
```

