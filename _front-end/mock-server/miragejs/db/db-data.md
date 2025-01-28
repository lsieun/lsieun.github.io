---
title: "MirageJS: database-data"
sequence: "205"
---

```text
createServer({
  models: {
    movie: Model,
  },

  routes() {
    this.namespace = "api"

    this.get("/movies", (schema, request) => {
      return schema.movies.all()
    })
  },

  seeds(server) {
    server.create("movie", { name: "Inception", year: 2010 })
    server.create("movie", { name: "Interstellar", year: 2014 })
    server.create("movie", { name: "Dunkirk", year: 2017 })
  },
})
```

`server.create` takes **a model name** and **an attributes object**, and inserts the new data into the database.

Now, when our JavaScript app makes a request to `/api/movies`, our server responds with this:

```text
// GET /api/movies

{
  "movies": [
    { "id": 1, "name": "Inception", "year": 2010 },
    { "id": 2, "name": "Interstellar", "year": 2014 },
    { "id": 3, "name": "Dunkirk", "year": 2017 }
  ]
}
```

Notice Mirage's database automatically assigns an auto-incrementing ID for each record.
