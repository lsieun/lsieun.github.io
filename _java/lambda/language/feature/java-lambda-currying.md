---
title: "Currying"
sequence: "101"
---

## 简单示例

预期目标：创建 `Letter` 对象

```java
class Letter {
    private String salutation;
    private String body;
    
    Letter(String salutation, String body){
        this.salutation = salutation;
        this.body = body;
    }
}
```

第一版，使用方法：

```text
Letter createLetter(String salutation, String body){
    return new Letter(salutation, body);
}
```

第二版，使用 `BiFunction`：

```text
BiFunction<String, String, Letter> SIMPLE_LETTER_CREATOR = Letter::new;
```

第三版，使用一系列的 `Function`：

```text
Function<String, Function<String, Letter>> SIMPLE_CURRIED_LETTER_CREATOR
            = salutation -> body -> new Letter(salutation, body);
```

We see that `salutation` maps to a function.
The resulting function maps onto the new `Letter` object.
See how the return type has changed from `BiFunction`.
We're only using the `Function` class.
**Such a transformation to a sequence of functions is called currying.**

```java
import java.util.function.BiFunction;
import java.util.function.Function;

public class Main {
    // Creation by Method
    static Letter createLetter(String salutation, String body){
        return new Letter(salutation, body);
    }

    // Creation with a BiFunction
    static BiFunction<String, String, Letter> SIMPLE_LETTER_CREATOR = Letter::new;

    // Creation with a Sequence of Functions
    static Function<String, Function<String, Letter>> SIMPLE_CURRIED_LETTER_CREATOR
            = salutation -> body -> new Letter(salutation, body);

    public static void main(String[] args) {
        String salutation = "Hello";
        String body = "Nice to Meet you";

        Letter instance1 = createLetter(salutation, body);
        Letter instance2 = SIMPLE_LETTER_CREATOR.apply(salutation, body);
        Letter instance3 = SIMPLE_CURRIED_LETTER_CREATOR.apply(salutation).apply(body);
    }
}
```

## 进阶示例

```java
import java.time.LocalDate;

class Letter {
    private String returningAddress;
    private String insideAddress;
    private LocalDate dateOfLetter;
    private String salutation;
    private String body;
    private String closing;

    Letter(String returningAddress, String insideAddress, LocalDate dateOfLetter,
           String salutation, String body, String closing) {
        this.returningAddress = returningAddress;
        this.insideAddress = insideAddress;
        this.dateOfLetter = dateOfLetter;
        this.salutation = salutation;
        this.body = body;
        this.closing = closing;
    }

    @Override
    public String toString() {
        return "Letter{" +
                "returningAddress='" + returningAddress + "'" +
                ", insideAddress='" + insideAddress + "'" +
                ", dateOfLetter=" + dateOfLetter +
                ", salutation='" + salutation + "'" +
                ", body='" + body + "'" +
                ", closing='" + closing + "'" +
                '}';
    }
}
```

```java
import java.time.LocalDate;
import java.util.function.Function;

public class Main {
    static String RETURN_ADDRESS = "Home";
    static String INSIDE_ADDRESS = "School";
    static LocalDate DATE_OF_LETTER = LocalDate.now();
    static String SALUTATION = "Hello";
    static String BODY = "Nice to Meet you";
    static String CLOSING = "Good Bye";

    // Creation by Method
    static Letter createLetter(String returnAddress, String insideAddress, LocalDate dateOfLetter,
                               String salutation, String body, String closing) {
        return new Letter(returnAddress, insideAddress, dateOfLetter, salutation, body, closing);
    }

    // Creation with a Sequence of Functions
    static Function<String, Function<String, Function<LocalDate,
            Function<String, Function<String, Function<String, Letter>>>>>> LETTER_CREATOR =
            returnAddress
                    -> closing
                    -> dateOfLetter
                    -> insideAddress
                    -> salutation
                    -> body
                    -> new Letter(returnAddress, insideAddress, dateOfLetter, salutation, body, closing);

    // Pre-Filling Values
    static Function<String, Function<LocalDate, Function<String, Function<String, Function<String, Letter>>>>>
            LETTER_CREATOR_PREFILLED = returningAddress -> LETTER_CREATOR.apply(returningAddress).apply(CLOSING);

    public static void main(String[] args) {
        Letter instance1 = createLetter(
                RETURN_ADDRESS, INSIDE_ADDRESS,
                DATE_OF_LETTER,
                SALUTATION, BODY, CLOSING
        );
        Letter instance2 = LETTER_CREATOR.apply(RETURN_ADDRESS)
                .apply(CLOSING)
                .apply(DATE_OF_LETTER)
                .apply(INSIDE_ADDRESS)
                .apply(SALUTATION)
                .apply(BODY);
        Letter instance3 = LETTER_CREATOR_PREFILLED.apply(RETURN_ADDRESS)
                .apply(DATE_OF_LETTER)
                .apply(INSIDE_ADDRESS)
                .apply(SALUTATION)
                .apply(BODY);

        System.out.println(instance1);
        System.out.println(instance2);
        System.out.println(instance3);
    }
}
```

第一版，使用方法：

```text
Letter createLetter(String returnAddress, String insideAddress, LocalDate dateOfLetter, 
  String salutation, String body, String closing) {
    return new Letter(returnAddress, insideAddress, dateOfLetter, salutation, body, closing);
}
```

第二版，Functions for Arbitrary Arity

Arity is a measure of the number of parameters a function takes.
Java provides existing functional interfaces for
**nullary** (`Supplier`), **unary** (`Function`), and **binary** (`BiFunction`), but that's it.
Without defining a new Functional Interface, we can't provide a function with six input parameters.

**Currying is our way out. It transforms an arbitrary arity into a sequence of unary functions.**

```text
Function<String, Function<String, Function<LocalDate, Function<String,
  Function<String, Function<String, Letter>>>>>> LETTER_CREATOR =
  returnAddress
    -> closing
    -> dateOfLetter
    -> insideAddress
    -> salutation
    -> body
    -> new Letter(returnAddress, insideAddress, dateOfLetter, salutation, body, closing);
```

Obviously, the above type is not quite readable. With this form, we use 'apply' six times to create a `Letter`:

```text
LETTER_CREATOR.apply(RETURN_ADDRESS)
                .apply(CLOSING)
                .apply(DATE_OF_LETTER)
                .apply(INSIDE_ADDRESS)
                .apply(SALUTATION)
                .apply(BODY);
```

第三版，Pre-Filling Values

With this chain of functions, we can create a helper which pre-fills out the first values and
returns the function for onward completion of the letter object:

```text
Function<String, Function<LocalDate, Function<String, Function<String, Function<String, Letter>>>>> 
  LETTER_CREATOR_PREFILLED = returningAddress -> LETTER_CREATOR.apply(returningAddress).apply(CLOSING);
```

Notice, that for this to be useful,
**we have to carefully choose the order of the parameters in the original function**
**so that the less specific are the first ones.**

## Builder Pattern

**Instead of a sequence of functions, we use a sequence of functional interfaces.**

```java
import java.time.LocalDate;

class Letter {
    private String returningAddress;
    private String insideAddress;
    private LocalDate dateOfLetter;
    private String salutation;
    private String body;
    private String closing;

    Letter(String returningAddress, String insideAddress, LocalDate dateOfLetter,
           String salutation, String body, String closing) {
        this.returningAddress = returningAddress;
        this.insideAddress = insideAddress;
        this.dateOfLetter = dateOfLetter;
        this.salutation = salutation;
        this.body = body;
        this.closing = closing;
    }

    @Override
    public String toString() {
        return "Letter{" +
                "returningAddress='" + returningAddress + "'" +
                ", insideAddress='" + insideAddress + "'" +
                ", dateOfLetter=" + dateOfLetter +
                ", salutation='" + salutation + "'" +
                ", body='" + body + "'" +
                ", closing='" + closing + "'" +
                '}';
    }

    static AddReturnAddress builder(){
        return returnAddress
                -> closing
                -> dateOfLetter
                -> insideAddress
                -> salutation
                -> body
                -> new Letter(returnAddress, insideAddress, dateOfLetter, salutation, body, closing);
    }

    interface AddReturnAddress {
        Letter.AddClosing withReturnAddress(String returnAddress);
    }

    interface AddClosing {
        Letter.AddDateOfLetter withClosing(String closing);
    }

    interface AddDateOfLetter {
        Letter.AddInsideAddress withDateOfLetter(LocalDate dateOfLetter);
    }

    interface AddInsideAddress {
        Letter.AddSalutation withInsideAddress(String insideAddress);
    }

    interface AddSalutation {
        Letter.AddBody withSalutation(String salutation);
    }

    interface AddBody {
        Letter withBody(String body);
    }
}
```

```java
import java.time.LocalDate;

public class Main {
    static String RETURN_ADDRESS = "Home";
    static String INSIDE_ADDRESS = "School";
    static LocalDate DATE_OF_LETTER = LocalDate.now();
    static String SALUTATION = "Hello";
    static String BODY = "Nice to Meet you";
    static String CLOSING = "Good Bye";

    // Creation by Method
    static Letter createLetter(String returnAddress, String insideAddress, LocalDate dateOfLetter,
                               String salutation, String body, String closing) {
        return new Letter(returnAddress, insideAddress, dateOfLetter, salutation, body, closing);
    }

    public static void main(String[] args) {
        Letter instance1 = createLetter(
                RETURN_ADDRESS, INSIDE_ADDRESS,
                DATE_OF_LETTER,
                SALUTATION, BODY, CLOSING
        );


        Letter instance2 = Letter.builder()
                .withReturnAddress(RETURN_ADDRESS)
                .withClosing(CLOSING)
                .withDateOfLetter(DATE_OF_LETTER)
                .withInsideAddress(INSIDE_ADDRESS)
                .withSalutation(SALUTATION)
                .withBody(BODY);


        Letter.AddDateOfLetter prefilledLetter = Letter.builder().
                withReturnAddress(RETURN_ADDRESS).withClosing(CLOSING);
        Letter instance3 = prefilledLetter.withDateOfLetter(DATE_OF_LETTER)
                .withInsideAddress(INSIDE_ADDRESS)
                .withSalutation(SALUTATION)
                .withBody(BODY);

        System.out.println(instance1);
        System.out.println(instance2);
        System.out.println(instance3);
    }
}
```
