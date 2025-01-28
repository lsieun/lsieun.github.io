---
title: "Baeldung code"
sequence: "203"
---

## code samples(Code In Draft)

### about code samples

- code should be - as much as possible - **copy-paste runnable**; that means - a reader should be able to simply copy-paste a code sample in an empty unit test and run it
- this is of course easily achieved, since code samples should mostly be copy-pasted into the article from the IDE

### code samples - should not contain
- code samples should not contain any:
  - import statements (unless they're unusual or absolutely necessary)
  - `final` keywords (unless it's for a constant)
  - setters and getters (instead just say **// standard setters and getters**)
  - comments or javadoc
  - `private static final long serialVersionUID = ...;`
  - **try-catch blocks** (most of the time)
  - **default constructors** for classes that only have the default constructor


### code samples - indentation

- the indentation should be **4 spaces**
- when breaking up a long line, the second part of the line needs to be indented by **2 spaces** (compared to the first part of the line)

### code - getters and setters comment

- **example 1 - incorrect**:

```text
//getters and setters
// Getters and Setters
// Getters & Setters
// getters & setters
```


- **example 2 - correct**:

```text
// getters and setters
```

or:

```text
// standard getters and setters
```

### code - new lines

- here are a few suggestions of where to add (and not add new lines):
  - add a new line before the comment: `// getters and setters`
  - add a new line between the given, when and then sections of a test

#### multiple lines

breaking a new line into multiple lines - examples

- **example 1 - incorrect**:

```text
public Object process(BeanContext context, Object object,
  String name, Object value) {
```

- **example 1 - correct**:

```text
public Object process(
  BeanContext context, Object object, String name, Object value) {
```

- **example 1 - discussion**: technically, both are OK; but, **it's a good idea to keep all of the parameters on the same line if possible** (like here)

- **example 2 - incorrect**:

```text
@RequestMapping(
  value = "/ex/foos", headers = { "key1=val1", "key2=val2" },
  method = GET)
```

- **example 2 - correct**:

```text
@RequestMapping(
  value = "/ex/foos",
  headers = { "key1=val1", "key2=val2" },
  method = GET
)
```

- **example 3 - incorrect**:

```text
public void givenDestWithNullReverseMappedToSourceAndLocalConfigForNoNull
  _whenFailsToMap_thenCorrect() {
```

- **example 3 - correct**: either put the entire method on a new line or rename it; definitely don't break a method name in the middle

#### operator

- **when breaking a line with an operator, put the operator on the new line**
- **example - correct**:

```text
CompletableFuture<String> completableFuture
  = new CompletableFuture<>();
```

- **incorrect**:

```text
CompletableFuture<String> completableFuture =
  new CompletableFuture<>();
```

### doing stacktraces correctly

- stack traces are naturally very long - we need to make them nice and readable
- first, use Logback (of course)
- then, make sure you actually select the right exception in the stack trace
- finally, if you have a long stack, only show the few lines at the top

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

## Code Test(Github)

测试，要确实能够验证某个特定的行为。

- your code should include tests as needed to verify the behavior added

### 测试类：名字规范

关于测试类的名字，分成三种情况：

- 如果是单元测试，则以`XxxUnitTest.java`命名。
- 如果是集成测试，例如Spring enabled tests，则以`XxxIntegrationTest.java`命名。
- 如果需要a running component，则以`XxxLiveTest.java`命名。

- all tests should following our **standard naming convention**:
  - `FooUnitTest.java`
  - `FooIntegrationTest.java` or `FooIntTest.java` // usually Spring enabled tests
  - `FooLiveTest.java` // tests that require a running component

- that's because **unit** tests run in the standard build; **integration** and **live** tests do not
- if your tests requires accessing a running component (eg: a MySql database), you can rename it to `*LiveTest` so it doesn't run as part of the build, which would cause it to fail
- new tests should use **JUnit 5** over **JUnit 4**

### 测试方法：名字规范

- test should follow the **BDD** convention: `givenX_whenY_thenZ`
- the `given` part is optional, but the other two are not
- example: `whenSendingAPost_thenCorrectStatusCode`

注意：下划线（`_`）也不能随便添加

- also, the delimiter (**underline**) should only be used between these sections, and not anywhere else
- **for example - this isn't correct**: `whenSomething_andSomethingElse_thenSuccessfull`

### 测试方法：必要的空行

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
