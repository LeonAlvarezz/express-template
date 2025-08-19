import type { AxiosInstance, AxiosResponse } from "axios";

import axios from "axios";
import qs from "qs";

import { FileDownloader } from "./downloader";
import { FileUploader } from "./uploader";
import type { RequestClientConfig, RequestClientOptions } from "./types";
import { isString } from "@/utils";
import { InterceptorManager } from "./interceptor";

function getParamsSerializer(
  paramsSerializer: RequestClientOptions["paramsSerializer"]
) {
  if (isString(paramsSerializer)) {
    switch (paramsSerializer) {
      case "brackets": {
        return (params: any) =>
          qs.stringify(params, { arrayFormat: "brackets" });
      }
      case "comma": {
        return (params: any) => qs.stringify(params, { arrayFormat: "comma" });
      }
      case "indices": {
        return (params: any) =>
          qs.stringify(params, { arrayFormat: "indices" });
      }
      case "repeat": {
        return (params: any) => qs.stringify(params, { arrayFormat: "repeat" });
      }
    }
  }
  return paramsSerializer;
}

class RequestClient {
  public addRequestInterceptor: InterceptorManager["addRequestInterceptor"];

  public addResponseInterceptor: InterceptorManager["addResponseInterceptor"];
  public download: FileDownloader["download"];

  // 是否正在刷新token
  public isRefreshing = false;
  // 刷新token队列
  public refreshTokenQueue: ((token: string) => void)[] = [];
  public upload: FileUploader["upload"];
  private readonly instance: AxiosInstance;

  /**
   * 构造函数，用于创建Axios实例
   * @param options - Axios请求配置，可选
   */
  constructor(options: RequestClientOptions = {}) {
    // 合并默认配置和传入的配置
    const defaultConfig: RequestClientOptions = {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      responseReturn: "raw",
      // 默认超时时间
      timeout: 10_000,
    };
    const { ...axiosConfig } = options;
    const requestConfig = { ...defaultConfig, ...axiosConfig };
    requestConfig.paramsSerializer = getParamsSerializer(
      requestConfig.paramsSerializer
    );

    this.instance = axios.create(requestConfig);

    this.bindMethods(this);

    const interceptorManager = new InterceptorManager(this.instance);
    this.addRequestInterceptor =
      interceptorManager.addRequestInterceptor.bind(interceptorManager);
    this.addResponseInterceptor =
      interceptorManager.addResponseInterceptor.bind(interceptorManager);

    const fileUploader = new FileUploader(this);
    this.upload = fileUploader.upload.bind(fileUploader);
    const fileDownloader = new FileDownloader(this);
    this.download = fileDownloader.download.bind(fileDownloader);
  }

  public delete<T = any>(
    url: string,
    config?: RequestClientConfig
  ): Promise<T> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }

  public get<T = any>(url: string, config?: RequestClientConfig): Promise<T> {
    console.log("url:", url);
    return this.request<T>(url, { ...config, method: "GET" });
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: RequestClientConfig
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: "POST" });
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: RequestClientConfig
  ): Promise<T> {
    return this.request<T>(url, { ...config, data, method: "PUT" });
  }

  public async request<T>(
    url: string,
    config: RequestClientConfig
  ): Promise<T> {
    try {
      // Create the full request config first
      const requestConfig = {
        url,
        ...config,
        ...(config.paramsSerializer
          ? { paramsSerializer: getParamsSerializer(config.paramsSerializer) }
          : {}),
      };

      const response: AxiosResponse<T> = await this.instance(requestConfig);
      return response as T;
    } catch (error: any) {
      throw error.response ? error.response.data : error;
    }
  }

  private bindMethods<T extends object>(instance: T): void {
    const prototype = Object.getPrototypeOf(instance);
    const propertyNames = Object.getOwnPropertyNames(prototype);

    propertyNames.forEach((propertyName) => {
      const descriptor = Object.getOwnPropertyDescriptor(
        prototype,
        propertyName
      );
      const propertyValue = instance[propertyName as keyof T];

      if (
        typeof propertyValue === "function" &&
        propertyName !== "constructor" &&
        descriptor &&
        !descriptor.get &&
        !descriptor.set
      ) {
        instance[propertyName as keyof T] = propertyValue.bind(instance);
      }
    });
  }
}

export { RequestClient };
