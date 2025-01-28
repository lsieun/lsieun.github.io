---
title: "Vue3 + Apache SkyWalking Client JS"
sequence: "102"
---

NOTICE, **SkyWalking Client JS `0.8.0`** and later versions require **SkyWalking `v9`**.

## 准备 Vue3 环境

### 查看 NPM 版本

```text
> npm -v
8.11.0
```

### 搭建环境

```text
# npm 6.x
npm create vite@latest skywalking-vue3-client --template vue

# npm 7+, extra double-dash is needed:
npm create vite@latest skywalking-vue3-client -- --template vue
```

```text
cd skywalking-vue3-client
npm install
npm run dev
```

### 安装 Axios

```text
npm install axios --save
```

### 修改 App.vue

修改 `src/App.vue` 文件：

```vue
<script setup lang="ts">
import axios, {AxiosResponse} from 'axios';
import {ref} from "vue";
import ClientMonitor from 'skywalking-client-js';

const result = ref({});

const printResponse = (response: AxiosResponse<any, any>) => {
    let status = response.status;
    let statusText = response.statusText;
    let headers = response.headers;
    let data = response.data;

    console.log('status = ', status);
    console.log('statusText = ', statusText);
    console.log('headers = ', headers);
    console.log('data = ', data);

    result.value = response.data;
};

const doGet = (url: String) => {
    axios.get(url)
        .then(function (response) {
            printResponse(response);
        });
}

const doNotify = () => {
    axios.post('http://localhost/msg/alert/notify',
        [{
            "scopeId": 1,
            "scope": "SERVICE",
            "name": "serviceA",
            "id0": "12",
            "id1": "",
            "ruleName": "service_resp_time_rule",
            "alarmMessage": "alarmMessage xxxx",
            "startTime": 1560524171000,
            "tags": [{
                "key": "level",
                "value": "WARNING"
            }]
        }, {
            "scopeId": 1,
            "scope": "SERVICE",
            "name": "serviceB",
            "id0": "23",
            "id1": "",
            "ruleName": "service_resp_time_rule",
            "alarmMessage": "alarmMessage yyy",
            "startTime": 1560524171000,
            "tags": [{
                "key": "level",
                "value": "CRITICAL"
            }]
        }]
    ).then(function (response) {
        printResponse(response);
    });
}

// Report collected data to `http:// + window.location.host + /browser/perfData` in default
// Use core/default/restPort in the OAP server.
// If External Communication Channels are activated, `receiver-sharing-server/default/restPort`,
// ref to https://skywalking.apache.org/docs/main/latest/en/setup/backend/backend-expose/
ClientMonitor.register({
    collector: 'http://127.0.0.1',
    service: 'browser-vue3-app',
    pagePath: '/current/page/name',
    serviceVersion: 'v1.0.0',
});
</script>

<template>
    <div>
        <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo"/>
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" class="logo vue" alt="Vue logo"/>
        </a>
    </div>
    <div>
        <table>
            <tr>
                <th>类别</th>
                <th>请求</th>
            </tr>
            <tr>
                <td>Hello World</td>
                <td>
                    <button @click="doGet('http://localhost/account/hello/world')">Account</button>
                    <button @click="doGet('http://localhost/auth/hello/world')">Auth</button>
                    <button @click="doGet('http://localhost/money/hello/world')">Money</button>
                    <button @click="doGet('http://localhost/msg/hello/world')">Msg</button>
                </td>
            </tr>
            <tr>
                <td>H2/Redis</td>
                <td>
                    <button @click="doGet('http://localhost/account/users/1')">用户 1</button>
                    <button @click="doGet('http://localhost/account/users/2')">用户 2</button>
                    <button @click="doGet('http://localhost/account/users/3')">用户 3</button>
                </td>
            </tr>
            <tr>
                <td>RestTemplate</td>
                <td>
                    <button @click="doGet('http://localhost/money/hello/auth-world')">Money --&gt; Auth</button>
                </td>
            </tr>
            <tr>
                <td>MQ</td>
                <td>
                    <button @click="doGet('http://localhost/money/hello/send?message=hello-activemq')">ActiveMQ</button>
                </td>
            </tr>
            <tr>
                <td>告警超时</td>
                <td>
                    <button @click="doGet('http://localhost/money/hello/alarm')">超时请求</button>
                    <button @click="doNotify">WebHook</button>
                </td>
            </tr>
            <tr>
                <td>结果</td>
                <td><p>{{ result }}</p></td>
            </tr>
        </table>
    </div>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}

table {
    border-collapse: collapse;
}

table, td, th {
    border: 1px solid black;
}
</style>
```

## Apache SkyWalking Client JS

The `skywalking-client-js` runtime library is available at `npm`:

```text
npm install skywalking-client-js --save
```

We could use `register` method to load and report **data automatically**.

```vue
import ClientMonitor from 'skywalking-client-js';
```

- `collector`:
    - In default, the collected data would be reported to current domain(`/browser/perfData`).
    - Then, typically, we recommend you use a Gateway/proxy to redirect the data to the OAP(`resthost:restport`).
    - If you set this, the data could be reported to another domain,
    - NOTE the Cross-Origin Resource Sharing (CORS) issuse and solution.

### 使用 Gateway 进行 Proxy

第一种方式，使用 Spring Cloud Gateway 来进行处理。这里将 `collector` 指向 Gateway 地址（`http://127.0.0.1`）。

```vue
// Report collected data to `http:// + window.location.host + /browser/perfData` in default
// Use core/default/restPort in the OAP server.
// If External Communication Channels are activated, `receiver-sharing-server/default/restPort`,
// ref to https://skywalking.apache.org/docs/main/latest/en/setup/backend/backend-expose/
ClientMonitor.register({
  collector: 'http://127.0.0.1',
  service: 'browser-vue3-app',
  pagePath: '/current/page/name',
  serviceVersion: 'v1.0.0',
});
```

### 配置 vite.config.js

第二种方式，通过修改 Vue3 的配置文件（`vite.config.js`）。这里就省略了 `collector` 参数的配置。

```vue
// Report collected data to `http:// + window.location.host + /browser/perfData` in default
// Use core/default/restPort in the OAP server.
// If External Communication Channels are activated, `receiver-sharing-server/default/restPort`,
// ref to https://skywalking.apache.org/docs/main/latest/en/setup/backend/backend-expose/
ClientMonitor.register({
  service: 'browser-vue3-app',
  pagePath: '/current/page/name',
  serviceVersion: 'v1.0.0',
});
```

```typescript
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        proxy: {
            '/browser': 'http://192.168.80.130:12800',
            '/v3': 'http://192.168.80.130:12800',
        }
    }
})
```

## SkyWalking NodeJS Agent


```text
npm install --save skywalking-backend-js
```

- [SkyWalking NodeJS Agent](https://www.npmjs.com/package/skywalking-backend-js)

## Reference

- [Apache SkyWalking Client JS](https://www.npmjs.com/package/skywalking-client-js)
- [skywalking-client-js 前端监控实现分析](https://juejin.cn/post/7024424803469623333)
