---
title: "SkyWalking FAQ: 001"
sequence: "101"
---

1.什么是 Skywalking？
Skywalking 是一个开源的 APM(应用程序性能管理)系统，可以帮助开发人员和系统管理员监控和管理分布式应用程序的性能，从而及时发现和解决潜在的问题。

2.Skywalking 支持哪些编程语言？
Skywalking 支持 Java、.NET、Node.js、Go、PHP 等多种编程语言，这使得它可以用于监控各种类型的应用程序。

3.Skywalking 的架构是什么样的？
Skywalking 的架构包括**探针**、**收集器**和**存储器**三个部分。
- **探针**位于**应用程序**中，用于收集性能数据。
- **收集器**负责从探针中收集数据，并将其发送到**存储器**中进行存储和分析。

Architecture

- Transport layer （这几个分别是什么作用？）
- Receiver cluster
- Aggregator cluster

4.Skywalking 的特点有哪些？
Skywalking 的特点包括：支持多种编程语言、分布式追踪、性能指标监控、事务监控、告警和故障排除等功能。
此外，Skywalking 还支持多种存储和分析方式，如 Elasticsearch、InfluxDB、Kafka、Zipkin 等。

5.Skywalking 如何实现分布式追踪？
Skywalking 通过为每个请求添加唯一的追踪 ID，并将这些 ID 传递给所有相关的服务来实现分布式追踪。
每个服务都可以将追踪 ID 添加到其日志中，从而形成完整的追踪记录。
Skywalking 还提供了可视化界面，以帮助用户查看追踪记录和识别潜在的性能问题。

Q: Skywalking 如何实现跨应用程序和服务的链路跟踪？
A: Skywalking 使用了一种名为“Trace ID”的跟踪标识符来跟踪跨越多个应用程序和服务的请求。
当请求进入系统时，Skywalking 为其分配一个唯一的 Trace ID，并将其传递给后续的应用程序和服务。
每个应用程序和服务在处理请求时，都会将其 Trace ID 添加到其响应中，以便 Skywalking 可以跟踪整个请求链路。


Q: Skywalking 如何实现对性能指标的监控和分析？
A: Skywalking 使用了一种名为“指标监控器”的机制来实现对性能指标的监控和分析。
指标监控器会定期收集系统中的性能指标数据，并将其存储到数据存储中。
您可以使用 Skywalking 提供的用户界面来查看和分析这些性能指标数据，以便识别和解决性能问题。


6.Q: Skywalking 的优势是什么？
A: Skywalking 具有以下优势：

- 全面性：Skywalking 可以跟踪多种类型的应用程序和服务，包括 Java、.NET、PHP、Node.js 等。
- 易于使用：Skywalking 提供了直观的用户界面，使得开发人员和运维人员可以轻松地查看和分析跟踪数据。
- 灵活性：Skywalking 支持多种数据存储方式和扩展机制，可以根据需要进行定制和扩展。
- 高可用性：Skywalking 具有高可用性和容错性，可以保证在分布式系统中收集和展示跟踪数据的可靠性和准确性。


7.Skywalking 与其他 APM 系统有什么不同？
Skywalking 与其他 APM 系统的不同点在于，它支持多种编程语言、具有分布式追踪和事务监控功能、支持多种存储和分析方式、具有可扩展性等。
此外，Skywalking 还是一个开源项目，用户可以自由地使用和定制它。

8.Skywalking 如何处理大量的性能数据？
Skywalking 使用分布式存储和分析技术来处理大量的性能数据。
它支持多种存储和分析方式，如 Elasticsearch、InfluxDB、Kafka、Zipkin 等。
这些技术可以帮助 Skywalking 高效地处理大量的性能数据，并提供快速的分析和查询功能。

9.Skywalking 如何进行告警和故障排除？
Skywalking 可以监控应用程序的性能指标，并根据预定义的规则生成告警。
例如，当应用程序的响应时间超过一定阈值时，Skywalking 可以自动发送告警通知。
此外，Skywalking 还提供了可视化界面，可以帮助用户识别潜在的性能问题，并提供详细的故障排除指南。

10.Skywalking 的性能如何？
Skywalking 的性能取决于多个因素，如收集器的性能、存储器的性能、数据量等。
在实际使用中，如果合理配置，Skywalking 可以在不影响应用程序性能的情况下提供高效的性能监控和追踪。

Q: Skywalking 支持哪些数据存储方式？
A: Skywalking 支持多种数据存储方式，包括 Elasticsearch、MySQL、TiDB、H2 等。您可以根据自己的需求选择最适合自己的数据存储方式。

Q: Skywalking 如何实现对分布式系统中的错误和异常的监控和分析？
A: Skywalking 使用了一种名为“日志分析器”的机制来实现对分布式系统中的错误和异常的监控和分析。
日志分析器会收集系统中的日志数据，并将其存储到数据存储中。
您可以使用 Skywalking 提供的用户界面来查看和分析这些日志数据，以便识别和解决错误和异常。
