---
title: "Terminating a JavaFX Application"
sequence: "105"
---

A JavaFX application may be terminated **explicitly** or **implicitly**.

## Explicitly

You can terminate a JavaFX application explicitly by calling the `Platform.exit()` method.

When this method is called, after or from within the `start()` method,
the `stop()` method of the `Application` class is called,
and then the **JavaFX Application Thread** is terminated.
At this point, if there are only daemon threads running, the JVM will exit.

> 第一种情况

If this method is called from the **constructor** or the `init()` method of the `Application` class,
the `stop()` method may not be called.

> 第二种情况

Tip: A JavaFX application may be run in web browsers.
Calling the `Platform.exit()` method in web environments may not have any effect.

## Implicitly

A JavaFX application may be terminated implicitly, when the last window is closed.
This behavior can be turned on and turned off
using the static `Platform.setImplicitExit(boolean implicitExit)` method.

Passing `true` to this method turns this behavior on.
Passing `false` to this method turns this behavior off.
By default, this behavior is turned on.
This is the reason that in most of the examples so far,
applications were terminated when you closed the windows.

When this behavior is turned on,
the `stop()` method of the `Application` class is called before terminating **the JavaFX Application Thread**.
Terminating the **JavaFX Application Thread** does not always terminate the JVM.
The JVM terminates if all running nondaemon threads terminate.

If the implicit terminating behavior of the JavaFX application is turned off,
you must call the `exit()` method of the `Platform` class to terminate the application.









