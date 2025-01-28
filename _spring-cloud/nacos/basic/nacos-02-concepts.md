---
title: "Nacos Concepts"
sequence: "102"
---

- Region
    - Available Zone
    - Endpoint: The entry domain name of a service in each region.

- Namespace (development and test environment and production environment)
    - Group or Data ID

- system development
    - Configuration management
        - Configuration
            - Group - Group ID
                - Configuration Set - Data ID
                    - Configuration Item


- Service Group
    - Service
        - Virtual Cluster
            - Service instance: A process with an accessible network address (IP:Port)
                - Service Name: Identifier
                - Service Metadata
                - Weight: The greater the weight, the greater the traffic that the instance expects to be allocated.
                - Health Check: Instances are judged to be healthy or unhealthy according to the inspection results.
                - Protect Threshold:
- Service Registry: Database
    - Service instances are registered with the service registry on startup and deregistered on shutdown.
    - Clients of the service and/or routers query the service registry to find the available instances of a service.
- Service Discovery: the address and metadata of an instance under the service ---> client

## Data ID

Data ID：相当于一个配置文件，比如相当于 `application.properties`，或者 `application-dev.properties`。
不过要注意的是，我们在某个项目中使用 `application.properties` 文件，那个 application 表示的就是当前应用。
我们在 Nacos 进行配置时，就要尽可能的取一些有意义的 Data ID，比如 `user.properties`（表示用户应用的配置），
`order.properties`（表示订单应用的配置），`common.properties`（表示多个应用共享的配置）。

配置内容：写具体的配置项，可以用 `properties` 的格式，也可以用 `yaml` 的格式。

![](/assets/images/spring-cloud/nacos/nacos-configuration-details-mytest.png)

## Group

Group：在 Nacos 中，一个 Data ID，也就是一个或多个配置文件可以归类到同一个 Group 中，
Group 的作用就是用来区分 Data ID 相同的情况。

不同的应用或中间件使用了相同的 Data ID 时，就可以通过 Group 来进行区分，默认为 `DEFAULT_GROUP`。

## Reference

- [Nacos Concepts](https://nacos.io/en-us/docs/concepts.html)
