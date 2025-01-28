---
title: "Filter Order"
sequence: "105"
---

If you have multiple filters applied to the same resource and the order of invocation is important,
you have to use the deployment descriptor to manage which filter should be invoked first.
For example, if Filter1 must be invoked before Filter2,
the declaration of Filter1 should appear before
the declaration of Filter2 in the deployment descriptor.

```text
<filter>
    <filter-name>Filter1</filter-name>
    <filter-class>
        the fully-qualified name of the filter class
    </filter-class>
</filter>
<filter>
    <filter-name>Filter2</filter-name>
    <filter-class>
        the fully-qualified name of the filter class
    </filter-class>
</filter>
```


