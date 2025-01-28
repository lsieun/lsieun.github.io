---
title: "路由断言工厂（Route Predicate Factories）配置"
sequence: "104"
---

作用：当请求gateway的时候，使用断言对请求进行匹配。
如果匹配成功，就路由转发；如果匹配失败，就返回404。

Spring Cloud Gateway包括许多内置的断言工厂，所有这些断言都与HTTP请求的不同属性匹配。

## 时间

基于Datetime类型的断言工厂

```text
ZonedDateTime now = ZonedDateTime.now();
System.out.println(now);
```

输出：

```text
2022-10-30T15:58:36.738+08:00[Asia/Shanghai]
```

此类型的断言根据时间做判断，主要有三个：

- `AfterRoutePredicateFactory`：接收一个日期参数，判断请求日期是否晚于指定日期。
- `BeforeRoutePredicateFactory`：接收一个日期参数，判断请求日期是否早于指定日期。
- `BetweenRoutePredicateFactory`：接收两个日期参数，判断请求日期是否在指定时间段内。

```text
- After=2021-12-31T23:59:59.789+08:00[Asian/Shanghai]
```

## IP

基于远程地址的断言工厂

`RemoteAddrRoutePredicateFactory`：接收一个IP地址段，判断请求主机地址是否在地址段中

```text
- RometeAddr=192.168.1.1/24
```

## HTTP

### RequestLine

#### Method

基于Method请求方法的断言工厂

`MethodRoutePredicateFactory`：接收一个参数，判断请求类型是否跟指定的类型匹配

```text
- Method=GET
```

#### Path

基于Path请求路径的断言工厂

`PathRoutePredicateFactory`：接收一个参数，判断请求的URI部分是否满足路径规则：

```text
- Path=/foo/{segment}
```

如果 `Path` 有多项内容，可以用 `,` 分隔：

```text
- Path=/browser/**, /v3/**
```

#### Query

基于Query请求参数的断言工厂

`QueryRoutePredicateFactory`：接收两个参数（请求param和正则表达式）。
判断请求参数是否具有给定名称且与正则表达式匹配：

```text
- Query=baz, ba.
```

### Header

基于Header的断言工厂

`HeaderRoutePredicateFactory`：接收两个参数（标题名称和正则表达式）。

判断请求Header是否具有给定名称且值与正则表达式匹配：

```text
- Header=X-Request-Id,\d+
```

#### Host

基于Host的断言工厂

`HostRoutePredicateFactory`：接收一个参数，主机名模式。
判断请求的Host是否满足匹配规则：

```text
- Host=**.testhost.org
```

#### Cookie

基于Cookie的断言工厂

`CookieRoutePredicateFactory`：接收两个参数（cookie名字和一个正则表达式）。

判断请求cookie是否具有给定名称且值与正则表达式匹配：

```text
- Cookie=chocolate, ch.
```

### Weight

基于路由权重的断言工厂

`WeightRoutePredicateFactory`：接收一个`[组名, 权重]`，然后对于同一个组内的路由按照权重转发：

```text
routes:
  - id: weight_route1
    uri: host1
    predicates:
      - Path=/product/**
      - Weight=group3, 1
  - id: weight_route2
    uri: host2
    predicates:
      - Path=/product/**
      - Weight=group3, 9
```




