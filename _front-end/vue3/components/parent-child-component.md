---
title: "Component：父子组件"
sequence: "201"
---

## Basic

File: `Parent.vue`

```vue
<template>
  <div class="parent-div">
    <h1>我是Parent组件</h1>
    <hr/>
    <Child/>
  </div>
</template>

<script setup lang="ts">
import Child from './Child.vue';
</script>

<style scoped lang="css">
.parent-div {
  width: 600px;
  height: 400px;
  background-color: grey;
}
</style>
```

File: `Child.vue`

```vue
<template>
  <div class="child-div">
    <h1>我是Child组件</h1>
  </div>
</template>

<style scoped lang="css">
.child-div {
  width: 300px;
  height: 200px;
  background-color: orange;
}
</style>
```

## 传递值

### 父组件向子组件传值

File: `Parent.vue`

```text
<template>
  <div class="parent-div">
    <h1>我是Parent组件</h1>
    <hr/>

    <!-- 父组件通过attribute传递数据 -->
    <Child :info="parentMsg"/>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import Child from './Child.vue';

const parentMsg = ref<string>('Parent: 你好吗？');
</script>

<style scoped lang="css">
.parent-div {
  width: 600px;
  height: 400px;
  background-color: grey;
}
</style>
```

File: `Child.vue`

```text
<template>
  <div class="child-div">
    <h1>我是Child组件</h1>
    <p>{{info}}</p>
  </div>
</template>

<script setup lang="ts">
import {defineProps} from "vue";

// 子组件接收父组件传递过来的值
defineProps({
  info: String
});
</script>

<style scoped lang="css">
.child-div {
  width: 300px;
  height: 200px;
  background-color: orange;
  margin: auto;
}
</style>
```

### 子组件向父组件传值

Vue3中子组件向父组件传递值和Vue2.x的区别：
Vue2.x使用的是`$emit`，而Vue3使用的是`emit`，它们的传值一样都是方法加值，
即Vue2.x的是`this.$emit('方法名','传递的值(根据需要传或者不传)')`，
Vue3的setup语法糖的是`defineEmits`。

File: `Child.vue`

```text
<template>
  <div class="child-div">
    <h1>我是Child组件</h1>
    <button @click="clickChild">点击子组件</button>
  </div>
</template>

<script setup lang="ts">
import {defineEmits} from "vue";

// 使用defineEmits创建名称，接收一个数组
const emit = defineEmits(['fn']);

const clickChild = () => {
  let data = {
    username: 'tom',
    password: '123'
  };

  // 传递给父组件
  emit('fn', data);
};
</script>

<style scoped lang="css">
.child-div {
  width: 300px;
  height: 200px;
  background-color: orange;
  margin: auto;
}
</style>
```

File: `Parent.vue`

```text
<template>
  <div class="parent-div">
    <h1>我是Parent组件</h1>
    <hr/>

    <!-- 父组件通过attribute传递数据 -->
    <Child @fn="handleByParent"/>

    <hr/>
    <p>
      username: {{ result.username }}<br/>
      password: {{ result.password }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import Child from './Child.vue';

const result = ref();

const handleByParent = (val) => {
  console.log(val);
  result.value = val;
};
</script>

<style scoped lang="css">
.parent-div {
  width: 600px;
  height: 400px;
  background-color: grey;
}
</style>
```

### 父组件获取子组件中的属性值

当使用语法糖时，需要将组件的属性及方法通过`defineExpose`导出，父组件才能访问到数据；否则，父组件拿不到子组件的数据。



File: `Child.vue`

```text
<template>
  <div class="child-div">
    <h1>我是Child组件</h1>
    <p>
      username: {{ userInfo.username }}<br/>
      password: {{ userInfo.password }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {defineExpose, reactive, ref} from "vue";

const msg = ref('来自子组件的消息');
const userInfo = reactive({
  username: 'tom',
  password: '123'
});

defineExpose({
  msg, userInfo
});

</script>

<style scoped lang="css">
.child-div {
  width: 300px;
  height: 200px;
  background-color: orange;
  margin: auto;
}
</style>
```

File: `Parent.vue`

```text
<template>
  <div class="parent-div">
    <h1>我是Parent组件</h1>
    <hr/>

    <Child ref="childRef"/>
    <hr/>
    <button @click="handleChildData">获取子组件数据</button>
    <p>
      Data From Child: {{ info }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import Child from './Child.vue';

const childRef = ref();

const info = ref();

const handleChildData = () => {
  console.log(childRef.value.msg);
  console.log(childRef.value.userInfo);
  info.value = childRef.value.msg;
};
</script>

<style scoped lang="css">
.parent-div {
  width: 600px;
  height: 400px;
  background-color: grey;
}
</style>
```


File: `Parent.vue`

File: `Child.vue`


File: `Parent.vue`

File: `Child.vue`

