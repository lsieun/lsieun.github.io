---
title: "Vue3.x的生命周期"
sequence: "201"
---

## 流程图

![](/assets/images/front-end/vue3/vue3-lifecycle.png)

## 示例

### 配置项的方式

File: `App.vue`

```text
<template>
  <div>
    <Demo v-if="isShowDemo"/>
  </div>
  <button @click="isShowDemo = !isShowDemo">切换显示/隐藏</button>
</template>

<script>
import Demo from './components/Demo.vue';
import {ref} from "vue";

export default {
  name: 'App',
  components: {Demo},
  setup() {
    let isShowDemo = ref(false);
    return {isShowDemo};
  }
}
</script>

<style scoped lang="scss">
</style>
```

File: `components/Demo.vue`

```text
<template>
  <h1>当前的值为：{{ sum }}</h1>
  <br/>
  <button @click="sum++">点我+1</button>
</template>

<script>
import {ref} from "vue";

export default {
  name: 'Demo',
  setup() {
    let sum = ref(0);
    return {sum};
  },
  // 通过配置项的方式使用生命周期钩子
  beforeCreate() {
    console.log('---beforeCreate');
  },
  created() {
    console.log('---created');
  },
  beforeMount() {
    console.log('---beforeMount');
  },
  mounted() {
    console.log('---mounted');
  },
  beforeUpdate() {
    console.log('---beforeUpdate');
  },
  updated() {
    console.log('---updated');
  },
  beforeUnmount() {
    console.log('---beforeUnmount');
  },
  unmounted() {
    console.log('---unmounted');
  }
};
</script>
```

输出结果：

```text
---beforeCreate
---created
---beforeMount
---mounted
---beforeUpdate
---updated
---beforeUnmount
---unmounted
```

### 组合式API

Vue3也提供了Composition API形式的生命周期钩子：

| Configuration | Composition API |
|---------------|-----------------|
| beforeCreate  | setup()         |
| created       | setup()         |
| beforeMount   | onBeforeMount   |
| mounted       | onMounted       |
| beforeUpdate  | onBeforeUpdate  |
| updated       | onUpdated       |
| beforeUnmount | onBeforeUnmount |
| unmounted     | onUnmounted     |

File: `Demo.vue`

```text
<template>
  <h1>当前的值为：{{ sum }}</h1>
  <br/>
  <button @click="sum++">点我+1</button>
</template>

<script>
import {onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated, ref} from "vue";

export default {
  name: 'Demo',
  setup() {
    let sum = ref(0);

    console.log('---setup---')

    // 通过组合式API的形式来使用生命周期钩子
    onBeforeMount(() => {
      console.log('---onBeforeMount---');
    });
    onMounted(() => {
      console.log('---onMounted---');
    });
    onBeforeUpdate(() => {
      console.log('---onBeforeUpdate---');
    })
    onUpdated(() => {
      console.log('---onUpdated---');
    });
    onBeforeUnmount(() => {
      console.log('---onBeforeUnmount---');
    });
    onUnmounted(() => {
      console.log('---onUnmounted---');
    });

    return {sum};
  }
};
</script>
```

输出信息：

```text
---setup---
---onBeforeMount---
---onMounted---
---onBeforeUpdate---
---onUpdated---
---onBeforeUnmount---
---onUnmounted---
```

### setup语法糖

File: `App.vue`

```text
<template>
  <div>
    <Demo v-if="isShowDemo"/>
  </div>
  <button @click="isShowDemo = !isShowDemo">切换显示/隐藏</button>
</template>

<script setup lang="ts">
import Demo from './components/Demo.vue';
import {ref} from "vue";

let isShowDemo = ref(false);
</script>

<style scoped lang="scss">
</style>
```

File: `Demo.vue`

```text
<template>
  <h1>当前的值为：{{ sum }}</h1>
  <br/>
  <button @click="sum++">点我+1</button>
</template>

<script setup lang="ts">
import {onBeforeMount, onBeforeUnmount, onBeforeUpdate, onMounted, onUnmounted, onUpdated, ref} from "vue";

const sum = ref(0);

console.log('---setup---')

onBeforeMount(() => {
  console.log('---onBeforeMount---');
});
onMounted(() => {
  console.log('---onMounted---');
});
onBeforeUpdate(() => {
  console.log('---onBeforeUpdate---');
})
onUpdated(() => {
  console.log('---onUpdated---');
});
onBeforeUnmount(() => {
  console.log('---onBeforeUnmount---');
});
onUnmounted(() => {
  console.log('---onUnmounted---');
});
</script>
```

## Reference

- [Lifecycle Diagram](https://vuejs.org/guide/essentials/lifecycle.html#lifecycle-diagram)
