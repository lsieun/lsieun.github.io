---
title: "避免死锁"
sequence: "104"
---

[UP](/java-concurrency.html)


产生死锁的四大因素：

- 互斥：共享资源只能被一个线程占用 —— 互斥锁
- 占有且等待：线程当前占有至少一个资源，并还想请求其它线程持有的其它资源，就会造成等待。——等待对方释放资源
- 不可抢占：资源只能由持有它的线程自愿释放，其它线程不可强行占有资源。——无法释放对方的资源。
- 循环等待：线程 T1 等待线程 T2 占有的资源，线程 T2 等待线程 T1 占有的资源，就是循环等待。——两个线程互相等待。

思路：

- 1、不使用锁
    - 使用 CAS 的机制
- 2、使用锁
    - 给一个获取锁的请求时间，如果超时，就释放资源
    - 对锁的资源，有一个规则：同时锁定多个资源，或者按一个特定的顺序给资源加锁

## 转账

```java
public class Account {
    public Integer id;
    public String name;
    public Integer balance = 100;

    public Account(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public void transfer(Account target, int amount) throws InterruptedException {
        synchronized (this) {
            System.out.println(Thread.currentThread().getName() + " begin");

            Thread.sleep(2000);

            synchronized (target) {
                this.balance -= amount;
                target.balance += amount;

                System.out.println(Thread.currentThread().getName() + " end");
            }
        }
    }
}
```

```java
public class DeadLock_TransferMoney {
    public static void main(String[] args) {
        Account zhangsan = new Account(1, "张三");
        Account lisi = new Account(2, "李四");

        new Thread(() -> {
            try {
                zhangsan.transfer(lisi, 50);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, "t1").start();

        new Thread(() -> {
            try {
                lisi.transfer(zhangsan, 50);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, "t2").start();
    }
}
```

```text
Java stack information for the threads listed above:
===================================================
"t2":
        at lsieun.concurrent.lock.Account.transfer(Account.java:23)
        - waiting to lock <0x000000076b426ea0> (a lsieun.concurrent.lock.Account)    # 线程 t2 等待加锁 76b426ea0
        - locked <0x000000076b427160> (a lsieun.concurrent.lock.Account)             # 线程 t2 已经加锁 76b427160
        at lsieun.concurrent.lock.DeadLock_TransferMoney.lambda$main$1(DeadLock_TransferMoney.java:19)
        at lsieun.concurrent.lock.DeadLock_TransferMoney$$Lambda$2/1096979270.run(Unknown Source)
        at java.lang.Thread.run(Thread.java:748)
"t1":
        at lsieun.concurrent.lock.Account.transfer(Account.java:23)
        - waiting to lock <0x000000076b427160> (a lsieun.concurrent.lock.Account)    # 线程 t1 等待加锁 76b427160
        - locked <0x000000076b426ea0> (a lsieun.concurrent.lock.Account)             # 线程 t1 已经加锁 76b426ea0
        at lsieun.concurrent.lock.DeadLock_TransferMoney.lambda$main$0(DeadLock_TransferMoney.java:10)
        at lsieun.concurrent.lock.DeadLock_TransferMoney$$Lambda$1/1324119927.run(Unknown Source)
        at java.lang.Thread.run(Thread.java:748)

Found 1 deadlock.
```

## 破坏互斥

- 互斥：共享资源只能被一个线程占用 —— 互斥锁

```java
import java.util.concurrent.atomic.AtomicInteger;

public class Account {
    public Integer id;
    public String name;

    public AtomicInteger atomicBalance = new AtomicInteger(100);

    public Account(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public void transfer(Account target, int amount) throws InterruptedException {
        synchronized (this) {
            System.out.println(Thread.currentThread().getName() + " begin");

            Thread.sleep(2000);

            this.atomicBalance.addAndGet(-amount);
            target.atomicBalance.addAndGet(amount);

            System.out.println(Thread.currentThread().getName() + " end");
        }
    }
}
```

## 破坏占有且等待

```java
import java.util.ArrayList;
import java.util.List;

public class Account {
    public Integer id;
    public String name;
    public Integer balance = 100;

    public Account(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    // 破坏占有且等待：占有不能破坏，那就不要等待；两个对象，我都占用，用完了，再给其它线程。
    private Allocator actr = Allocator.getAllocator();

    public void transfer(Account target, int amount) throws InterruptedException {
        // 一次性申请转出账户和转入账户，直到成功
        while (!actr.apply(this, target)) {
        }

        try {
            // 锁定转出账户
            synchronized (this) {
                System.out.println(Thread.currentThread().getName() + " begin");

                Thread.sleep(2000);

                // 锁定转入账户
                synchronized (target) {
                    if (this.balance > amount) {
                        this.balance -= amount;
                        target.balance += amount;
                    }
                }

                System.out.println(Thread.currentThread().getName() + " end");
            }
        } finally {
            // 用完释放，交给其它线程使用
            actr.free(this, target);
        }

    }

    // 利用一个账户管理员同时占有 2 个资源，其它线程空轮询
    static class Allocator {
        private static Allocator allocator = new Allocator();

        private Allocator() {
        }

        public static Allocator getAllocator() {
            return allocator;
        }

        private List<Object> resourceList = new ArrayList<>();

        // 一次性申请资源
        synchronized boolean apply(Object from, Object to) {
            if (resourceList.contains(from) || resourceList.contains(to)) {
                return false;
            } else {
                resourceList.add(from);
                resourceList.add(to);
                return true;
            }
        }

        // 归还资源
        synchronized void free(Object from, Object to) {
            resourceList.remove(from);
            resourceList.remove(to);
        }

    }
}
```

## 破坏不可抢占

解决方法：设置等待时间

```java
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class Account {
    public Integer id;
    public String name;
    public Integer balance = 100;

    public Account(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    // 破坏不可抢占 —— 可以让其它线程让步
    private final Lock lock = new ReentrantLock();

    public void transfer(Account target, int amount) throws InterruptedException {
        while (true) {
            // 锁定转出账户，并设置超时
            if (this.lock.tryLock(2, TimeUnit.SECONDS)) {
                if (target.lock.tryLock()) {
                    if (this.balance < amount) {
                        return;
                    }

                    Thread.sleep(2000);

                    this.balance -= amount;
                    target.balance += amount;
                    break;
                }
            }
        }
    }
}
```

## 破坏循环等待

解决方法：给资源一个排序，加锁的时候，要按资源的顺序来加锁

```java
public class Account {
    public Integer id;
    public String name;
    public Integer balance = 100;

    public Account(Integer id, String name) {
        this.id = id;
        this.name = name;
    }


    public void transfer(Account target, int amount) throws InterruptedException {
        Account left = this;
        Account right = target;
        if (this.id > target.id) {
            left = target;
            right = this;
        }


        synchronized (left) {
            System.out.println(Thread.currentThread().getName() + " begin lock " + left.name);

            Thread.sleep(2000);

            synchronized (right) {
                System.out.println(Thread.currentThread().getName() + " begin lock " + right.name);
                this.balance -= amount;
                target.balance += amount;
                System.out.println(Thread.currentThread().getName() + " end lock " + right.name);
            }

            System.out.println(Thread.currentThread().getName() + " end lock " + left.name);
        }
    }
}
```

```text
t1 begin lock 张三
t1 begin lock 李四
t1 end lock 李四
t1 end lock 张三

t2 begin lock 张三
t2 begin lock 李四
t2 end lock 李四
t2 end lock 张三
```
