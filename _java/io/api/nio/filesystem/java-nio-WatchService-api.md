---
title: "WatchService"
sequence: "104"
---

[UP](/java/java-io-index.html)

The Watch Service API consists of the following types in the `java.nio.file` package:

- `Watchable`: An interface that describes any object
  that may be registered with a watch service so that it can be watched for changes and events.
  Because `Path` extends `Watchable`, all entries in directories represented as `Path`s can be watched.
- `WatchEvent<T>`: An interface describing any event or repeated event for an object
  that's registered with a watch service.
- `WatchEvent<T>.Kind`: A nested interface that identifies an event kind (such as directory entry creation).
- `WatchEvent<T>.Modifier`: A nested interface qualifying
  how a watchable is registered with a watch service.
  This interface isn't used at this time.
- `WatchKey`: An interface describing a token representing the registration of a watchable with a watch service.
- `WatchService`: An interface describing any object that
  watches registered objects for changes and events.
- `StandardWatchEventKinds`: A class describing four event kind constants (directory entry creation, deletion,
  or modification; and overflow, which indicates that
  events may have been lost because the file system is generating them too quickly).
- `ClosedWatchServiceException`: A class describing an unchecked exception
  that's thrown when an attempt is made to invoke an operation on a watch service that's closed.

You would typically perform the following steps to interact with the Watch Service API:

1.  Create a `WatchService` object to watch one or more
    directories with the current or some other file system.
    This object is known as a **watcher**.
2.  Register each directory to be monitored with the  
    watcher. When registering a directory, specify the  
    kinds of events (described by the
    `StandardWatchEventKinds` class) of which you want
    to receive notification. For each registration, you
    will receive a `WatchKey` instance that serves as a
    registration token.
3.  Implement an infinite loop to wait for incoming
    events. When an event occurs, the key is signaled
    and placed into the watcher's queue.
4.  Retrieve the key from the watcher's queue. You can
    obtain the file name from the key.
5.  Retrieve each pending event for the key (there might
    be multiple events) and process as needed.
6.  Reset the key and resume waiting for events.
7.  Close the watch service. The watch service exits
    when the thread exits or when it's explicitly closed
    (by invoking its `close()` method).

```text
                ┌─── poll() ───┼─── return ───┼─── WatchKey 立即返回
                │
                │                             ┌─── long
                │              ┌─── params ───┤
WatchService ───┼─── poll() ───┤              └─── TimeUnit
                │              │
                │              └─── return ───┼─── WatchKey 限时等待
                │
                └─── take() ───┼─── return ───┼─── WatchKey 无限等待
```

```text
                                               ┌─── WatchService
                                ┌─── params ───┤
             ┌─── register() ───┤              └─── WatchEvent$Kind<?>[]
             │                  │
             │                  └─── return ───┼─── WatchKey
             │
Watchable ───┤                                 ┌─── WatchService
             │                                 │
             │                  ┌─── params ───┼─── WatchEvent$Kind<?>[]
             │                  │              │
             └─── register() ───┤              └─── WatchEvent$Modifier[]
                                │
                                └─── return ───┼─── WatchKey
```

```text
            ┌─── service ───┼─── cancel()
            │
            │               ┌─── state ───┼─── isValid()
            ├─── key ───────┤
WatchKey ───┤               │             ┌─── pollEvents() --> List<WatchEvent<?>>
            │               └─── event ───┤
            │                             └─── reset()
            │
            └─── target ────┼─── watchable() --> Watchable
```

A watch key has state. It's in the **ready state** when initially created and
in the **signaled state** when an event is detected
(the watch key is then queued for retrieval by `poll()` or `take()`).
Events detected while the key is in the signaled state are queued
but don't cause the key to be requeued for retrieval.

Calling `reset()` immediately requeues the watch key to the watch service when there are pending events.
If there are no pending events, the watch key is put into the **ready state** and
will remain in this state until an event is detected or the watch key is canceled.
This method returns `true` when the watch key is valid and has been reset.
When it returns `false`, the watch key couldn't be reset because it's no longer valid.
We can use this condition to exit the infinite loop.

If `reset()` fails because the key is no longer valid (perhaps because the watch service has been closed),
the loop is broken and the application ends.
**Resetting the key is very important.
If you fail to invoke `reset(`), this key will not receive any further events.**

```text
              ┌─── kind() --> WatchEvent$Kind<T>
              │
WatchEvent ───┼─── count()
              │
              └─── context()
```

```text
                           ┌─── ENTRY_CREATE
                           │
                           ├─── ENTRY_DELETE
StandardWatchEventKinds ───┤
                           ├─── ENTRY_MODIFY
                           │
                           └─── OVERFLOW
```

