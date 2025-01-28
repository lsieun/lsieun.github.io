---
title: "computed函数"
sequence: "201"
---

与Vue2.x中computed配置功能一致

写法：

```text
import {reactive, computed} from 'vue';

setup() {
    const person = reactive({
        firstName: '张',
        lastName: '三'
    });
    
    // 计算属性（简写）
    let fullName = computed(() => {
        return person.firstName + '-' + person.lastName;
    });
    
    // 计算属性（完整）
    person.fullName = computed({
        get() {
            return person.firstName + '-' + person.lastName;
        },
        set(value) {
            const nameArray = value.split('-');
            person.firstName = nameArr[0];
            person.lastName = nameArr[1];
        }
    });
}
```
