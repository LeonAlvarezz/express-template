import { isFunction } from "@/utils";
import type { RequestClient } from "./modules/request-client";
import type {
  MakeErrorMessageFn,
  ResponseInterceptorConfig,
} from "./modules/types";

import axios from "axios";
import { DefaultErrorMessage } from "@/core/error";

export const defaultResponseInterceptor = ({
  codeField = "code",
  dataField = "data",
  successCode = 0,
}: {
  codeField: string;
  dataField: ((response: any) => any) | string;
  successCode: ((code: any) => boolean) | number | string;
}): ResponseInterceptorConfig => {
  return {
    fulfilled: (response) => {
      const { config, data: responseData, status } = response;

      if (config.responseReturn === "raw") {
        return response;
      }

      if (status >= 200 && status < 400) {
        if (config.responseReturn === "body") {
          return responseData;
        } else if (
          isFunction(successCode)
            ? successCode(responseData[codeField])
            : responseData[codeField] === successCode
        ) {
          return isFunction(dataField)
            ? dataField(responseData)
            : responseData[dataField];
        }
      }
      throw Object.assign({}, response, { response });
    },
  };
};

export const authenticateResponseInterceptor = ({
  client,
  doReAuthenticate,
  // doRefreshToken,
  enableRefreshToken,
  formatToken,
}: {
  client: RequestClient;
  doReAuthenticate: () => Promise<void>;
  // doRefreshToken: () => Promise<string>;
  enableRefreshToken: boolean;
  formatToken: (token: string) => null | string;
}): ResponseInterceptorConfig => {
  return {
    rejected: async (error) => {
      const { config, response } = error;
      // 如果不是 401 错误，直接抛出异常
      if (response?.status !== 401) {
        throw error;
      }
      // 判断是否启用了 refreshToken 功能
      // 如果没有启用或者已经是重试请求了，直接跳转到重新登录
      if (!enableRefreshToken || config.__isRetryRequest) {
        console.log("error:", error);
        await doReAuthenticate();
        throw error;
      }
      // 如果正在刷新 token，则将请求加入队列，等待刷新完成
      if (client.isRefreshing) {
        return new Promise((resolve) => {
          client.refreshTokenQueue.push((newToken: string) => {
            config.headers.Authorization = formatToken(newToken);
            resolve(client.request(config.url, { ...config }));
          });
        });
      }

      client.isRefreshing = true;
      config.__isRetryRequest = true;

      // try {
      //   const newToken = await doRefreshToken();

      //   // 处理队列中的请求
      //   client.refreshTokenQueue.forEach((callback) => callback(newToken));
      //   // 清空队列
      //   client.refreshTokenQueue = [];

      //   return client.request(error.config.url, { ...error.config });
      // } catch (refreshError) {
      //   // 如果刷新 token 失败，处理错误（如强制登出或跳转登录页面）
      //   client.refreshTokenQueue.forEach((callback) => callback(''));
      //   client.refreshTokenQueue = [];
      //   console.error('Refresh token failed, please login again.');
      //   await doReAuthenticate();

      //   throw refreshError;
      // } finally {
      //   client.isRefreshing = false;
      // }
    },
  };
};

export const errorMessageResponseInterceptor = (
  makeErrorMessage?: MakeErrorMessageFn
): ResponseInterceptorConfig => {
  return {
    rejected: (error: any) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      }

      const err: string = error?.toString?.() ?? "";
      let errMsg = "";
      if (err?.includes("Network Error")) {
        errMsg = DefaultErrorMessage.NETWORK_ERROR;
      } else if (error?.message?.includes?.("timeout")) {
        errMsg = DefaultErrorMessage.REQUEST_TIMEOUT;
      }
      if (errMsg) {
        makeErrorMessage?.(errMsg, error);
        return Promise.reject(error);
      }

      let errorMessage = "";
      const status = error?.response?.status;

      switch (status) {
        case 400: {
          errorMessage = DefaultErrorMessage.BAD_REQUEST;
          break;
        }
        case 401: {
          errorMessage = DefaultErrorMessage.UNAUTHORIZED;
          break;
        }
        case 403: {
          errorMessage = DefaultErrorMessage.FORBIDDEN;
          break;
        }
        case 404: {
          errorMessage = DefaultErrorMessage.NOT_FOUND;
          break;
        }
        case 408: {
          errorMessage = DefaultErrorMessage.REQUEST_TIMEOUT;
          break;
        }
        default: {
          errorMessage = DefaultErrorMessage.INTERNAL_SERVER;
        }
      }
      makeErrorMessage?.(errorMessage, error);
      return Promise.reject(error);
    },
  };
};
