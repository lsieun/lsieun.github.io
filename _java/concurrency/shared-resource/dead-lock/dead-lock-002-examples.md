---
title: "死锁代码示例"
sequence: "102"
---

[UP](/java-concurrency.html)


## synchronized 示例

### 两个文件

```java
public class DeadLock_TwoFile {
    private static final String fileA = "A 文件";
    private static final String fileB = "B 文件";

    public static void main(String[] args) {
        new Thread() { // 线程一
            @Override
            public void run() {
                synchronized (fileA) { // 打开文件 A，线程独占
                    System.out.println(this.getName() + ":文件 A 写入");
                    synchronized (fileB) {
                        System.out.println(this.getName() + ":文件 B 写入");
                    }
                    System.out.println(this.getName() + ":所有文件保存");
                }
            }
        }.start();

        new Thread() { // 线程二
            @Override
            public void run() {
                synchronized (fileB) { // 打开文件 A，线程独占
                    System.out.println(this.getName() + ":文件 B 写入");
                    synchronized (fileA) {
                        System.out.println(this.getName() + ":文件 A 写入");
                    }
                    System.out.println(this.getName() + ":所有文件保存");
                }
            }
        }.start();
    }
}
```
