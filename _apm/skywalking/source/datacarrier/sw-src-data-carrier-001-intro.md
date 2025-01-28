---
title: "apm-datacarrier"
sequence: "101"
---

- project: `apm-commons/apm-datacarrier`
- package: `org.apache.skywalking.apm.commons.datacarrier`

```text
Data --> Consumer --> Thread --> Driver --> DataCarrier
```

- QueueBuffer
- data
    - Buffer
    - Channels
    - Group
- thread
    - ConsumerThread
    - MultipleChannelsConsumer

- Data
- Data Consumer
- Thread
- Driver

![](/assets/images/skywalking/source/sw-src-data-carrier-buffer.png)

![](/assets/images/skywalking/source/sw-src-data-carrier-channels.png)

![](/assets/images/skywalking/source/sw-src-data-carrier-consumer-thread.png)

![](/assets/images/skywalking/source/sw-src-data-carrier-group.png)

![](/assets/images/skywalking/source/sw-src-data-carrier-multiple-channels-consumer.png)

