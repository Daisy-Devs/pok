import client from "@/src/lib/api/client";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosRequestConfig, AxiosError } from "axios";

export const axiosBaseQuery: BaseQueryFn<
  {
    url: string;
    method?: AxiosRequestConfig["method"];
    body?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
    headers?: AxiosRequestConfig["headers"];
  },
  unknown,
  unknown
> = async ({ url, method = "GET", body, params, headers }) => {
  try {
    const result = await client({
      url,
      method,
      data: body,
      params,
      headers,
    });
    return { data: result }; // client already returns response.data
  } catch (error) {
    const err = error as AxiosError;
    return {
      error: {
        status: err.response?.status,
        data: err.response?.data || err.message,
      },
    };
  }
};