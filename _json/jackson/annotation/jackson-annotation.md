---
title: "Jackson Annotations"
sequence: "112"
---

The Jackson JSON toolkit contains a set of Java annotations
which you can use to influence how JSON is read into objects, or what JSON is generated from the objects.

## Read + Write Annotations

Jackson contains a set of annotations that affect both the reading of Java objects from JSON,
and the writing of Java objects into JSON. I refer to these annotations as "read + write annotations".



## Read Annotations

Jackson contains a set of annotations that only affect
how Jackson parses JSON into objects - meaning they affect Jackson's reading of JSON.
I refer to these as "read annotations".

### setter

#### @JsonSetter

The `@JsonSetter` annotation is used to tell Jackson
that it should match the name of this setter method to a property name in the JSON data,
when reading JSON into objects.
This is useful if the property names used internally in your Java class
is not the same as the property name used in the JSON file.

The following `Person` class uses the name `personId` for its id property:

```java
public class Person {

    private long   personId = 0;
    private String name     = null;

    public long getPersonId() { return this.personId; }
    public void setPersonId(long personId) { this.personId = personId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
```

But in this JSON object the name `id` is used instead of `personId`:

```text
{
  "id"   : 1234,
  "name" : "John"
}
```

Without some help Jackson cannot map the `id` property from the JSON object to the `personId` field of the Java class.

The `@JsonSetter` annotation instructs Jackson to use a setter method for a given JSON field.
In our case we add the `@JsonSetter` annotation above the `setPersonId()` method.

```java
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class PersonSetter {
    private long personId = 0;
    private String name = null;

    public long getPersonId() {
        return this.personId;
    }

    @JsonSetter("id")
    public void setPersonId(long personId) {
        this.personId = personId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "PersonSetter{" +
                "personId=" + personId +
                ", name='" + name + '\'' +
                '}';
    }

    public static void main(String[] args) throws JsonProcessingException {
        String json = "{\"id\": 1234, \"name\": \"Tom\"}";

        ObjectMapper objectMapper = new ObjectMapper();
        PersonSetter instance = objectMapper.readValue(json, PersonSetter.class);
        System.out.println(instance);
    }
}
```

The value specified inside the `@JsonSetter` annotation is the name of the JSON field to match to this setter method.
In this case the name is `id` since that is the name of the field in the JSON object
we want to map to the `setPersonId()` setter method.

#### @JsonAnySetter

The `@JsonAnySetter` annotation instructs Jackson to call the same setter method
for all unrecognized fields in the JSON object.
By "unrecognized" I mean all fields that are not already mapped to a property or setter method in the Java object.

```java
public class Bag {

    private Map<String, Object> properties = new HashMap<>();

    public void set(String fieldName, Object value){
        this.properties.put(fieldName, value);
    }

    public Object get(String fieldName){
        return this.properties.get(fieldName);
    }
}
```

And then look at this JSON object:

```text
{
  "id"   : 1234,
  "name" : "John"
}
```

Jackson cannot directly map the `id` and `name` property of this JSON object to the `Bag` class,
because the Bag class contains no public fields or setter methods.

You can tell Jackson to call the `set()` method for all unrecognized fields
by adding the `@JsonAnySetter` annotation, like this:

```java
public class Bag {

    private Map<String, Object> properties = new HashMap<>();

    @JsonAnySetter
    public void set(String fieldName, Object value){
        this.properties.put(fieldName, value);
    }

    public Object get(String fieldName){
        return this.properties.get(fieldName);
    }
}
```

Now Jackson will call the `set()` method with the name and value of all unrecognized fields in the JSON object.

Keep in mind that this only has effect on unrecognized fields.
If, for instance, you added a public `name` property or `setName(String)` method to the `Bag` Java class,
then the name field in the JSON object would be mapped to that property/setter instead.

### @JsonCreator

The `@JsonCreator` annotation is used to tell Jackson
that the Java object has a constructor (a "creator")
which can match the fields of a JSON object to the fields of the Java object.

The `@JsonCreator` annotation is useful in situations
where the `@JsonSetter` annotation cannot be used.
For instance, immutable objects do not have any setter methods,
so they need their initial values injected into the constructor.
Look at this PersonImmutable class as example:

```java
public class PersonImmutable {

    private long   id   = 0;
    private String name = null;

    public PersonImmutable(long id, String name) {
        this.id = id;
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

}
```

To tell Jackson that it should call the constructor of `PersonImmutable`
we must add the `@JsonCreator` annotation to the constructor.
But that alone is not enough.
We must also annotate the parameters of the constructor to tell Jackson
which fields from the JSON object to pass to which constructor parameters.
Here is how the `PersonImmutable` class looks with the `@JsonCreator` and `@JsonProperty` annotations added:

```java
public class PersonImmutable {

    private long   id   = 0;
    private String name = null;

    @JsonCreator
    public PersonImmutable(
            @JsonProperty("id")  long id,
            @JsonProperty("name") String name  ) {

        this.id = id;
        this.name = name;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

}
```

### @JacksonInject

The `@JacksonInject` annotation is used to inject values into the parsed objects,
instead of reading those values from the JSON.
For instance, imagine you are downloading person JSON objects from various different sources,
and would like to know what source a given person object came from.
The sources may not themselves contain that information,
but you can have Jackson inject that into the Java objects created from the JSON objects.

To mark a field in a Java class as a field that needs to have its value injected by Jackson,
add the `@JacksonInject` annotation above the field.
Here is an example `PersonInject` class with the `@JacksonInject` annotation added above the `source` field:

```java
public class PersonInject {

    public long   id   = 0;
    public String name = null;

    @JacksonInject
    public String source = null;

}
```

In order to have Jackson inject values into the `source` field
you need to do a little extra when creating the Jackson `ObjectMapper`.
Here is what it takes to have Jackson inject values into the Java objects:

```text
InjectableValues inject = new InjectableValues.Std().addValue(String.class, "jenkov.com");
PersonInject personInject = new ObjectMapper().reader(inject)
                        .forType(PersonInject.class)
                        .readValue(new File("data/person.json"));
```

```java
import com.fasterxml.jackson.annotation.JacksonInject;
import com.fasterxml.jackson.databind.InjectableValues;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class PersonInject {

    public long id = 0;
    public String name = null;

    @JacksonInject
    public String source = null;

    @Override
    public String toString() {
        return "PersonInject{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", source='" + source + '\'' +
                '}';
    }

    public static void main(String[] args) throws IOException {
        String json = "{\"id\": 10, \"name\": \"tom\"}";

        InjectableValues inject = new InjectableValues.Std().addValue(String.class, "www.liusen.com");
        PersonInject personInject = new ObjectMapper().reader(inject)
                .forType(PersonInject.class)
                .readValue(json);
        System.out.println(personInject);
    }
}
```

```text
PersonInject{id=10, name='tom', source='www.liusen.com'}
```

Notice how the value to inject into the `source` attribute is set in the `InjectableValues.addValue()` method.
Notice also that the value is only tied to the type `String` - not to any specific field name.
It is the `@JacksonInject` annotation that specifies what field the value is to be injected into.

If you were to download person JSON objects from multiple sources and
have a different source value injected for each source,
you would have to repeat the above code for each source.

### @JsonDeserialize

The Jackson annotation `@JsonDeserialize` is used to specify
a custom de-serializer class for a given field in a Java object.
For instance, imagine you wanted to optimize the on-the-wire formatting of the boolean values `false` and `true` to `0` and `1`.

First you would need to add the `@JsonDeserialize` annotation to the field
you want to use the custom deserializer for.
Here is how adding the `@JsonDeserialize` annotation to a field looks like:

```java
public class PersonDeserialize {

    public long    id      = 0;
    public String  name    = null;

    @JsonDeserialize(using = OptimizedBooleanDeserializer.class)
    public boolean enabled = false;
}
```

Second, here is what the `OptimizedBooleanDeserializer` class referenced from the `@JsonDeserialize` annotation looks like:

```java
public class OptimizedBooleanDeserializer
    extends JsonDeserializer<Boolean> {

    @Override
    public Boolean deserialize(JsonParser jsonParser,
            DeserializationContext deserializationContext) throws
        IOException, JsonProcessingException {

        String text = jsonParser.getText();
        if("0".equals(text)) return false;
        return true;
    }
}
```

Notice that the `OptimizedBooleanDeserializer` class extends `JsonDeserializer` with the generic type `Boolean`.
Doing so makes the `deserialize()` method return a `Boolean` object.
If you were to deserialize another type (e.g a `java.util.Date`)
you would have to specify that type inside the generics brackets.

You obtain the value of the field to deserialize by calling the `getText()` method of the `jsonParser` parameter.
You can then deserialize that text into whatever value and type your deserializer is targeted at (a Boolean in this example).

Finally, you need to see what it looks like to deserialize an object with a custom deserializer and the `@JsonDeserializer` annotation:

```text
PersonDeserialize person = objectMapper
        .reader(PersonDeserialize.class)
        .readValue(new File("data/person-optimized-boolean.json"));
```

Notice how we first need to create a reader for the `PersonDeserialize` class
using the `ObjectMapper`'s `reader()` method, and then we call `readValue()` on the object returned by that method.

## Write Annotations

Jackson also contains a set of annotations that can influence how Jackson serializes (writes) Java objects to JSON.

### @JsonInclude

The `@JsonInclude` annotation tells Jackson only to include properties under certain circumstances.
For instance, that properties should only be included
if they are non-null, non-empty, or have non-default values.

```java
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PersonInclude {

    public long  personId = 0;
    public String name     = null;

}
```

This example will only include the `name` property if the value set for it is non-empty,
meaning is not null and is not an empty string.

A more saying name for the `@JsonInclude` annotation could have been `@JsonIncludeOnlyWhen`,
but that would have been longer to write.

### getter

#### @JsonGetter

The `@JsonGetter` annotation is used to tell Jackson
that a certain field value should be obtained from calling a getter method instead of via direct field access.
The `@JsonGetter` annotation is useful if your Java class uses jQuery style for getter and setter names.
For instance, instead of `getPersonId()` and `setPersonId()` you might have the methods `personId()` and `personId(long id)`.

```java
public class PersonGetter {

    private long  personId = 0;

    @JsonGetter("id")
    public long personId() { return this.personId; }

    @JsonSetter("id")
    public void personId(long personId) { this.personId = personId; }

}
```

As you can see, the `personId()` method is annotated with the `@JsonGetter` annotation.
The value set on the `@JsonGetter` annotation is the name that should be used in the JSON object.
Thus, the name used for the `personId` in the JSON object is `id`.
The resulting JSON object would look like this:

```text
{"id":0}
```

Notice also that the `personId(long personId)` method is annotated with the `@JsonSetter` annotation
to make Jackson recognized that as the setter matching the `id` attribute in the JSON object.
The `@JsonSetter` annotation is used
when reading from JSON into Java objects - not when writing Java objects to JSON.
The `@JsonSetter` annotation is just included for the sake of completeness.

#### @JsonAnyGetter

The `@JsonAnyGetter` Jackson annotation enables you to use a `Map` as container for properties that you want to serialize to JSON.

```java
public class PersonAnyGetter {

    private Map<String, Object> properties = new HashMap<>();

    @JsonAnyGetter
    public Map<String, Object> properties() {
        return properties;
    }
}
```

When seeing the `@JsonAnyGetter` annotation Jackson will obtain the `Map` returned from the method
which `@JsonAnyGetter` annotates, and will treat each key-value pair in that `Map` as a property.
In other words, all key-value pairs in the Map will be serialized to JSON as part of the `PersonAnyGetter` object.

### @JsonPropertyOrder

The `@JsonPropertyOrder` Jackson annotation can be used
to specify in what order the fields of your Java object should be serialized into JSON.

```java
@JsonPropertyOrder({"name", "personId"})
public class PersonPropertyOrder {

    public long  personId  = 0;
    public String name     = null;

}
```

Normally Jackson would have serialized the properties in `PersonPropertyOrder` in the sequence
they are found in the class.
However, the `@JsonPropertyOrder` annotation specifies a different order
where the `name` property will appear first and the `personId` property second in the serialized JSON output.

### @JsonRawValue

The `@JsonRawValue` Jackson annotation tells Jackson that
this property value should be written directly as it is to the JSON output.
If the property is a `String`, Jackson would normally have enclosed the value in quotation marks,
but if annotated with the `@JsonRawValue` property Jackson won't do that.

```java
public class PersonRawValue {

    public long   personId = 0;

    public String address  = "$#";
}
```

Jackson would serialize this into this JSON string:

```text
{"personId":0,"address":"$#"}
```

Now we add the `@JsonRawValue` to the `address` property, like this:

```java
public class PersonRawValue {

    public long   personId = 0;

    @JsonRawValue
    public String address  = "$#";
}
```

Jackson will now omit the quotation marks when serializing the `address` property.
The serialized JSON will thus look like this:

```text
{"personId":0,"address":$#}
```

This is of course invalid JSON, so why would you want that?

Well, if the `address` property contained a JSON string then
that JSON string would be serialized into the final JSON object as part of the JSON object structure,
and not just into a string in the `address` field in the JSON object.
To see how that would work, let us change the value of the `address` property like this:

```java
public class PersonRawValue {

    public long   personId = 0;

    @JsonRawValue
    public String address  =
            "{ \"street\" : \"Wall Street\", \"no\":1}";

}
```

Jackson would serialize this into this JSON:

```text
{"personId":0,"address":{ "street" : "Wall Street", "no":1}}
```

Notice how the JSON string is now part of the serialized JSON structure.

Without the `@JsonRawValue` annotation Jackson would have serialized the object to this JSON:

```text
{"personId":0,"address":"{ \"street\" : \"Wall Street\", \"no\":1}"}
```

Notice how the value of the `address` property is now enclosed in quotation marks,
and all the quotation marks inside the value are escaped.

### @JsonValue

The `@JsonValue` annotation tells Jackson that Jackson should not attempt to serialize the object itself,
but rather call a method on the object which serializes the object to a JSON string.
Note that Jackson will escape any quotation marks inside the `String` returned by the custom serialization,
so you cannot return e.g. a full JSON object.
For that you should use `@JsonRawValue` instead.

The `@JsonValue` annotation is added to the method
that Jackson is to call to serialize the object into a JSON string.

```java
public class PersonValue {

    public long   personId = 0;
    public String name = null;

    @JsonValue
    public String toJson(){
        return this.personId + "," + this.name;
    }

}
```

The output you would get from asking Jackson to serialize a `PersonValue` object is this:

```text
"0,null"
```

The quotation marks are added by Jackson.
Remember, any quotation marks in the value string returned by the object are escaped.

### @JsonSerialize

The `@JsonSerialize` annotation is used to specify a custom serializer for a field in a Java object.

```java
public class PersonSerializer {

    public long   personId = 0;
    public String name     = "John";

    @JsonSerialize(using = OptimizedBooleanSerializer.class)
    public boolean enabled = false;
}
```

Notice the `@JsonSerialize` annotation above the enabled field.

The `OptimizedBooleanSerializer` will serialize a `true` value to `1` and a `false` value `0`.
Here is the code:

```java
public class OptimizedBooleanSerializer extends JsonSerializer<Boolean> {

    @Override
    public void serialize(Boolean aBoolean, JsonGenerator jsonGenerator, 
        SerializerProvider serializerProvider) 
    throws IOException, JsonProcessingException {

        if(aBoolean){
            jsonGenerator.writeNumber(1);
        } else {
            jsonGenerator.writeNumber(0);
        }
    }
}
```
