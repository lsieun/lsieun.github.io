---
title: "QuickSort 快速排序"
sequence: "102"
---

## 介绍

Quicksort is a sorting algorithm, which is leveraging the divide-and-conquer principle.
It has an average O(n log n) complexity,
and it's one of the most used sorting algorithms, especially for big data volumes.

It's important to remember that **Quicksort isn't a stable algorithm.**
A stable sorting algorithm is an algorithm
where the elements with the same values appear in the same order in the sorted output as they appear in the input list.

## 思路

The input list is divided into two sub-lists by an element called **pivot**;
one sub-list with elements less than the pivot and another one with elements greater than the pivot.
This process repeats for each sub-list.

Finally, all sorted sub-lists merge to form the final output.

## Algorithm Steps

- We choose an element from the list, called the **pivot**. We'll use it to divide the list into two sub-lists.
- We reorder all the elements around the pivot – the ones with smaller value are placed before it,
  and all the elements greater than the pivot after it.
  After this step, the pivot is in its final position.
- This is the important **partition step**.
- We apply the above steps recursively to both sub-lists on the left and right of the pivot.

