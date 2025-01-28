---
title: "Logic"
sequence: "101"
---

```java
@FunctionalInterface
public interface LineTextMatch {
    boolean test(int lineIndex, String line);
}
```

## Enum

### NoOp

```Java
public enum LineTextMatchNoOp implements LineTextMatch {
    INSTANCE;

    @Override
    public boolean test(int lineIndex, String line) {
        return false;
    }
}
```

### Bool

```java
public enum LineTextMatchBool implements LineTextMatch {
    TRUE {
        @Override
        public boolean test(int lineIndex, String line) {
            return true;
        }
    },
    FALSE {
        @Override
        public boolean test(int lineIndex, String line) {
            return false;
        }
    };
}
```

## Compound

```java
import java.util.Arrays;
import java.util.List;

@FunctionalInterface
public interface LineTextMatch {
    boolean test(int lineIndex, String line);

    static LineTextMatch of(LineTextMatch... matches) {
        List<LineTextMatch> list = Arrays.asList(matches);
        return new Compound(list);
    }
    
    static LineTextMatch of(List<LineTextMatch> list) {
        return new Compound(list);
    }
    
    class Compound implements LineTextMatch {
        private final List<LineTextMatch> matches;

        private Compound(List<LineTextMatch> matches) {
            this.matches = matches;
        }

        @Override
        public boolean test(int lineIndex, String line) {
            for (LineTextMatch match : matches) {
                boolean matched = match.test(lineIndex, line);
                if (!matched) {
                    return false;
                }
            }
            return true;
        }
    }
}
```

```java
import java.util.List;
import java.util.function.Function;

@FunctionalInterface
public interface ByteArrayProcessor extends Function<byte[], byte[]> {

    static ByteArrayProcessor of(ByteArrayProcessor... processors) {
        List<ByteArrayProcessor> list = ListUtils.toList(processors);
        return of(list);
    }

    static ByteArrayProcessor of(List<ByteArrayProcessor> list) {
        if (ListUtils.isNullOrEmpty(list)) {
            return NoOp.INSTANCE;
        }
        else if (list.size() == 1) {
            return list.get(0);
        }
        else {
            return new Compound(list);
        }
    }

    enum NoOp implements ByteArrayProcessor {
        INSTANCE;

        @Override
        public byte[] apply(byte[] bytes) {
            return bytes;
        }
    }

    class Compound implements ByteArrayProcessor {
        private final List<ByteArrayProcessor> processors;

        private Compound(@NotNull List<ByteArrayProcessor> processors) {
            this.processors = processors;
        }

        @Override
        public byte[] apply(byte[] bytes) {
            for (ByteArrayProcessor p : processors) {
                bytes = p.apply(bytes);
            }
            return bytes;
        }
    }
}
```
