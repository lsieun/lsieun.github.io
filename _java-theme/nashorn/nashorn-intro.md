---
title: "Nashorn"
sequence: "101"
---

```java
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class A {
    public static void main(String[] args) throws ScriptException {
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");

        Object result = engine.eval(
                "var greeting='hello world';" +
//                        "print(greeting);" +
                        "greeting");
        System.out.println(result);
    }
}
```

```java
import javax.script.Bindings;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class B {
    public static void main(String[] args) throws ScriptException {
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
        Bindings bindings = engine.createBindings();
        bindings.put("count", 3);
        bindings.put("name", "baeldung");

        String script = "var greeting='Hello ';" +
                "for(var i=count;i>0;i--) { " +
                "greeting+=name + ' '" +
                "}" +
                "greeting";

        Object bindingsResult = engine.eval(script, bindings);
        System.out.println(bindingsResult);
    }
}
```

```java
import javax.script.Bindings;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.math.BigDecimal;
import java.math.RoundingMode;

public class C {
    public static void main(String[] args) throws ScriptException {
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");

        Bindings bindings = engine.createBindings();
        bindings.put("a", 6628445.5);
        bindings.put("b", 81006.9);
        String returnVarName = "result";

        String expression = "a / (a + b) * 100";

        String script = String.format("var %1$s = %2$s; %1$s", returnVarName, expression);
        Double bindingsResult = (Double) engine.eval(script, bindings);
        double finalResult = BigDecimal.valueOf(bindingsResult).setScale(3, RoundingMode.HALF_UP).doubleValue();
        System.out.println(finalResult);

    }
}
```


## Reference

- [Introduction to Nashorn](https://www.baeldung.com/java-nashorn)
- [Evaluating a Math Expression in Java](https://www.baeldung.com/java-evaluate-math-expression-string)
