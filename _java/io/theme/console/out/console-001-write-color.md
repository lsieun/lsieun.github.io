---
title: "带颜色输出"
sequence: "101"
---

[UP](/java/java-io-index.html)


```java
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class ConsoleColors {
    // Reset
    public static final String RESET = "\033[0m"; // Text Reset

    // region Regular Colors
    private static final String BLACK = "\033[0;30m"; // BLACK
    private static final String RED = "\033[0;31m"; // RED
    private static final String GREEN = "\033[0;32m"; // GREEN
    private static final String YELLOW = "\033[0;33m"; // YELLOW
    private static final String BLUE = "\033[0;34m"; // BLUE
    private static final String MAGENTA = "\033[0;35m"; // PURPLE
    private static final String CYAN = "\033[0;36m"; // CYAN
    private static final String WHITE = "\033[0;37m"; // WHITE
    // endregion

    // region Bold
    private static final String BLACK_BOLD = "\033[1;30m"; // BLACK
    private static final String RED_BOLD = "\033[1;31m"; // RED
    private static final String GREEN_BOLD = "\033[1;32m"; // GREEN
    private static final String YELLOW_BOLD = "\033[1;33m"; // YELLOW
    private static final String BLUE_BOLD = "\033[1;34m"; // BLUE
    private static final String MAGENTA_BOLD = "\033[1;35m"; // PURPLE
    private static final String CYAN_BOLD = "\033[1;36m"; // CYAN
    private static final String WHITE_BOLD = "\033[1;37m"; // WHITE
    // endregion

    // region Underline
    private static final String BLACK_UNDERLINED = "\033[4;30m"; // BLACK
    private static final String RED_UNDERLINED = "\033[4;31m"; // RED
    private static final String GREEN_UNDERLINED = "\033[4;32m"; // GREEN
    private static final String YELLOW_UNDERLINED = "\033[4;33m"; // YELLOW
    private static final String BLUE_UNDERLINED = "\033[4;34m"; // BLUE
    private static final String MAGENTA_UNDERLINED = "\033[4;35m"; // PURPLE
    private static final String CYAN_UNDERLINED = "\033[4;36m"; // CYAN
    private static final String WHITE_UNDERLINED = "\033[4;37m"; // WHITE
    // endregion

    // region Bold + Underline
    private static final String BLACK_BOLD_UNDERLINED = "\033[1;4;30m";
    private static final String RED_BOLD_UNDERLINED = "\033[1;4;31m";
    private static final String GREEN_BOLD_UNDERLINED = "\033[1;4;32m";
    private static final String YELLOW_BOLD_UNDERLINED = "\033[1;4;33m";
    private static final String BLUE_BOLD_UNDERLINED = "\033[1;4;34m";
    private static final String MAGENTA_BOLD_UNDERLINED = "\033[1;4;35m";
    private static final String CYAN_BOLD_UNDERLINED = "\033[1;4;36m";
    private static final String WHITE_BOLD_UNDERLINED = "\033[1;4;37m";
    // endregion


    // region RGB

    public static String red(String message) {
        return RED + message + RESET;
    }

    public static String redBold(String message) {
        return RED_BOLD + message + RESET;
    }

    public static String redUnderlined(String message) {
        return RED_UNDERLINED + message + RESET;
    }

    public static String redBoldUnderlined(String message) {
        return RED_BOLD_UNDERLINED + message + RESET;
    }


    public static String green(String message) {
        return GREEN + message + RESET;
    }

    public static String greenBold(String message) {
        return GREEN_BOLD + message + RESET;
    }

    public static String greenUnderlined(String message) {
        return GREEN_UNDERLINED + message + RESET;
    }


    public static String greenBoldUnderlined(String message) {
        return GREEN_BOLD_UNDERLINED + message + RESET;
    }

    public static String blue(String message) {
        return BLUE + message + RESET;
    }

    public static String blueBold(String message) {
        return BLUE_BOLD + message + RESET;
    }

    public static String blueUnderlined(String message) {
        return BLUE_UNDERLINED + message + RESET;
    }


    public static String blueBoldUnderlined(String message) {
        return BLUE_BOLD_UNDERLINED + message + RESET;
    }
    // endregion

    // region CMYK

    public static String cyan(String message) {
        return CYAN + message + RESET;
    }

    public static String cyanBold(String message) {
        return CYAN_BOLD + message + RESET;
    }

    public static String cyanUnderlined(String message) {
        return CYAN_UNDERLINED + message + RESET;
    }

    public static String cyanBoldUnderlined(String message) {
        return CYAN_BOLD_UNDERLINED + message + RESET;
    }

    public static String magenta(String message) {
        return MAGENTA + message + RESET;
    }

    public static String magentaBold(String message) {
        return MAGENTA_BOLD + message + RESET;
    }

    public static String magentaUnderlined(String message) {
        return MAGENTA_UNDERLINED + message + RESET;
    }

    public static String magentaBoldUnderlined(String message) {
        return MAGENTA_BOLD_UNDERLINED + message + RESET;
    }

    public static String yellow(String message) {
        return YELLOW + message + RESET;
    }

    public static String yellowBold(String message) {
        return YELLOW_BOLD + message + RESET;
    }

    public static String yellowUnderlined(String message) {
        return YELLOW_UNDERLINED + message + RESET;
    }

    public static String yellowBoldUnderlined(String message) {
        return YELLOW_BOLD_UNDERLINED + message + RESET;
    }

    public static String black(String message) {
        return BLACK + message + RESET;
    }

    public static String blackBold(String message) {
        return BLACK_BOLD + message + RESET;
    }

    public static String blackUnderlined(String message) {
        return BLACK_UNDERLINED + message + RESET;
    }

    public static String blackBoldUnderlined(String message) {
        return BLACK_BOLD_UNDERLINED + message + RESET;
    }

    // endregion

    private static final ThreadLocal<String> currentColor = new ThreadLocal<>();
    private static final String[] COLOR_ARRAY = {
            RED, GREEN, BLUE, CYAN, MAGENTA, YELLOW,
            RED_UNDERLINED, GREEN_UNDERLINED, BLUE_UNDERLINED, CYAN_UNDERLINED, MAGENTA_UNDERLINED, YELLOW_UNDERLINED
    };
    private static final int[] array = new int[COLOR_ARRAY.length];

    public static String color(String message) {
        String prefix = currentColor.get();
        if (prefix == null) {
            synchronized (ConsoleColors.class) {
                prefix = currentColor.get();
                if (prefix == null) {
                    int minIndex = 0;
                    int minValue = array[0];
                    for (int i = 1; i < array.length; i++) {
                        if (array[i] < minValue) {
                            minValue = array[i];
                            minIndex = i;
                        }
                    }
                    array[minIndex] = minValue + 1;
                    prefix = COLOR_ARRAY[minIndex];
                    currentColor.set(prefix);
                }
            }
        }

        return prefix + message + RESET;
    }

    public static void main(String[] args) throws Exception {
        Class<ConsoleColors> clazz = ConsoleColors.class;
        Method[] methods = clazz.getDeclaredMethods();

        List<Method> methodList = Arrays.stream(methods)
                .sorted(Comparator.comparing(Method::getName))
                .collect(Collectors.toList());

        for (Method m : methodList) {
            String name = m.getName();
            if ("main".equals(name)) {
                continue;
            }
            Object value = m.invoke(null, name);
            System.out.println(value);
        }
    }
}
```
