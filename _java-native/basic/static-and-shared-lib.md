---
title: "Static And Shared Lib"
sequence: "101"
---

Linux supports two classes of libraries, namely:

- **Static libraries** – are bound to a program statically at compile time.
- **Dynamic or shared libraries** – are loaded when a program is launched and loaded into memory and binding occurs at run time.

Dynamic or shared libraries can further be categorized into:

- **Dynamically linked libraries** – here a program is linked with the shared library and **the kernel** loads the library (in case it's not in memory) upon execution.
- **Dynamically loaded libraries** – **the program** takes full control by calling functions with the library.

Normally, when making a native executable program, we can choose to use static or shared libs:

- **Static libs** – all library binaries will be included as part of our executable during the linking process.
  Thus, we won't need the libs anymore, but it'll increase the size of our executable file.
- **Shared libs** – the final executable only has references to the libs, not the code itself.
  It requires that the environment in which we run our executable has access to all the files of the libs used by our program.

The latter is what makes sense for JNI as we can't mix bytecode and natively compiled code into the same binary file.

Therefore, our shared lib will keep the native code separately within its `.so`/`.dll`/`.dylib` file
(depending on which Operating System we're using) instead of being part of our classes.

File: `main.c`

```text
#include <stdio.h>

// forward declaration from my_lib.a
int getRandInt();
void printInteger(int *inValue);
// forward declaration from my_shared_lib.so
int negateIfOdd(int inValue);

int main(){

    printf("Press Enter to repeat\n\n");
    do{
        int n = getRandInt();
        n = negateIfOdd(n);
        printInteger(&n);

    } while (getchar() == '\n');
   
    return 0;
}
```

File: `libmy_static_a.c`

```text
#include <stdlib.h>
#include <time.h>

int getRandInt(){
   srand(time(NULL)); 
   return rand() % 10;
}
```

File: `libmy_static_b.c`

```text
#include <stdio.h>

void printInteger(int *inValue){
     printf("Got integer: %d\n", (*inValue));
}
```

File: `libmy_shared.c`

```text
int negateIfOdd(int inValue){
    if (inValue % 2 == 0){
        return inValue * -1;
    } else {
        return inValue;
    }
}
```

File: `Makefile`

```text
#gcc flags:
# -c assemble but do not link
# -g include debug information
# -o output
# -s make stripped libray

# uncomment the last part in line 10 to specify current working
# directory as the default search path for shared objects

CFLAGS =-Wall -Werror #-Wl,-rpath,$(shell pwd) 
LIBS = -L. -lmy_shared


all: main.o libmy_static.a libmy_shared.so
	cc $(LIBS) -o my_app main.o libmy_static.a $(CFLAGS)

main.o: main.c
	cc -c main.c $(CFLAGS)

libmy_static.a: libmy_static_a.o libmy_static_b.o
	ar -rsv libmy_static.a libmy_static_a.o libmy_static_b.o

libmy_static_a.o: libmy_static_a.c
	cc -c libmy_static_a.c -o libmy_static_a.o $(CFLAGS)

libmy_static_b.o: libmy_static_b.c
	cc -c libmy_static_b.c -o libmy_static_b.o $(CFLAGS)

libmy_shared.so: libmy_shared.o
	cc -shared -o libmy_shared.so libmy_shared.o
libmy_shared.o: libmy_shared.c
	cc -c -fPIC libmy_shared.c -o libmy_shared.o
	

.PHONY: clean
clean:
	rm *.o
```

```text
$ make
cc -c main.c -Wall -Werror 
cc -c libmy_static_a.c -o libmy_static_a.o -Wall -Werror 
cc -c libmy_static_b.c -o libmy_static_b.o -Wall -Werror 
ar -rsv libmy_static.a libmy_static_a.o libmy_static_b.o
ar: creating libmy_static.a
a - libmy_static_a.o
a - libmy_static_b.o
cc -c -fPIC libmy_shared.c -o libmy_shared.o
cc -shared -o libmy_shared.so libmy_shared.o
cc -L. -lmy_shared -o my_app main.o libmy_static.a -Wall -Werror 

$ ls
libmy_shared.c  libmy_shared.so  libmy_static_a.c  libmy_static_b.c  main.c  Makefile
libmy_shared.o  libmy_static.a   libmy_static_a.o  libmy_static_b.o  main.o  my_app

$ make clean
rm *.o

$ ls
libmy_shared.c  libmy_shared.so  libmy_static.a  libmy_static_a.c  libmy_static_b.c  main.c  Makefile  my_app

```


