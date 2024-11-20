---
title: "Changing Style"
sequence: "103"
---

[UP](/plantuml/plantuml-index.html)

```plantuml
@startmindmap

* MindMap
    * selector
        * element
            *[#lightgreen] node
                *[#lightgreen] :depth(n)
                *[#lightgreen] boxless
        * class
            *[#lightgreen] .your_style_name
                *_ node
            *[#lightgreen] .your_style_name *
                *_ branch

left side
    * style
        * color
            *[#lightgreen] FontColor
            *[#lightgreen] BackgroundColor

@endmindmap
```

## selector

### element

#### node

```text
@startmindmap
<style>
mindmapDiagram {
    node {
        BackgroundColor lightGreen
    }
}
</style>
* Linux
    * NixOS
    * Debian
        *_ Ubuntu
            * Linux Mint
            * Kubuntu
            * Lubuntu
            * KDE Neon
@endmindmap
```

```plantuml
@startmindmap
<style>
mindmapDiagram {
    node {
        BackgroundColor lightGreen
    }
}
</style>
* Linux
    * NixOS
    * Debian
        *_ Ubuntu
            * Linux Mint
            * Kubuntu
            * Lubuntu
            * KDE Neon
@endmindmap
```

#### depth

```plantuml
@startmindmap
<style>
mindmapDiagram {
    node {
        BackgroundColor lightGreen
    }
    :depth(1) {
      BackGroundColor white
    }
}
</style>
* Linux
    * NixOS
    * Debian
        *_ Ubuntu
            * Linux Mint
            * Kubuntu
            * Lubuntu
            * KDE Neon
@endmindmap
```

#### boxless

```plantuml
@startmindmap
<style>
mindmapDiagram {
    node {
        BackgroundColor lightGreen
    }
    boxless {
        FontColor darkgreen
    }
}
</style>
* Linux
    * NixOS
    * Debian
        *_ Ubuntu
            * Linux Mint
            * Kubuntu
            * Lubuntu
            * KDE Neon
@endmindmap
```

### class

### Apply style to a node

```text
@startmindmap
<style>
mindmapDiagram {
    .green {
        BackgroundColor lightgreen
    }
    .rose {
        BackgroundColor #FFBBCC
    }
    .your_style_name {
        BackgroundColor lightblue
    }
}
</style>
* root node
    * some first level node <<green>>
        * second level node <<rose>>
        * another second level node <<your_style_name>>
    * another first level node <<green>>
@endmindmap
```

```plantuml
@startmindmap
<style>
mindmapDiagram {
    .green {
        BackgroundColor lightgreen
    }
    .rose {
        BackgroundColor #FFBBCC
    }
    .your_style_name {
        BackgroundColor lightblue
    }
}
</style>
* root node
    * some first level node <<green>>
        * second level node <<rose>>
        * another second level node <<your_style_name>>
    * another first level node <<green>>
@endmindmap
```

### Apply style to a branch

```text
@startmindmap
<style>
mindmapDiagram {
    .myStyle * {
        BackgroundColor lightgreen
    }
}
</style>
* root
    * b1 <<myStyle>>
        * b11
        * b12
    * b2
@endmindmap
```

```plantuml
@startmindmap
<style>
mindmapDiagram {
    .myStyle * {
        BackgroundColor lightgreen
    }
}
</style>
* root
    * b1 <<myStyle>>
        * b11
        * b12
    * b2
@endmindmap
```
