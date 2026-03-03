---
title: "Quick Start"
sequence: "102"
---

[UP](/selenium/index.html)

| Browser | Property                  |
|---------|---------------------------|
| Chrome  | `webdriver.chrome.driver` |
| Edge    | `webdriver.edge.driver`   |
| Firefox | `webdriver.gecko.driver`  |
| Safari  | `webdriver.safari.driver` |

## pom.xml

```xml
<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <version>${selenium.version}</version>
</dependency>
```

```xml
<dependency>
    <groupId>io.github.bonigarcia</groupId>
    <artifactId>webdrivermanager</artifactId>
    <version>${webdriver.manager.version}</version>
</dependency>
```

## 第一种

```java
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class SeleniumChrome {
    public static void main(String[] args) {
        // 1. Set the path of the web driver executable
        System.setProperty("webdriver.chrome.driver", "D:\\webdrivers\\chromedriver.exe");

        // 2. Initialize a web driver instance
        WebDriver driver = new ChromeDriver();

        // 3. 0pen URL in the browser
        driver.get("http://localhost");

        // 4. Quit the browser
        driver.quit();
    }
}
```

## 第二种

```java
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class SeleniumChromeWithManager {
    public static void main(String[] args) {
        // 1. 使用 WebDriverManager 自动管理具体的 WebDriver
        WebDriverManager.chromedriver().setup();

        // 2. Initialize a web driver instance
        WebDriver webDriver = new ChromeDriver();

        // 3. 0pen URL in the browser
        webDriver.get("http://localhost");

        // 4. Quit the browser
        webDriver.quit();
    }
}
```
