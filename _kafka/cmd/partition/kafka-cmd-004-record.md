---
title: "Kafka Record"
sequence: "104"
---

## kafka-delete-records.sh

File: `delete-config.json`

Let's purge all messages from the `partition=1` by using `offset=-1`:

```json
{
  "partitions": [
    {
      "topic": "purge-scenario",
      "partition": 1,
      "offset": -1
    }
  ],
  "version": 1
}
```

```text
$ bin/kafka-delete-records.sh \
  --bootstrap-server 0.0.0.0:9092 \
  --offset-json-file delete-config.json
```

