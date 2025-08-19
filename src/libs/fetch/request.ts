/**
 * 该文件可自行根据业务逻辑进行调整
 */

import {
  authenticateResponseInterceptor,
  defaultResponseInterceptor,
} from "./preset-interceptor";
import { RequestClient } from "./modules/request-client";
import type { RequestClientOptions } from "./modules/types";
import { env } from "@/config";

// import { refreshTokenApi } from './core';

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
  });

  // async function doReAuthenticate() {
  // console.warn("Access token or refresh token is invalid or expired. ");
  // if (
  //   preferences.app.loginExpiredMode === "modal" &&
  //   accessStore.isAccessChecked
  // ) {
  //   accessStore.setLoginExpired(true);
  // } else {
  //   await authStore.logout();
  // }
  // }

  // function formatToken(token: null | string) {
  //   return token ? `Bearer ${token}` : null;
  // }

  // client.addRequestInterceptor({
  //   fulfilled: async (config) => {
  //     return config;
  //   },
  // });

  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: "code",
      dataField: "data",
      successCode: 0,
    })
  );

  // client.addResponseInterceptor(
  //   errorMessageResponseInterceptor((msg: string, error) => {
  //     // 这里可以根据业务进行定制,你可以拿到 error 内的信息进行定制化处理，根据不同的 code 做不同的提示，而不是直接使用 message.error 提示 msg
  //     // 当前mock接口返回的错误字段是 error 或者 message
  //     const responseData = error?.response?.data ?? {};
  //     const errorMessage = responseData?.error ?? responseData?.message ?? '';
  //     // 如果没有错误信息，则会根据状态码进行提示
  //     toastError(errorMessage || msg);
  //   }),
  // );

  return client;
}

export const requestClient = createRequestClient(env.API_BASE_URL, {
  responseReturn: "data",
  timeout: 0,
});

export const baseRequestClient = new RequestClient({
  baseURL: env.API_BASE_URL,
});
