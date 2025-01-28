---
title: "link"
sequence: "107"
---

```text
docker run -d --name db -p 5342:5342 postgres:latest 
docker run -d -p 8080:8080 --name web-app --link db web-app:latest
```

```yaml
services:
  db:
    image: postgres:latest
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    ports:
      - 5432:5432
  web-app:
    images: web-app:latest
    ports:
      - 8080:8080
    links:
      - db
```

## Reference

- [Legacy container links](https://docs.docker.com/network/links/)
- [Difference Between links and depends_on in Docker Compose](https://www.baeldung.com/ops/docker-compose-links-depends-on)
