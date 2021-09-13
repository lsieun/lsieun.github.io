---
title:  "Baeldung-Git"
sequence: "208"
---

- if you're just getting started with Pull Requests - this is a good place to start:
- https://help.github.com/articles/using-pull-requests/
- https://help.github.com/articles/creating-a-pull-request/

- very briefly - here's what the process looks like:
  - you fork the repo
  - you do the work on the forked repo (which is under your github account)
  - you commit that work
  - you open a PR from your fork to the official repo

## getting started - forking the repository

- most of our articles include code examples (or pseudocode/shell commands)
- code examples should also be included in our repository
- we have a dedicated GitHub repository for each area (if it uses code) - have a look at the area-specific doc linked above to find the exact repository
- you won't be able to push directly to our repository, so you have to **fork** it, then work on your fork of the repository
- if you're not familiar with this process, here's a general guide written by one of our editors on his personal blog: [How to Fork an Open Source Project](https://codingcraftsman.wordpress.com/2019/04/17/how-to-fork-an-open-source-project/)

## adding the code

- for the most part, you should use **one of the existing modules** we already have
- if you're not sure which module fits - **propose a few to your editor** and they'll help you pick

- a module shouldn't have more than 10 articles pointing to it (you can count them in the Readme)
- for Spring modules the limit is 7 articles
- so, if you're thinking of using a module that's already at (or over) the limit - again - talk to your editor about it

## when to create a new module

- if you think no module fits - and you need a new one - definitely talk to your editor first
- as a general rule - we should try to introduce a new module if you think that can be used by a few articles (existing or upcoming)
- that means that - if you think the new module you're thinking about has no chance of ever being used by another article (because it's too specific) - then we should try to avoid introducing it (if we can)

## package structure

- each article should have its own package, in the module you're using
- for example, let's say the package structure of the module is: `com.baeldung`
- and, let's say your article is about Defining a DataSource in Spring Boot (as an example)
- then - your article code should be in: `com.baeldung.boot.data`
- or: `com.baeldung.boot.datasource`

- the main aspect here is - it has its own subpackage, separate from everything else
- that means that it shouldn't use/re-use any code from the other packages either

- note: try to make the package readable; so, for example - instead of a single package like: `convertiteratortolist`, it would be better to go with: `convert.iteratortolist`

## Maven info

- the typical order of the main blocks should be: **parent**, **dependencies**, **build**, **properties**
- the `artifactId` should be lowercase
- the `name` in the pom is optional, but if we have it, it should be the same as the `artifactId`
- as much as possible, all modules should use the parents (in most cases, it should be clear which parent is the right one)

- wherever possible, the project should **use the latest versions** of any dependencies
- the dependencies should define versions **using properties** (not hardcoded)
- test dependencies should be clearly marked as `<scope>test</scope>`

## about tests

- your code should include tests as needed to verify the behavior added
- all tests should following our **standard naming convention**:
  - `FooUnitTest.java`
  - `FooIntegrationTest.java` or `FooIntTest.java` // usually Spring enabled tests
  - `FooLiveTest.java` // tests that require a running component

- that's because unit tests run in the standard build; integration and live tests do not
- if your tests requires accessing a running component (eg: a MySql database), you can rename it to `*LiveTest` so it doesn't run as part of the build, which would cause it to fail
- new tests should use **JUnit 5** over JUnit 4

## tests - names

- test should follow the **BDD** convention: `givenX_whenY_thenZ`
- the given part is optional, but the other two are not
- example: `whenSendingAPost_thenCorrectStatusCode`

- also, the delimiter (underline) should only be used between these sections, and not anywhere else
- **for example - this isn't correct**: `whenSomething_andSomethingElse_thenSuccessfull`

- always use **a new line before the then section** of the test
- for example (notice the new line): 

```text
public void whenSomething_thenSomethingElse {
    // some preparation code belonging to the when section

    assert( ...)
}
```

## building the code

- always build your code before opening a PR:

```text
mvn clean install
```

- to build a module by disabling the incremental build, use the command:

```text
mvn clean install -Dgib.enabled=false
```

## the Pull Request (PR)

- when your code is ready, create a Pull Request (PR) from your fork to our repository - for your editor to review and merge
- make sure to only include the relevant changes that are necessary for your article and nothing else:
  - no formatting changes
  - no IDE artifacts (Eclipse, IntelliJ stuff)
  - basically, nothing that isn't critical to the article

- **note 1**: try to keep the PR **under 10 commits** so that we can merge them quickly
- **note 2**: all PRs should contain the **JIRA issue number** in the title
- **note 3**: you don't need to add the article link should to the readme, as you don't have the final URL yet

## code - assertions

- when creating complex assertions, it's a good idea to use [assertj](http://joel-costigliola.github.io/assertj/) to preserve clarity - if the assertions are trivial, it's fine to stick to JUnit ones
