---
title: "Sealed Class"
sequence: "106"
---

```java
public abstract sealed class Animal permits Cat, Dog {
}
```

```java
public final class Cat extends Animal {
}
```

```java
public final class Dog extends Animal {
}
```

```java
import net.bytebuddy.ByteBuddy;
import net.bytebuddy.description.modifier.TypeManifestation;
import net.bytebuddy.description.modifier.Visibility;
import net.bytebuddy.dynamic.DynamicType;

public class HelloWorldGenerate {
    public static void main(String[] args) {
        // 1. prepare
        String parentAnimal = "sample.Animal";
        String childCat = "sample.Cat";
        String childDog = "sample.Dog";


        // 2. weave
        ByteBuddy byteBuddy = new ByteBuddy();

        DynamicType.Builder<?> animalBuilder = byteBuddy.subclass(Object.class)
                .modifiers(Visibility.PUBLIC, TypeManifestation.ABSTRACT)
                .name(parentAnimal);
        DynamicType.Builder<?> catBuilder = byteBuddy.subclass(animalBuilder.toTypeDescription())
                .modifiers(Visibility.PUBLIC, TypeManifestation.FINAL)
                .name(childCat);
        DynamicType.Builder<?> dogBuilder = byteBuddy.subclass(animalBuilder.toTypeDescription())
                .modifiers(Visibility.PUBLIC, TypeManifestation.FINAL)
                .name(childDog);

        animalBuilder = animalBuilder.permittedSubclass(catBuilder.toTypeDescription(), dogBuilder.toTypeDescription());


        // 3. output
        DynamicType.Unloaded<?> unloadedType = animalBuilder.make().include(catBuilder.make(), dogBuilder.make());
        OutputUtils.save(unloadedType);
    }
}
```

