---
title:  "Baeldung code"
sequence: "203"
---

## code samples

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

- **example 1 - discussion**: technically, both are OK; but, it's a good idea to keep all of the parameters on the same line if possible (like here)

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


