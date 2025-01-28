---
title: "线程间 - 消息队列"
sequence: "102"
---

[UP](/java-concurrency.html)


```java
record Message(int id, Object value) {
}
```

```java
import java.util.LinkedList;

// 消息队列类 ， java 线程之间通信
class MessageQueue {
    // 消息的队列集合
    private final LinkedList<Message> list = new LinkedList<>();
    // 队列容量
    private final int capacity;

    public MessageQueue(int capacity) {
        this.capacity = capacity;
    }

    // 获取消息
    public Message take() {
        // 检查队列是否为空
        synchronized (list) {
            while (list.isEmpty()) {
                try {
                    LogUtils.log("队列为空, 消费者线程等待");
                    list.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            // 从队列头部获取消息并返回
            Message message = list.removeFirst();
            LogUtils.log("已消费消息 {}", message);
            list.notifyAll();
            return message;
        }
    }

    // 存入消息
    public void put(Message message) {
        synchronized (list) {
            // 检查对象是否已满
            while (list.size() == capacity) {
                try {
                    LogUtils.log("队列已满, 生产者线程等待");
                    list.wait();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            // 将消息加入队列尾部
            list.addLast(message);
            LogUtils.log("已生产消息 {}", message);
            list.notifyAll();
        }
    }
}
```

```java
public class MessageQueueRun {

    public static void main(String[] args) {
        MessageQueue queue = new MessageQueue(2);

        Thread t1 = new Thread(() -> {
            while (true) {
                sleep(1);
                Message message = queue.take();
                LogUtils.log("message: {}", message);
            }
        }, "消费者");
        t1.start();

        for (int i = 0; i < 3; i++) {
            int id = i;
            new Thread(() -> {
                queue.put(new Message(id, "值" + id));
            }, "生产者" + i).start();
        }


        sleep(10);
        System.exit(0);
    }
}
```
