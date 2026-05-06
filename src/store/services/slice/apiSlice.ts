import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ['User','Campaign','Campaigns'],
  baseQuery: axiosBaseQuery,
  endpoints:()=>({}),
})