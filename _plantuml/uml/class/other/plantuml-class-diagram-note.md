---
title: "Note"
sequence: "104"
---

[UP](/plantuml/plantuml-index.html)


## Notes and stereotypes

Stereotypes are defined with the `class` keyword, `<<` and `>>`.

You can also define notes using `note left of`, `note right of`, `note top of`, `note bottom of` keywords.

You can also define a note on the last defined class using `note left`, `note right`, `note top`, `note bottom`.

A note can be also define alone with the `note` keywords, then linked to other objects using the `..` symbol.

```plantuml
@startuml
class Object << general >>
Object <|--- ArrayList

note top of Object : In java, every class\nextends this one.

note "This is a floating note" as N1
note "This note is connected\nto several objects." as N2
Object .. N2
N2 .. ArrayList

class Foo
note left: On last defined class

@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-note-basic.svg)

## HTML

```plantuml
@startuml

class Foo
note left: On last defined class

note top of Foo
  In java, <size:18>every</size> <u>class</u>
  <b>extends</b>
  <i>this</i> one.
end note

note as N1
  This note is <u>also</u>
  <b><color:royalBlue>on several</color>
  <s>words</s> lines
  And this is hosted by <img:tweet.png>
end note

@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-note-html.svg)

## Note on links

It is possible to add a note on a link, just after the link definition, using `note on link`.

You can also use `note left on link`, `note right on link`, `note top on link`, `note bottom on link`
if you want to change the relative position of the note with the label.

```plantuml
@startuml

class Dummy
Dummy --> Foo : A link
note on link #red: note that is red

Dummy --> Foo2 : Another link
note right on link #green
this is my note on right link
and in green
end note

@enduml
```

![](/assets/images/uml/plantuml/class/class-diagram-note-link.svg)
