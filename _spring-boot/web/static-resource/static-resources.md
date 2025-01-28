---
title: "Spring Boot: Static Resources"
sequence: "102"
---

Spring Boot comes with a pre-configured implementation of `ResourceHttpRequestHandler`
to facilitate serving static resources.

By default, this handler serves static content from any of
the `/static`, `/public`, `/resources`, and `/META-INF/resources` directories that are on the classpath.
Since `src/main/resources` is typically on the classpath by default, we can place any of these directories there.

For example, if we put an `about.html` file inside the `/static` directory in our classpath,
then we can access that file via `http://localhost:8080/about.html`.
Similarly, we can achieve the same result by adding that file in the other mentioned directories.

## References

- [Serve Static Resources with Spring](https://www.baeldung.com/spring-mvc-static-resources)
