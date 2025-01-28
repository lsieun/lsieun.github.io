---
title: "Mvn Debug"
sequence: "113"
---

[UP](/maven-index.html)


- run maven goal with `mvnDebug` instead of `mvn`. E.g. `mvnDebug clean`
- 添加断点。Open the source of the maven plugin you want to debug in intelliJ and set a breakPoint
- In IDEA, add a **Remote JVM Debug** Configuration.
  - Under Settings, set Transport: Socket, Debugger Mode: Attach, Host: localhost, Port: 8000 (default port of mvnDebug).

![](/assets/images/intellij/idea-menu-run-edit-configurations.png)

![](/assets/images/intellij/run-debug-configuration-remote-jvm-debug.png)

![](/assets/images/intellij/maven-remote-debug-configration.png)

Run the Configuration in **Debug** mode. It should connect to the waiting `mvnDebug` jvm.

![](/assets/images/intellij/maven-remote-debug-start.png)

```text
$ mvnDebug hello-mojo:simple
Listening for transport dt_socket at address: 8000
```

## 添加依赖

I think the easiest solution is to temporarily add the maven plugin as a dependency.
Once this is done, IntelliJ will treat this just like any other dependency and you can set breakpoints the usual way.



## 注意事项

### 代码更新，要重新打包

## Reference

- [How to debug a maven goal with intellij idea?](https://stackoverflow.com/questions/14602540/how-to-debug-a-maven-goal-with-intellij-idea)
- [Debug Maven goals](https://www.jetbrains.com/help/idea/work-with-maven-goals.html#debug_goal)
- [Connecting the Intellij IDEA Debugger to a Maven Execution](https://spin.atomicobject.com/2020/08/20/maven-debugging-intellij/)

Remote Debug

- [What are Java command line options to set to allow JVM to be remotely debugged?](https://stackoverflow.com/questions/138511/what-are-java-command-line-options-to-set-to-allow-jvm-to-be-remotely-debugged)
- [JDWP](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/introclientissues005.html)
- [Java Application Remote Debugging](https://www.baeldung.com/java-application-remote-debugging)
