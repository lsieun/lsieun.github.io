---
title: "FAQ"
sequence: "101"
---

Q：什么是 Prometheus？

A：Prometheus 是一个开源的系统监控和警报工具集，用于收集、存储和查询时间序列数据。

Q：Prometheus 的主要组件有哪些？

A：Prometheus 由以下主要组件组成：

- Prometheus Server：负责收集和存储时间序列数据。
- Exporters：用于收集特定应用或系统的指标数据，并将其暴露给 Prometheus 进行抓取。
- Alertmanager：用于定义和发送警报通知。

Q：Prometheus 的数据模型是什么？

A：Prometheus 使用时间序列数据模型，其中每个时间序列由唯一的标识符（metric name 和一组标签）和对应的时间戳 - 值对组成。

Q：如何在 Prometheus 中定义监控指标？

A：可以使用 Prometheus 的自有查询语言 PromQL 来定义监控指标。通过指标名称和标签来唯一标识监控指标，并使用各种函数和操作符来进行数据查询和聚合。

Q：如何配置 Prometheus 进行目标抓取？

A：可以通过 Prometheus 的配置文件 prometheus.yml 来定义抓取配置。
在配置文件中指定要抓取的目标（如 Exporter 的地址和端口），并设置抓取频率等参数。

Q：Prometheus 如何处理数据存储和保留策略？

A：Prometheus 使用本地磁盘存储时间序列数据。数据存储采用分块压缩格式，同时可以配置数据保留策略，以控制数据的存储时间和保留期限。

Q：如何设置警报规则并配置 Alertmanager？

A：可以使用 Prometheus 的配置文件 prometheus.yml 来定义警报规则，并配置 Alertmanager 的通知方式和接收者。

Q：Prometheus 支持哪些查询操作和聚合函数？

A：Prometheus 支持丰富的查询操作和聚合函数，如过滤、计算率、求和、平均值、最大值、最小值等，以便对监控指标进行灵活的数据查询和分析。

Q：什么是 Prometheus 的服务发现机制？

A：Prometheus 提供多种服务发现机制，如静态配置、文件发现、Consul、Kubernetes 等，用于自动发现和抓取要监控的目标。

Q：Prometheus 的可视化和查询界面是什么？

A：Prometheus 提供一个内置的可视化和查询界面，称为 Prometheus Web UI，可以在浏览器中访问，并通过 PromQL 进行数据查询和展示。

Q：什么是 Prometheus 的推模式（Push）和拉模式（Pull）抓取？

A：Prometheus 的推模式抓取是指被监控的目标主动向 Prometheus 发送指标数据，而拉模式抓取是 Prometheus 主动从目标中拉取指标数据。

Q：如何在 Prometheus 中配置持久化存储？

A：可以使用 Prometheus 的 `--storage.tsdb.path` 参数来配置持久化存储路径，以便将时间序列数据持久化保存在磁盘上。

Q：Prometheus 是否支持高可用性（HA）部署？如果是，如何实现？

A：是的，Prometheus 支持高可用性部署。可以通过使用多个 Prometheus 实例并结合使用服务发现和联邦（Federation）来实现高可用性。

Q：什么是 Prometheus 的 Alertmanager？它的作用是什么？

A：Prometheus 的 Alertmanager 是用于处理和发送警报通知的组件。
它能够根据预定义的警报规则接收来自 Prometheus 的警报，并根据配置的通知方式发送警报通知。

Q：什么是 Prometheus 的持续查询（Continuous Queries）？

A：Prometheus 的持续查询是预定义的查询语句，定期计算和聚合时间序列数据，并将结果存储在新的时间序列中，以供后续查询和展示使用。
