---
title: "UTC time zone"
sequence: "103"
---

[UP](/java-time.html)


Coordinated Universal Time or UTC is the primary time standard
by which the world regulates clocks and time.
It is within about one second of mean solar time (such as UT1) at 0° longitude
(at the IERS Reference Meridian as the currently used prime meridian)
and is not adjusted for daylight saving time.
It is effectively a successor to Greenwich Mean Time (GMT).

![](/assets/images/java/time/world-time-zones-map.png)

## UTC 和 GMT 的区别

### 计算方式不同

UTC 是根据原子钟来计算时间，而 GMT 是根据地球的自转和公转来计算时间。

### 准确度不同

UTC 是现在用的时间标准，GMT 是老的时间计量标准。UTC 更加精确，由于现在世界上最精确的原子钟 50 亿年才会误差 1 秒，可以说非常精确。
