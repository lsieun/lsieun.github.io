---
title:  "205个opcode"
sequence: "102"
---

下表的内容是来自于[The Java® Virtual Machine Specification Java SE 8 Edition](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)中的[Chapter 6. The Java Virtual Machine Instruction Set](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)

| opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol | opcode | mnemonic symbol |
|--------|-----------------|--------|-----------------|--------|-----------------|--------|-----------------|
| 0      | nop             | 64     | lstore_1        | 128    | ior             | 192    | checkcast       |
| 1      | aconst_null     | 65     | lstore_2        | 129    | lor             | 193    | instanceof      |
| 2      | iconst_m1       | 66     | lstore_3        | 130    | ixor            | 194    | monitorenter    |
| 3      | iconst_0        | 67     | fstore_0        | 131    | lxor            | 195    | monitorexit     |
| 4      | iconst_1        | 68     | fstore_1        | 132    | iinc            | 196    | wide            |
| 5      | iconst_2        | 69     | fstore_2        | 133    | i2l             | 197    | multianewarray  |
| 6      | iconst_3        | 70     | fstore_3        | 134    | i2f             | 198    | ifnull          |
| 7      | iconst_4        | 71     | dstore_0        | 135    | i2d             | 199    | ifnonnull       |
| 8      | iconst_5        | 72     | dstore_1        | 136    | l2i             | 200    | goto_w          |
| 9      | lconst_0        | 73     | dstore_2        | 137    | l2f             | 201    | jsr_w           |
| 10     | lconst_1        | 74     | dstore_3        | 138    | l2d             | 202    | breakpoint      |
| 11     | fconst_0        | 75     | astore_0        | 139    | f2i             | 203    |                 |
| 12     | fconst_1        | 76     | astore_1        | 140    | f2l             | 204    |                 |
| 13     | fconst_2        | 77     | astore_2        | 141    | f2d             | 205    |                 |
| 14     | dconst_0        | 78     | astore_3        | 142    | d2i             | 206    |                 |
| 15     | dconst_1        | 79     | iastore         | 143    | d2l             | 207    |                 |
| 16     | bipush          | 80     | lastore         | 144    | d2f             | 208    |                 |
| 17     | sipush          | 81     | fastore         | 145    | i2b             | 209    |                 |
| 18     | ldc             | 82     | dastore         | 146    | i2c             | 210    |                 |
| 19     | ldc_w           | 83     | aastore         | 147    | i2s             | 211    |                 |
| 20     | ldc2_w          | 84     | bastore         | 148    | lcmp            | 212    |                 |
| 21     | iload           | 85     | castore         | 149    | fcmpl           | 213    |                 |
| 22     | lload           | 86     | sastore         | 150    | fcmpg           | 214    |                 |
| 23     | fload           | 87     | pop             | 151    | dcmpl           | 215    |                 |
| 24     | dload           | 88     | pop2            | 152    | dcmpg           | 216    |                 |
| 25     | aload           | 89     | dup             | 153    | ifeq            | 217    |                 |
| 26     | iload_0         | 90     | dup_x1          | 154    | ifne            | 218    |                 |
| 27     | iload_1         | 91     | dup_x2          | 155    | iflt            | 219    |                 |
| 28     | iload_2         | 92     | dup2            | 156    | ifge            | 220    |                 |
| 29     | iload_3         | 93     | dup2_x1         | 157    | ifgt            | 221    |                 |
| 30     | lload_0         | 94     | dup2_x2         | 158    | ifle            | 222    |                 |
| 31     | lload_1         | 95     | swap            | 159    | if_icmpeq       | 223    |                 |
| 32     | lload_2         | 96     | iadd            | 160    | if_icmpne       | 224    |                 |
| 33     | lload_3         | 97     | ladd            | 161    | if_icmplt       | 225    |                 |
| 34     | fload_0         | 98     | fadd            | 162    | if_icmpge       | 226    |                 |
| 35     | fload_1         | 99     | dadd            | 163    | if_icmpgt       | 227    |                 |
| 36     | fload_2         | 100    | isub            | 164    | if_icmple       | 228    |                 |
| 37     | fload_3         | 101    | lsub            | 165    | if_acmpeq       | 229    |                 |
| 38     | dload_0         | 102    | fsub            | 166    | if_acmpne       | 230    |                 |
| 39     | dload_1         | 103    | dsub            | 167    | goto            | 231    |                 |
| 40     | dload_2         | 104    | imul            | 168    | jsr             | 232    |                 |
| 41     | dload_3         | 105    | lmul            | 169    | ret             | 233    |                 |
| 42     | aload_0         | 106    | fmul            | 170    | tableswitch     | 234    |                 |
| 43     | aload_1         | 107    | dmul            | 171    | lookupswitch    | 235    |                 |
| 44     | aload_2         | 108    | idiv            | 172    | ireturn         | 236    |                 |
| 45     | aload_3         | 109    | ldiv            | 173    | lreturn         | 237    |                 |
| 46     | iaload          | 110    | fdiv            | 174    | freturn         | 238    |                 |
| 47     | laload          | 111    | ddiv            | 175    | dreturn         | 239    |                 |
| 48     | faload          | 112    | irem            | 176    | areturn         | 240    |                 |
| 49     | daload          | 113    | lrem            | 177    | return          | 241    |                 |
| 50     | aaload          | 114    | frem            | 178    | getstatic       | 242    |                 |
| 51     | baload          | 115    | drem            | 179    | putstatic       | 243    |                 |
| 52     | caload          | 116    | ineg            | 180    | getfield        | 244    |                 |
| 53     | saload          | 117    | lneg            | 181    | putfield        | 245    |                 |
| 54     | istore          | 118    | fneg            | 182    | invokevirtual   | 246    |                 |
| 55     | lstore          | 119    | dneg            | 183    | invokespecial   | 247    |                 |
| 56     | fstore          | 120    | ishl            | 184    | invokestatic    | 248    |                 |
| 57     | dstore          | 121    | lshl            | 185    | invokeinterface | 249    |                 |
| 58     | astore          | 122    | ishr            | 186    | invokedynamic   | 250    |                 |
| 59     | istore_0        | 123    | lshr            | 187    | new             | 251    |                 |
| 60     | istore_1        | 124    | iushr           | 188    | newarray        | 252    |                 |
| 61     | istore_2        | 125    | lushr           | 189    | anewarray       | 253    |                 |
| 62     | istore_3        | 126    | iand            | 190    | arraylength     | 254    | impdep1         |
| 63     | lstore_0        | 127    | land            | 191    | athrow          | 255    | impdep2         |

