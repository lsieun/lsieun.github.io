---
title: "bootstrap.server 和 Metadata"
sequence: "102"
---

The producer's job includes fetching metadata about the cluster.
Because producers can only write to the replica leader of the partition they are assigned to,
the metadata helps the producer determine which broker to write to
as the user might have only included a topic name without any other details.

```text
Sending METADATA request with header RequestHeader(
    apiKey=METADATA,
    apiVersion=12,
    clientId=producer-1,
    correlationId=1,
    headerVersion=2
) and timeout 30000 to node -2: MetadataRequestData(
    topics=[
        MetadataRequestTopic(topicId=AAAAAAAAAAAAAAAAAAAAAA, name='my-favorite-topic')
    ],
    allowAutoTopicCreation=true,
    includeClusterAuthorizedOperations=false,
    includeTopicAuthorizedOperations=false
)
```

```text
Received METADATA response from node -2 for request with header RequestHeader(
    apiKey=METADATA,
    apiVersion=12,
    clientId=producer-1,
    correlationId=1,
    headerVersion=2
): MetadataResponseData(
    throttleTimeMs=0,
    brokers=[
        MetadataResponseBroker(nodeId=2, host='192.168.80.132', port=9092, rack=null),
        MetadataResponseBroker(nodeId=3, host='192.168.80.133', port=9092, rack=null),
        MetadataResponseBroker(nodeId=1, host='192.168.80.131', port=9092, rack=null)
    ],
    clusterId='qBf7h2sIRieHKDkaWPFzKQ',
    controllerId=3,
    topics=[
        MetadataResponseTopic(
            errorCode=0,
            name='my-favorite-topic',
            topicId=vI2xDTwdQl2J07Jb7dF3Ig,
            isInternal=false,
            partitions=[
                MetadataResponsePartition(
                    errorCode=0,
                    partitionIndex=0,
                    leaderId=3,
                    leaderEpoch=0,
                    replicaNodes=[3, 2, 1],
                    isrNodes=[3, 2, 1],
                    offlineReplicas=[]
                ),
                MetadataResponsePartition(
                    errorCode=0,
                    partitionIndex=2,
                    leaderId=2,
                    leaderEpoch=0,
                    replicaNodes=[2, 1, 3],
                    isrNodes=[2, 1, 3],
                    offlineReplicas=[]
                ),
                MetadataResponsePartition(
                    errorCode=0,
                    partitionIndex=1,
                    leaderId=1,
                    leaderEpoch=0,
                    replicaNodes=[1, 3, 2],
                    isrNodes=[1, 3, 2],
                    offlineReplicas=[]
                )
            ],
            topicAuthorizedOperations=-2147483648
        )
    ],
    clusterAuthorizedOperations=-2147483648
)
```




