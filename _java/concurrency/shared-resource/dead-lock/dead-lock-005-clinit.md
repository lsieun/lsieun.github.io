---
title: "Dead Lock: clinit"
sequence: "105"
---

[UP](/java-concurrency.html)


```java
package sample;

import java.util.concurrent.TimeUnit;

public class HelloWorld {
    public static void main(String[] args) {
        new Thread(() -> A.test()).start();
        new Thread(() -> B.test()).start();
    }
}

class A {
    static {
        System.out.println("class A init");

        try {
            TimeUnit.SECONDS.sleep(1);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        new B();
    }

    public static void test() {
        System.out.println("aaa");
    }
}

class B {
    static {
        System.out.println("class B init");

        new A();
    }

    public static void test() {
        System.out.println("bbb");
    }
}
```
