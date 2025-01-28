---
title: "如何发现死锁"
sequence: "103"
---

[UP](/java-concurrency.html)


## 查看线程 ID

```text
jps
```

```text
$ jps
944 Launcher
11124 RemoteMavenServer36
10924 Jps
12268 DeadLock_TransferMoney
```

## 查看死锁信息

```text
jstack <PID>
```

```text
$ jstack 12268

Full thread dump Java HotSpot(TM) 64-Bit Server VM (25.301-b09 mixed mode):

"DestroyJavaVM" #14 prio=5 os_prio=0 tid=0x000000000031c000 nid=0x2fc0 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"t2" #13 prio=5 os_prio=0 tid=0x000000001f33d000 nid=0x2d6c waiting for monitor entry [0x000000001fdef000]
   java.lang.Thread.State: BLOCKED (on object monitor)
        at lsieun.concurrent.lock.Account.transfer(Account.java:43)
        - waiting to lock <0x000000076b427290> (a lsieun.concurrent.lock.Account)
        - locked <0x000000076b4272e8> (a lsieun.concurrent.lock.Account)
        at lsieun.concurrent.lock.DeadLock_TransferMoney.lambda$main$1(DeadLock_TransferMoney.java:19)
        at lsieun.concurrent.lock.DeadLock_TransferMoney$$Lambda$2/1096979270.run(Unknown Source)
        at java.lang.Thread.run(Thread.java:748)

"t1" #12 prio=5 os_prio=0 tid=0x000000001f332800 nid=0x2c7c waiting for monitor entry [0x000000001e10f000]
   java.lang.Thread.State: BLOCKED (on object monitor)
        at lsieun.concurrent.lock.Account.transfer(Account.java:43)
        - waiting to lock <0x000000076b4272e8> (a lsieun.concurrent.lock.Account)
        - locked <0x000000076b427290> (a lsieun.concurrent.lock.Account)
        at lsieun.concurrent.lock.DeadLock_TransferMoney.lambda$main$0(DeadLock_TransferMoney.java:10)
        at lsieun.concurrent.lock.DeadLock_TransferMoney$$Lambda$1/1324119927.run(Unknown Source)
        at java.lang.Thread.run(Thread.java:748)

"Service Thread" #11 daemon prio=9 os_prio=0 tid=0x000000001e3c3000 nid=0x2ff8 runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C1 CompilerThread3" #10 daemon prio=9 os_prio=2 tid=0x000000001e308000 nid=0x1610 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread2" #9 daemon prio=9 os_prio=2 tid=0x000000001e307000 nid=0x2d40 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread1" #8 daemon prio=9 os_prio=2 tid=0x000000001e304000 nid=0x2e3c waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C2 CompilerThread0" #7 daemon prio=9 os_prio=2 tid=0x000000001e300000 nid=0x2ed0 waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Monitor Ctrl-Break" #6 daemon prio=5 os_prio=0 tid=0x000000001e2ea000 nid=0x24e8 runnable [0x000000000efee000]
   java.lang.Thread.State: RUNNABLE
        at java.net.SocketInputStream.socketRead0(Native Method)
        at java.net.SocketInputStream.socketRead(SocketInputStream.java:116)
        at java.net.SocketInputStream.read(SocketInputStream.java:171)
        at java.net.SocketInputStream.read(SocketInputStream.java:141)
        at sun.nio.cs.StreamDecoder.readBytes(StreamDecoder.java:284)
        at sun.nio.cs.StreamDecoder.implRead(StreamDecoder.java:326)
        at sun.nio.cs.StreamDecoder.read(StreamDecoder.java:178)
        - locked <0x000000076b3122e0> (a java.io.InputStreamReader)
        at java.io.InputStreamReader.read(InputStreamReader.java:184)
        at java.io.BufferedReader.fill(BufferedReader.java:161)
        at java.io.BufferedReader.readLine(BufferedReader.java:324)
        - locked <0x000000076b3122e0> (a java.io.InputStreamReader)
        at java.io.BufferedReader.readLine(BufferedReader.java:389)
        at com.intellij.rt.execution.application.AppMainV2$1.run(AppMainV2.java:53)

"Attach Listener" #5 daemon prio=5 os_prio=2 tid=0x000000001e2b4000 nid=0x2efc waiting on condition [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Signal Dispatcher" #4 daemon prio=9 os_prio=2 tid=0x000000001e2a2000 nid=0x11c4 runnable [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Finalizer" #3 daemon prio=8 os_prio=1 tid=0x000000001e276000 nid=0x298c in Object.wait() [0x000000001e7df000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x000000076b188ee0> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:144)
        - locked <0x000000076b188ee0> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:165)
        at java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:216)

"Reference Handler" #2 daemon prio=10 os_prio=2 tid=0x000000000d2db000 nid=0x2fc4 in Object.wait() [0x000000001e26f000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(Native Method)
        - waiting on <0x000000076b186c00> (a java.lang.ref.Reference$Lock)
        at java.lang.Object.wait(Object.java:502)
        at java.lang.ref.Reference.tryHandlePending(Reference.java:191)
        - locked <0x000000076b186c00> (a java.lang.ref.Reference$Lock)
        at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:153)

"VM Thread" os_prio=2 tid=0x000000000d293800 nid=0x2f94 runnable

"GC task thread#0 (ParallelGC)" os_prio=0 tid=0x0000000000332800 nid=0x2eb8 runnable

"GC task thread#1 (ParallelGC)" os_prio=0 tid=0x0000000000333800 nid=0x1d20 runnable

"GC task thread#2 (ParallelGC)" os_prio=0 tid=0x0000000000335000 nid=0x2c2c runnable

"GC task thread#3 (ParallelGC)" os_prio=0 tid=0x0000000000336000 nid=0x2ff0 runnable

"GC task thread#4 (ParallelGC)" os_prio=0 tid=0x0000000000339000 nid=0x2760 runnable

"GC task thread#5 (ParallelGC)" os_prio=0 tid=0x000000000033a000 nid=0x2a54 runnable

"GC task thread#6 (ParallelGC)" os_prio=0 tid=0x000000000033b000 nid=0x2dfc runnable

"GC task thread#7 (ParallelGC)" os_prio=0 tid=0x000000000033c000 nid=0x954 runnable

"VM Periodic Task Thread" os_prio=2 tid=0x000000001e422800 nid=0x2e40 waiting on condition

JNI global references: 316


Found one Java-level deadlock:
=============================
"t2":
  waiting to lock monitor 0x000000001e2757d8 (object 0x000000076b427290, a lsieun.concurrent.lock.Account),
  which is held by "t1"
"t1":
  waiting to lock monitor 0x000000001e275678 (object 0x000000076b4272e8, a lsieun.concurrent.lock.Account),
  which is held by "t2"

Java stack information for the threads listed above:
===================================================
"t2":
        at lsieun.concurrent.lock.Account.transfer(Account.java:43)
        - waiting to lock <0x000000076b427290> (a lsieun.concurrent.lock.Account)
        - locked <0x000000076b4272e8> (a lsieun.concurrent.lock.Account)
        at lsieun.concurrent.lock.DeadLock_TransferMoney.lambda$main$1(DeadLock_TransferMoney.java:19)
        at lsieun.concurrent.lock.DeadLock_TransferMoney$$Lambda$2/1096979270.run(Unknown Source)
        at java.lang.Thread.run(Thread.java:748)
"t1":
        at lsieun.concurrent.lock.Account.transfer(Account.java:43)
        - waiting to lock <0x000000076b4272e8> (a lsieun.concurrent.lock.Account)
        - locked <0x000000076b427290> (a lsieun.concurrent.lock.Account)
        at lsieun.concurrent.lock.DeadLock_TransferMoney.lambda$main$0(DeadLock_TransferMoney.java:10)
        at lsieun.concurrent.lock.DeadLock_TransferMoney$$Lambda$1/1324119927.run(Unknown Source)
        at java.lang.Thread.run(Thread.java:748)

Found 1 deadlock.
```
