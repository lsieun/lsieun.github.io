---
title: "API: VectorStore"
sequence: "103"
---

[UP](/spring-ai/index.html)

## 概念

如何理解 `VectorStore`

- vector store
    - add
    - delete
    - search

- VectorStore
    - `void add(List<Document> documents)`
    - `void delete(List<String> idList)`
    - `void delete(Filter.Expression filterExpression)`
    - `List<Document> similaritySearch(SearchRequest request)`

## 使用

### 创建 VectorStore

通过 `Builder` 来构建 `VectorStore` 对象

### 添加 Document

### 删除 Document

### 查询 Document

使用 `similaritySearch()` 方法，需要先准备一个 `SearchRequest` 参数：

```text
List<Document> similaritySearch(SearchRequest request)
```

首先，需要对于 `SearchRequest` 类的理解，

- 核心字段
    - `query`：会转换成一个 vector
    - `similarityThreshold`：相似度的阈值
- 辅助字段
    - `topK`：限制数量
    - `filterExpression`：对 metadata 进行过滤

```java
public class SearchRequest {
    private String query = "";
    private double similarityThreshold = 0.0;

    private int topK = 4;
    private Filter.Expression filterExpression;
}
```

其次，就是如何创建 `SearchRequest` 对象？通过 Builder 模式。

```text
import org.springframework.ai.vectorstore.SearchRequest;

SearchRequest createSearchRequest(String query) {
    return SearchRequest.builder()
            .query(query)
            .topK(3)
            .similarityThreshold(0.2)
            .build();
}

SearchRequest createSearchRequest(String query, String filter) {
    return SearchRequest.builder()
            .query(query)
            .filterExpression(filter)
            .build();
}
```

## Filter.Expression

第 1 种方法，使用 `Filter.Expression` 类的构造方法：

```text
import java.time.Duration;
import java.time.Instant;
import org.springframework.ai.vectorstore.filter.Filter;


Filter.Expression sourceFilter = new Filter.Expression(
        Filter.ExpressionType.EQ,
        new Filter.Key("source"),
        new Filter.Value("db")
);

Filter.Expression dateFilter = new Filter.Expression(
        Filter.ExpressionType.GT,
        new Filter.Key("lastUpdatedAt"),
        new Filter.Value(Instant.now().minus(Duration.ofDays(1)).toEpochMilli())
);

Filter.Expression filter = new Filter.Expression(
        Filter.ExpressionType.AND,
        sourceFilter,
        dateFilter
);
```

第 2 种方法，使用 `FilterExpressionBuilder` 类（Builder 模式）：

```text
import java.time.Duration;
import java.time.Instant;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.ai.vectorstore.filter.FilterExpressionBuilder;


FilterExpressionBuilder builder = new FilterExpressionBuilder();
Filter.Expression filter = builder.and(
        builder.eq("source", "db"),
        builder.gt(
                "lastUpdatedAt",
                Instant.now().minus(Duration.ofDays(1)).toEpochMilli()
        )
).build();
```

第 3 种方法，使用 `FilterExpressionTextParser` 类，对字符串（`String`）进行解析：

```text
import java.time.Duration;
import java.time.Instant;
import org.springframework.ai.vectorstore.filter.Filter;
import org.springframework.ai.vectorstore.filter.FilterExpressionTextParser;


FilterExpressionTextParser parser = new FilterExpressionTextParser();
Filter.Expression filter = parser.parse(
        "source == 'db' && lastUpdatedAt > '" +
                Instant.now().minus(Duration.ofDays(1)).toEpochMilli()
        + "'"
);
```

## 源码

```java

@FunctionalInterface
public interface VectorStoreRetriever {
    List<Document> similaritySearch(SearchRequest request);
}
```

```java
public interface DocumentWriter extends Consumer<List<Document>> {

    default void write(List<Document> documents) {
        accept(documents);
    }

}
```

```java
public interface VectorStore extends DocumentWriter, VectorStoreRetriever {
    void add(List<Document> documents);

    void delete(List<String> idList);

    void delete(Filter.Expression filterExpression);
}
```
