---
title: "JDK Timer"
sequence: "103"
---

[UP](/netty.html)

```java
import java.util.Timer;
import java.util.TimerTask;

public class HelloWorld {

    public static void main(String[] args) throws InterruptedException {
        TimerTask task = new TimerTask() {
            @Override
            public void run() {
                printTimestamp();
            }
        };

        printTimestamp();
        Timer timer = new Timer();
        timer.schedule(task, 1000, 3000);

        Thread.sleep(10000);
        timer.cancel();
    }

    static void printTimestamp() {
        Thread thread = Thread.currentThread();
        String info = String.format("%10s: Hello - %s", thread.getName(), System.currentTimeMillis());
        System.out.println(info);
    }
}
```

```text
      main: Hello - 1716092732838
   Timer-0: Hello - 1716092733860
   Timer-0: Hello - 1716092736860
   Timer-0: Hello - 1716092739873
```
