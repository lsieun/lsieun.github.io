---
title: "Platform"
sequence: "101"
---

```java
package com.intellij.util;

public final class PlatformUtils {
    public static final String PLATFORM_PREFIX_KEY = "idea.platform.prefix";
    public static final String IDEA_PREFIX = "idea";
    public static final String IDEA_CE_PREFIX = "Idea";
    public static final String IDEA_EDU_PREFIX = "IdeaEdu";
    public static final String APPCODE_PREFIX = "AppCode";
    public static final String AQUA_PREFIX = "Aqua";
    public static final String CLION_PREFIX = "CLion";
    public static final String MOBILE_IDE_PREFIX = "MobileIDE";
    public static final String PYCHARM_PREFIX = "Python";
    public static final String PYCHARM_CE_PREFIX = "PyCharmCore";
    public static final String DATASPELL_PREFIX = "DataSpell";
    public static final String PYCHARM_EDU_PREFIX = "PyCharmEdu";
    public static final String RUBY_PREFIX = "Ruby";
    public static final String PHP_PREFIX = "PhpStorm";
    public static final String WEB_PREFIX = "WebStorm";
    public static final String DBE_PREFIX = "DataGrip";
    public static final String RIDER_PREFIX = "Rider";
    public static final String GOIDE_PREFIX = "GoLand";
    public static final String FLEET_PREFIX = "FleetBackend";
    public static final String RUSTROVER_PREFIX = "RustRover";
    public static final String WRITERSIDE_PREFIX = "Writerside";
    /**
     * @deprecated
     */
    @Deprecated
    public static final String CWM_GUEST_PREFIX = "CodeWithMeGuest";
    public static final String JETBRAINS_CLIENT_PREFIX = "JetBrainsClient";
    public static final String GATEWAY_PREFIX = "Gateway";
    private static final Set<String> COMMERCIAL_EDITIONS = new HashSet<>(Arrays.asList(
            "idea", "AppCode", "CLion", "MobileIDE", "Python", "DataSpell",
            "Ruby", "PhpStorm", "WebStorm", "DataGrip", "Rider", "GoLand"));

}
```
