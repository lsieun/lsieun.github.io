---
title: "Collection: Array, List, Map"
sequence: "136"
---

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/coll")
public class CollectionController {

    @GetMapping("/array")
    public String array(@RequestParam("idArray") Long[] idArray) {
        String msg = "idArray: " + Arrays.toString(idArray);
        System.out.println(msg);
        return msg;
    }

    @GetMapping("/list")
    public String list(@RequestParam("idList") List<Long> idList) {
        System.out.println("idList: " + idList);
        return "OK";
    }

    @GetMapping("/map")
    public String map(@RequestParam Map<String, String> allParams) {
        return "Parameters are " + allParams;
    }

}
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class CollectionControllerTest {
    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void testArray() {
        String url = "/coll/array?idArray=123,456,789";
        String body = this.restTemplate.getForObject(url, String.class);
        System.out.println(body);
    }

    @Test
    void testList() {
        String url = "/coll/list?idList=123,456,789";
        String body = this.restTemplate.getForObject(url, String.class);
        System.out.println(body);
    }

    @Test
    void testMap() {
        String url = "/coll/map?username=tomcat&password=123456";
        String body = this.restTemplate.getForObject(url, String.class);
        System.out.println(body);
    }
}
```
