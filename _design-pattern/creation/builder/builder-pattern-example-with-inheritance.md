---
title: "示例：继承"
sequence: "105"
---

![](/assets/images/design-pattern/creational/builder/builder-patter-example-vehicle-builder.svg)

## 第一版：存在的问题

```java
import java.util.Formatter;

public class Vehicle {
    private final String fuelType;
    private final String colour;

    public Vehicle(VehicleBuilder builder) {
        this.colour = builder.colour;
        this.fuelType = builder.fuelType;
    }

    public String getFuelType() {
        return fuelType;
    }

    public String getColour() {
        return colour;
    }

    @Override
    public String toString() {
        return new Formatter()
                .format("Vehicle{")
                .format("colour='%s'", colour)
                .format(", fuelType='%s'", fuelType)
                .format("}")
                .toString();
    }
}
```

```java
public class VehicleBuilder {
    protected String fuelType;
    protected String colour;

    public VehicleBuilder fuelType(String fuelType) {
        this.fuelType = fuelType;
        return this;
    }

    public VehicleBuilder colour(String colour) {
        this.colour = colour;
        return this;
    }

    public Vehicle build() {
        return new Vehicle(this);
    }
}
```

```java
import java.util.Formatter;

public class Car extends Vehicle {
    private final String make;
    private final String model;

    public Car(CarBuilder builder) {
        super(builder);
        this.make = builder.make;
        this.model = builder.model;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    @Override
    public String toString() {
        return new Formatter()
                .format("Car {")
                .format("colour='%s'", getColour())
                .format(", fuelType='%s'", getFuelType())
                .format(", make='%s'", make)
                .format(", model='%s'", model)
                .format("}")
                .toString();
    }
}
```

```java
public class CarBuilder extends VehicleBuilder {
    protected String make;
    protected String model;

    public CarBuilder make(String make) {
        this.make = make;
        return this;
    }

    public CarBuilder model(String model) {
        this.model = model;
        return this;
    }

    public Car build() {
        return new Car(this);
    }
}
```

```java
import java.util.Formatter;

public class ElectricCar extends Car {
    private final String batteryType;

    public ElectricCar(ElectricCarBuilder builder) {
        super(builder);
        this.batteryType = builder.batteryType;
    }

    public String getBatteryType() {
        return batteryType;
    }

    @Override
    public String toString() {
        return new Formatter()
                .format("ElectricCar {")
                .format("colour='%s'", getColour())
                .format(", fuelType='%s'", getFuelType())
                .format(", make='%s'", getMake())
                .format(", model='%s'", getModel())
                .format(", batteryType='%s'", batteryType)
                .format("}")
                .toString();
    }
}
```

```java
public class ElectricCarBuilder extends CarBuilder {
    protected String batteryType;

    public ElectricCarBuilder batteryType(String batteryType) {
        this.batteryType = batteryType;
        return this;
    }

    @Override
    public Car build() {
        return new ElectricCar(this);
    }
}
```

```java
public class App {
    public static void main(String[] args) {
        CarBuilder carBuilder = new CarBuilder();
        Car car1 = (Car) carBuilder.make("Ford")
                .model("F")
                .fuelType("Petrol")
                .colour("red")
                .build();
        System.out.println(car1);

        Car car2 = carBuilder.make("Ford")
                .colour("red")
                .fuelType("Petrol") // 返回 VehicleBuilder 类型
                .model("F") // 报错：VehicleBuilder 不支持方法
                .build();
        System.out.println(car2);
    }
}
```

## 第二版：不使用泛型

```java
import java.util.Formatter;

public class Vehicle {

    private final String fuelType;
    private final String colour;

    public Vehicle(VehicleBuilder builder) {
        this.colour = builder.colour;
        this.fuelType = builder.fuelType;
    }

    public String getFuelType() {
        return fuelType;
    }

    public String getColour() {
        return colour;
    }

    @Override
    public String toString() {
        return new Formatter()
                .format("Vehicle{")
                .format("colour='%s'", colour)
                .format(", fuelType='%s'", fuelType)
                .format("}")
                .toString();
    }

    public static class VehicleBuilder {

        protected String fuelType;
        protected String colour;

        public VehicleBuilder fuelType(String fuelType) {
            this.fuelType = fuelType;
            return this;
        }

        public VehicleBuilder colour(String colour) {
            this.colour = colour;
            return this;
        }

        public Vehicle build() {
            return new Vehicle(this);
        }
    }
}
```

```java
import java.util.Formatter;

public class Car extends Vehicle {

    private final String make;
    private final String model;

    public Car(CarBuilder builder) {
        super(builder);
        this.make = builder.make;
        this.model = builder.model;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    @Override
    public String toString() {
        return new Formatter()
                .format("Car {")
                .format("colour='%s'", getColour())
                .format(", fuelType='%s'", getFuelType())
                .format(", make='%s'", make)
                .format(", model='%s'", model)
                .format("}")
                .toString();
    }

    public static class CarBuilder extends VehicleBuilder {
        protected String make;
        protected String model;

        @Override
        public CarBuilder colour(String colour) {
            // 缺点：需要重写父类的方法，返回当前类型
            this.colour = colour;
            return this;
        }

        @Override
        public CarBuilder fuelType(String fuelType) {
            // 缺点：需要重写父类的方法，返回当前类型
            this.fuelType = fuelType;
            return this;
        }

        public CarBuilder make(String make) {
            this.make = make;
            return this;
        }

        public CarBuilder model(String model) {
            this.model = model;
            return this;
        }

        public Car build() {
            return new Car(this);
        }
    }
}
```

```java
import java.util.Formatter;

public class ElectricCar extends Car {
    private final String batteryType;

    public ElectricCar(ElectricCarBuilder builder) {
        super(builder);
        this.batteryType = builder.batteryType;
    }

    public String getBatteryType() {
        return batteryType;
    }

    @Override
    public String toString() {
        return new Formatter()
                .format("ElectricCar {")
                .format("colour='%s'", getColour())
                .format(", fuelType='%s'", getFuelType())
                .format(", make='%s'", getMake())
                .format(", model='%s'", getModel())
                .format(", batteryType='%s'", batteryType)
                .format("}")
                .toString();
    }

    public static class ElectricCarBuilder extends CarBuilder {
        protected String batteryType;

        @Override
        public ElectricCarBuilder colour(String colour) {
            // 缺点：需要重写父类的方法，返回当前类型
            this.colour = colour;
            return this;
        }

        @Override
        public ElectricCarBuilder fuelType(String fuelType) {
            // 缺点：需要重写父类的方法，返回当前类型
            this.fuelType = fuelType;
            return this;
        }

        @Override
        public ElectricCarBuilder make(String make) {
            // 缺点：需要重写父类的方法，返回当前类型
            this.make = make;
            return this;
        }

        @Override
        public ElectricCarBuilder model(String model) {
            // 缺点：需要重写父类的方法，返回当前类型
            this.model = model;
            return this;
        }

        public ElectricCarBuilder batteryType(String batteryType) {
            this.batteryType = batteryType;
            return this;
        }

        @Override
        public ElectricCar build() {
            return new ElectricCar(this);
        }
    }
}
```

```java
public class App {
    public static void main(String[] args) {
        Car.CarBuilder carBuilder = new Car.CarBuilder();
        Car car = carBuilder.colour("red")
                .fuelType("Petrol")
                .make("Ford")
                .model("F")
                .build();
        System.out.println(car);

        ElectricCar.ElectricCarBuilder eCarBuilder = new ElectricCar.ElectricCarBuilder();
        ElectricCar eCar = eCarBuilder.make("Mercedes")
                .colour("White")
                .model("G")
                .fuelType("Electric")
                .batteryType("Lithium")
                .build();
        System.out.println(eCar);
    }
}
```

## 第三版：使用泛型

```java
import java.util.Formatter;

public class Vehicle {

    private final String colour;
    private final String fuelType;

    public Vehicle(Builder<?> builder) {
        this.colour = builder.colour;
        this.fuelType = builder.fuelType;
    }

    public String getColour() {
        return colour;
    }

    public String getFuelType() {
        return fuelType;
    }

    @Override
    public String toString() {
        return new Formatter()
                .format("Vehicle{")
                .format("colour='%s'", colour)
                .format(", fuelType='%s'", fuelType)
                .format("}")
                .toString();
    }

    public static class Builder<T extends Builder<T>> {
        protected String colour;
        protected String fuelType;

        // 注意：添加 self() 方法
        T self() {
            return (T) this;
        }

        public T colour(String colour) {
            this.colour = colour;
            return self();
        }

        public T fuelType(String fuelType) {
            this.fuelType = fuelType;
            return self();
        }

        public Vehicle build() {
            return new Vehicle(this);
        }
    }
}
```

```java
import java.util.Formatter;

public class Car extends Vehicle {
    private final String make;
    private final String model;

    public Car(Builder<?> builder) {
        super(builder);
        this.make = builder.make;
        this.model = builder.model;
    }

    public String getMake() {
        return make;
    }

    public String getModel() {
        return model;
    }

    @Override
    public String toString() {
        return new Formatter()
                .format("Car {")
                .format("colour='%s'", getColour())
                .format(", fuelType='%s'", getFuelType())
                .format(", make='%s'", make)
                .format(", model='%s'", model)
                .format("}")
                .toString();
    }

    public static class Builder<T extends Builder<T>> extends Vehicle.Builder<T> {
        protected String make;
        protected String model;

        public T make(String make) {
            this.make = make;
            // 注意：返回 self()
            return self();
        }

        public T model(String model) {
            this.model = model;
            // 注意：返回 self()
            return self();
        }

        @Override
        public Car build() {
            return new Car(this);
        }
    }
}
```

```java
import java.util.Formatter;

public class ElectricCar extends Car {
    private final String batteryType;

    public ElectricCar(Builder<?> builder) {
        super(builder);
        this.batteryType = builder.batteryType;
    }

    public String getBatteryType() {
        return batteryType;
    }

    @Override
    public String toString() {
        return new Formatter()
                .format("ElectricCar {")
                .format("colour='%s'", getColour())
                .format(", fuelType='%s'", getFuelType())
                .format(", make='%s'", getMake())
                .format(", model='%s'", getModel())
                .format(", batteryType='%s'", batteryType)
                .format("}")
                .toString();
    }

    public static class Builder<T extends Builder<T>> extends Car.Builder<T> {
        protected String batteryType;

        public T batteryType(String batteryType) {
            this.batteryType = batteryType;
            // 注意：返回 self()
            return self();
        }

        @Override
        public ElectricCar build() {
            return new ElectricCar(this);
        }
    }
}
```

```java
public class App {
    public static void main(String[] args) {
        Car.Builder<?> carBuilder = new Car.Builder<>();
        Car car = carBuilder.colour("red")
                .fuelType("Petrol")
                .make("Ford")
                .model("F")
                .build();
        System.out.println(car);

        ElectricCar.Builder<?> ElectricCarBuilder = new ElectricCar.Builder<>();
        ElectricCar eCar = ElectricCarBuilder.make("Mercedes")
                .colour("White")
                .model("G")
                .fuelType("Electric")
                .batteryType("Lithium")
                .build();
        System.out.println(eCar);
    }
}
```

## Reference

- [Builder Pattern and Inheritance](https://www.baeldung.com/java-builder-pattern-inheritance)
