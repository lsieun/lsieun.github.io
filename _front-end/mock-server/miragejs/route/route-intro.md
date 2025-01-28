---
title: "MirageJS: routes"
sequence: "202"
---

## Static Route Handlers

```typescript
import {createServer, Response} from "miragejs"

createServer({
    routes() {
        this.namespace = "api";

        // Responding to a POST request
        this.post("/movies", (schema, request) => {
            let attrs = JSON.parse(request.requestBody)
            attrs.id = Math.floor(Math.random() * 100)

            return {movie: attrs};
        })

        // Using the `timing` option to slow down the response
        this.get(
            "/movies",
            () => {
                return {
                    movies: [
                        {id: 1, name: "Inception", year: 2010},
                        {id: 2, name: "Interstellar", year: 2014},
                        {id: 3, name: "Dunkirk", year: 2017},
                    ]
                };
            },
            {timing: 4000}
        )

        // Using the `Response` class to return a 500
        this.delete("/movies/1", () => {
            let headers = {};
            let data = {errors: ["Server did not respond"]};

            return new Response(500, headers, data);
        })
    },
})
```

## Dynamic Route Handlers

Mirage has a **Data layer** to help you write a more powerful server implementation.

File: `main.ts`

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import {createServer, Model} from 'miragejs';

createServer({
    models: {
        movie: Model,
    },

    routes() {
        this.namespace = "api";

        this.get("/movies", (schema, request) => {
            return schema.movies.all();
        })

        this.get("/movies/:id", (schema, request) => {
            let id = request.params.id;

            return schema.movies.find(id);
        })

        this.post("/movies", (schema, request) => {
            let attrs = JSON.parse(request.requestBody);

            return schema.movies.create(attrs);
        })

        this.patch("/movies/:id", (schema, request) => {
            let newAttrs = JSON.parse(request.requestBody);
            let id = request.params.id;
            let movie = schema.movies.find(id);

            return movie.update(newAttrs);
        })

        this.delete("/movies/:id", (schema, request) => {
            let id = request.params.id;

            return schema.movies.find(id).destroy();
        })
    },

    seeds(server) {
        server.create("movie", { name: "Inception", year: 2010 });
        server.create("movie", { name: "Interstellar", year: 2014 });
        server.create("movie", { name: "Dunkirk", year: 2017 });
    },
});

createApp(App).mount('#app');
```

File: `App.vue`

```text
<script setup lang="ts">
import axios, {AxiosResponse} from 'axios'
import {ref} from "vue";

const result = ref({});
const num = ref(0);

const printResponse = (response: AxiosResponse<any, any>) => {
  let status = response.status;
  let statusText = response.statusText;
  let headers = response.headers;
  let data = response.data;

  console.log('status = ', status);
  console.log('statusText = ', statusText);
  console.log('headers = ', headers);
  console.log('data = ', data);
};

const getAll = () => {
  axios.get('/api/movies')
      .then(function (response) {
        printResponse(response);
        result.value = response.data;
      });
};

const getById = () => {
  axios.get('/api/movies/1')
      .then(function (response) {
        printResponse(response);
      });
};


const postAdd = () => {
  num.value++;
  axios.post('/api/movies', {
    name: "天道酬勤" + num.value, year: 2010 + num.value
  }).then(function (response) {
    printResponse(response);
  });
};

const patchUpdate = () => {
  num.value++;
  axios.patch('/api/movies/1', {
    name: "天道酬勤" + num.value, year: 2010 + num.value
  }).then(function (response) {
    printResponse(response);
  });
};

const deleteById = () => {
  axios.delete('/api/movies/1')
      .then(function (response) {
        printResponse(response);
      });
};
</script>

<template>
  <div>
    <button @click="getAll">Get: All</button>
    <br/>
    <button @click="getById">Get: Id</button>
    <br/>
    <button @click="postAdd">Post: Add</button>
    <br/>
    <button @click="patchUpdate">Patch: Update</button>
    <br/>
    <button @click="deleteById">Delete: Id</button>
    <br/>
    <p>{{ result }}</p>
    <table border="1">
      <tr v-for="item in result?.movies">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.year }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
</style>
```

## 特殊情况

### Passthrough

Mirage is a great tool to use even if you're working on an existing app, or if you don't want to mock your entire API.

**By default, Mirage will throw an error**
if your JavaScript app makes a request that doesn't have a corresponding route handler defined.

> 默认情况下，Mirage会抛出error。

To avoid this, tell Mirage to let unhandled requests pass through:

```text
createServer({
  routes() {
    // Allow unhandled requests on the current domain to pass through
    this.passthrough();
  },
});
```

When it comes time to build a new feature, you don't have to wait for the API to be updated.
Just define the new route that you need

```text
createServer({
  routes() {
    // Mock this route and Mirage will intercept it
    this.get("/movies")

    // All other API requests on the current domain will still pass through
    // e.g. GET /api/directors
    this.passthrough()

    // If your API requests go to an external domain, pass those through by
    // specifying the fully qualified domain name
    this.passthrough("http://api.acme.com/**")
  },
})
```

### urlPrefix

If your API is on a different host or port than your app, set `urlPrefix`:

```text
routes() {
    this.urlPrefix = 'http://localhost:3000';
}
```

### timing

All the HTTP verbs work, there's a `timing` option you can use to simulate a slow server.

```text

```
