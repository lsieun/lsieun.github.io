---
title: "ASM Analysis"
sequence: "101"
---

## Find

```java
public class ClassFileFindUtilsRun {
    public static void main(String[] args) {
        findField();
        findMethod();
        findMethodByStackFrameLine();
    }

    public static void findField() {
        // (1) dir
        Path dirPath = Path.of("...");

        // (2) match: entry and field
        TextMatch zipEntryMatch = TextMatchBuddy.ignoreThirdParty();
        FieldInfoMatch fieldMatch = FieldInfoMatch.byValue(7);

        // (3) find
        ClassFileFindBuilder.byField()
                .withDir(dirPath, 1, false)
                .withZipEntryMatch(zipEntryMatch)
                .withClassInfoMatch()
                .withFieldMatch(fieldMatch)
                .print();
    }

    public static void findMethod() {
        // (1) dir
        Path dirPath = Path.of("...");

        // (2) match: entry and method
        String entry = "com/abc/Xyz.class";
        String methodName = "test";
        String methodDesc = "()V";

        TextMatch zipEntryMatch = TextMatch.contains(entry);
        MethodInfoMatch methodMatch = MethodInfoMatch.byMethodNameAndDesc(methodName, methodDesc);

        // (3) find
        ClassFileFindBuilder.byMethod()
                .withDir(dirPath, 1, false)
                .withZipEntryMatch(zipEntryMatch)
                .withClassInfoMatch()
                .withMethodMatch(methodMatch)
                .print();
    }
    
    public static void findMethodByStackFrameLine() {
        // (1) dir
        Path dirPath = Path.of("...");

        // (2) match: entry and method
        String stackFrameLine = "...";
        MemberDesc memberDesc = MemberDesc.of(stackFrameLine);

        TextMatch zipEntryMatch = TextMatch.contains(
                AsmTypeNameUtils.toInternalName(memberDesc.owner())
        );
        MethodInfoMatch methodMatch = MethodInfoMatch.byMethodNameAndDesc(
                memberDesc.name(),
                memberDesc.desc()
        );

        // (3) find
        ClassFileFindBuilder.byMethod()
                .withDir(dirPath, 1, false)
                .withZipEntryMatch(zipEntryMatch)
                .withClassInfoMatch()
                .withMethodMatch(methodMatch)
                .print();
    }
}
```
