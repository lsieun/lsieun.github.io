---
title: "Include files or URL"
sequence: "101"
---

[UP](/plantuml/plantuml-index.html)


File: `List.iuml`

```text
@startuml
interface List
List : int size()
List : void clear()
List <|.. ArrayList
@enduml

@startuml
interface List2
List2 : int size()
List2 : void clear()
List2 <|.. ArrayList2
@enduml

@startuml(id=MY_List3)
interface List3
List3 : int size()
List3 : void clear()
List3 <|.. ArrayList3
@enduml
```

File: `container.puml`

```text
@startuml
!include List.iuml
!include List.iuml!1
!include List.iuml!MY_List3
@enduml
```

![](/assets/images/uml/plantuml/preprocessing/plantuml-preprocessing-include-example.svg)
