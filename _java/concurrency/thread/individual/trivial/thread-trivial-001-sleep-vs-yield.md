---
title: "sleep 与 yield"
sequence: "101"
---

[UP](/java-concurrency.html)


Both the `sleep()` method and the `yield()` method express their willingness of not using the processor.
However, `sleep()` is the more sincere one
since it truly ceases execution for the specified amount of time, freeing the processor.
On the other hand, `yield()` is more like a gesture of being polite.
It gives hint to the scheduler about its willingness to yield its current use of the processor.
It is still up to the scheduler to decide whether or not to schedule the yielding thread
for the next time slice of processor usage.

## sleep

- 调用 `sleep` 会让当前线程从 `Running` 进入 Timed Waiting 状态（阻塞）
- 其它线程可以使用 interrupt 方法打断正在睡眠的线程，这时 `sleep` 方法会抛出 `InterruptedException`
- 睡眠结束后的线程未必会立刻得到执行
- 建议用 `TimeUnit` 的 `sleep` 代替 `Thread` 的 `sleep` 来获得更好的可读性

## yield

- 调用 `yield` 会让当前线程从 Running 进入 Runnable 就绪状态，然后调度执行其它线程
- 具体的实现依赖于操作系统的任务调度器

## Thread.sleep(0)

`Thread.sleep(0)` can temporarily release the CPU timeline.

### Time slice circular scheduling algorithm

In the operating system, the CPU has many competition strategies.
The Unix system uses the Time slice circular scheduling algorithm.
In the algorithm, all processes are grouped into a queue.
The operating system allocates a certain time to each process in their order,
that is, the time allowed for the process to run.
If the process is still running at the end of the time slice,
the CPU will be deprived and allocated to another process,
If the process blocks or ends within the time slice, the CPU switches immediately.
All the dispatcher has to do is maintain a table of ready processes.
When the process runs out of time slices, it will be moved to the end of the queue.

## How Thread.sleep Works

`Thread.sleep()` interacts with the thread scheduler
to put the current thread in a wait state for a specified period of time.
Once the wait time is over,
the thread state is changed to a runnable state and waits for the CPU for further execution.
The actual time that the current thread sleeps depends on the thread scheduler that is part of the operating system.

## Java Thread.sleep important points

- It always pauses the current thread execution.
- The actual time the thread sleeps before waking up and starting execution depends on system timers and schedulers.
  For a quiet system, the actual time for sleep is near to the specified sleep time,
  but for a busy system, it will be a little bit longer.
- `Thread.sleep()` doesn't lose any monitors or lock the current thread it has acquired.
- Any other thread can interrupt the current thread in sleep, and in such cases `InterruptedException` is thrown.
