---
title: "分组"
sequence: "103"
---

[UP](/plantuml/plantuml-index.html)


## Advanced class body

By default, methods and fields are automatically regrouped by PlantUML.

You can use separators to define your own way of ordering fields and methods.
The following separators are possible:

- `--`
- `..`
- `==`
- `__`

```plantuml
@startuml
class Foo1 {
  You can use
  several lines
  ..
  as you want
  and group
  ==
  things together.
  __
  You can have as many groups
  as you want
  --
  End of class
}

class User {
  .. Simple Getter ..
  + getName()
  + getAddress()
  .. Some setter ..
  + setName()
  __ private data __
  int age
  -- encrypted --
  String password
}
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-member-advanced.svg)
