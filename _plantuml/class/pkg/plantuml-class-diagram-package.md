---
title: "Packages"
sequence: "105"
---

[UP](/plantuml/plantuml-index.html)


## Basic

You can define a package using the `package` keyword,
and optionally declare a background color for your package (Using a html color code or name).

Note that package definitions can be nested.

```plantuml
@startuml

package "Classic Collections" #DDDDDD {
  Object <|-- ArrayList
}

package com.plantuml {
  Object <|-- Demo1
  Demo1 *- Demo2
}

@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-package-01.svg)

## Packages style

There are different styles available for packages.

You can specify them either by setting a default style with the command: `skinparam packageStyle`,
or by using a stereotype on the package:

```plantuml
@startuml
scale 750 width
package foo1 <<Node>> {
  class Class1
}

package foo2 <<Rectangle>> {
  class Class2
}

package foo3 <<Folder>> {
  class Class3
}

package foo4 <<Frame>> {
  class Class4
}

package foo5 <<Cloud>> {
  class Class5
}

package foo6 <<Database>> {
  class Class6
}
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-package-02.svg)

## Automatic package creation

You can define another separator (other than the dot) using the command : `set separator ???`.

```plantuml
@startuml

set separator ::
class X1::X2::foo {
  some info
}

@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-package-03.svg)

You can disable automatic namespace creation using the command `set separator none`.

```plantuml
@startuml

set separator none
class X1.X2.foo {
  some info
}

@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-package-04.svg)

## 多级包名布局

```plantuml
@startuml
class A.B.C.D.Z {
}
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-package-layout-01.svg)

```plantuml
@startuml
set separator none
class A.B.C.D.Z {
}
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-package-layout-02.svg)

```plantuml
@startuml
set separator none
package A.B.C.D {
  class Z {
  }
}
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-package-layout-03.svg)

```plantuml
@startuml
!pragma useIntermediatePackages false
class A.B.C.D.Z {
}
@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-package-layout-04.svg)
