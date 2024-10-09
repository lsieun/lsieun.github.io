---
title: "示例：内部类"
sequence: "103"
---

## 示例

```java
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class Trip {
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final String start;
    private final String end;
    private final int duration;
    private final int numberTravellers;
    private final int numberKids;
    private final int minimumStars;
    private final int minimumRecommendations;
    private final int rating;
    private final int minimumNumberRatings;

    // the constructor is private,
    // so that an object can only be created within the class
    private Trip(Builder builder) {
        this.startDate = builder.startDate;
        this.endDate = builder.endDate;
        var formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        start = formatter.format(startDate);
        end = formatter.format(endDate);
        this.duration = builder.duration;
        this.numberTravellers = builder.numberTravellers;
        this.numberKids = builder.numberKids;
        this.minimumStars = builder.minimumStars;
        this.minimumRecommendations = builder.minimumRecommendations;
        this.rating = builder.rating;
        this.minimumNumberRatings = builder.minimumNumberRatings;
    }

    public static Trip.Builder builder(LocalDate startDate,
                                       LocalDate endDate,
                                       int duration,
                                       int numberTravellers) {
        return new Trip.Builder(startDate, endDate, duration, numberTravellers);
    }

    // The Builder type is defined as the static inner class
    public static class Builder {
        private LocalDate startDate;
        private LocalDate endDate;
        private int duration;
        private int numberTravellers;
        private int numberKids = 0;
        private int minimumStars = 0;
        private int minimumRecommendations = 0;
        private int rating = 0;
        private int minimumNumberRatings = 0;

        // The important data fields are initialized in the constructor,
        // the others get default values.
        public Builder(LocalDate startDate, LocalDate endDate, int duration, int numberTravellers) {
            this.startDate = startDate;
            this.endDate = endDate;
            this.duration = duration;
            this.numberTravellers = numberTravellers;
        }

        // For each data field, there is a setter that, contrary to language convention,
        // only repeats the name of the field.
        // Inside the setter, the corresponding data field is assigned a value;
        // finally, the setter returns the builder instance.
        public Builder numberKids(int numberKids) {
            this.numberKids = numberKids;
            return this;
        }

        public Builder minimumStars(int minimumStars) {
            this.minimumStars = minimumStars;
            return this;
        }

        public Builder minimumRecommendations(int minimumRecommendations) {
            this.minimumRecommendations = minimumRecommendations;
            return this;
        }

        public Builder rating(int rating) {
            this.rating = rating;
            return this;
        }

        public Builder minimumNumberRatings(int minimumNumberRatings) {
            this.minimumNumberRatings = minimumNumberRatings;
            return this;
        }

        public Trip build() {
            return new Trip(this);
        }
    }

    public static void main(String[] args) {
        // use builder constructor
        var builder = new Trip.Builder(
                LocalDate.now(),
                LocalDate.now().plusDays(15),
                15,
                2
        );
        var trip = builder
                .minimumStars(3)
                .rating(5)
                .numberKids(0)
                .build();
        System.out.println(trip);

        // use static method
        var trip2 = Trip.builder(LocalDate.now(),
                        LocalDate.now().plusDays(15),
                        15, 2)
                .minimumStars(3)
                .rating(5)
                .numberKids(0)
                .build();
        System.out.println(trip2);
    }
}
```
