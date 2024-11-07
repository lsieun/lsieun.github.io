---
title: "策略模式"
sequence: "strategy"
---

![](/assets/images/design-pattern/diagrams/strategy-structure.png)

```text
Concrete Strategies --> Strategy --> Context
---------------------------------------------
                    Client
```

- The `Context` maintains a reference to one of the concrete strategies and
  communicates with this concrete strategy object only via the `Strategy` interface.
- The `Strategy` interface is common to all concrete strategies.
  It declares a method the context uses to execute a strategy.
- **Concrete Strategies** implement different variations of an algorithm the context uses.
- The context calls the execution method on the linked strategy object each time it needs to run the algorithm.
  The context doesn't know what type of strategy it works with or how the algorithm is executed.
- The `Client` creates a specific strategy object and passes it to the context.
  The context exposes a setter which lets clients replace the strategy associated with the context at runtime.

## 示例

### 数学

```java
public interface MathStrategy {
    int execute(int a, int b);
}
```

```java
public class MathConcreteStrategyAdd implements MathStrategy {
    @Override
    public int execute(int a, int b) {
        return a + b;
    }
}
```

```java
public class MathConcreteStrategySubtract implements MathStrategy {
    @Override
    public int execute(int a, int b) {
        return a - b;
    }
}
```

```java
public class MathConcreteStrategyMultiply implements MathStrategy {
    @Override
    public int execute(int a, int b) {
        return a * b;
    }
}
```

```java
public class MathContext {
    private MathStrategy strategy;

    public void setStrategy(MathStrategy strategy) {
        this.strategy = strategy;
    }

    public int executeStrategy(int a, int b) {
        return strategy.execute(a, b);
    }
}
```

```java
import java.util.Scanner;

public class MathZeroClientRunner {
    public static void main(String[] args) {
        MathContext context = new MathContext();

        MathStrategy addStrategy = new MathConcreteStrategyAdd();
        MathStrategy subStrategy = new MathConcreteStrategySubtract();
        MathStrategy mulStrategy = new MathConcreteStrategyMultiply();

        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            if ("exit".equalsIgnoreCase(line)) {
                break;
            }

            String[] array = line.split(" ");
            int a = Integer.parseInt(array[0]);
            int b = Integer.parseInt(array[2]);
            String op = array[1];

            if ("+".equals(op)) {
                context.setStrategy(addStrategy);
            } else if ("-".equals(op)) {
                context.setStrategy(subStrategy);
            } else if ("*".equals(op)) {
                context.setStrategy(mulStrategy);
            } else {
                break;
            }

            int result = context.executeStrategy(a, b);
            String info = String.format("%s = %s", line, result);
            System.out.println(info);
        }

        System.out.println("... Have a nice day ...");
    }
}
```

