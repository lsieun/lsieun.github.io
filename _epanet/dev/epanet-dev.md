---
title: "epanet-dev"
sequence: "101"
---

## epanet-dev

[OpenWaterAnalytics/epanet-dev](https://github.com/OpenWaterAnalytics/epanet-dev)

- 数据校验：`src/Core/diagnostics.cpp`
- 生成 INP 文件：`src/Output/projectwriter.cpp`
- 解析 INP 文件：`src/Input`
    - `src/Input/inputreader.cpp`
        - `InputReader::readFile`
    - `src/Input/inputparser.cpp`
    - `src/Input/nodeparser.cpp`
        - parseNodeData
            - parseJuncData
            - parseResvData
            - parseTankData
        - parseDemand
        - parseEmitter
        - parseCoords
        - parseInitQual
        - parseQualSource
        - parseTankMixing
        - parseTankReact
    - `src/Input/linkparser.cpp`
        - parseLinkData
            - parsePipeData
            - parsePumpData
            - parseValveData
        - parseStatus
        - parseLeakage
        - parseEnergy
        - parseReaction

```text
InputParser
    ObjectParser
    PropertyParser
```

## EPANET-2.2

[OpenWaterAnalytics/EPANET](https://github.com/OpenWaterAnalytics/EPANET)

- 生成 INP 文件：`src/inpfile.c` 中的 `saveinpfile(Project *pr, const char *fname)` 方法
- 解析 INP 文件：
    - `src/input2.c`
        - `newline(Project *pr, int sect, char *line)` 方法
    - `src/input3.c`
        - `JUNCTIONS`:  `juncdata(Project *pr)` 方法
        - `RESERVOIRS` or `TANKS`：`tankdata(Project *pr)`
        - `PIPES`: `pipedata(Project *pr)`
        - `PUMPS`: `pumpdata(Project *pr)`
        - `VALVES`: `valvedata(Project *pr)`
        - `PATTERNS`: `patterndata(Project *pr)`
        - `CURVES`: `curvedata(Project *pr)`
        - `COORDS`: `coordata(Project *pr)`
        - `DEMANDS`: `demanddata(Project *pr)`
        - `RULES`: `controldata(Project *pr)`
        - `SOURCES`: `sourcedata(Project *pr)`
        - `EMITTERS`: `emitterdata(Project *pr)`
        - `QUALITY`: `qualdata(Project *pr)`
        - `REACTIONS`: `reactdata(Project *pr)`
        - `MIXING`: `mixingdata(Project *pr)`
        - `STATUS`: `statusdata(Project *pr)`
        - `ENERGY`: `energydata(Project *pr)`
        - `REPORT`: `reportdata(Project *pr)`
        - `TIMES`: `timedata(Project *pr)`
        - `OPTIONS`: `optiondata(Project *pr)`
        - ``: `optionchoice(Project *pr, int n)`
        - ``: `optionvalue(Project *pr, int n)`
        - ``: `getpumpcurve(Project *pr, int n)`
        - ``: `powercurve(double h0, double h1, double h2, double q1, double q2, double *a, double *b, double *c)`
        - ``: `changestatus(Network *net, int j, StatusType status, double y)`
- 数据校验：`src/input3.c` 中的 `setError` 方法调用之处

- ucf: unit conversion factor
