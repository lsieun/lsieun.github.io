---
title: "分布式"
sequence: "distributed"
---

## 分布式事务

- 2PC
- 3PC: Prepare --> Commit
- TCC: Try --> Confirm --> Cancel
- SAGA

## 分布式锁

通过 Redis 的 SetNx 实现分布式锁：

- [都是分布式锁惹的祸](https://www.bilibili.com/video/BV1Uz4y137UA/)

- Redission
  - 分布式锁
  - 布隆过滤器

问题：
第 1 个线程，到 redis 进行加锁，过了一段时间，当过期时间到了， 第 1 个线程还在处理业务中，第 2 个线程获得到 redis 锁？
当第 1 个线程，任务执行完成后，要释放 redis 锁，这时候把第 2 个 redis 的锁释放了？

- 第 1 个问题，当锁过期时，线程还在处理业务？
- 当处理完释放其它线程的锁？

解决：

- 加长时间，并添加子线程每 10 秒确认线程是否在线；如果在线，则将过期时间重设；
- 给锁加唯一 ID

red lock 来进行解决？


