// types/response.types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
  message: string;
}

export interface ErrorResponse extends ApiResponse {
  success: false;
  data: null;
  message: string;
}

// Extend Express Response type
declare global {
  namespace Express {
    interface Response {
      success: <T = any>(
        data?: T,
        message?: string,
        statusCode?: number
      ) => Response;

      simpleSuccess: <T = any>(
        message?: string,
        statusCode?: number
      ) => Response;

      error: (message?: string, statusCode?: number, data?: any) => Response;
    }
  }
}
