import { apiInstance } from "@config/_axios/AxiosConfig";
import { ApiResponse } from "@interfaces/response/common";
import axios, { AxiosError, AxiosResponse } from "axios";

export function AxiosErrorHandler(error: unknown): ApiResponse<any> {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<any>>;

    return {
      success: false,
      message: axiosError.response?.data?.message ||
        axiosError.message ||
        "Axios Error",
      data: axiosError.response?.data?.data || null,
      requestId: axiosError.response!.data?.requestId ,
      timestamp: axiosError.response!.data?.timestamp ,
      version: axiosError.response!.data?.version ,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message,
      data: null,
      requestId: "",
      timestamp: "",
      version: "",
    };
  }

  return {
    success: false,
    message: "Unknown error occurred",
    data: null,
    requestId: "",
    timestamp: "",
    version: "",
  };
}

// Generic API response handler
export function handleApiResponse<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
  if (response.status === 204) { // No Content
    return {
      success: true,
      message: "Success",
      data: null as unknown as T,
      requestId: response.data.requestId,
      timestamp: response.data.timestamp,
      version: response.data.version,
    };
  }

  return {
    ...response.data,
  };
}

// Example typed API call function
export async function getRequest<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await apiInstance.get<ApiResponse<T>>(url);
    return handleApiResponse(response);
  } catch (error) {
    return AxiosErrorHandler(error);
  }
}

export async function postRequest<T, D>(url: string, data: D): Promise<ApiResponse<T>> {
  try {
    const response = await apiInstance.post<ApiResponse<T>>(url, data)
    return handleApiResponse(response)
  } catch (error) {
    return AxiosErrorHandler(error);
  }
}


export async function putRequest<T, D>(url: string, data: D): Promise<ApiResponse<T>> {
  try {
    const response = await apiInstance.put<ApiResponse<T>>(url, data)
    return handleApiResponse(response)
  } catch (error) {
    return AxiosErrorHandler(error);
  }
}

