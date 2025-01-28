---
title: "事务"
sequence: "106"
---

```java
import org.apache.curator.RetryPolicy;
import org.apache.curator.framework.CuratorFramework;
import org.apache.curator.framework.CuratorFrameworkFactory;
import org.apache.curator.framework.api.transaction.CuratorOp;
import org.apache.curator.framework.api.transaction.CuratorTransactionResult;
import org.apache.curator.framework.api.transaction.OperationType;
import org.apache.curator.retry.RetryNTimes;

import java.util.List;

public class ZK_Curator_Transaction_001_Simple {
    public static void main(String[] args) throws Exception {
        // 第 1 步，创建 Client
        RetryPolicy retryPolicy = new RetryNTimes(3, 100);
        CuratorFramework client = CuratorFrameworkFactory.newClient(Const.ZK_CONNECTITON_STRING, retryPolicy);

        // 第 2 步，启动 Client
        client.start();

        // 第 3 步，操作
        CuratorOp createOp1 = client.transactionOp().create().forPath("/transaction1");
        CuratorOp createOp2 = client.transactionOp().create().forPath("/transaction2");
        CuratorOp createOp3 = client.transactionOp().create().forPath("/transaction3");

        List<CuratorTransactionResult> result = client.transaction().forOperations(createOp1, createOp2, createOp3);
        for (CuratorTransactionResult item : result) {
            OperationType type = item.getType();
            String path = item.getForPath();
            String msg = String.format("[%s] %s", type, path);
            System.out.println(msg);
        }

        // 第 4 步，关闭 Client
        client.close();
    }
}
```
