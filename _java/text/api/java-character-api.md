---
title: "Character"
sequence: "101"
---

```text
                                                  ┌─── charCount()
                                                  │
                                                  ├─── highSurrogate()
                                                  │
                                                  ├─── lowSurrogate()
                                                  │
                                ┌─── surrogate ───┼─── isSurrogatePair()
                                │                 │
                                │                 ├─── isSurrogate()
                                │                 │
                                │                 ├─── isHighSurrogate()
                                │                 │
                                │                 └─── isLowSurrogate()
                                │
                                │                 ┌─── codePointAt()
                                │                 │
                                │                 ├─── codePointBefore()
                                ├─── codePoint ───┤
                                │                 ├─── codePointCount()
                                │                 │
                                │                 └─── codePointOf()
                                │
                                ├─── direction ───┼─── getDirectionality()
                                │
                                ├─── name ────────┼─── getName()
                                │
                                ├─── type ────────┼─── getType()
                                │
                                │                 ┌─── isBmpCodePoint()
                                │                 │
                                │                 ├─── isSupplementaryCodePoint()
                                ├─── plane ───────┤
                                │                 ├─── isDefined()
                                │                 │
                                │                 └─── isValidCodePoint()
                                │
                                │                 ┌─── alpha ────────┼─── isAlphabetic()
                                │                 │
                                │                 │                  ┌─── digit()
                                │                 │                  │
                                │                 │                  ├─── forDigit()
                                │                 ├─── num ──────────┤
                                │                 │                  ├─── isDigit()
                                │                 │                  │
                                │                 │                  └─── getNumericValue()
                                │                 │
                                │                 │                  ┌─── isLetter()
                                │                 ├─── letter ───────┤
                                │                 │                  └─── isJavaLetter()
                                │                 │
                                │                 │                  ┌─── isSpace()
             ┌─── static ───────┤                 │                  │
             │                  │                 ├─── space ────────┼─── isSpaceChar()
             │                  │                 │                  │
             │                  │                 │                  └─── isWhitespace()
             │                  ├─── block ───────┤
             │                  │                 │                  ┌─── isJavaIdentifierPart()
             │                  │                 │                  │
             │                  │                 │                  ├─── isJavaIdentifierStart()
             │                  │                 │                  │
             │                  │                 ├─── identifier ───┼─── isIdentifierIgnorable()
             │                  │                 │                  │
             │                  │                 │                  ├─── isUnicodeIdentifierPart()
             │                  │                 │                  │
             │                  │                 │                  └─── isUnicodeIdentifierStart()
             │                  │                 │
             │                  │                 │                  ┌─── isJavaLetterOrDigit()
             │                  │                 ├─── combine ──────┤
             │                  │                 │                  └─── isLetterOrDigit()
             │                  │                 │
             │                  │                 │                  ┌─── isUpperCase()
             │                  │                 │                  │
             │                  │                 │                  ├─── isLowerCase()
             │                  │                 │                  │
             │                  │                 │                  ├─── isTitleCase()
             │                  │                 └─── case ─────────┤
             │                  │                                    ├─── toUpperCase()
             │                  │                                    │
             │                  │                                    ├─── toLowerCase()
Character ───┤                  │                                    │
             │                  │                                    └─── toTitleCase()
             │                  │
             │                  │                                         ┌─── `U+0000` - `U+001F`
             │                  │                 ┌─── isISOControl() ────┤
             │                  │                 │                       └─── `U+007F` - `U+009F`
             │                  ├─── is ──────────┤
             │                  │                 ├─── isIdeographic()
             │                  │                 │
             │                  │                 └─── isMirrored()
             │                  │
             │                  │                 ┌─── offsetByCodePoints()
             │                  │                 │
             │                  │                 ├─── reverseBytes()
             │                  │                 │
             │                  │                 ├─── toChars()
             │                  │                 │
             │                  └─── other ───────┼─── toCodePoint()
             │                                    │
             │                                    ├─── toString()
             │                                    │
             │                                    ├─── valueOf()
             │                                    │
             │                                    └─── compare()
             │
             │                  ┌─── charValue()
             │                  │
             │                  ├─── compareTo()
             └─── non-static ───┤
                                ├─── describeConstable()
                                │
                                └─── equals()
```
