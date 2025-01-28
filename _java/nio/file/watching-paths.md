---
title: "Watching Paths"
sequence: "105"
---

[UP](/java-nio.html)


## WatchService

One of the nicest features of the NIO File API is the `WatchService`,
which can monitor a `Path` for changes to **any file or directory** in the hierarchy.
We can choose to receive events when files or directories are **added, modified, or deleted**.

The following snippet watches for changes under the folder `/Users/pat`:

```java
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

import static java.nio.file.StandardWatchEventKinds.*;

public class WatchingPaths {
    public static void main(String[] args) throws IOException, InterruptedException {
        FileSystem fs = FileSystems.getDefault();
        Path watchPath = fs.getPath("D:\\git-repo\\learn-java-nio\\");
        WatchService watchService = fs.newWatchService();
        watchPath.register(watchService, ENTRY_CREATE, ENTRY_MODIFY, ENTRY_DELETE);

        WatchKey changeKey;
        while ((changeKey = watchService.take()) != null) {
            List<WatchEvent<?>> watchEvents = changeKey.pollEvents();
            for (WatchEvent<?> watchEvent : watchEvents) {
                // Ours are all Path type events:
                WatchEvent<Path> pathEvent = (WatchEvent<Path>) watchEvent;

                Path path = pathEvent.context();
                WatchEvent.Kind<Path> eventKind = pathEvent.kind();
                System.out.println(eventKind + " for path: " + path);
            }
            changeKey.reset(); // Important!
        }
    }
}
```

We construct a `WatchService` from a `FileSystem` using the `newWatchService()` call.
Thereafter, we can register a `Watchable` object with the service
(currently, `Path` is the only type of Watchable) and poll it for events.
As shown, in actuality the API is the other way around and we call the watchable object's `register()` method,
passing it the watch service and a variable length argument list of enumerated values
representing the event types of interest: `ENTRY_CREATE`, `ENTRY_MODIFY`, or `ENTRY_DELETE`.
One additonal type, `OVERFLOW`, can be registered in order to get events
that indicate when the host implementation has been too slow to process all changes and some changes may have been lost.

After we are set up, we can poll for changes using the watch service `take()` method,
which returns a `WatchKey` object.
The `take()` method blocks until an event occurs;
another form, `poll()`, is nonblocking.
When we have a `WatchKey` containing events, we can retrieve them with the `pollEvents()` method.
The API is, again, a bit awkward here as `WatchEvent` is a generic type parameterized on the kind of `Watchable` object.
In our case, the only types possible are `Path` type events and so we cast as needed.
The type of event (create, modify, delete) is indicated by the `WatchEventkind()` method and
the changed path is indicated by the `context()` method.
Finally, it's important that we call `reset()` on the `WatchKey` object
in order to clear the events and be able to receive further updates.

## Performance

Performance of the `WatchService` depends greatly on implementation.
On many systems, filesystem monitoring is built into the operating system and
we can get change events almost instantly.
But in many cases, Java may fall back on its generic,
background thread-based implementation of the watch service,
which is very slow to detect changes.
At the time of this writing, for example,
Java 7 on Mac OS X does not take advantage of the OS-level file monitoring and instead uses the slow, generic polling service.

## Modify Twice

```java
import java.io.IOException;
import java.nio.file.*;
import java.util.List;

import static java.nio.file.StandardWatchEventKinds.*;

public class WatchingPaths {
    public static void main(String[] args) throws IOException, InterruptedException {
        FileSystem fs = FileSystems.getDefault();
        Path watchPath = fs.getPath("D:\\git-repo\\learn-java-nio\\");
        WatchService watchService = fs.newWatchService();
        watchPath.register(watchService, ENTRY_CREATE, ENTRY_MODIFY, ENTRY_DELETE);

        WatchKey changeKey;
        while ((changeKey = watchService.take()) != null) {
            // Prevent receiving two separate ENTRY_MODIFY events: file modified and timestamp updated.
            // Instead, receive one ENTRY_MODIFY event with two counts.
            Thread.sleep( 50 );
            
            List<WatchEvent<?>> watchEvents = changeKey.pollEvents();
            for (WatchEvent<?> watchEvent : watchEvents) {
                // Ours are all Path type events:
                WatchEvent<Path> pathEvent = (WatchEvent<Path>) watchEvent;

                Path path = pathEvent.context();
                WatchEvent.Kind<Path> eventKind = pathEvent.kind();
                System.out.println(eventKind + " for path: " + path);
            }
            changeKey.reset(); // Important!
        }
    }
}
```

## Reference

- [baeldung: A Guide to WatchService in Java NIO2](https://www.baeldung.com/java-nio2-watchservice)
- [Java 7 WatchService - Ignoring multiple occurrences of the same event](https://stackoverflow.com/questions/16777869/java-7-watchservice-ignoring-multiple-occurrences-of-the-same-event/16916165)
- [Getting to modify events on changes in file?](https://stackoverflow.com/questions/12347632/getting-to-modify-events-on-changes-in-file)
- [WatchService fires ENTRY_MODIFY sometimes twice and sometimes once](https://stackoverflow.com/questions/39147735/watchservice-fires-entry-modify-sometimes-twice-and-sometimes-once)
