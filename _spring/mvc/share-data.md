---
title: "Share Data"
sequence: "114"
---

## Servlet API

### HelloController

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping(value = "/world")
    public String world(HttpServletRequest request) {
        request.setAttribute("greeting","Hello, HttpServletRequest");

        return "success";
    }

}
```

### success.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>目标页</title>
</head>
<body>
恭喜你，成功了！<br/>
<p th:text="${greeting}"></p>
</body>
</html>
```

## ModelAndView

### HelloController

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping(value = "/world")
    public ModelAndView world() {
        ModelAndView mav = new ModelAndView();
        mav.addObject("greeting", "Hello, SpringMVC");
        mav.setViewName("success");

        return mav;
    }

}
```

## Model

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping(value = "/world")
    public String world(Model model) {
        model.addAttribute("greeting", "Hello, Model");

        return "success";
    }

}
```

## Map

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping(value = "/world")
    public String world(Map<String, Object> map) {
        map.put("greeting", "Hello, Map");

        return "success";
    }

}
```

## ModelMap

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping(value = "/world")
    public String world(ModelMap modelMap) {
        modelMap.put("greeting", "Hello, ModelMap");

        return "success";
    }

}
```

## Model, ModelMap and Map

```text
                                                                                                 ┌─── HashMap(c)
                                                    ┌─── ModelMap(c) ───┼─── LinkedHashMap(c) ───┤
BindingAwareModelMap ───┼─── ExtendedModelMap(c) ───┤                                            └─── Map(i)
                                                    │
                                                    └─── Model(i)
```

## Session

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping(value = "/world")
    public String world(HttpSession session) {
        session.setAttribute("greeting", "Hello, Session");
        return "success";
    }

}
```

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>目标页</title>
</head>
<body>
恭喜你，成功了！<br/>
<p th:text="${session.greeting}"></p>
</body>
</html>
```

## Application

### HelloController

```java
package lsieun.mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/hello")
public class HelloController {

    @RequestMapping(value = "/world")
    public String world(HttpSession session) {
        ServletContext application = session.getServletContext();
        application.setAttribute("greeting", "Hello, Application");
        return "success";
    }

}
```

### index.html

```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>目标页</title>
</head>
<body>
恭喜你，成功了！<br/>
<p th:text="${application.greeting}"></p>
</body>
</html>
```

