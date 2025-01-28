---
title: "Common Bit Tasks"
sequence: "102"
---

## Set Bit

```text
int setBit(int num, int position) {
    int mask = 1 << position;
    return x | mask;
}
```

## Get Bit

```text
boolean getBit(int num, int position) {
    return ((num & (1 << position)) != 0);
}
```

## Clear Bit

```text
int clearBit(int num, int position) {
    int mask = 1 << position;
    return x & ~mask;
}
```

## Update Bit

```text
int updateBit(int num, int position, boolean isOne) {
    int value = isOne? 1:0;
    int mask = ~(1 << position);
    return (num & mask) | (value << position);
}
```

## Toggle Bit

```text
int toggleBit(int num, int position) {
    int mask = 1 << position;
    return x ^ mask;
}
```
