---
title: "Mojo: Integration Test"
sequence: "110"
---

[UP](/maven-index.html)


## Integration/Functional testing

```text
mvn integration-test -Prun-its
```

### maven-verifier

maven-verifier tests are run using JUnit or TestNG,
and provide a simple class allowing you to launch Maven and assert on its log file and built artifacts.
It also provides a `ResourceExtractor`, which extracts a Maven project from your `src/test/resources` directory
into a temporary working directory where you can do tricky stuff with it.
