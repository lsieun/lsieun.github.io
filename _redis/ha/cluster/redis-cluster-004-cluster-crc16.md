---
title: "CRC16"
sequence: "104"
---

CRC16 校验算法简介
CRC 即循环冗余校验码（Cyclic Redundancy Check[1] ）：是数据通信领域中最常用的一种查错校验码，其特征是信息字段和校验字段的长度可以任意选定。循环冗余检查（CRC）是一种数据传输检错功能，对数据进行多项式计算，并将得到的结果附在帧的后面，接收设备也执行类似的算法，以保证数据传输的正确性和完整性。

Crc16Util 说明
CRC16 有多种实现算法，这里是基于 Modbus CRC16 的校验算法的 java 实现。如果是基于其他的协议的算法，只需更改 getCrc16()中的实现。
getCrc16(); 是核心算法，获取校验码 byte 数组。
intToBytes(); 将算出的 int 类型转成 byte 数组，低位在前，高位在后。改变高地位顺序，只需改变方法中数组的顺序。
getData(); 获取源数据和验证码的组合 byte 数组，可以传入 byte 数组，也可以传入十六进制字符数组。
byteTo16String(); 将 byte 或 byte 数组转换成十六进制字符，这里主要用于测试观察校验算法的结果。


## Reference

- [CRC16 校验算法的 Java 实现](https://blog.csdn.net/qq_34356024/article/details/78205530)
