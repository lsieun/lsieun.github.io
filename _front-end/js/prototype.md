---
title: "prototype"
sequence: "202"
---

```html
<script type="text/javascript">
    function Parent() {
        this.a = 111;
    }
    
    Parent.prototype.say = function () {
        console.log("Hello");
    }
    
    function Child() {
        Parent.call(this);
    }
    
    // Child.prototype = Object.create(Parent.prototype);
    if (!Object.create) {
        Object.create = function (proto) {
            function F() {}
            F.prototype = proto;
            return new F();
        };
    }
    Child.prototype = Object.create(Parent.prototype);
    
    var child1 = new Child();
    var child2 = new Child();
</script>
```
