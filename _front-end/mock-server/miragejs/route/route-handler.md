---
title: "Route: GET/POST/PATCH/DELETE"
sequence: "202"
---

Hopefully you can see how the **database**, **models** and the `Schema` API drastically simplify our server definition.
Here's a set of five standard RESTful routes for our Movie resource:

```text
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
```
