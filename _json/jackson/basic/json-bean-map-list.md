---
title: "JSON 字符串 与 对象 Bean、Map、List、Array 互相转换"
sequence: "103"
---

## To Json

```java
import java.text.MessageFormat;

public class User {
    private int id;
    private String name;

    public User() {
    }

    public User(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return MessageFormat.format("User: id={0}, name={1}", id, name);
    }
}
```

### From Object

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        User user = new User(1, "小明");

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(user);

        System.out.println(json);
    }
}
```

输出：

```text
{"id":1,"name":"小明"}
```

### From Map

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        Map<String, String> map = new HashMap<>();
        map.put("username", "tomcat");
        map.put("password", "123456");

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(map);

        System.out.println(json);
    }
}
```

```text
{"password":"123456","username":"tomcat"}
```

### From List

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        User user1 = new User(1, "tomcat");
        User user2 = new User(2, "jerry");
        List<User> list = new ArrayList<>();
        list.add(user1);
        list.add(user2);

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(list);

        System.out.println(json);
    }
}
```

输出：

```text
[{"id":1,"name":"tomcat"},{"id":2,"name":"jerry"}]
```

### From Array

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        User user1 = new User(1, "tomcat");
        User user2 = new User(2, "jerry");
        User[] array = {user1, user2};

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writeValueAsString(array);

        System.out.println(json);
    }
}
```

输出：

```text
[{"id":1,"name":"tomcat"},{"id":2,"name":"jerry"}]
```

## From Json

### To Object

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        String json = "{\"id\":1,\"name\":\"小明\"}";

        ObjectMapper mapper = new ObjectMapper();
        User user = mapper.readValue(json, User.class);

        System.out.println(user);
    }
}
```

输出：

```text
User: id=1, name=小明
```

## To Map

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        String json = "{\"password\":\"123456\",\"username\":\"tomcat\"}";

        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> map = mapper.readValue(json, Map.class);

        System.out.println(map);
    }
}
```

### To List

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;

import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        String json = "[{\"id\":1,\"name\":\"tomcat\"},{\"id\":2,\"name\":\"jerry\"}]";

        ObjectMapper mapper = new ObjectMapper();
        CollectionType listType = mapper.getTypeFactory().constructCollectionType(ArrayList.class, User.class);
        List<User> list = mapper.readValue(json, listType);

        System.out.println(list);
    }
}
```

### To List-Map

json字符串转`Map`数组`List<Map<String,Object>>`

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        String json = "[{\"a\":12},{\"b\":23},{\"name\":\"Tom\"}]";

        ObjectMapper mapper = new ObjectMapper();
        CollectionType listType = mapper.getTypeFactory().constructCollectionType(ArrayList.class, Map.class);
        List<Map<String, Object>> list = mapper.readValue(json, listType);

        System.out.println(list);
        System.out.println(list.getClass());
    }
}
```

Jackson 默认将对象转换为 `LinkedHashMap`

```text
String expected = "[{\"name\":\"Ryan\"},{\"name\":\"Test\"},{\"name\":\"Leslie\"}]";
ArrayList arrayList = mapper.readValue(expected, ArrayList.class);
```

JSON 字符串与 `List` 或 `Map` 互转的方法

```text
ObjectMapper objectMapper = new ObjectMapper();
 //遇到date按照这种格式转换
 SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 objectMapper.setDateFormat(fmt);
 
  String preference = "{name:'张三'}";
        //json字符串转map
  Map<String, String> preferenceMap = new HashMap<String, String>();
  preferenceMap = objectMapper.readValue(preference, preferenceMap.getClass());
  
  //map转json字符串
  String result=objectMapper.writeValueAsString(preferenceMap);

```

bean转换为map

```text
List<Map<String,String>> returnList=new ArrayList<Map<String,String>>();
List<Menu> menuList=menuDAOImpl.findByParentId(parentId);
ObjectMapper mapper = new ObjectMapper();
returnList=mapper.convertValue(menuList,new TypeReference<List<Map<String, String>>>(){});
```

## Reference

- [jackson objectMapper json字符串、对象bean、map、数组list互相转换常用的方法][link01]

[link01]: https://blog.csdn.net/Best_Lynn/article/details/106850622
