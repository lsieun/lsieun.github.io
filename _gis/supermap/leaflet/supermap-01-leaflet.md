---
title: "SuperMap: Leaflet"
sequence: "121"
---

- Leaflet
- SuperMap iClient for Leaflet

## 初始化Vue3项目

```text
npm init vue
```

```text
npm install --verbose
npm run dev
```

## 安装iClient for Leaflet

```text
npm install @supermap/iclient-leaflet --verbose
```

安装完成之后，在`node_modules`目录下会有`@supermap/iclient-leaflet`和`leaflet`子目录。

### 引入CSS文件

在`main.ts`文件中引入`leaflet`和`iclient-leaflet`相关的CSS文件：

```text
import 'leaflet/dist/leaflet.css'
import '@supermap/iclient-leaflet/dist/iclient-leaflet.css'
```

完整的`main.ts`文件：

```text
import { createApp } from 'vue';
import App from './App.vue';

import './assets/main.css';
import 'leaflet/dist/leaflet.css';
import '@supermap/iclient-leaflet/dist/iclient-leaflet.css';

createApp(App).mount('#app');
```

### 引入JS调用地图

在`App.vue`文件中，添加如下内容：

```text
import {nextTick} from 'vue';
import L from 'leaflet';
import {TiledMapLayer} from '@supermap/iclient-leaflet';

nextTick(() => {
  console.log('nextTick');
  const url = "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World";
  const map = L.map('map', {
    crs: L.CRS.EPSG4326,
    center: [0, 0],
    maxZoom: 18,
    zoom: 1
  });

  const layer = new TiledMapLayer(url);
  layer.addTo(map);
});
```

完整的`App.vue`文件如下：

```text
<template>
  <div>
    <h1>Hello 你好</h1>
    <div id="map" style="width: 800px;height:600px;border: 1px solid green"></div>
  </div>
</template>

<script setup lang="ts">
import {nextTick} from 'vue';
import L from 'leaflet';
import {TiledMapLayer} from '@supermap/iclient-leaflet';

nextTick(() => {
  console.log('nextTick');
  const url = "https://iserver.supermap.io/iserver/services/map-world/rest/maps/World";
  const map = L.map('map', {
    crs: L.CRS.EPSG4326,
    center: [0, 0],
    maxZoom: 18,
    zoom: 1
  });

  const layer = new TiledMapLayer(url);
  layer.addTo(map);
});
</script>

<style scoped>
</style>
```

### 遇到错误

使用`npm run dev`命令之后，查看浏览器的Console出现如下错误信息：

```text
Uncaught TypeError: utils2.inherits is not a function
```

解决方法：

第一步，在`package.json`文件中的`devDependencies`部分增加如下内容：

```text
"events": "^3.3.0",
"util": "^0.12.4",
```

配置成功后，执行`npm install`

或者执行以下命令：

```text
npm install events -D
npm install util -D
```

第二步，在`vite.config.js`中增加`define`配置：

```text
export default defineConfig({
    // ...
    define: {
        'process.env': {}
    }
});
```

完整的`vite.config.js`文件如下：

```text
import {fileURLToPath, URL} from 'node:url';

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    define: {
        'process.env': {}
    }
});
```

## leaflet的问题

在`App.vue`中，引入`leaflet`：

```text
import L from 'leaflet';
```

会提示以下信息：

```text
TS7016: Could not find a declaration file for module 'leaflet'.
```

解决方法：

```text
npm install @types/leaflet -D
```

安装完成之后，并不能立即生效，重新打开一下项目就可以了。

## Reference

- [Preparing your page](https://iclient.supermap.io/en/web/introduction/leafletDevelop.html#Ready)
- [Vue 3 + Vite + SuerMap iClient构建报错Uncaught TypeError utils.inherits is not a function](https://blog.csdn.net/zhang90522/article/details/123556156)
