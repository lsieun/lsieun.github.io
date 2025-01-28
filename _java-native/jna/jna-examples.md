---
title: "JNA Examples"
sequence: "105"
---

## CLibrary

### print

```java
import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Platform;

public interface CLibrary extends Library {
    CLibrary INSTANCE = Native.load((Platform.isWindows() ? "msvcrt" : "c"), CLibrary.class);

    void printf(String format, Object... args);
}
```

```java
public class JNARun {
    public static void main(String[] args) {
        CLibrary.INSTANCE.printf("Hello, World\n");
        for (int i=0;i < args.length;i++) {
            CLibrary.INSTANCE.printf("Argument %d: %s\n", i, args[i]);
        }
    }
}
```

## kernel32

### time

```java
import com.sun.jna.Native;
import com.sun.jna.Structure;
import com.sun.jna.win32.StdCallLibrary;

public interface Kernel32 extends StdCallLibrary {
    Kernel32 INSTANCE = Native.load("kernel32", Kernel32.class);

    @Structure.FieldOrder({"wYear", "wMonth", "wDayOfWeek", "wDay", "wHour", "wMinute", "wSecond", "wMilliseconds"})
    class SYSTEMTIME extends Structure {
        public short wYear;
        public short wMonth;
        public short wDayOfWeek;
        public short wDay;
        public short wHour;
        public short wMinute;
        public short wSecond;
        public short wMilliseconds;
    }

    void GetSystemTime(SYSTEMTIME result);
}
```

```java
public class JNARun {
    public static void main(String[] args) {
        Kernel32 lib = Kernel32.INSTANCE;
        Kernel32.SYSTEMTIME time = new Kernel32.SYSTEMTIME();
        lib.GetSystemTime(time);

        // 打印出的时间慢8小时
        String line = String.format("%04d-%02d-%02d %02d:%02d:%02d.%03d",
                time.wYear, time.wMonth, time.wDay,
                time.wHour, time.wMinute, time.wSecond, time.wMilliseconds);
        System.out.println(line);
    }
}
```

## user32

- [Link](https://www.heatonresearch.com/2018/10/02/jna-quickstart.html)

```java
import com.sun.jna.Native;
import com.sun.jna.Pointer;
import com.sun.jna.platform.win32.WinDef;
import com.sun.jna.platform.win32.WinUser;
import com.sun.jna.win32.StdCallLibrary;

public interface User32 extends StdCallLibrary {
    User32 INSTANCE = Native.load("user32", User32.class);

    boolean EnumWindows(WinUser.WNDENUMPROC lpEnumFunc, Pointer arg);

    int GetWindowTextA(WinDef.HWND hWnd, byte[] lpString, int nMaxCount);
}
```

```java
import com.sun.jna.Native;
import com.sun.jna.Pointer;
import com.sun.jna.platform.win32.WinDef;
import com.sun.jna.platform.win32.WinUser;
import lsieun.jna.User32;

public class JNARun {
    public static void main(String[] args) {
        final User32 user32 = User32.INSTANCE;
        user32.EnumWindows(new WinUser.WNDENUMPROC() {
            int count = 0;

            @Override
            public boolean callback(WinDef.HWND hWnd, Pointer arg1) {
                byte[] windowText = new byte[1024];
                user32.GetWindowTextA(hWnd, windowText, windowText.length);
                String wText = Native.toString(windowText);

                if (wText.isEmpty()) {
                    return true;
                }

                System.out.println("Window, hwnd:" + hWnd + ", total " + ++count
                        + " Title: " + wText);
                return true;
            }
        }, null);
    }
}
```

## print

```java
import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Platform;

public interface JNAApiInterface extends Library {
    JNAApiInterface INSTANCE = (JNAApiInterface) Native.load((Platform.isWindows() ? "msvcrt" : "c"), JNAApiInterface.class);

    void printf(String format, Object... args);

    int sprintf(byte[] buffer, String format, Object... args);

    int scanf(String format, Object... args);
}
```

```java
import lsieun.jna.JNAApiInterface;

public class JNARun {
    public static void main(String[] args) {
        JNAApiInterface jnaLib = JNAApiInterface.INSTANCE;
        jnaLib.printf("Hello World");
        String testName = null;

        for (int i = 0; i < args.length; i++) {
            jnaLib.printf("\nArgument %d : %s", i, args[i]);
        }

        jnaLib.printf("Please Enter Your Name:\n");
        jnaLib.scanf("%s", testName);
        jnaLib.printf("\nYour name is %s", testName);
    }
}
```

