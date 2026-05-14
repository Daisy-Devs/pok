import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ['User','Campaign','Campaigns','Donations'],
  baseQuery: axiosBaseQuery,
  endpoints:()=>({}),
})