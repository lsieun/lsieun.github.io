---
title: "Off-Heap Memory"
sequence: "101"
---

If an application is running out of available memory on the JVM,
we could end up forcing the GC process to run too often.
Ideally, we would want a special memory region, off-heap and not controlled by the GC process.

```java
public final class Unsafe {
    /**
     * （作用）
     * Allocates a new block of native memory, of the given size in bytes.
     * （内容）
     * The contents of the memory are uninitialized; they will generally be garbage.
     * （返回值）
     * The resulting native pointer will never be zero, and will be
     * aligned for all value types.
     * （空间释放和改变大小）
     * Dispose of this memory by calling {@link #freeMemory},
     * or resize it with {@link #reallocateMemory}.
     *
     * @throws IllegalArgumentException if the size is negative or too large
     *         for the native size_t type
     * @throws OutOfMemoryError if the allocation is refused by the system
     *
     * @see #getByte(long)
     * @see #putByte(long, byte)
     */
    public native long allocateMemory(long bytes);


    /**
     * （作用）
     * Resizes a new block of native memory, to the given size in bytes.
     * （内容）
     * The contents of the new block past the size of the old block are
     * uninitialized; they will generally be garbage.
     * （返回值）
     * The resulting native pointer will be zero if and only if the requested size is zero.
     * The resulting native pointer will be aligned for all value types.
     * （空间释放和改变大小）
     * Dispose of this memory by calling {@link #freeMemory},
     * or resize it with {@link #reallocateMemory}.
     * （方法参数）
     * The address passed to this method may be null,
     * in which case an allocation will be performed.
     *
     * @throws IllegalArgumentException if the size is negative or too large
     *         for the native size_t type
     * @throws OutOfMemoryError if the allocation is refused by the system
     *
     * @see #allocateMemory
     */
    public native long reallocateMemory(long address, long bytes);
    
    /**
     * （作用）
     * Disposes of a block of native memory,
     * as obtained from {@link #allocateMemory} or {@link #reallocateMemory}.
     * （方法参数）
     * The address passed to this method may be null, in which case no action is taken.
     *
     * @see #allocateMemory
     */
    public native void freeMemory(long address);

    /**
     * （作用）
     * Fetches a value from a given memory address.
     * （方法参数和返回值）
     * If the address is zero,
     * or does not point into a block obtained from {@link #allocateMemory},
     * the results are undefined.
     *
     * @see #allocateMemory
     */
    public native byte getByte(long address);

    /**
     * （作用）
     * Stores a value into a given memory address.
     * （方法参数和效果）
     * If the address is zero,
     * or does not point into a block obtained from {@link #allocateMemory},
     * the results are undefined.
     *
     * @see #getByte(long)
     */
    public native void putByte(long address, byte x);
}
```

The `allocateMemory()` method from the `Unsafe` class gives us the ability to allocate huge objects off the heap,
meaning that this memory will not be seen and taken into account by the **GC** and the **JVM**.

This can be very useful, but we need to remember that
this memory needs to be managed manually and properly reclaiming with `freeMemory()` when no longer needed.

```java
import sun.misc.Unsafe;

public class Program {
    public static void main(String[] args) {
        Unsafe unsafe = UnsafeUtils.getInstance();

        long size = 1024L;
        long address = unsafe.allocateMemory(size);

        for (int i = 0; i < 10; i++) {
            unsafe.putByte(address + i, (byte) ('a' + i));
        }

        for (int i = 0; i < 10; i++) {
            byte b = unsafe.getByte(address + i);
            char ch = (char) b;
            System.out.println(ch);
        }

        unsafe.freeMemory(address);
    }
}
```
