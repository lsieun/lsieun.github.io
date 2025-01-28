---
title: "Bootstrap Server"
sequence: "102"
---

```text
$ bin/kafka-console-consumer.sh \
  --bootstrap-server=0.0.0.0:9092 \
  --topic my-favorite-topic \
  --from-beginning \
  --max-messages 3
```

```text
$ kafka-topics.sh --bootstrap-server server1:9092,server2:9092,server3:9092 --describe --topic my-favorite-topic
```

## Kafka Topology

- Kafka 设计目标：scalability + high availability --> topic partition

Kafka's topology is designed for **scalability** and **high availability**.
That's why there is a cluster of servers (brokers) dealing with
**topic partitions replicated** between the brokers.

Each partition has one broker as the **leader** and the other brokers as **followers**.

- partition
    - leader
    - follower

- partition 有两个角色：leader 和 follower

Producers send messages to the partition leader,
which then propagates the record to each replica.
Consumers typically also connect to the partition leader,
because consuming a message is state-changing (consumer offset).

```text
producer --> message --> partition leader --> replicas
consumer --> message --> partition leader
```

- partition leader 对于 producer 和 consumer 都有重要作用。

The count of replicas is the **replication factor**.
A value of 3 is recommended,
as it provides the right balance between performance and fault tolerance.

- replicas 的最佳数量：3

**When one partition leader crashes, Kafka chooses another broker as the new partition leader.**
Then, the consumers and producers (“clients”) also have to switch to the new leader.

## Bootstrapping

As we've seen, the whole cluster is dynamic,
and clients need to know about the current state of topology
to connect to the correct partition leader for sending and receiving messages.
This is where bootstrapping comes into play.

The “bootstrap-servers” configuration is a list of `hostname:port` pairs
that address one or more (even all) of the brokers.
The client uses this list by doing these steps:

- pick the first broker from the list
- send a request to the broker to fetch the cluster metadata containing information about
  topics, partitions, and the leader brokers for each partition (each broker can provide this metadata)
- connect to the leader broker for the chosen partition of the topic

Of course, it makes sense to specify multiple brokers within the list
because if the first broker is unavailable, the client can choose the second one for bootstrapping.

Kafka uses Kraft (from the earlier Zookeeper) to manage all this kind of orchestration.

## Reference

- [bootstrap-server in Kafka Configuration](https://www.baeldung.com/java-kafka-bootstrap-server)

