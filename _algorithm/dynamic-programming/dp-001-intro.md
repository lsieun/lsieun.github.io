---
title: "动态规划算法"
sequence: "101"
---

- 第 1 步，设计状态
- 第 2 步，确定状态转移方程
- 第 3 步，确定初始状态
- 第 4 步，执行状态转移
- 第 5 步，计算最终的解

动态规划的应用：

- 最短路径（弗洛伊德算法）
- 库存管理
- 资源分配
- 设备更新
- 排序
- 装载

## 一维数据

### 最长递增子序列

第一种方式，时间复杂度为O(n^2)

第二种方式，时间复杂度为 O(nlog(n))

## Rod Cutting Problem

```text
if(rodLength > currentLength) {
    table[row][col] = table[row-1][col];
}
else {
    table[row][col] = Math.max(
        table[row-1][col],
        table[row][currentLength - rodLength] + rodPrice;
    );
}
```

## Longest Common Subsequence

```text
if (a == b) {
    table[row][col] = table[row - 1][col - 1] + 1;
}
else {
    table[row][col] = Math.max(
        table[row][col - 1],
        table[row - 1][col]
    );
}
```

## Longest Common Substring

```text
if (a == b) {
    table[row][col] = table[row - 1][col - 1] + 1;
}
else {
    table[row][col] = 0;
}
```

## 放苹果

- [典型递归问题-放苹果](https://www.bilibili.com/video/BV1xZ4y1x7jb/)

## Regular Expression

## 通配符匹配 Wildcard Matching

```text
https://www.bilibili.com/video/BV18K411J7xs/
```

```text
if (p == '?' || p == t) {
    table[row][col] = table[row - 1][col - 1];
}
else if(p == '*') {
    table[row][col] = table[row][col - 1] || table[row - 1][col];
}
else {
    table[row][col] = false;
}
```


## Reference

- [labuladong 的算法笔记](https://labuladong.gitee.io/algo/)
    - [动态规划解题套路框架](https://labuladong.gitee.io/algo/di-er-zhan-a01c6/dong-tai-g-a223e/dong-tai-g-1e688/)
- [10分钟彻底搞懂“动态规划”算法](https://www.bilibili.com/video/BV1AB4y1w7eT/)
- [这可能是最好懂的动态规划入门教程](https://www.bilibili.com/video/BV1yL411L7sX/)
- [动态规划入门50题](https://www.bilibili.com/video/BV1aa411f7uT/)
