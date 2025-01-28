---
title: "JUC FutureTask"
sequence: "102"
---

[UP](/java-concurrency.html)

```java
public class FutureTask<V> implements RunnableFuture<V> {
    /**
     * The run state of this task, initially NEW.
     * （初始状态为NEW）
     * The run state transitions to a terminal state only in methods set, setException, and cancel.
     * （最终状态由 set, setException, cancel 方法设置）
     * During completion, state may take on transient values of
     * COMPLETING (while outcome is being set) or
     * INTERRUPTING (only while interrupting the runner to satisfy a cancel(true)).
     * （中间状态：COMPLETING, INTERRUPTING）
     * Transitions from these intermediate to final states use cheaper ordered/lazy writes
     * because values are unique and cannot be further modified.
     * （中间状态，过渡到，终态，使用 cheaper ordered/lazy writes）
     *
     * Possible state transitions:
     * <ul>
     *     <li>NEW -> COMPLETING -> NORMAL</li>
     *     <li>NEW -> COMPLETING -> EXCEPTIONAL</li>
     *     <li>NEW -> CANCELLED</li>
     *     <li>NEW -> INTERRUPTING -> INTERRUPTED</li>
     * </ul>
     */
    private volatile int state;
    private static final int NEW          = 0;
    private static final int COMPLETING   = 1;
    private static final int NORMAL       = 2;
    private static final int EXCEPTIONAL  = 3;
    private static final int CANCELLED    = 4;
    private static final int INTERRUPTING = 5;
    private static final int INTERRUPTED  = 6;
}
```
