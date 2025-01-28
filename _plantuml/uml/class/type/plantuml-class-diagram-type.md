---
title: "类"
sequence: "101"
---

[UP](/plantuml/plantuml-index.html)


## Basic

```plantuml
@startuml

abstract class MyAbstractClass
annotation MyAnnotation
circle MyCircle
class MyClass
class MyClassStereo <<stereotype>>
diamond MyDiamond
entity MyEntity
enum TimeUnit {
    DAYS
    HOURS
    MINUTES
}
exception MyException
interface MyInterface
metaclass MyMetaclass
protocol MyProtocol
stereotype MyStereotype
struct MyStruct

@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-type-declare.svg)

## Hide Classes

You can also use the `show/hide` commands to hide classes.

This may be useful if you define a large [!included file],
and if you want to hide some classes after [file inclusion].

```plantuml
@startuml

class Foo1
class Foo2

Foo2 *-- Foo1

hide Foo2

@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-type-hide.svg)

## Remove classes

You can also use the `remove` commands to remove classes.

This may be useful if you define a large [!included file],
and if you want to hide some classes after [file inclusion].

```plantuml
@startuml

class Foo1
class Foo2

Foo2 *-- Foo1

remove Foo2

@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-type-remove.svg)

## Hide or Remove unlinked class

```plantuml
@startuml
class C1
class C2
class C3
C1 -- C2
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-type-unlink-raw.svg)

```plantuml
@startuml
class C1
class C2
class C3
C1 -- C2

hide @unlinked
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-type-unlink-hide.svg)

```plantuml
@startuml
class C1
class C2
class C3
C1 -- C2

remove @unlinked
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-type-unlink-remove.svg)

## Reference

- [Class Diagram](https://plantuml.com/class-diagram)
