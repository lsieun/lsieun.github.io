---
title: "Transaction"
sequence: "111"
---

## 事务处理的提交、撤销与嵌套

```text
using (Transaction trans = db.TransactionManager.StartTransaction())
{
    try
    {
        trans.Commit();
    }
    catch
    {
        trans.Abort();
    }
}
```
