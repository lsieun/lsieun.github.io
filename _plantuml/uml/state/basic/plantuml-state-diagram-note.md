---
title: "Note"
sequence: "103"
---

[UP](/plantuml/plantuml-index.html)

```plantuml
@startmindmap

* note
    * non-floating
        * state
            * composite state
            * serveral lines
        * link
    * floating

@endmindmap
```

define notes using

- `note left of`
- `note right of`
- `note top of`
- `note bottom of` keywords.

## Note on state

```text
@startuml

[*] --> SomeState

SomeState --> [*]

note right of SomeState : This is a right note
note left of SomeState : This is a left note

@enduml
```

```plantuml
@startuml

[*] --> SomeState

SomeState --> [*]

note right of SomeState : This is a right note
note left of SomeState : This is a left note

@enduml
```

### composite state

You can put notes on **composite states**.

```plantuml
@startuml

[*] --> NotShooting

state "Not Shooting State" as NotShooting {
  state "Idle mode" as Idle
  state "Configuring mode" as Configuring
  [*] --> Idle
  Idle --> Configuring : EvConfig
  Configuring --> Idle : EvConfig
}

note right of NotShooting : This is a note on a composite state

@enduml
```

### several lines

You can also define notes on several lines.

```text
@startuml

[*] --> Active
Active --> Inactive

note left of Active : this is a short note

note right of Inactive
  A note can also
  be defined on
  several lines
end note

@enduml
```

```plantuml
@startuml

[*] --> Active
Active --> Inactive

note left of Active : this is a short note

note right of Inactive
  A note can also
  be defined on
  several lines
end note

@enduml
```

## Note on link

You can put notes on state-transition or link, with `note on link` keyword.

```text
@startuml
[*] -> State1
State1 --> State2
note on link 
  this is a state-transition note 
end note
@enduml
```

```plantuml
@startuml
[*] -> State1
State1 --> State2
note on link 
  this is a state-transition note 
end note
@enduml
```

## floating notes

```text
@startuml

state foo
note "This is a floating note" as N1

@enduml
```

```plantuml
@startuml

state foo
note "This is a floating note" as N1

@enduml
```
