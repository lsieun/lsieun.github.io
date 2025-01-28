---
title: "Element Plus"
sequence: "101"
---

## 安装

```text
# NPM
$ npm install element-plus --save

# Yarn
$ yarn add element-plus

# pnpm
$ pnpm install element-plus
```

## 引入

File: `main.ts`

```text
import {createApp} from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';

import './assets/main.css';

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');
```
