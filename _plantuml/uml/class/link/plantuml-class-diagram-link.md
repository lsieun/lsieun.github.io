---
title: "类之间的关系"
sequence: "103"
---

[UP](/plantuml/plantuml-index.html)


| Type        | Symbol | Drawing                                            |
|-------------|--------|----------------------------------------------------|
| Extension   | `<--`  | ![](/assets/images/uml/plantuml/img/extends01.png) |
| Composition | `*--`  | ![](/assets/images/uml/plantuml/img/sym03.png)     |
| Aggregation | `o--`  | ![](/assets/images/uml/plantuml/img/sym01.png)     |

## 基础

### 线形

```plantuml
@startuml
Class01 -- Class02
Class03 .. Class04
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-style-basic.svg)

```plantuml
@startuml
title Bracketed line style with label
class foo
class bar

bar1 : [bold]  
bar2 : [dashed]
bar3 : [dotted]
bar4 : [hidden]
bar5 : [plain] 

foo --> bar          : ∅
foo -[bold]-> bar1   : [bold]
foo -[dashed]-> bar2 : [dashed]
foo -[dotted]-> bar3 : [dotted]
foo -[hidden]-> bar4 : [hidden]
foo -[plain]-> bar5  : [plain]

@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-style-advanced.svg)

### 箭头

```plantuml
@startuml
Class01 .. Class02
Class03 -- Class04
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-arrow-zero.svg)

```plantuml
@startuml
Class01 <|-- Class02
Class03 *.. Class04
Class05 --o Class06
Class07 ..> Class08
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-arrow-one.svg)

```plantuml
@startuml
Class01 <--* Class02
Class03 <|--o Class04
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-arrow-two.svg)

```plantuml
@startuml
Class01 #-- Class02
Class03 x-- Class04
Class05 }-- Class06
Class07 +-- Class08
Class09 ^-- Class10
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-arrow-one-more.svg)

### 颜色

```plantuml
@startuml
title Bracketed line color
class foo
class bar

foo --> bar
foo -[#red]-> bar1
foo -[#green]-> bar2
foo -[#blue]-> bar3
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-color.svg)

### 线宽

```plantuml
@startuml
title Bracketed line thickness
class foo
class bar

foo --> bar                 : ∅
foo -[thickness=1]-> bar1   : [1]
foo -[thickness=2]-> bar2   : [2]
foo -[thickness=4]-> bar3   : [4]
foo -[thickness=8]-> bar4   : [8]
foo -[thickness=16]-> bar5  : [16]

@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-thickness.svg)

## Label on relations

It is possible to add a label on the relation, using `:`, followed by the text of the label.

### 数量关系

For cardinality, you can use double-quotes `""` on each side of the relation.

```plantuml
@startuml

Car "1" *-- "many" Wheel

@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-cardinality.svg)

### 文字

```plantuml
@startuml
Class01 "1" *-- "many" Class02 : contains
Class03 o-- Class04 : aggregation
Class05 --> "1" Class06
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-text.svg)

### 行为发起者

You can add an extra arrow pointing at one object showing
which object acts on the other object, using `<` or `>` at the beginning or at the end of the label.

```plantuml
@startuml
Driver - Car : drives >
Car *- Wheel : have 4 >
Car -- Person : < owns
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-act.svg)

## Extends and implements

It is also possible to use `extends` and `implements` keywords.

```plantuml
@startuml
interface Collection
interface List extends Collection

abstract class AbstractList
class ArrayList extends AbstractList implements List
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-super-01.svg)

```plantuml
@startuml
class A extends B, C {
}
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-super-02.svg)

## Arrows from/to class members

```plantuml
@startuml
class Foo {
+ field1
+ field2
}

class Bar {
+ field3
+ field4
}

Foo::field1 --> Bar::field3 : foo
Foo::field2 --> Bar::field4 : bar
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-link-class-member.svg)
