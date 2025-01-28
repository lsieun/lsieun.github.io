---
title: "SOLID-S：单一职责原则"
sequence: "102"
---

SRP = Single Responsibility Principle

Each class should have one responsibility, one single purpose.

## 代码举例

```java
public class TextManipulator {
    private String text;

    public TextManipulator(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void appendText(String newText) {
        text = text.concat(newText);
    }
    
    public String findWordAndReplace(String word, String replacementWord) {
        if (text.contains(word)) {
            text = text.replace(word, replacementWord);
        }
        return text;
    }
    
    public String findWordAndDelete(String word) {
        if (text.contains(word)) {
            text = text.replace(word, "");
        }
        return text;
    }

    public void printText() {
        System.out.println(textManipulator.getText());
    }
}
```

Although this may seem fine, **it is not a good example of the SRP**.
Here we have **two responsibilities**: **manipulating** and **printing the text**.

Having a method that prints out text in this class violate the Single Responsibility Principle.
For this purpose, we should create another class, which will only handle printing text:

```java
public class TextPrinter {
    TextManipulator textManipulator;

    public TextPrinter(TextManipulator textManipulator) {
        this.textManipulator = textManipulator;
    }

    public void printText() {
        System.out.println(textManipulator.getText());
    }

    public void printOutEachWordOfText() {
        System.out.println(Arrays.toString(textManipulator.getText().split(" ")));
    }

    public void printRangeOfCharacters(int startingIndex, int endIndex) {
        System.out.println(textManipulator.getText().substring(startingIndex, endIndex));
    }
}
```

Now, in this class, we can create methods for as many variations of printing text as we want,
because that's its job.

## How Can This Principle Be Misleading?

**The trick of implementing SRP in our software is knowing the responsibility of each class.**

However, **every developer has their vision of the class purpose**, which makes things tricky.
Since we don't have strict instructions on how to implement this principle,
we are left with our interpretations of what the responsibility will be.

What this means is that sometimes only we, as designers of our application,
can decide if something is in the scope of a class or not.

When writing a class according to the SRP principle,
we have to think about the problem domain, business needs, and application architecture.
It is very subjective, which makes implementing this principle harder than it seems.
It will not be as simple as the example we have in this tutorial.

This leads us to the next point.

## Cohesion

Following the SRP principle, our classes will adhere to one functionality.
Their methods and data will be concerned with one clear purpose.
This means **high cohesion**, as well as **robustness, which together reduce errors**.

When designing software based on the SRP principle, **cohesion is essential**,
since it helps us find single responsibilities for our classes.
This concept also helps us find classes that have more than one responsibility.

Let's go back to our `TextManipulator` class methods:

```text
...

public void appendText(String newText) {
    text = text.concat(newText);
}

public String findWordAndReplace(String word, String replacementWord) {
    if (text.contains(word)) {
        text = text.replace(word, replacementWord);
    }
    return text;
}

public String findWordAndDelete(String word) {
    if (text.contains(word)) {
        text = text.replace(word, "");
    }
    return text;
}

...
```

Here, we have a clear representation of what this class does: **Text manipulation**.

But, if we don't think about cohesion, and we don't have a clear definition of what this class's responsibility is,
we could say that writing and updating the text are two different and separate jobs.
Lead by this thought, we can conclude than these should be two separate classes:
`WriteText` and `UpdateText`.

In reality, we'd get two classes that are tightly coupled and loosely cohesive,
which should almost always be used together.
These three methods may perform different operations,
but they essentially serve one single purpose: **Text manipulation**.
**The key is not to overthink.**

## Reference

- [Single Responsibility Principle in Java](https://www.baeldung.com/java-single-responsibility-principle)
