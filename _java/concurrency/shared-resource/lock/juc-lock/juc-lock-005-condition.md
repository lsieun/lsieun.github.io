---
title: "Working With Conditions"
sequence: "105"
---

[UP](/java-concurrency.html)


The `Condition` class provides the ability for a thread to wait for some condition to occur
while executing the critical section.

This can occur when a thread acquires the access to the critical section
but doesn't have the necessary condition to perform its operation.
For example, a reader thread can get access to the lock of a shared queue
that still doesn't have any data to consume.

Traditionally Java provides `wait()`, `notify()` and `notifyAll()` methods for **thread intercommunication**.

Conditions have similar mechanisms, but we can also specify multiple conditions:

```java
import java.util.Stack;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockWithCondition {

    Stack<String> stack = new Stack<>();
    int CAPACITY = 5;

    ReentrantLock lock = new ReentrantLock();
    Condition stackEmptyCondition = lock.newCondition();
    Condition stackFullCondition = lock.newCondition();

    public void pushToStack(String item) {
        try {
            lock.lock();
            while (stack.size() == CAPACITY) {
                stackFullCondition.await();
            }
            stack.push(item);
            stackEmptyCondition.signalAll();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            lock.unlock();
        }
    }

    public String popFromStack() {
        try {
            lock.lock();
            while (stack.size() == 0) {
                stackEmptyCondition.await();
            }
            return stack.pop();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            stackFullCondition.signalAll();
            lock.unlock();
        }
    }
}
```
