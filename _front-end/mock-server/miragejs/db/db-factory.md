---
title: "Database: Factory"
sequence: "205"
---

**Factories** are objects that make it easy to generate realistic-looking data for your Mirage server.
Think of them as blueprints for your models.

We can create a Factory for our `Movie` model like this:

```text
import {createServer, Factory, Model} from 'miragejs';

createServer({
    models: {
        movie: Model
    },
    factories: {
        movie: Factory.extend({})
    }
});
```

We can then define some properties on our Factory.
They can be simple types like **Booleans**, **Strings** or **Numbers**, or **functions** that return dynamic data:

```text
import {createServer, Factory, Model} from 'miragejs';

export const startMock = () => createServer({
    models: {
        movie: Model
    },
    factories: {
        movie: Factory.extend({
            title(i) {
                return `Movie ${i}`
            },
            year() {
                let min = 1950;
                let max = 2022;

                return Math.floor(Math.random() * (max - min + 1)) + min
            },

            rating: "PG-13"
        })
    }
});
```

Now when we use the `server.create` API, Mirage will use our Factory to help us generate new data.
(It still respects attribute overrides we pass in.)

```text
server.create("movie")
server.create("movie")
server.create("movie", { rating: "R" })

server.db.dump()
```

## createList

There's also a `server.createList` API to generate many records at once.

You can use both `server.create` and `server.createList` to invoke your Factories in your seeds function:

```text
import { createServer, Factory } from "miragejs"

createServer({
  seeds(server) {
    server.createList("movie", 10)
  },
})
```

## 完整示例

### App.vue

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
  axios.delete('/api/movies/2')
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
        <td>{{ item.title }}</td>
        <td>{{ item.year }}</td>
        <td>{{ item.rating }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
</style>
```

### main.ts

```text
import { createApp } from 'vue';
import App from './App.vue';
import { startMirage } from './server/server02factory'
startMirage();
createApp(App).mount('#app');
```

### server02factory.ts

```text
import {createServer, Factory, Model} from 'miragejs';

export const startMock = () => createServer({
    models: {
        movie: Model
    },
    factories: {
        movie: Factory.extend({
            title(i) {
                return `Movie ${i}`
            },
            year() {
                let min = 1950;
                let max = 2022;

                return Math.floor(Math.random() * (max - min + 1)) + min
            },

            rating: "PG-13"
        })
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
        server.create("movie")
        server.create("movie")
        server.create("movie", { rating: "R" })

        server.db.dump()
    }
});
```
