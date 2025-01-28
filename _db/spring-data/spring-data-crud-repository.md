---
title: "CrudRepository"
sequence: "crud"
---

## Repository

在 `spring-data-commons-x.x.x.jar` 中，有一个 `Repository` 接口：

```java
package org.springframework.data.repository;

public interface Repository<T, ID> {
}
```

The `Repository` is a marker interface and is primarily used
to capture the domain class and its ID type information.
A marker interface has no methods or constants and
provides runtime type information about objects.

### CrudRepository

The `CrudRepository` is a subinterface of the `Repository` interface and provides CRUD operations.

```java
package org.springframework.data.repository;

public interface CrudRepository<T, ID> extends Repository<T, ID> {
    <S extends T> S save(S entity);
    <S extends T> Iterable<S> saveAll(Iterable<S> entities);

    Optional<T> findById(ID id);
    boolean existsById(ID id);
    Iterable<T> findAll();
    Iterable<T> findAllById(Iterable<ID> ids);
    long count();

    void deleteById(ID id);
    void delete(T entity);
    void deleteAllById(Iterable<? extends ID> ids);
    void deleteAll(Iterable<? extends T> entities);
    void deleteAll();
}
```

### PagingAndSortingRepository

In addition to the `CrudRepository`, Spring Data also provides a `PagingAndSortingRepository`,
which extends the `CrudRepository` and provides additional support for **pagination** and **sorting** of the entities.

```java
package org.springframework.data.repository;

public interface PagingAndSortingRepository<T, ID> extends Repository<T, ID> {
    Iterable<T> findAll(Sort sort);
    Page<T> findAll(Pageable pageable);
}
```

