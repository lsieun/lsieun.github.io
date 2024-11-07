---
title: "哲学家就餐问题（Dining Philosophers）"
sequence: "101"
---

[UP](/java-concurrency.html)

哲学家就餐问题，是多个线程**共享资源**的场景。

## 问题描述

![](/assets/images/java/concurrency/problems/dp0.png)

There are five silent philosophers (P1 – P5) sitting around a circular table, spending their lives eating and thinking.

There are five forks for them to share (1 – 5) and to be able to eat,
a philosopher needs to have forks in both his hands.
After eating, he puts both of them down,
and then they can be picked by another philosopher who repeats the same cycle.

The goal is to come up with a scheme/protocol
that helps the philosophers achieve their goal of eating and thinking without getting starved to death.

## A Solution

An initial solution would be to make each of the philosophers follow the following protocol:

```text
while(true) { 
    // Initially, thinking about life, universe, and everything
    think();

    // Take a break from thinking, hungry now
    pick_up_left_fork();
    pick_up_right_fork();
    eat();
    put_down_right_fork();
    put_down_left_fork();

    // Not hungry anymore. Back to thinking!
}
```

As the above pseudo code describes, each philosopher is initially thinking.
**After a certain amount of time, the philosopher gets hungry and wishes to eat.**

At this point, **he reaches for the forks on his either side and once he's got both of them, proceeds to eat.**
Once the eating is done, the philosopher then puts the forks down, so that they're available for his neighbor.

## synchronized

### 第一版

```java
public class Philosopher implements Runnable {
    // The forks on either side of this Philosopher
    private final Object leftFork;
    private final Object rightFork;

    public Philosopher(Object leftFork, Object rightFork) {
        this.leftFork = leftFork;
        this.rightFork = rightFork;
    }

    private void doAction(String action) throws InterruptedException {
        LogUtils.log(action);
        Thread.sleep(((int) (Math.random() * 100)));
    }

    @Override
    public void run() {
        try {
            while (true) {

                // thinking
                doAction("Thinking");
                synchronized (leftFork) {
                    doAction("Picked up left fork");
                    sleep(1);
                    synchronized (rightFork) {
                        // eating
                        doAction("Picked up right fork - eating");
                        sleep(1);

                        doAction("Put down right fork");
                    }

                    // Back to thinking
                    doAction("Put down left fork. Back to thinking");
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return;
        }
    }
}
```

```java
public class DiningPhilosophers {
    public static void main(String[] argv) {
        Philosopher[] philosophers = new Philosopher[5];
        Object[] forks = new Object[philosophers.length];

        for (int i = 0; i < forks.length; i++) {
            forks[i] = new Object();
        }

        for (int i = 0; i < philosophers.length; i++) {
            Object leftFork = forks[i];
            Object rightFork = forks[(i + 1) % forks.length];

            // 会出现“死锁”
            // philosophers[i] = new Philosopher(leftFork, rightFork);

            if (i == philosophers.length - 1) {
                // The last philosopher picks up the right fork first
                philosophers[i] = new Philosopher(rightFork, leftFork);
            } else {
                philosophers[i] = new Philosopher(leftFork, rightFork);
            }

            Thread t = new Thread(philosophers[i], "Philosopher " + (i + 1));
            t.start();
        }
    }
}
```

## ReentrantLock

### 第一版

```java
import java.util.concurrent.locks.Lock;

class Philosopher {
    private final String name; // Philosopher's name
    private final Lock leftFork;
    private final Lock rightFork;

    public Philosopher(String name, Lock leftFork, Lock rightFork) {
        this.leftFork = leftFork;
        this.rightFork = rightFork;
        this.name = name;
    }

    public void think() {
        LogUtils.log("{} is thinking...", name);
    }

    public void eat() {
        // Try to get the left fork
        if (leftFork.tryLock()) {
            try {
                // try to get the right fork
                if (rightFork.tryLock()) {
                    try {
                        try {
                            // Got both forks. Eat now
                            Thread.sleep(1000);
                            LogUtils.log("{} is eating...", name);

                            Thread.sleep(1000);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    } finally {
                        // release the right fork
                        rightFork.unlock();
                    }
                }
            } finally {
                // release the left fork
                leftFork.unlock();
            }
        }
    }
}
```

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class DiningPhilosophers {
    public static void main(String[] argv) {
        Lock fork1 = new ReentrantLock(false);
        Lock fork2 = new ReentrantLock(true);
        Lock fork3 = new ReentrantLock(true);
        Lock fork4 = new ReentrantLock();
        Lock fork5 = new ReentrantLock(true);

        Philosopher p1 = new Philosopher("P1", fork1, fork2);
        Philosopher p2 = new Philosopher("P2", fork2, fork3);
        Philosopher p3 = new Philosopher("P3", fork3, fork4);
        Philosopher p4 = new Philosopher("P4", fork4, fork5);
        Philosopher p5 = new Philosopher("P5", fork5, fork1);

        p1.eat();
        p1.think();

        p2.eat();
        p2.think();

        p3.eat();
        p3.think();

        p4.eat();
        p4.think();

        p5.eat();
        p5.think();


        p1.eat();
        p2.eat();
        p3.eat();
        p4.eat();
        p5.eat();

        p1.think();
        p2.think();
        p3.think();
        p4.think();
        p5.think();

    }
}
```

```text
14:20.390 [main] INFO P1 is eating...
14:21.406 [main] INFO P1 is thinking...
14:22.416 [main] INFO P2 is eating...
14:23.418 [main] INFO P2 is thinking...
14:24.421 [main] INFO P3 is eating...
14:25.437 [main] INFO P3 is thinking...
14:26.439 [main] INFO P4 is eating...
14:27.453 [main] INFO P4 is thinking...
14:28.455 [main] INFO P5 is eating...
14:29.470 [main] INFO P5 is thinking...
14:30.483 [main] INFO P1 is eating...
14:32.513 [main] INFO P2 is eating...
14:34.530 [main] INFO P3 is eating...
14:36.548 [main] INFO P4 is eating...
14:38.550 [main] INFO P5 is eating...
14:39.552 [main] INFO P1 is thinking...
14:39.552 [main] INFO P2 is thinking...
14:39.552 [main] INFO P3 is thinking...
14:39.552 [main] INFO P4 is thinking...
14:39.552 [main] INFO P5 is thinking...
```

### 哲学家就餐问题（待整理）

```java
import java.util.concurrent.locks.ReentrantLock;

public class PhilosopherRun {
    public static void main(String[] args) {
        Chopstick c1 = new Chopstick("1");
        Chopstick c2 = new Chopstick("2");
        Chopstick c3 = new Chopstick("3");
        Chopstick c4 = new Chopstick("4");
        Chopstick c5 = new Chopstick("5");
        new Philosopher("苏格拉底", c1, c2).start();
        new Philosopher("柏拉图", c2, c3).start();
        new Philosopher("亚里士多德", c3, c4).start();
        new Philosopher("赫拉克利特", c4, c5).start();
        new Philosopher("阿基米德", c5, c1).start();
    }
}

class Philosopher extends Thread {
    Chopstick left;
    Chopstick right;

    public Philosopher(String name, Chopstick left, Chopstick right) {
        super(name);
        this.left = left;
        this.right = right;
    }

    @Override
    public void run() {
        while (true) {
            //　尝试获得左手筷子
            if (left.tryLock()) {
                try {
                    // 尝试获得右手筷子
                    if (right.tryLock()) {
                        try {
                            eat();
                        } finally {
                            right.unlock();
                        }
                    }
                } finally {
                    // 获取右手筷子失败，会放弃已经拿到的左手筷子
                    left.unlock();
                }
            }
        }
    }

    private void eat() {
        LogUtils.log("eating...");
        SleepUtils.sleep(1);
    }
}


class Chopstick extends ReentrantLock {
    String name;

    public Chopstick(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "筷子{" + name + '}';
    }
}
```

只吃一次：

```java
import java.util.concurrent.locks.ReentrantLock;

public class PhilosopherRun {
    public static void main(String[] args) {
        Chopstick c1 = new Chopstick("1");
        Chopstick c2 = new Chopstick("2");
        Chopstick c3 = new Chopstick("3");
        Chopstick c4 = new Chopstick("4");
        Chopstick c5 = new Chopstick("5");
        new Philosopher("苏格拉底", c1, c2).start();
        new Philosopher("柏拉图", c2, c3).start();
        new Philosopher("亚里士多德", c3, c4).start();
        new Philosopher("赫拉克利特", c4, c5).start();
        new Philosopher("阿基米德", c5, c1).start();
    }
}

class Philosopher extends Thread {
    Chopstick left;
    Chopstick right;

    public Philosopher(String name, Chopstick left, Chopstick right) {
        super(name);
        this.left = left;
        this.right = right;
    }

    @Override
    public void run() {
        while (true) {
            boolean success = false;
            //　尝试获得左手筷子
            if (left.tryLock()) {
                try {
                    // 尝试获得右手筷子
                    if (right.tryLock()) {
                        try {
                            eat();
                            success = true;
                        } finally {
                            right.unlock();
                        }
                    }
                } finally {
                    // 获取右手筷子失败，会放弃已经拿到的左手筷子
                    left.unlock();
                }
            }

            if (success) {
                break;
            }
        }
    }

    private void eat() {
        LogUtils.log("eating...");
        SleepUtils.sleep(1);
    }
}


class Chopstick extends ReentrantLock {
    String name;

    public Chopstick(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "筷子{" + name + '}';
    }
}
```

吃指定次数（例如，三次）：

```java
import java.util.concurrent.locks.ReentrantLock;

public class PhilosopherRun {
    public static void main(String[] args) {
        Chopstick c1 = new Chopstick("1");
        Chopstick c2 = new Chopstick("2");
        Chopstick c3 = new Chopstick("3");
        Chopstick c4 = new Chopstick("4");
        Chopstick c5 = new Chopstick("5");
        new Philosopher("苏格拉底", c1, c2).start();
        new Philosopher("柏拉图", c2, c3).start();
        new Philosopher("亚里士多德", c3, c4).start();
        new Philosopher("赫拉克利特", c4, c5).start();
        new Philosopher("阿基米德", c5, c1).start();
    }
}

class Philosopher extends Thread {
    Chopstick left;
    Chopstick right;

    public Philosopher(String name, Chopstick left, Chopstick right) {
        super(name);
        this.left = left;
        this.right = right;
    }

    @Override
    public void run() {
        int count = 0;
        while (true) {
            //　尝试获得左手筷子
            if (left.tryLock()) {
                try {
                    // 尝试获得右手筷子
                    if (right.tryLock()) {
                        try {
                            eat();
                            count++;
                        } finally {
                            right.unlock();
                        }
                    }
                } finally {
                    // 获取右手筷子失败，会放弃已经拿到的左手筷子
                    left.unlock();
                }
            }

            if (count == 3) {
                break;
            }
        }
    }

    private void eat() {
        LogUtils.log("eating...");
        SleepUtils.sleep(1);
    }
}


class Chopstick extends ReentrantLock {
    String name;

    public Chopstick(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "筷子{" + name + '}';
    }
}
```

## Reference

- [The Dining Philosophers Problem in Java](https://www.baeldung.com/java-dining-philoshophers)
- [The Dining Philosophers](https://www.baeldung.com/cs/dining-philosophers)
