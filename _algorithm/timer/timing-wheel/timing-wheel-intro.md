---
title: "时间轮"
sequence: "101"
---

## 参考

文章

- [Hashed Wheel Timers](https://dev.to/frosnerd/hashed-wheel-timers-5bo9)
- [Hashed Timing Wheel](https://medium.com/@raghavan99o/hashed-timing-wheel-2192b5ec8082)
- [Hashed and Hierarchical Timing Wheels: Data Structures for the Efficient Implementation of a Timer Facility](https://blog.acolyer.org/2015/11/23/hashed-and-hierarchical-timing-wheels/)

- [Hashed and Hierarchical Timing Wheels](https://paulcavallaro.com/blog/hashed-and-hierarchical-timing-wheels/)
- [Implement a timing wheel for millions of concurrent tasks](https://dev.to/kevwan/implement-a-timing-wheel-for-millions-of-concurrent-tasks-30oi)

- [Apache Kafka, Purgatory, and Hierarchical Timing Wheels](https://www.confluent.io/blog/apache-kafka-purgatory-hierarchical-timing-wheels/)

文献：

- [Hashed and Hierarchical Timing Wheels: Data Structures for the Efficient Implementation of a Timer Facility](http://www.cs.columbia.edu/~nahum/w6998/papers/sosp87-timing-wheels.pdf)
- [Hashed and Hierarchical Timing Wheels: Efficient Data Structures for the Implementating a Timer Facility](http://www.cs.columbia.edu/~nahum/w6998/papers/ton97-timing-wheels.pdf)
- [Hashed and Hierarchical Timing Wheels](https://www.cse.wustl.edu/~cdgill/courses/cs6874/TimingWheels.ppt)

代码

- Java
    - [ben-manes/caffeine](https://github.com/ben-manes/caffeine/blob/master/caffeine/src/main/java/com/github/benmanes/caffeine/cache/TimerWheel.java)
    - [apache/kafka](https://github.com/apache/kafka/blob/trunk/server-common/src/main/java/org/apache/kafka/server/util/timer/TimingWheel.java)
    - [netty/netty](https://github.com/netty/netty/blob/4.1/common/src/main/java/io/netty/util/HashedWheelTimer.java)
    - [real-logic/agrona](https://github.com/real-logic/agrona/blob/master/agrona/src/main/java/org/agrona/DeadlineTimerWheel.java)
- C/C++
    - [facebook/folly](https://github.com/facebook/folly/blob/main/folly/io/async/HHWheelTimer.h)

应用

- [Implement a Monitor Service in Netty Server: Hashed and Hierarchical Timing Wheels - Spring Boot - Spring WebFlux](https://ranawakay.medium.com/implement-a-monitor-service-in-netty-server-hashed-and-hierarchical-timing-wheels-spring-boot-39d11365f87e)
