---
title: "Compile EPANET on Linux"
sequence: "201"
---

## CMake

The most straightforward way to build the EPANET files is by using CMake (https://cmake.org/).
CMake is a cross-platform build tool that generates platform native build systems
that can be used with your compiler of choice.
It uses a generator concept to represent different build tooling.
CMake automatically detects the platform it is running on and
generates the appropriate makefiles for the platform default compiler.
Different generators can also be specified.

The project's `CMake` file (`CMakeLists.txt`) is located in its root directory and supports builds for Linux, macOS and Windows.
To build the EPANET library and its command line executable using `CMake`,
first open a console window and navigate to the project's root directory.
Then enter the following commands:

```text
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

## Build

```text
$ sudo yum install cmake -y
$ tar -xzvf EPANET-2.2.tar.gz
$ cd EPANET-2.2
$ mkdir build
$ cd build/
$ cmake ..
$ cmake --build . --config Release
```

```text
cmake [options] <path-to-source>
cmake [options] <path-to-existing-build>

--build <dir>               = Build a CMake-generated project binary tree.

```

```text
$ cmake ..
-- The C compiler identification is GNU 4.8.5
-- The CXX compiler identification is GNU 4.8.5
-- Check for working C compiler: /usr/bin/cc
-- Check for working C compiler: /usr/bin/cc -- works
-- Detecting C compiler ABI info
-- Detecting C compiler ABI info - done
-- Check for working CXX compiler: /usr/bin/c++
-- Check for working CXX compiler: /usr/bin/c++ -- works
-- Detecting CXX compiler ABI info
-- Detecting CXX compiler ABI info - done
-- Performing Test COMPILER_HAS_HIDDEN_VISIBILITY
-- Performing Test COMPILER_HAS_HIDDEN_VISIBILITY - Success
-- Performing Test COMPILER_HAS_HIDDEN_INLINE_VISIBILITY
-- Performing Test COMPILER_HAS_HIDDEN_INLINE_VISIBILITY - Success
-- Performing Test COMPILER_HAS_DEPRECATED_ATTR
-- Performing Test COMPILER_HAS_DEPRECATED_ATTR - Success
-- Configuring done
-- Generating done
-- Build files have been written to: /home/liusen/EPANET-2.2/build
```

```text
$ cmake --build . --config Release
Scanning dependencies of target epanet2
[  3%] Building C object CMakeFiles/epanet2.dir/src/epanet.c.o
[  6%] Building C object CMakeFiles/epanet2.dir/src/epanet2.c.o
[ 10%] Building C object CMakeFiles/epanet2.dir/src/genmmd.c.o
[ 13%] Building C object CMakeFiles/epanet2.dir/src/hash.c.o
[ 17%] Building C object CMakeFiles/epanet2.dir/src/hydcoeffs.c.o
[ 20%] Building C object CMakeFiles/epanet2.dir/src/hydraul.c.o
[ 24%] Building C object CMakeFiles/epanet2.dir/src/hydsolver.c.o
[ 27%] Building C object CMakeFiles/epanet2.dir/src/hydstatus.c.o
[ 31%] Building C object CMakeFiles/epanet2.dir/src/inpfile.c.o
[ 34%] Building C object CMakeFiles/epanet2.dir/src/input1.c.o
[ 37%] Building C object CMakeFiles/epanet2.dir/src/input2.c.o
[ 41%] Building C object CMakeFiles/epanet2.dir/src/input3.c.o
[ 44%] Building C object CMakeFiles/epanet2.dir/src/mempool.c.o
[ 48%] Building C object CMakeFiles/epanet2.dir/src/output.c.o
[ 51%] Building C object CMakeFiles/epanet2.dir/src/project.c.o
[ 55%] Building C object CMakeFiles/epanet2.dir/src/quality.c.o
[ 58%] Building C object CMakeFiles/epanet2.dir/src/qualreact.c.o
[ 62%] Building C object CMakeFiles/epanet2.dir/src/qualroute.c.o
[ 65%] Building C object CMakeFiles/epanet2.dir/src/report.c.o
[ 68%] Building C object CMakeFiles/epanet2.dir/src/rules.c.o
[ 72%] Building C object CMakeFiles/epanet2.dir/src/smatrix.c.o
[ 75%] Building C object CMakeFiles/epanet2.dir/src/util/cstr_helper.c.o
[ 79%] Building C object CMakeFiles/epanet2.dir/src/util/errormanager.c.o
[ 82%] Building C object CMakeFiles/epanet2.dir/src/util/filemanager.c.o
Linking C shared library lib/libepanet2.so
[ 82%] Built target epanet2
Scanning dependencies of target runepanet
[ 86%] Building C object run/CMakeFiles/runepanet.dir/main.c.o
Linking C executable ../bin/runepanet
[ 86%] Built target runepanet
Scanning dependencies of target epanet-output
[ 89%] Building C object src/outfile/CMakeFiles/epanet-output.dir/src/epanet_output.c.o
[ 93%] Building C object src/outfile/CMakeFiles/epanet-output.dir/__/util/errormanager.c.o
[ 96%] Building C object src/outfile/CMakeFiles/epanet-output.dir/__/util/filemanager.c.o
[100%] Building C object src/outfile/CMakeFiles/epanet-output.dir/__/util/cstr_helper.c.o
Linking C shared library ../../lib/libepanet-output.so
[100%] Built target epanet-output
```

```text
$ tree -L 2
.
├── bin
│   └── runepanet
├── CMakeCache.txt
├── CMakeFiles
│   ├── 2.8.12.2
│   ├── cmake.check_cache
│   ├── CMakeDirectoryInformation.cmake
│   ├── CMakeOutput.log
│   ├── CMakeTmp
│   ├── epanet2.dir
│   ├── Makefile2
│   ├── Makefile.cmake
│   ├── progress.marks
│   └── TargetDirectories.txt
├── cmake_install.cmake
├── lib
│   ├── libepanet2.so
│   └── libepanet-output.so
├── Makefile
├── run
│   ├── CMakeFiles
│   ├── cmake_install.cmake
│   └── Makefile
└── src
    └── outfile

10 directories, 15 files
```

## Run

For Linux and macOS, the EPANET toolkit shared library `libepanet2.so` appears in the `build/lib` directory and
the command line executable `runepanet` is in the `build/bin` directory.

```text
$ cd ./build/bin
$ ./runepanet ./Net3.inp ./Net3.rpt ./Net3.out

... Running EPANET Version 2.2.0
                                                               
... EPANET ran successfully.
```

```text
$ cd ./build/lib
$ nm -D libepanet2.so 
...
000000000001953d T ENclose
000000000000b8f2 T EN_close
000000000001961e T ENcloseH
000000000000be88 T EN_closeH
000000000001974d T ENcloseQ
000000000000c46e T EN_closeQ
...
0000000000019385 T ENinit
000000000000b2af T EN_init
00000000000195ac T ENinitH
000000000000bc94 T EN_initH
00000000000196b4 T ENinitQ
000000000000c26b T EN_initQ
00000000000195f7 T ENnextH
000000000000bdfc T EN_nextH
00000000000196ff T ENnextQ
000000000000c34e T EN_nextQ
00000000000193d7 T ENopen
000000000000b462 T EN_open
0000000000019594 T ENopenH
000000000000bbf5 T EN_openH
000000000001969c T ENopenQ
000000000000c1be T EN_openQ
000000000001978c T ENreport
000000000000c4fb T EN_report
00000000000197e3 T ENresetreport
000000000000c5a0 T EN_resetreport
00000000000195d0 T ENrunH
000000000000bd9a T EN_runH
000000000000b1c7 T EN_runproject
00000000000196d8 T ENrunQ
000000000000c2ec T EN_runQ
000000000001957c T ENsaveH
000000000000bb81 T EN_saveH
...
0000000000019564 T ENsolveH
000000000000ba34 T EN_solveH
0000000000019684 T ENsolveQ
000000000000c050 T EN_solveQ
0000000000019726 T ENstepQ
000000000000c3de T EN_stepQ
...
```

## Reference

- [OpenWaterAnalytics/EPANET/BUILDING.md](https://github.com/OpenWaterAnalytics/EPANET/blob/master/BUILDING.md)
