---
title: "happens-before"
sequence: "106"
---

[UP](/java-concurrency.html)


Happens-before is a concept, a phenomenon, or simply a set of rules
that define **the basis for reordering of instructions by a compiler or CPU.**
Happens-before is not any keyword or object in the Java language,
it is simply a discipline put into place so that
**in a multi-threading environment
the reordering of the surrounding instructions does not result in a code that produces incorrect output.**

## JMM

The Java Memory Model
which is also referred to as the JMM model
defines how the storage and exchange of data take place
between threads and the hardware
in a single or multithreaded environment.

Some points to keep in mind are as follows:

- Every CPU core has its own set of registers.
- Every CPU core has its own set of cache.
- Every CPU core can execute more than one thread at a time.
- A thread executes on a CPU core but its data is stored and accessed from RAM
  where the local variables lie inside the "Thread Stack" and the objects lie inside the "Heap."

![](/assets/images/java/concurrency/memory/jmm/jmm.png)

The local variables and the references to objects inside a thread are stored in the Thread Stack,
whereas the objects themselves are stored inside the Heap.
The request for a variable by the thread running on the CPU follows this route **RAM -> Cache -> CPU Registers**.
Similarly, when some processing happens on the variable and its value is updated,
the changes go through **CPU Register -> Cache -> RAM**.
Thus while working with multiple threads that share a variable,
when one thread updates a shared variable's value,
the update has to be done to the register, then cache, and finally the RAM.
And when another thread requires to read that shared variable,
it reads the value present in the RAM which travels through the cache and registers.

```text
CPU Register --- Cache --- RAM (HEAP + Thread Stack)
```

If you look at it at the basic level,
if the read-write operations are delayed in such a way that the correct value is not stored in memory
before another read-write is performed then it can result in **memory consistency errors**.

```text
memory consistency errors
```

When working with multiple threads, this procedure of storage and retrieval may pose some problems such as:

- **Race Condition**: The condition where two threads sharing some variable,
  read and write on it but do not do so in a synchronized manner, resulting in inconsistent values.
- **Update Visibility**: where the updates made by one thread to a shared variable
  may not be visible to the other thread because the value has not yet been updated to the RAM.

```text
Race Condition 是解决两个 thread “谁先执行，谁后执行” 的问题
Update Visibility 是解决 “先执行的 thread 的运行结果，让后运行的 thread 看到结果值”的问题
```

These problems are solved by the use of **`synchronized` block** and **`volatile` variables**.

## Instruction Reordering

During compilation or during processing,
the compiler or the CPU might **reorder the instructions** to run them in parallel
to increase throughput and performance.
For example, we have 3 instructions:

```text
FullName = FirstName + LastName        // Statement 1
UniqueId = FullName + TokenNo          // Statement 2

Age = CurrentYear - BirthYear          // Statement 3
```

The compiler cannot run 1 and 2 in parallel
because 2 needs the output of 1,
but 1 and 3 can run in parallel because they are independent of each other.
So the compiler or the CPU can reorder these instructions in this way:

```text
FullName = FirstName + LastName      // Statement 1
Age = CurrentYear - BirthYear        // Statement 3

UniqueId = FullName + TokenNo        // Statement 2
```

However, if reordering is performed in a **multithreaded application**
where threads share some variables then it may cost us the correctness of our program.

Now recall the two problems we talked about in the previous section,
**the race condition**, and **the updated visibility**.
Java provides us with some solutions to handle these types of situations.
We are gonna learn what they are, and finally happens-before will be introduced in that section.

## Volatile

For a field/variable declared as `volatile`,

```text
private volatile count;
```

- Every write to the field will be written/flushed directly to the main memory (i.e. bypassing the cache.)
- Every read of that field is read directly from the main memory.

This means that the shared variable `count`, whenever written-to or read-by a thread,
it will always correspond to its most recently written value.
This will prevent **race condition** because now the threads will always use the correct value of a shared variable.
Also, the updates to the shared variable will also be visible to all the threads reading it,
thus preventing the **update visibility** problem.

There are **some more important points** that the `volatile` dictates:

- At the time you **write** to a `volatile` variable,
  all the non-volatile variables that are visible to that thread will also get written/flushed to the main memory,
  i.e. their most recent values will be stored in the RAM along with the `volatile` variable.
- At the time you **read** a volatile variable,
  all the non-volatile variables that are visible to that thread will also get refreshed from the main memory,
  i.e. their most recent values will be assigned to them.

This is called the **visibility guarantee** of a `volatile` variable.

All of this looks and works fine, unless the CPU decides to reorder your instructions,
resulting in incorrect execution of your application.
Let's understand what we mean. Consider this piece of a program:

The below code in the illustration depicts as conveyed in simpler words is as follows:

- Inputs a fresh assignment submitted by a student
- And then collects that fresh assignment.

Our goal is that each time "only a freshly prepared assignment is collected."
So proposing the sample code for the same as follows:

```java
// Sample class
class ClassRoom {

    // Declaring and initializing variables
    // of this class
    private int numOfAssgnSubmitted = 0;
    private int numOfAssgnCollected = 0;
    private Assignment assgn = null;
    // Volatile shared variable
    private volatile boolean newAssignment = false;

    // Methods of this class

    // Method 1
    // Used by Thread 1
    public void submitAssignment(Assignment assgn)
    {

        // This keyword refers to current instance itself
        // 1
        this.assgn = assgn;
        // 2
        this.numOfAssgnSubmitted++;
        // 3
        this.newAssignment = true;
    }

    // Method 2
    // Used by Thread 2
    public Assignment collectAssignment()
    {
        while (!newAssignment) {

            // Wait until a new assignment is submitted
        }

        Assignment collectedAssgn = this.assgn;

        this.numOfAssgnCollected++;
        this.newAssignment = false;

        return collectedAssgn;
    }
}
```

- The method `submitAssignment()` is used by a thread Thread1,
  which accepts an assignment submitted by a student in the field `assign`,
  then increases the count of assignments submitted, and then flips the `newAssignment` variable to `true`.
- The method `collectAssignment()` is used by a thread Thread2,
  which waits until a new assignment has been submitted,
  when the value of `newAssignment` becomes `true`,
  it stores the submitted assignment into a variable `collectedAssgn`,
  increasing the count of assignments collected and flips the `newAssignment` to `false`,
  since no pending assignments are left. Finally, it returns the collected assignment.

Now, the `volatile` variable `newAssignment` acts as a shared variable between Thread1 and Thread2
which are running concurrently.
And since all the other variables are visible to each of the threads along with `newAssignment` itself,
the read-write operations will be done directly using the main memory.

If we focus on the `submitAssignment()` method, statements 1, 2, and 3 are independent of each other,
since no statement makes use of the other statement,
hence your CPU might think “Why not reorder them?” for whatever reasons that it may provide better performance.
So let us assume the CPU reordered the three statements in this way:

```text
this.newAssignment = true;  // 3
this.assgn = assgn;         // 1
this.numOfAssgnSubmitted++; // 2
```

Now think for a second, what our goal was, it was to collect a new fresh assignment each time,
but now due to statement 3 updating the `newAssignment` to `true` even before the new assgn has been stored in the `assgn`,
the while loop in the Thread2 will now be exited and there is a possibility that
Thread2's instructions execute before the remaining instructions of Thread1,
resulting in an older value object of Assignment being submitted.
Even though the values are being retrieved directly from the main memory,
it is useless if the instructions are executed in the wrong order in this case.

This is the point where even though the visibility of the variables is guaranteed,
**the reordering of the instructions may lead to incorrect execution.**
And therefore, Java introduced the **happens-before guarantee**, in regard to the visibility of `volatile` variables.

### Happens-Before in Volatile

Happens-Before states about **reordering**. It is as follows:

- When reordering any write to a variable that happened before a **write** to a `volatile`,
  will remain before the write to the `volatile` variable.
- When reordering any **read** of a `volatile` variable
  that is located before read of some non-volatile or `volatile` variable,
  is guaranteed to happen before any of the subsequent reads.

In context to the above example, the first point is relevant.
Any write to a variable (Statements 1 and 2) that happened before a write to a `volatile` (Statement 3),
will remain before the write to the `volatile` variable.
This means that reordering of Statement 3 before 1 and 2 is prohibited.
This in turn guarantees that `newAssignment` is only set to `true`
once the new value of Assignment is assigned to `assgn`.
This is called **happens-before visibility guarantee of volatile**.
Also, statements 1 and 2 may be reordered among themselves as long as they are not being reordered after statement 3.

## Synchronization Block

In the case of a synchronization block in Java:

- When a thread **enters** a **synchronization block**,
  the thread will refresh the values of all variables that are visible to the thread at that time from the main memory.
- When a thread **exits** a **synchronization block**,
  the values of all those variables will be written to the main memory.

### Happens-Before in Synchronization Block

In case of synchronization block, happens before states that for **reordering**:

- Any write to a variable that happens before the exit of a synchronization block is guaranteed to remain
  before the exit of a synchronization block.
- Entrance to a synchronization block that happens before a read of a variable, is guaranteed to remain
  before any of the reads to the variables that follow the entrance of a synchronized block.

If one action 'x' is visible to and ordered before another action 'y',
then there is a happens-before relationship between the two actions indicated by `hb(x, y)`.

- If x and y are actions of the same thread and x comes before y in program order, then `hb(x, y)`.
- There is a happens-before edge from the end of a constructor of an object to the start of a finalizer for that object.
- If an action x synchronizes with the following action y, then we also have `hb(x, y)`.
- If `hb(x, y)` and `hb(y, z)`, then `hb(x, z)`.

Note: It is important to know that if we have `hb(x, y)`
then it does not necessarily mean that `x` always occurs in the implementation before `y`,
as long as the execution produces correct results, reordering of such actions is legal.

## More

Some more rules laid out regarding synchronization state that are as follows:

- An unlock on a monitor happens-before every subsequent lock on that monitor.
- A write to a `volatile` field happens-before every subsequent read of that field.
- A call to `start()` on a thread happens-before any actions in the started thread.
- All actions in a thread happen-before any other thread successfully return from a `join()` on that thread.
- The default initialization of any object happens-before any other actions (other than default-writes) of a program.
- When a statement invokes `Thread.start`,
  every statement that has a happens-before relationship with that statement
  also has a happens-before relationship with every statement executed by the new thread.
  The effects of the code that led up to the creation of the new thread are visible to the new thread.
- When a thread terminates and causes a `Thread.join` in another thread to return,
  then all the statements executed by the terminated thread have a happens-before relationship
  with all the statements following the successful join.
  The effects of the code in the thread are now visible to the thread that performed the join.

## Reference

- [Happens-Before Relationship in Java](https://www.geeksforgeeks.org/happens-before-relationship-in-java/)（写得很好）
- [JMM 最最最核心的概念 -Happens-before 原则](https://www.cswiki.top/pages/7214c6/)
