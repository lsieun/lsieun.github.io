---
title: "分布式锁"
sequence: "103"
---

## 分布式锁

分布式锁的作用：在整个系统中，提供一个全局唯一的锁，在分布式系统中，每个系统在进行相关操作的时候，需要获取到该锁，才能执行相应的操作。

## ZK 实现分布式锁

利用 ZooKeeper 可以创建**临时带序号节点**的特性来实现一个分布式锁。

```text
ZK：临时带序号节点 --> 分布式锁
```

### 实现思路

- 锁，就是 ZK 指定目录下序列号最小的临时序列节点，多个系统的多个线程都要在此目录下创建临时顺序节点。
  因为 ZK 会为我们保证节点的顺序性，所以可以利用节点的顺序进行锁的判断。
- 每个线程都是先创建**临时顺序节点**，然后获取当前目录下最小的节点（序号），判断最小节点是不是当前节点；
  如果“是”，那么获取锁（Lock）成功；如果“不是”，那么获取锁（Lock）失败。
- 获取锁失败的线程，获取当前节点上一个**临时顺序节点**，并对此节点进行监听，当该节点删除的时候（上一个线程执行结束删除或者是掉线 ZK 删除临时节点），
  这个线程会获取到通知，代表获取到了锁。

## 代码（版本一）

### DistributedLockRun

```java
public class DistributedLockRun {

    public static void main(String[] args) {
        for (int i = 0; i < 10; i++) {
            Thread t = new Thread(new DisLockRunnable());
            t.start();
        }
    }

    static class DisLockRunnable implements Runnable {

        @Override
        public void run() {
            ClientLock clientLock = new ClientLock();
            clientLock.getLock();

            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }

            clientLock.releaseLock();
        }
    }
}
```

### ClientLock

```java
import org.I0Itec.zkclient.IZkDataListener;
import org.I0Itec.zkclient.ZkClient;

import java.util.Collections;
import java.util.Formatter;
import java.util.List;
import java.util.concurrent.CountDownLatch;

// 1. 去 ZK 创建临时序列节点，并获取到序号
// 2. 判断自己创建节点序号是否是当前节点最小序号；如果是，则获取锁，执行相关操作，最后释放锁
// 3. 如果不是最小节点，当前线程需要等待，等待前一个序号的节点被删除，然后再次判断自己是否为最小节点
public class ClientLock {
    private static final String LOCK_PATH = "/distributedLock";
    public static final String CONNECT_STRING = "192.168.80.131:2181,192.168.80.132:2181,192.168.80.133:2181";

    private ZkClient zkClient = new ZkClient(CONNECT_STRING);
    private String currentNodePath;
    private String previousNodePath;

    public ClientLock() {
        synchronized (ClientLock.class) {
            boolean exists = zkClient.exists(LOCK_PATH);
            if (!exists) {
                zkClient.createPersistent(LOCK_PATH, true);
            }
        }
    }

    // 完整获取锁
    public void getLock() {
        while (!tryLock()) {
            // 等待获取锁
            waitForLock();
        }
    }

    // 尝试获取锁
    public boolean tryLock() {
        String threadName = Thread.currentThread().getName();
        String path = LOCK_PATH + "/";

        // 第 1 步，如果没有注册，先注册到 ZK 上
        if (currentNodePath == null || "".equals(currentNodePath)) {
            currentNodePath = zkClient.createEphemeralSequential(path, threadName);
            String msg = String.format("[%s] CREATE PATH: %s", threadName, currentNodePath);
            System.out.println(msg);
        }

        // 第 2 步，获取 LOCK_PATH 下的所有子节点
        List<String> children = zkClient.getChildren(LOCK_PATH);
        Collections.sort(children);

        // 第 3 步，判断当前节点是否为最小节点（是否可以获得锁），记录在 success 变量中
        boolean success;
        String minNode = children.get(0);
        if (currentNodePath.equals(path + minNode)) {
            success = true;
        } else {
            int index = Collections.binarySearch(children, currentNodePath.substring(path.length()));
            String previousNode = children.get(index - 1);
            previousNodePath = path + previousNode;
            success = false;
        }

        // 辅助：打印信息
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("[%s]%n", threadName);
        for (String child : children) {
            String fullPath = String.format("%s/%s", LOCK_PATH, child);
            Object data = zkClient.readData(fullPath);
            fm.format("    - %s: %s%n", fullPath, data);
        }
        fm.format("[%s] GET LOCK %S%n", threadName, success ? "SUCCESS" : "FAILED");
        System.out.println(sb);

        return success;
    }

    // 等待前一个节点释放锁
    public void waitForLock() {
        CountDownLatch countDownLatch = new CountDownLatch(1);

        IZkDataListener listener = new IZkDataListener() {
            @Override
            public void handleDataChange(String dataPath, Object data) throws Exception {
                // ...
            }

            @Override
            public void handleDataDeleted(String dataPath) throws Exception {
                // 第 3 步，唤醒当前线程，准备再次获取锁
                countDownLatch.countDown();
            }
        };

        // 第 1 步，添加监听
        zkClient.subscribeDataChanges(previousNodePath, listener);

        String threadName = Thread.currentThread().getName();

        // 在监听的通知没来之前，该线程应该是等待状态
        if (zkClient.exists(previousNodePath)) {
            try {
                String msg = String.format("[%s] WATCH AND BLOCK AT PATH: %s", threadName, previousNodePath);
                System.out.println(msg);

                // 第 2 步，阻塞当前线程
                countDownLatch.await();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }


        {
            String msg = String.format("[%s] Watcher DELETE PATH: %s", threadName, previousNodePath);
            System.out.println(msg);
        }

        // 第 4 步，解除监听
        zkClient.unsubscribeDataChanges(previousNodePath, listener);
    }

    public void releaseLock() {
        if (zkClient != null) {
            if (currentNodePath != null && !"".equals(currentNodePath)) {
                zkClient.delete(currentNodePath);

                String threadName = Thread.currentThread().getName();
                String msg = String.format("[%s] RELEASE LOCK - DELETE PATH: %s", threadName, currentNodePath);
                System.out.println(msg);
            }
            zkClient.close();
        }
    }
}
```

