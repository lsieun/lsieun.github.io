---
title: "MirageJS: response"
sequence: "207"
---

```text
// Using the `Response` class to return a 500
this.delete("/movies/1", () => {
  let headers = {};
  let data = { errors: ["Server did not respond"] };

  return new Response(500, headers, data);
})
```

## Serializer

**Serializers** let you customize the formatting logic of your responses,
without having to change your route handlers, models, relationships,
or any other part of your Mirage setup.

### JSONAPISerializer

Mirage ships with a few named serializers that match popular backend formats:

```text
import { createServer, JSONAPISerializer } from "miragejs";

createServer({
  serializers: {
    application: JSONAPISerializer,
  },
})
```

```text
{
    "data": [
        {
            "type": "movies",
            "id": "1",
            "attributes": {
                "rating": "PG-13",
                "year": 2009,
                "title": "Movie 0"
            }
        },
        {
            "type": "movies",
            "id": "2",
            "attributes": {
                "rating": "PG-13",
                "year": 1957,
                "title": "Movie 1"
            }
        }
    ]
}
```

### customize

You can also extend from the base class and use its formatting hooks to write your own:

```text

```

