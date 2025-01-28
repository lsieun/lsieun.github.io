---
title: "Enum"
sequence: "enum"
---


```java
public enum Distance {
    KILOMETER("km", 1000),
    MILE("miles", 1609.34),
    METER("meters", 1),
    INCH("inches", 0.0254),
    CENTIMETER("cm", 0.01),
    MILLIMETER("mm", 0.001);

    private final String unit;
    private final double meters;

    Distance(String unit, double meters) {
        this.unit = unit;
        this.meters = meters;
    }

    public String getUnit() {
        return unit;
    }

    public double getMeters() {
        return meters;
    }
}
```

## Serializing Enums to JSON

### Default Enum Representation

By default, Jackson will represent Java Enums as **a simple String**. For instance:

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        String str = objectMapper.writeValueAsString(Distance.MILE);
        System.out.println(str);
    }
}
```

```text
"MILE"
```

However, when marshaling this **Enum to a JSON Object**, we would like to get something like:

```text
{"unit":"miles","meters":1609.34}
```

### Enum as a JSON Object

Starting with Jackson 2.1.2, there's now a configuration option that can handle this kind of representation.
This can be done via the `@JsonFormat` annotation at the class level:

```java
import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum Distance {
    KILOMETER("km", 1000),
    MILE("miles", 1609.34),
    METER("meters", 1),
    INCH("inches", 0.0254),
    CENTIMETER("cm", 0.01),
    MILLIMETER("mm", 0.001);

    private final String unit;
    private final double meters;

    Distance(String unit, double meters) {
        this.unit = unit;
        this.meters = meters;
    }

    public String getUnit() {
        return unit;
    }

    public double getMeters() {
        return meters;
    }
}
```

This will lead to the desired result when serializing this enum for `Distance.MILE`:

```text
{"unit":"miles","meters":1609.34}
```

### Enums and @JsonValue

Another simple way of controlling the marshaling output for an enum is using the `@JsonValue` annotation on a getter:

```java
import com.fasterxml.jackson.annotation.JsonValue;

public enum Distance {
    KILOMETER("km", 1000),
    MILE("miles", 1609.34),
    METER("meters", 1),
    INCH("inches", 0.0254),
    CENTIMETER("cm", 0.01),
    MILLIMETER("mm", 0.001);

    private final String unit;
    private final double meters;

    Distance(String unit, double meters) {
        this.unit = unit;
        this.meters = meters;
    }

    public String getUnit() {
        return unit;
    }

    @JsonValue
    public double getMeters() {
        return meters;
    }
}
```

What we're expressing here is that `getMeters()` is the actual representation of this enum.
So the result of serializing will be:

```text
1609.34
```

### Custom Serializer for Enum

If we're using a version of Jackson earlier than 2.1.2,
or if even more customization is required for the enum, we can use a custom Jackson serializer.
First, we'll need to define it:

```java
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import lsieun.entity.Distance;

import java.io.IOException;

public class DistanceSerializer extends StdSerializer<Distance> {

    public DistanceSerializer() {
        super(Distance.class);
    }

    public DistanceSerializer(Class t) {
        super(t);
    }

    @Override
    public void serialize(Distance distance, JsonGenerator generator, SerializerProvider provider)
            throws IOException, JsonProcessingException {
        generator.writeStartObject();
        generator.writeFieldName("name");
        generator.writeString(distance.name());
        generator.writeFieldName("unit");
        generator.writeString(distance.getUnit());
        generator.writeFieldName("meters");
        generator.writeNumber(distance.getMeters());
        generator.writeEndObject();
    }
}
```

Then we can apply the serializer to the class that'll be serialized:

```java
@JsonSerialize(using = DistanceSerializer.class)
public enum TypeEnum { 
    // ...
}
```

```java
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize(using = DistanceSerializer.class)
public enum Distance {
    KILOMETER("km", 1000),
    MILE("miles", 1609.34),
    METER("meters", 1),
    INCH("inches", 0.0254),
    CENTIMETER("cm", 0.01),
    MILLIMETER("mm", 0.001);

    private final String unit;
    private final double meters;

    Distance(String unit, double meters) {
        this.unit = unit;
        this.meters = meters;
    }

    public String getUnit() {
        return unit;
    }

    public double getMeters() {
        return meters;
    }
}
```

This results in:

```text
{"name":"MILE","unit":"miles","meters":1609.34}
```

## Deserializing JSON to Enum

First, let's define a `City` class that has a `Distance` member:

```java
public class City {
    private Distance distance;

    public Distance getDistance() {
        return distance;
    }

    public void setDistance(Distance distance) {
        this.distance = distance;
    }
}
```

### Default Behavior

**By default, Jackson will use the Enum name to deserialize from JSON.**

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        City city = new City();
        city.setDistance(Distance.KILOMETER);

        ObjectMapper objectMapper = new ObjectMapper();
        String str = objectMapper.writeValueAsString(city);
        System.out.println(str);
    }
}
```

For example, it'll deserialize the JSON:

```text
{"distance":"KILOMETER"}
```

To a `Distance.KILOMETER` object:

```text
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lsieun.entity.City;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        String json = "{\"distance\":\"KILOMETER\"}";

        ObjectMapper objectMapper = new ObjectMapper();
        City city = objectMapper.readValue(json, City.class);
        System.out.println(city.getDistance());
    }
}
```

If we want Jackson to case-insensitively deserialize from JSON by the Enum name,
we need to customize the `ObjectMapper` to enable the `ACCEPT_CASE_INSENSITIVE_ENUMS` feature.

Let's say we have another JSON:

```text
{"distance":"KiLoMeTeR"}
```

Now, let's do a case-insensitive deserialization:

```text
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import lsieun.entity.City;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        String json = "{\"distance\":\"KiLoMeTeR\"}";

        ObjectMapper objectMapper = JsonMapper.builder()
                .enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS)
                .build();
        City city = objectMapper.readValue(json, City.class);
        System.out.println(city.getDistance());
    }
}
```

As the test above shows, we enable the `ACCEPT_CASE_INSENSITIVE_ENUMS` feature with the `JsonMapper` builder.

### Using @JsonValue

We've learned how to use `@JsonValue` to serialize Enums.
We can use the same annotation for deserialization as well.
This is possible because Enum values are constants.

First, let's use `@JsonValue` with one of the getter methods, `getMeters()`:

```java
import com.fasterxml.jackson.annotation.JsonValue;

public enum Distance {
    KILOMETER("km", 1000),
    MILE("miles", 1609.34),
    METER("meters", 1),
    INCH("inches", 0.0254),
    CENTIMETER("cm", 0.01),
    MILLIMETER("mm", 0.001);

    private final String unit;
    private final double meters;

    Distance(String unit, double meters) {
        this.unit = unit;
        this.meters = meters;
    }

    public String getUnit() {
        return unit;
    }

    @JsonValue
    public double getMeters() {
        return meters;
    }
}
```

The return value of the `getMeters()` method represents the Enum objects.
Therefore, when deserializing the sample JSON:

```text
{"distance":"0.0254"}
```

Jackson will look for the Enum object that has a `getMeters()` return value of `0.0254`.
In this case, the object is `Distance.INCH`:

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorldRun {
    public static void main(String[] args) throws JsonProcessingException {
        String json = "{\"distance\":\"0.0254\"}";

        ObjectMapper objectMapper = new ObjectMapper();
        City city = objectMapper.readValue(json, City.class);
        System.out.println(city.getDistance());
    }
}
```

### Using @JsonProperty

The `@JsonProperty` annotation is used on enumeration instances:

```java
import com.fasterxml.jackson.annotation.JsonProperty;

public enum Distance {
    @JsonProperty("distance-in-km")
    KILOMETER("km", 1000),
    @JsonProperty("distance-in-miles")
    MILE("miles", 1609.34),
    METER("meters", 1),
    INCH("inches", 0.0254),
    CENTIMETER("cm", 0.01),
    MILLIMETER("mm", 0.001);

    private final String unit;
    private final double meters;

    Distance(String unit, double meters) {
        this.unit = unit;
        this.meters = meters;
    }

    public String getUnit() {
        return unit;
    }

    public double getMeters() {
        return meters;
    }
}
```

By using this annotation, we're simply telling Jackson
to map the value of the `@JsonProperty` to the object annotated with this value.

As a result of the above declaration, the example JSON string:

```text
{"distance": "distance-in-km"}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorldDeserialize {
    public static void main(String[] args) throws JsonProcessingException {
        String json = "{\"distance\": \"distance-in-km\"}";

        ObjectMapper objectMapper = new ObjectMapper();
        City city = objectMapper.readValue(json, City.class);
        System.out.println(city.getDistance());
    }
}
```

### Using @JsonCreator

**Jackson invokes methods annotated with `@JsonCreator` to get an instance of the enclosing class.**

Consider the JSON representation:

```text
{
    "distance": {
        "unit":"miles", 
        "meters":1609.34
    }
}
```

Then we'll define the `forValues()` factory method with the `@JsonCreator` annotation:

```java
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public enum Distance {
    KILOMETER("km", 1000),
    MILE("miles", 1609.34),
    METER("meters", 1),
    INCH("inches", 0.0254),
    CENTIMETER("cm", 0.01),
    MILLIMETER("mm", 0.001);

    private final String unit;
    private final double meters;

    Distance(String unit, double meters) {
        this.unit = unit;
        this.meters = meters;
    }

    public String getUnit() {
        return unit;
    }

    public double getMeters() {
        return meters;
    }

    @JsonCreator
    public static Distance forValues(@JsonProperty("unit") String unit,
                                     @JsonProperty("meters") double meters) {
        for (Distance distance : Distance.values()) {
            if (
                    distance.unit.equals(unit) && Double.compare(distance.meters, meters) == 0) {
                return distance;
            }
        }

        return null;
    }
}
```

Note the use of the `@JsonProperty` annotation to bind the JSON fields with the **method arguments**.

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorldDeserialize {
    public static void main(String[] args) throws JsonProcessingException {
        String json = "{\n" +
                "    \"distance\": {\n" +
                "        \"unit\":\"miles\", \n" +
                "        \"meters\":1609.34\n" +
                "    }\n" +
                "}";

        ObjectMapper objectMapper = new ObjectMapper();
        City city = objectMapper.readValue(json, City.class);
        System.out.println(city.getDistance());
    }
}
```

### Using a Custom Deserializer

We can use a custom deserializer if none of the described techniques are available.
For example, we might not have access to the Enum source code,
or we might be using an older Jackson version that doesn't support one or more of the annotations covered so far.

```java
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import lsieun.entity.Distance;

import java.io.IOException;

public class CustomEnumDeserializer extends StdDeserializer<Distance> {

    public CustomEnumDeserializer(Class<?> vc) {
        super(vc);
    }

    public CustomEnumDeserializer(JavaType valueType) {
        super(valueType);
    }

    public CustomEnumDeserializer(StdDeserializer<?> src) {
        super(src);
    }

    @Override
    public Distance deserialize(JsonParser jsonParser, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {
        JsonNode node = jsonParser.getCodec().readTree(jsonParser);

        String unit = node.get("unit").asText();
        double meters = node.get("meters").asDouble();

        for (Distance distance : Distance.values()) {

            if (distance.getUnit().equals(unit) && Double.compare(
                    distance.getMeters(), meters) == 0) {
                return distance;
            }
        }

        return null;
    }
}
```

Then we'll use the `@JsonDeserialize` annotation on the Enum to specify our custom deserializer:

```java
@JsonDeserialize(using = CustomEnumDeserializer.class)
public enum Distance {
   // ...
}
```

## Reference

- [How To Serialize and Deserialize Enums with Jackson](https://www.baeldung.com/jackson-serialize-enums)
