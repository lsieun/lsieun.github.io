---
title: "Spring Boot Database"
sequence: "database"
---

## Spring Data

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/spring-data/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## DataSource

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/datasource/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## H2

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/h2/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Redis

### Basic

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/redis/basic/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

### Server

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/redis/server/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

### Client

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/redis/client/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Transaction

{%
assign filtered_posts = site.db |
where_exp: "item", "item.url contains '/db/transaction/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

## Reference

- [List of In-Memory Databases](https://www.baeldung.com/java-in-memory-databases)
- [Self-Contained Testing Using an In-Memory Database](https://www.baeldung.com/spring-jpa-test-in-memory-database)

- [java 进阶教程数据层全栈方案 Spring Data 高级应用](https://www.bilibili.com/video/BV1RE41167Pk)
- [最新 Spring Data Jpa 入门到实战教程](https://www.bilibili.com/video/BV1NP4y1z7Lo)
- [Hibernate - vs JDBC vs JPA vs Spring Data JPA](https://dev.to/yigi/hibernate-vs-jdbc-vs-jpa-vs-spring-data-jpa-1421) 这个文章讲 Hibernate、JPA、JDBC、Spring Data JPA 的概念区别，我觉得挺好的
- [Graph Databases vs Relational Databases: What and why?](https://dev.to/documatic/graph-databases-vs-relational-databases-what-and-why-5d6g#when-to-use-graph-databases)
- [Java ORM – Hibernate vs Spring Data JPA vs EclipseLink vs JPA vs JDBC](https://www.eversql.com/java-orm-hibernate-vs-spring-data-jpa-vs-eclipselink-vs-jpa-vs-jdbc/)
- [Hibernate vs. JDBC: How do these database APIs differ?](https://www.theserverside.com/video/Hibernate-vs-JDBC-How-do-these-database-APIs-differ)

- [Spring Data](https://www.baeldung.com/category/persistence/spring-persistence/spring-data)
    - Basic
        - [Spring Data – CrudRepository save() Method](https://www.baeldung.com/spring-data-crud-repository-save)
    - JPA
        - [Difference Between JPA and Spring Data JPA](https://www.baeldung.com/spring-data-jpa-vs-jpa)
        - [Introduction to Spring Data JPA](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)
        - [Getting Started with Spring Data JPA](https://attacomsian.com/blog/getting-started-spring-data-jpa)
        - [Spring Boot, Hibernate, JPA and H2 Database CRUD REST API Example](https://bushansirgur.in/spring-boot-hibernate-jpa-and-h2-database-crud-rest-api-example/)
        - [Spring Data JPA with H2 DataBase and Spring Boot](https://attacomsian.com/blog/spring-data-jpa-h2-database)
        - [Accessing Data with Spring Data JPA and MySQL](https://attacomsian.com/blog/accessing-data-spring-data-jpa-mysql)
        - [Spring Data JPA Batch Inserts](https://www.baeldung.com/spring-data-jpa-batch-inserts)
        - [Spring Data JPA – Run an App Without a Database](https://www.baeldung.com/spring-data-jpa-run-app-without-db)
        - [NonUniqueResultException in Spring Data JPA](https://www.baeldung.com/spring-jpa-non-unique-result-exception)
        - [How to Access EntityManager with Spring Data](https://www.baeldung.com/spring-data-entitymanager)
        - [How to Implement a Soft Delete with Spring JPA](https://www.baeldung.com/spring-jpa-soft-delete)
        - [Spring JPA @Embedded and @EmbeddedId](https://www.baeldung.com/spring-jpa-embedded-method-parameters)
        - [Spring Data JPA and Null Parameters](https://www.baeldung.com/spring-data-jpa-null-parameters)
        - [Pagination and Sorting using Spring Data JPA](https://www.baeldung.com/spring-data-jpa-pagination-sorting)
        - [Limiting Query Results with JPA and Spring Data JPA](https://www.baeldung.com/jpa-limit-query-results)
        - [Query Entities by Dates and Times with Spring Data JPA](https://www.baeldung.com/spring-data-jpa-query-by-date)
        - [Auditing with JPA, Hibernate, and Spring Data JPA](https://www.baeldung.com/database-auditing-jpa)
        - [Spring JPA – Multiple Databases](https://www.baeldung.com/spring-data-jpa-multiple-databases)
    - JDBC
        - [Introduction to Spring Data JDBC](https://www.baeldung.com/spring-data-jdbc-intro)
    - Cassandra
        - [Introduction to Spring Data Cassandra](https://www.baeldung.com/spring-data-cassandra-tutorial)
        - [Logging Queries with Spring Data Cassandra](https://www.baeldung.com/spring-data-cassandra-logging-queries)
    - Geode
        - [Intro to Spring Data Geode](https://www.baeldung.com/spring-data-geode)
    - LDAP
        - [Guide to Spring Data LDAP](https://www.baeldung.com/spring-data-ldap)
    - Neo4j
        - [Introduction to Spring Data Neo4j](https://www.baeldung.com/spring-data-neo4j-intro)
    - REST
        - [Introduction to Spring Data REST](https://www.baeldung.com/spring-data-rest-intro)
    - Couchbase
        - [Intro to Spring Data Couchbase](https://www.baeldung.com/spring-data-couchbase)
    - Elasticsearch
        - [Introduction to Spring Data Elasticsearch](https://www.baeldung.com/spring-data-elasticsearch-tutorial)
    - Redis
        - [Introduction to Spring Data Redis](https://www.baeldung.com/spring-data-redis-tutorial)


