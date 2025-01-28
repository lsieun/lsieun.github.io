---
title: "MirageJS: request"
sequence: "206"
---

```text
console.log('@request', request);
```

## url

```typescript
console.log('url = ', request.url);
```

## queryParams

```typescript
console.log('queryParams = ', request.queryParams);
console.log('page = ', request.queryParams?.page);
console.log('size = ', request.queryParams?.size);
```

## requestHeaders

```typescript
console.log('requestHeaders = ', request.requestHeaders);
console.log('Accept = ', request.requestHeaders?.Accept);
console.log('Authorization = ', request.requestHeaders?.Authorization);
console.log('X-Requested-With = ', request.requestHeaders['X-Requested-With']);
```

## requestBody

```typescript
console.log('requestBody = ', request.requestBody);
```

```text
let attrs = JSON.parse(request.requestBody)
```
