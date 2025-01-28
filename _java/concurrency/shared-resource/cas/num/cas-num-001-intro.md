---
title: "原子整数：AtomicInteger、AtomicLong"
sequence: "101"
---

[UP](/java-concurrency.html)


JUC 并发包提供了：

- AtomicBoolean
- AtomicInteger
- AtomicLong

```text
AtomicInteger i = new AtomicInteger(0);
 
//  获取并自增（ i = 0,  结果  i = 1,  返回  0 ），类似于  i++
System.out.println(i.getAndIncrement());
 
//  自增并获取（ i = 1,  结果  i = 2,  返回  2 ），类似于  ++i
System.out.println(i.incrementAndGet());
 
//  自减并获取（ i = 2,  结果  i = 1,  返回  1 ），类似于  --i
System.out.println(i.decrementAndGet());
 
//  获取并自减（ i = 1,  结果  i = 0,  返回  1 ），类似于  i--
System.out.println(i.getAndDecrement());
 
//  获取并加值（ i = 0,  结果  i = 5,  返回  0 ）
System.out.println(i.getAndAdd(5));
 
//  加值并获取（ i = 5,  结果  i = 0,  返回  0 ）
System.out.println(i.addAndGet(-5));
 
//  获取并更新（ i = 0, p  为  i  的当前值 ,  结果  i = -2,  返回  0 ）
//  其中函数中的操作能保证原子，但函数需要无副作用
System.out.println(i.getAndUpdate(p -> p - 2));
 
//  更新并获取（ i = -2, p  为  i  的当前值 ,  结果  i = 0,  返回  0 ）
//  其中函数中的操作能保证原子，但函数需要无副作用
System.out.println(i.updateAndGet(p -> p + 2));
 
//  获取并计算（ i = 0, p  为  i  的当前值 , x  为参数 1,  结果  i = 10,  返回  0 ）
//  其中函数中的操作能保证原子，但函数需要无副作用
// getAndUpdate  如果在  lambda  中引用了外部的局部变量，要保证该局部变量是  final  的
// getAndAccumulate  可以通过   参数 1  来引用外部的局部变量，但因为其不在  lambda  中因此不必是  final
System.out.println(i.getAndAccumulate(10, (p, x) -> p + x));
 
//  计算并获取（ i = 10, p  为  i  的当前值 , x  为参数 1,  结果  i = 0,  返回  0 ）
//  其中函数中的操作能保证原子，但函数需要无副作用
System.out.println(i.accumulateAndGet(-10, (p, x) -> p + x));
```
