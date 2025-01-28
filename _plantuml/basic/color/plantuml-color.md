---
title: "Color"
sequence: "101"
---

[UP](/plantuml/plantuml-index.html)

## 颜色

### 所有

```text
@startuml
colors
@enduml
```

![](/assets/images/plantuml/plantuml-color.svg)

### palette

```text
@startuml
colors chocolate
@enduml
```

![](/assets/images/plantuml/plantuml-color-palette.svg)

## 挑选

```plantuml
@startuml
skinparam minClassWidth 125
skinparam nodesep 10
skinparam ranksep 10

rectangle tomato        #tomato
rectangle orange        #orange
rectangle violet        #violet
rectangle pink          #pink

rectangle yellow        #yellow
rectangle gold          #gold
rectangle silver        #silver
rectangle wheat         #wheat

rectangle skyblue       #skyblue
rectangle lightblue     #lightblue
rectangle lightgreen    #lightgreen
rectangle aqua          #aqua
@enduml

```


## 参考

- [Colors](https://plantuml.com/color)