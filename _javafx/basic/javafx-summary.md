---
title: "Summary"
sequence: "107"
---

JavaFX is an open source Java-based GUI framework that is used to develop rich client applications.
It is the successor of Swing in the arena of GUI development technology on the Java platform.

The GUI in JavaFX is shown in a stage.
A **stage** is an instance of the `Stage` class.
A **stage** is a window in a desktop application.
A **stage** contains a **scene**.
A **scene** contains a group of nodes (graphics) arranged in a tree-like structure.

A JavaFX application inherits from the `Application` class.
The JavaFX runtime creates the first stage called the **primary stage** and
calls the `start()` method of the application class passing the reference of the **primary stage**.
The developer needs to add a **scene** to the **stage** and make the **stage** visible inside the `start()` method.

You can launch a JavaFX application using the `launch()` method of the Application class.


During the lifetime of a JavaFX application,
the JavaFX runtime calls predefined methods of the JavaFX Application class in a specific order.
First, the **no-args constructor** of the class is called,
followed by calls to the `init()` and `start()` methods.
When the application terminates, the `stop()` method is called.

You can terminate a JavaFX application by calling the `Platform.exit()` method.
Calling the `Platform.exit()` method when the application is running in a web browser as an applet may not have any effects.

```text
          ┌─── source code ────┼─── Application ───┼─── Stage ───┼─── Scene ───┼─── Node
          │
          │                                      ┌─── Application.launch(Class<? extends Application>, String...)
          │                    ┌─── launch ──────┤
          │                    │                 └─── Application.launch(String...)
          │                    │
          ├─── command line ───┤
          │                    │                                    ┌─── getNamed()
          │                    │                                    │
          │                    └─── parameter ───┼─── Parameters ───┼─── getUnnamed()
          │                                                         │
          │                                                         └─── getRaw()
JavaFX ───┤                                       ┌─── constructor
          │                                       │
          │                                       ├─── init()
          │                    ┌─── life cycle ───┤
          │                    │                  ├─── start()
          │                    │                  │
          ├─── runtime ────────┤                  └─── stop()
          │                    │
          │                    │                  ┌─── JavaFX-Launcher Thread
          │                    └─── thread ───────┤
          │                                       └─── JavaFX Application Thread
          │
          └─── exit ───────────┼─── Platform.exit()
```

