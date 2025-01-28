---
title: "ContextEnabled"
sequence: "106"
---

[UP](/maven-index.html)


## ContextEnabled

```java
/**
 * Interface to allow Mojos to communicate with each others Mojos,
 * other than project's source root and project's attachment.
 * 
 * The plugin manager would pull the context out of the plugin container context, and populate it into the Mojo.
 */
public interface ContextEnabled {
    /**
     * Set a new shared context <code>Map</code> to a mojo before executing it.
     *
     * @param pluginContext a new <code>Map</code>
     */
    void setPluginContext(Map pluginContext);

    /**
     * @return a <code>Map</code> stored in the plugin container's context.
     */
    Map getPluginContext();
}
```
