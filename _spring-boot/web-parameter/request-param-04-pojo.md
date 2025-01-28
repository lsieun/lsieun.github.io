---
title: "@RequestParam：POJO"
sequence: "114"
---

## 示例二：Binding @RequestParam to object

From my experience, developers don't replace long lists of `@RequestParams`
because they simply aren't aware it's possible.

The documentation of `@RequestParam` doesn't mention the alternative solution.

```java
import lsieun.springboot.query.ProductCriteria;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/product")
class ProductController {

    @GetMapping("/search")
    String searchProducts(ProductCriteria productCriteria) {
        return productCriteria.toString();
    }

}
```

```java
public class ProductCriteria {
    private String query;
    private int offset;
    private int limit;

    ProductCriteria() {
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    @Override
    public String toString() {
        return "ProductCriteria{" +
                "query='" + query + '\'' +
                ", offset=" + offset +
                ", limit=" + limit +
                '}';
    }
}
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    public void testGet() throws Exception {
        String path = "/product/search?query=abc";
        MvcResult mvcResult = mvc.perform(get(path)).andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        System.out.println(content);
    }
}
```

### Validating request parameters inside POJO

```xml
<!-- validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

如果想模拟`@RequestParam(required = true)`注解，需要在POJO的字段上添加`@NotNull`注解：

```java
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

public class ProductCriteria {
    @NotBlank
    private String query;
    @Min(0)
    private int offset;
    @Max(1)
    private int limit;

    ProductCriteria() {
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    @Override
    public String toString() {
        return "ProductCriteria{" +
                "query='" + query + '\'' +
                ", offset=" + offset +
                ", limit=" + limit +
                '}';
    }
}
```

A word of caution:
**Adding validation annotations of fields isn't enough to make it work.**

> 注意：还需要添加@Valid注解

You also need to mark the POJO parameter in controller's method with the `@Valid` annotation.
This way you inform Spring that it should execute validation on the binding step.

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/product")
class ProductController {

    @GetMapping("/search")
    String searchProducts(@Valid ProductCriteria productCriteria) {
        return productCriteria.toString();
    }

}
```

### Default request parameter values inside POJO

When we have a POJO no special magic is needed.
You just assign the default value directly to a field.
When the parameter is missing in the request, nothing will override the predefined value.

```text
private int offset = 0;
private int limit = 10;
```

### Multiple objects

You aren't forced to put all HTTP parameters inside a single object.
You can group parameters in several POJOs.

To illustrate that, let's add sort criteria to our endpoint.
First, we need a separate object.
Just like before it has some validation constraints.

```java
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class SortCriteria {
    @NotNull
    private String sortOrder;
    @NotBlank
    private String sortAttribute;

    public String getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public String getSortAttribute() {
        return sortAttribute;
    }

    public void setSortAttribute(String sortAttribute) {
        this.sortAttribute = sortAttribute;
    }

    @Override
    public String toString() {
        return "SortCriteria{" +
                "sortOrder='" + sortOrder + '\'' +
                ", sortAttribute='" + sortAttribute + '\'' +
                '}';
    }
}
```

In the controller, you just add it as a separate input parameter.
Note that the `@Valid` annotation is required on each parameter which should be validated.

```java
import lsieun.springboot.query.ProductCriteria;
import lsieun.springboot.query.SortCriteria;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/product")
class ProductController {

    @GetMapping("/search")
    String searchProducts(@Valid ProductCriteria productCriteria, @Valid SortCriteria sortCriteria) {
        return productCriteria.toString() + sortCriteria.toString();
    }

}
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    public void testGet() throws Exception {
        String path = "/product/search?query=abc&offset=0&limit=1&sortOrder=time&sortAttribute=desc";
        MvcResult mvcResult = mvc.perform(get(path)).andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        System.out.println(content);
    }
}
```

### Nested objects

As an alternative to multiple input request objects we can also use composition.
Parameter binding also works with nested objects.

To verify all nested properties, you should add the `@Valid` annotation to the field.
Be aware that if the field is `null` Spring won't validate its properties.
That might be the desired solution if all nested properties are optional.
If not, just put the `@NotNull` annotation on that nested object field.

```java
import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class ProductCriteria {
    @NotBlank
    private String query;
    @Min(0)
    private int offset;
    @Max(1)
    private int limit;
    
    // 注意这里
    @NotNull
    @Valid
    private SortCriteria sort;

    ProductCriteria() {
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public SortCriteria getSort() {
        return sort;
    }

    public void setSort(SortCriteria sort) {
        this.sort = sort;
    }

    @Override
    public String toString() {
        return "ProductCriteria{" +
                "query='" + query + '\'' +
                ", offset=" + offset +
                ", limit=" + limit +
                ", sort=" + sort +
                '}';
    }
}
```

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/product")
class ProductController {

    @GetMapping("/search")
    String searchProducts(@Valid ProductCriteria productCriteria) {
        return productCriteria.toString();
    }

}
```

HTTP parameters must match field names using the **dot notation**.
In our case they should look as follows:

```text
sort.order=ASC&sort.attribute=name
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    public void testGet() throws Exception {
        String path = "/product/search?query=abc&offset=0&limit=1&sort.sortOrder=time&sort.sortAttribute=desc";
        MvcResult mvcResult = mvc.perform(get(path)).andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        System.out.println(content);
    }
}
```

### Immutable DTO

Nowadays, you can observe a tendency in going away from traditional POJOs with setters in favor of immutable objects.

Immutable objects have several benefits (and downsides as well … but shh).
In my opinion, the biggest one is **simpler maintenance**.

Have you ever been tracking through dozens of layers of your application
to understand what conditions lead to a particular state of an object?
In which place this or that field changed? Why is it updated?
The name of a setter method doesn't explain anything.
Setters have no meaning.

Considering the fact when Spring framework was created,
no one should be surprised that Spring strongly relies on POJO specification.
Yet, times changed and old patterns became antipatterns.

There's no easy way to magically bind HTTP arguments to a POJO using a parameterized constructor.
The non-argument constructor is inevitable.
However, we can make that constructor `private` (but sadly not in nested objects) and removed all setters.
From the public perspective, the object will become immutable.

By default, Spring requires setter methods to bind HTTP parameters to fields.
Fortunately, it's possible to reconfigure the binder and use direct field access (via reflection).

In order to configure the data binder globally for your whole application,
you can create a controller advice component.
You can alter the binder configuration inside a method annotated with the `@InitBinder` annotation
which accepts the binder as an input.

```java
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.InitBinder;

@ControllerAdvice
public class BindingControllerAdvice {
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.initDirectFieldAccess();
    }
}
```

After creating that small class we can return to our POJO and
remove all setter methods from the class to make it read-only for the public use.

```java
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

public class ProductCriteria {
    @NotBlank
    private String query;
    @Min(0)
    private int offset;
    @Min(1)
    private int limit;

    private ProductCriteria() {
    }

    public String getQuery() {
        return query;
    }

    public int getOffset() {
        return offset;
    }

    public int getLimit() {
        return limit;
    }

    @Override
    public String toString() {
        return "ProductCriteria{" +
                "query='" + query + '\'' +
                ", offset=" + offset +
                ", limit=" + limit +
                '}';
    }
}
```

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/product")
class ProductController {

    @GetMapping("/search")
    String searchProducts(@Valid ProductCriteria productCriteria) {
        return productCriteria.toString();
    }

}
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    public void testGet() throws Exception {
        String path = "/product/search?query=abc&offset=0&limit=10";
        MvcResult mvcResult = mvc.perform(get(path)).andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        System.out.println(content);
    }
}
```
