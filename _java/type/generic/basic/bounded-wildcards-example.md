---
title: "bounded wildcards example"
sequence: "104"
---

## copy

```text
public class Collections {
  public static <T> void copy(List<? super T> dest, List<? extends T> src) {  // uses bounded wildcards
      for (int i=0; i<src.size(); i++)
        dest.set(i,src.get(i));
  }
}
```

## sort

```text
public static <T extends Comparable<? super T>> void sort(List<T> list) {
    list.sort(null);
}

public static <T> void sort(List<T> list, Comparator<? super T> c) {
    list.sort(c);
}
```

### lower bound wildcard

When would I use a wildcard parameterized type with a lower bound?

**When a concrete parmeterized type would be too restrictive**.

假设 `Person` 类实现了 `Comparable` 接口：

```java
public class Person implements Comparable<Person> {
    public String name;
    public int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public int compareTo(Person that) {
        return this.age - that.age;
    }

    @Override
    public String toString() {
        return String.format("name = %s, age = %d", name, age);
    }
}
```

假设 `Student` 类继承了 `Person` 类：

```java
public class Student extends Person {
    public Student(String name, int age) {
        super(name, age);
    }
}
```

在下面的代码中会出错，`Student` 类实现了 `Comparable<Person>` 接口，而没有实现 `Comparable<Student>` 接口：

```java
import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public static <T extends Comparable<T>> void sort(List<T> list) {
        list.sort(null);
    }

    public static void main(String[] args) {
        List<Student> studentList = new ArrayList<>();
        studentList.add(new Student("Tom", 10));
        studentList.add(new Student("Jerry", 9));

        // reason: Incompatible equality constraint: Person and Student
        HelloWorld.sort(studentList); // error
        System.out.println(studentList);
    }
}
```

那如何修改呢？将 `Comparable<T>` 修改成 `Comparable<? super T>` 就可以了：

- `Comparable<? super Student>` 包括了 `Comparable<Person>` 类型

```text
import java.util.ArrayList;
import java.util.List;

public class HelloWorld {
    public static <T extends Comparable<? super T>> void sort(List<T> list) {
        list.sort(null);
    }

    public static void main(String[] args) {
        List<Student> studentList = new ArrayList<>();
        studentList.add(new Student("Tom", 10));
        studentList.add(new Student("Jerry", 9));

        HelloWorld.sort(studentList);
        System.out.println(studentList);
    }
}
```

## max/min

- `Collections#max`

```text
public static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll) {
    Iterator<? extends T> i = coll.iterator();
    T candidate = i.next();

    while (i.hasNext()) {
        T next = i.next();
        if (next.compareTo(candidate) > 0)
            candidate = next;
    }
    return candidate;
}

public static <T> T max(Collection<? extends T> coll, Comparator<? super T> comp) {
    if (comp==null)
        return (T)max((Collection) coll);

    Iterator<? extends T> i = coll.iterator();
    T candidate = i.next();

    while (i.hasNext()) {
        T next = i.next();
        if (comp.compare(next, candidate) > 0)
            candidate = next;
    }
    return candidate;
}
```
