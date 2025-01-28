---
title: "Weka Filter"
sequence: "113"
---

In WEKA, filters are used to preprocess the data.
They can be found below package `weka.filters`.
Each filter falls into one of the following two categories:

- supervised – The filter requires a class attribute to be set.
- unsupervised – A class attribute is not required to be present.

And into one of the two sub-categories:

- attribute-based – Columns are processed, e.g., added or removed.
- instance-based – Rows are processed, e.g., added or deleted.


Apart from this classification, filters are either **stream- or batch-based**.
**Stream filters** can process the data straight away and make it immediately available for collection again.
**Batch filters**, on the other hand, need a batch of data to setup their internal data structures.

