---
title: "#define"
sequence: "102"
---

There are 4 main types of preprocessor directives:

- Macros
- File Inclusion
- Conditional Compilation
- Other directives

Macros are a piece of code in a program which is given some name.
Whenever this name is encountered by the compiler the compiler replaces the name with the actual piece of code.
The `#define` directive is used to define a macro.

## Examples

### Example 01: simple macro

```c++
#include <iostream>

// macro definition
#define LIMIT 5

int main() {
    for (int i = 0; i < LIMIT; i++) {
        std::cout << i << std::endl;
    }
    return 0;
}
```

### Example 02: macro with parameter

```c++
#include <iostream>
using namespace std;

// macro with parameter
#define MUL(a, b) (a * b)

int main() {
    int a = 3, b = 4, c;
    c = MUL(a, b);
    cout << "c = " << c << endl;
    return 0;
}
```

### Example 03: define class

```c++
#include <iostream>
using namespace std;

#define DEF_ANIMAL(animal, sound)                       \
class Little##animal {                                  \
public:                                                 \
    void speak() {                                      \
        cout << #sound " " #sound " " #sound << endl;   \
    }                                                   \
};

DEF_ANIMAL(Dog, bark)
DEF_ANIMAL(Cat, miao)

int main() {
    LittleDog dog;
    dog.speak();

    LittleCat cat;
    cat.speak();

    return 0;
}
```

Output:

```text
bark bark bark
miao miao miao
```

## `#` and `##` operators

In function-like macros, a `#` operator before **an identifier** in the `replacement-list`
runs the identifier through parameter replacement and encloses the result in quotes, effectively creating a string literal.
In addition, the preprocessor adds backslashes to escape the quotes surrounding embedded string literals,
if any, and doubles the backslashes within the string as necessary.
All leading and trailing whitespace is removed, and any sequence of whitespace in the middle of the text (but not inside embedded string literals) is collapsed to a single space. This operation is called "stringification". If the result of stringification is not a valid string literal, the behavior is undefined.

- [Token-pasting operator (##)](https://docs.microsoft.com/en-us/cpp/preprocessor/token-pasting-operator-hash-hash)

## undef

The `#undef` directive is used to undefine an existing macro.

This directive works as:

```text
#undef LIMIT
```
