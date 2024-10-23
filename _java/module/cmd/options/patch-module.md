---
title: "--patch-module"
sequence: "104"
---

The compiler and run-time option

```text
--patch-module ${module}=${artifact}
```

merges all classes from `${artifact}` into `${module}`.

## split packages

Now you know that you can use `--patch-module` to mend the split:

```text
javac
      --add-modules java.xml.ws.annotation
      --patch-module java.xml.ws.annotation=jsr305-3.0.2.jar
      --class-path 'libs/*'
      -d classes/monitor.rest
      ${source-files}
```

## Module.addOpens()

```text
public boolean openJavaLangTo(Module module) {
    Module base = Object.class.getModule();
    base.addOpens("java.lang", module);
    return base.isOpen("java.lang", module);
}
```

```text
java --patch-module java.base=open.up.jar --module java.base/open.up.Main
```

```text
WARNING: module-info.class ignored in patch: open.up.jar
```
