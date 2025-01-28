---
title: "PromQL"
sequence: "101"
---

Prometheus provides a functional query language called PromQL (Prometheus Query Language)
that lets the user select and aggregate time series data in real time.

The result of an expression can either be shown as a graph,
viewed as tabular data in Prometheus's expression browser,
or consumed by external systems via the HTTP API.

```text
- result of PromQL expression
    - graph
    - tabular data
    - consumed by external system
```

## Expression language data types

In Prometheus's expression language, an expression or sub-expression can evaluate to one of four types:

- **Instant vector** - a set of time series containing a single sample for each time series, all sharing the same timestamp
- **Range vector** - a set of time series containing a range of data points over time for each time series
- **Scalar** - a simple numeric floating point value
- **String** - a simple string value; currently unused

## Reference

- [QUERYING PROMETHEUS](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [QUERY EXAMPLES](https://prometheus.io/docs/prometheus/latest/querying/examples/)

https://note.youdao.com/ynoteshare/index.html?id=187c40f04fedde63c757ccdec3286f2a&type=note&_time=1690362906834

https://note.youdao.com/ynoteshare/index.html?id=cbfa3d73c49c9d7d1147d0feafb71ffb&type=note&_time=1690362914153
