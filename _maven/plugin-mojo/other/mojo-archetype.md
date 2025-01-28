---
title: "Mojo Archetype"
sequence: "102"
---

[UP](/maven-index.html)


To create a new plugin project, you could using the Mojo archetype with the following command line:

```text
mvn archetype:generate \
  -DgroupId=lsieun \
  -DartifactId=hello-maven-plugin \
  -DarchetypeGroupId=org.apache.maven.archetypes \
  -DarchetypeArtifactId=maven-archetype-plugin \
  -DinteractiveMode=false
```

```text
mvn archetype:generate \
  -DgroupId=lsieun \
  -DartifactId=hello-maven-plugin \
  -DarchetypeGroupId=org.apache.maven.archetypes \
  -DarchetypeArtifactId=maven-archetype-mojo \
  -DinteractiveMode=false
```
