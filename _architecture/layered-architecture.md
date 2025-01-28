---
title: "Layered Architecture"
sequence: "101"
---

![三层架构](/assets/images/architecture/three-layer-architecture.png)

- 表现层（presentation layer、user interface layer、view layer）
    - 是什么：就是user interface，这里是application与user进行交流互动的地方。
    - 主要作用：有两个，一个是向user展示信息，另一个是收集user的输入信息。
    - 具体表现形式：可能是一个web browser，可能是一个desktop application，也可能是一个graphical user interface (GUI)。
        - 如果开发的是Web应用程序，那就要用到HTML、CSS和JavaScript等技术。
- 业务逻辑层（business logic layer、application layer、domain logic layer）
    - 是什么：我觉得很难描述清楚
    - 角色：它是整个应用系统的“核心”
    - 作用：从“表现层”采集的数据要在这里进行处理，也要从“数据访问层”读取数据，或者向“数据访问层”保存数据。
    - 开发语言：C#、Java、PHP、Python等
- 数据访问层（data access layer、persistence layer）
    - 关系型数据库：MySQL、Oracle、Microsoft SQL Server
