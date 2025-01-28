---
title: "baeldung"
sequence: "201"
---

- [Google: Shared with me](https://drive.google.com/drive/shared-with-me)

- [Java drafts site](https://drafts.baeldung.com/wp-admin/)
- [GitHub: eugenp/tutorials](https://github.com/eugenp/tutorials)

Java 9 and above
- if the module uses Java 9 or above, then you have to add it to the `*-jdk9-and-above` profiles in the main pom
- otherwise the build will fail, as it uses JDK 8 for the `default-*` profiles


## Guide

info about creating a good article

- core info:
- [baeldung - for authors - formatting](https://docs.google.com/document/d/1T3Mtemue8I8KfHobcBPCwEDUgI_V180e0xjqZVZlDVE/edit)
- [baeldung - for authors - code in the article](https://docs.google.com/document/d/1L-TjM1cP8biT6mIWvH5fYaFHtWyZytzQoqrJ92WqK1A/edit)
- [baeldung - for authors - implementation code](https://docs.google.com/document/d/1NfAhFeuakpsf6_yukGOdMpcS5h0LhqVP1oaPkjdk-So/edit)
- [baeldung - for authors - on good writing](https://docs.google.com/document/d/15EpG0P5VLBpUH-bGypfS-uBk83rSEj8jeoR9lXJMdS8/edit)

### how to research an article

- you'll notice that most topics point to a link - usually a StackOverflow link - to get you started
- to be clear - that is **not enough** and the article should not just be based on that source
- the link is just a starting point - you **need to do your own research**, beyond that article, as you write

## Article

prefer American English
- American English is standard on the site

never use content from other articles

- before starting to write - you can read as many articles on the topic as you'd like
- but when you write, never have any articles open
- that can easily lead to unintentional plagiarism - which is not OK


### conversational style

use a conversational style

- the first variation is not conversational, the second one is

- example 1:
  - **Assume** the following Person Java bean:
  - **Let's define** the following Person Java bean:

- example 2:
  - **To get the reader acquainted,** a short survey of some of the key concepts of Cassandra is given below:
  - **Let's start with** a short survey of some of the key concepts of Cassandra:


- example 3:
  - Building upon the tutorial series, **we modify** the registration.html to include Google's library.
  - Building upon the tutorial series, **let's modify** the registration.html to include Google's library.

- example 4:
  - We **must** specify
  - We **need to** specify / We **should** specify / **Let's** specify

### Heading

#### 标题之间要有文字描述

where possible, avoid having headings after headings without text to separate them
- for example, if we have:

```text
<h2>2. OAuth</h2>
<h3>2.1. What is OAuth2?</h3>
…

```

add a brief introductory text after the H2 heading to separate the headings:

```text
<h2>2. OAuth</h2>
// add text here
<h3>2.1. What is OAuth2?</h3>
```

### Image

#### Image Source

- if you use an image or diagram from a different source, this should include credit and link to the source; example: "This image is part of the official documentation for Mesos ([source](https://mesos.apache.org/assets/img/documentation/architecture3.jpg))." in the article: https://www.baeldung.com/apache-mesos

- if you create an image or diagram for the article, attach the editable source to the Jira as well


#### 引入图片用冒号

a diagram/image should be introduced with a sentence ending in a colon ( ":" )

example - correct:

```text
Here we're setting up a controller:
// some image here
```

and this is incorrect:

```text
Here, we're setting up a controller.
// some image here
```



#### 图片大小

### Code Format

#### 引入代码用冒号

a code sample should be introduced with a sentence ending in a colon ( ":" )

example - correct:

```text
Here we're setting up a controller:
// some image here
```

and this is incorrect:

```text
Here, we're setting up a controller.
// some image here
```

#### don't use filler words

when introducing code samples, don't use filler words

- I'll highlight the filler words that should be removed

- example 1: Now we can create an aspect using AspectJ annotation syntax **as follows**:
- example 2: After we have defined the interceptor binding we should define interceptor implementation **like this**:
- example 3: Let's apply the created interceptor to the business logic **in the following way**:
- example 4: We can now create an simple aspect using AspectJ annotation syntax **like in the following example**:
- example 5: We have an Item class which represents the tuple "ITEM" in the database. **The class looks like the following**:

### GitHub code link at the end

- at the end of the article, we need to have a link to the GitHub project
- the format of this link should be exactly like this:
  "... available [over on GitHub]()."

### Check

extra info about the structure of an article

- let's start with the way we should focus on the topic of the article: focus on the core topic you're writing about
- do a quick check done to make sure there's no keyword stuffing
- make sure there's a valid link to the Github project at the end of the article


## Code

### package structure

each article should have its own package, in the module you're using

for example, let's say the package structure of the module is:
```text
com.baeldung
```

and, let's say your article is about Defining a DataSource in Spring Boot (as an example)
then - your article code should be in:
```text
com.baeldung.boot.data
```
  
or:

```text
com.baeldung.boot.datasource
```

the main aspect here is - it has its own subpackage, separate from everything else
that means that it shouldn't use/re-use any code from the other packages either


### PR

- [知乎：GitHub 的 Pull Request 是指什么意思？](https://www.zhihu.com/question/21682976)
- [How to Fork an Open Source Project](https://codingcraftsman.wordpress.com/2019/04/17/how-to-fork-an-open-source-project/)

always build your code before opening a PR

```text
mvn clean install
```

to build a module by disabling the incremental build, use the command:

```text
mvn clean install -Dgib.enabled=false
```
