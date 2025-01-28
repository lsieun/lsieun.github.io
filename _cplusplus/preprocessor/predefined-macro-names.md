---
title: "Predefined Macro Names"
sequence: "105"
---

## Standard predefined identifier

The compiler supports this predefined identifier specified by ISO C99 and ISO C++11.

- `__func__`: The unqualified and unadorned name of the enclosing function as a function-local `static const` array of `char`.

```c++
#include <iostream>
using namespace std;

void test() {
    cout << "func from: " << __func__ << endl;
}

int main() {
    test();
    cout << "func from: " << __func__ << endl;
    return 0;
}
```

Output:

```text
func from: test
func from: main
```

## Standard predefined macros

The following macro names are always defined (they all begin and end with two underscore characters, `_`):

- `__LINE__`: Integer value representing the current line in the source code file being compiled.
- `__FILE__`: A string literal containing the presumed name of the source file being compiled.
- `__DATE__`: A string literal in the form "Mmm dd yyyy" containing the date in which the compilation process began.
- `__TIME__`: A string literal in the form "hh:mm:ss" containing the time at which the compilation process began.
- `__cplusplus`: An integer value. All C++ compilers have this constant defined to some value. Its value depends on the version of the standard supported by the compiler.
  - 199711L (until C++11)
  - 201103L (C++11)
  - 201402L (C++14)
  - 201703L (C++17)
  - 202002L (C++20)
- `__STDC_HOSTED__`: `1` if the implementation is a hosted implementation (with all standard headers available), `0` otherwise.

```c++
#include <iostream>
using namespace std;

int main() {
    cout << "line: " << __LINE__ << endl;
    cout << "file: " << __FILE__ << endl;
    cout << "date: " << __DATE__ << endl;
    cout << "time: " << __TIME__ << endl;
    cout << "cplusplus: " << __cplusplus << endl;
    cout << "STDC_HOSTED: " << __STDC_HOSTED__ << endl;
    return 0;
}
```

```text
line: 5
file: /cygdrive/d/github-repo/learn-cplusplus/main.cpp
date: Jan  9 2022
time: 03:08:22
cplusplus: 201402
STDC_HOSTED: 1
```

## Reference

- [Predefined macros](https://docs.microsoft.com/en-us/cpp/preprocessor/predefined-macros)
