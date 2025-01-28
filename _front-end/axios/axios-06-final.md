---
title: "axios: 封装"
sequence: "206"
---

```text
import axios, {type AxiosInstance, type AxiosRequestConfig, type AxiosResponse} from 'axios';
import {Result} from './types';
import {useUserStore} from '@/store/modules/user'

class HYRequest {
    private instance: AxiosInstance;

    private readonly options: AxiosRequestConfig;

    constructor(options: AxiosRequestConfig) {
        this.options = options;
        this.instance = axios.create(options);

        this.instance.interceptors.request.use(
            (config) => {
                const token = useUserStore().getToken;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (err) => {
                return err;
            });

        this.instance.interceptors.response.use(
            (res) => {
                // 拦截响应的数据
                if (res.data.code === 0) {
                    return res.data.data;
                }
                return res.data;
            },
            (err) => {
                return err;
            }
        );
    }

    request<T = any>(config: AxiosRequestConfig): Promise<T> {
        return new Promise(
            (resolve, reject) => {
                this.instance.request<any, AxiosResponse<Result<T>>>(config)
                    .then(
                        (res) => {
                            resolve((res as unknown) as Promise<T>);
                        }
                    )
                    .catch(
                        (err) => {
                            reject(err);
                        }
                    );
            }
        );
    }

    get<T = any>(config: AxiosRequestConfig): Promise<T> {
        return this.request({...config, method: 'GET'});
    }

    post<T = any>(config: AxiosRequestConfig): Promise<T> {
        return this.request({...config, method: 'POST'});
    }

    patch<T = any>(config: AxiosRequestConfig): Promise<T> {
        return this.request({...config, method: 'PATCH'});
    }

    delete<T = any>(config: AxiosRequestConfig): Promise<T> {
        return this.request({...config, method: 'DELETE'});
    }
}
```
