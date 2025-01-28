---
title: "JNA Error"
sequence: "104"
---

## Handling Errors

Old versions of the standard C library used the global `errno` variable to store the reason a particular call failed.
For instance, this is how a typical `open()` call would use this global variable in C:

```text
int fd = open("some path", O_RDONLY);
if (fd < 0) {
    printf("Open failed: errno=%d\n", errno);
    exit(1);
}
```

Of course, in modern multi-threaded programs this code would not work, right?
Well, thanks to C's preprocessor, developers can still write code like this, and it will work just fine.
**It turns out that nowadays, `errno` is a macro that expands to a function call**:

```text
// ... excerpt from bits/errno.h on Linux
#define errno (*__errno_location ())

// ... excerpt from <errno.h> from Visual Studio
#define errno (*_errno())
```

Now, this approach works fine when compiling source code, but there's no such thing when using JNA.
We could declare the expanded function in our wrapper interface and call it explicitly,
but JNA offers a better alternative: `com.sun.jna.LastErrorException`.

Any method declared in wrapper interfaces with `throws LastErrorException`
will automatically include a check for an error after a native call.
If it reports an error, JNA will throw a `LastErrorException`, which includes the original error code.

Let's add a couple of methods to the StdC wrapper interface we've used before to show this feature in action:

```java
import com.sun.jna.LastErrorException;
import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Platform;
import com.sun.jna.Pointer;

public interface StdC extends Library {
    StdC INSTANCE = Native.load(Platform.isWindows() ? "msvcrt" : "c", StdC.class );

    Pointer malloc(long n);
    void free(Pointer p);

    Pointer memset(Pointer p, int c, long n);
    int open(String path, int flags) throws LastErrorException;
    int close(int fd) throws LastErrorException;
}
```

Now, we can use `open()` in a try/catch clause:

```java
import com.sun.jna.LastErrorException;
import lsieun.jna.StdC;

public class JNARun {
    public static void main(String[] args) {
        StdC instance = StdC.INSTANCE;
        int fd = 0;
        try {
            fd = instance.open("/some/path",0);
            // ... use fd
        }
        catch (LastErrorException err) {
            // ... error handling
        }
        finally {
            if (fd > 0) {
                instance.close(fd);
            }
        }
    }
}
```

In the catch block, we can use `LastErrorException.getErrorCode()` to get the original errno value and
use it as part of the error handling logic.

## Handling Access Violations

As mentioned before, **JNA does not protect us from misusing a given API,**
**especially when dealing with memory buffers passed back and forth native code.**
In normal situations, such errors result in an access violation and terminate the JVM.

**JNA supports, to some extent, a method that allows Java code to handle access violation errors.**

There are two ways to activate it:

- Setting the `jna.protected` system property to `true`
- Calling `Native.setProtected(true)`

Once we've activated this protected mode,
JNA will catch access violation errors that would normally result in a crash and throw a `java.lang.Error` exception.
We can verify that this works using a `Pointer` initialized with an invalid address and trying to write some data to it:

```java
import com.sun.jna.Native;
import com.sun.jna.Pointer;

public class JNARun {
    public static void main(String[] args) {
        Native.setProtected(true);
        Pointer p = new Pointer(0L);
        try {
            p.setMemory(0, 100*1024, (byte) 0);
        }
        catch (Error err) {
            // ... error handling omitted
            err.printStackTrace();
        }
    }
}
```

However, as the documentation states, **this feature should only be used for debugging/development purposes.**

