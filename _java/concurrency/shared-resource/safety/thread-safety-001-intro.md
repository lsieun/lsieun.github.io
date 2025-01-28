---
title: "Intro"
sequence: "111"
---

[UP](/java-concurrency.html)


The "**thread-safety**" programming methodology means that
**different threads can access the same resources
without exposing erroneous behavior or producing unpredictable results.**

- Thread-Safety
    - 有锁
    - 无锁

线程安全

- 优点：可靠
- 缺点：执行速度慢
- 使用建议：需要线程共享时使用

线程不安全：

- 优点：速度快
- 缺点：可能与预期不符
- 使用建议：在线程内部使用，无需线程间共享

线程（不）安全的类：

- `Vector` 是线程安全的，`ArrayList`、`LinkedList` 是线程不安全的
- `Properties` 是线程安全的，`HashSet`、`TreeSet` 是不安全的
- `StringBuffer` 是线程安全的，`StringBuilder` 是线程不安全的
- `HashTable` 是线程安全的，`HashMap` 是线程不安全的
