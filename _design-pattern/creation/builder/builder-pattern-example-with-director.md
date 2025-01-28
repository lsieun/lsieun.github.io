---
title: "示例：Director"
sequence: "102"
---

## 示例

```java
import java.util.Formatter;

public class Car {
    private String engine;
    private int wheels;
    private int seats;
    private boolean sunroof;

    public Car(String engine, int wheels, int seats, boolean sunroof) {
        this.engine = engine;
        this.wheels = wheels;
        this.seats = seats;
        this.sunroof = sunroof;
    }

    public String getEngine() {
        return engine;
    }

    public void setEngine(String engine) {
        this.engine = engine;
    }

    public int getWheels() {
        return wheels;
    }

    public void setWheels(int wheels) {
        this.wheels = wheels;
    }

    public int getSeats() {
        return seats;
    }

    public void setSeats(int seats) {
        this.seats = seats;
    }

    public boolean isSunroof() {
        return sunroof;
    }

    public void setSunroof(boolean sunroof) {
        this.sunroof = sunroof;
    }

    @Override
    public String toString() {
        return new Formatter().format("Car {")
                .format("engine='%s'", engine)
                .format(", wheels=%d", wheels)
                .format(", seats=%d", seats)
                .format(", sunroof=%s", sunroof)
                .format("}")
                .toString();
    }
}
```

```java
public interface CarBuilder {
    CarBuilder setEngine(String engine);

    CarBuilder setWheels(int wheels);

    CarBuilder setSeats(int seats);

    CarBuilder setSunroof(boolean sunroof);

    Car build();
}
```

```java
public class SportsCarBuilder implements CarBuilder {
    private String engine;
    private int wheels;
    private int seats;
    private boolean sunroof;

    @Override
    public CarBuilder setEngine(String engine) {
        this.engine = engine;
        return this;
    }

    @Override
    public CarBuilder setWheels(int wheels) {
        this.wheels = wheels;
        return this;
    }

    @Override
    public CarBuilder setSeats(int seats) {
        this.seats = seats;
        return this;
    }

    @Override
    public CarBuilder setSunroof(boolean sunroof) {
        this.sunroof = sunroof;
        return this;
    }

    @Override
    public Car build() {
        return new Car(engine, wheels, seats, sunroof);
    }
}
```

```java
public class CarDirector {
    private final CarBuilder builder;

    public CarDirector(CarBuilder builder) {
        this.builder = builder;
    }

    public Car buildSportsCar() {
        return builder.setEngine("V8")
                .setWheels(4)
                .setSeats(2)
                .setSunroof(true)
                .build();
    }
}
```

```java
public class CarPatternRun {
    public static void main(String[] args) {
        CarBuilder builder = new SportsCarBuilder();
        CarDirector director = new CarDirector(builder);
        Car car = director.buildSportsCar();
        System.out.println(car);
    }
}
```
