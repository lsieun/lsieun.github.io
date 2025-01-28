---
title: "MirageJS"
sequence: "201"
---

Mirage runs in the browser.
It intercepts any `XMLHttpRequest` or `fetch` requests your JavaScript app makes and lets you mock the response.
That means you can develop and test your app just as if it were talking to a real server.

In addition to intercepting HTTP requests,
Mirage provides **a mock database** and **helper functions**
that make it easy to simulate dynamic backend services.

Mirage borrows concepts from typical server-side frameworks like

- **routes** to handle HTTP requests
- a **database** and **models** for storing data and defining relationships
- **factories and fixtures** for stubbing data, and
- **serializers** for formatting HTTP responses

to help you quickly configure your mock server.

```text
                             ┌─── urlPrefix
                             │
            ┌─── routes ─────┼─── namespace
            │                │
MirageJS ───┤                └─── passthrough
            │
            └─── database
```

## 安装

```text
npm install --save-dev miragejs
```

```text
yarn add --dev miragejs
```

## 实践

```vue
<script setup lang="ts">
import axios from 'axios'

const sendRequest = () => {
  axios.get('/api/hello')
      .then(function(response) {
        let status = response.status;
        let statusText = response.statusText;
        let headers = response.headers;
        let data = response.data;

        console.log('status = ', status);
        console.log('statusText = ', statusText);
        console.log('headers = ', headers);
        console.log('data = ', data);
      });
}
</script>

<template>
  <div>
    <button @click="sendRequest">Click Me</button>
  </div>
</template>

<style scoped>
</style>
```

### server

第一个实例：

```typescript
import {createServer} from 'miragejs'

createServer({});
```

完整代码：

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import {createServer} from 'miragejs';

createServer({});

createApp(App).mount('#app');
```

出现错误：

```text
MirageError {
    message: "Mirage: Your app tried to GET '/api/hello', but there was no route defined to handle this request.
     Define a route for this endpoint in your routes() config.
      Did you forget to define a namespace? The existing namespace is undefined"
}
```

### route handlers

Mirage lets you simulate API responses by writing **route handlers**.

第二个实例：

```typescript
import {createServer} from "miragejs"

createServer({
    routes() {
        this.namespace = "api";

        this.get("/movies", () => {
            return {
                movies: [
                    {id: 1, name: "Inception", year: 2010},
                    {id: 2, name: "Interstellar", year: 2014},
                    {id: 3, name: "Dunkirk", year: 2017},
                ],
            }
        })
    },
})
```

```typescript
import { createApp } from 'vue'
import App from './App.vue'
import {createServer} from 'miragejs'

createServer({
    routes() {
        this.namespace = 'api';

        this.get('/hello', (schema, request) => {
            console.log('有人访问/api/hello接口');
            return {
                'username': '张三',
                'password': '李四'
            };
        });
    }
});

createApp(App).mount('#app');
```



### custom response

You can even return a custom `Response` to see how your app behaves
when it receives an error from your API.



## Reference

- [MirageJS](https://miragejs.com/docs/getting-started/introduction/)



