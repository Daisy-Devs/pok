import { ENDPOINTS } from "@/src/lib/api/endpoints";
import { apiSlice } from "../slice/apiSlice";

export const documentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadCompanyProfileImage: builder.mutation({
              query: (docs:FormData) => ({
                url: ENDPOINTS.documents.uploadCompanyProfileImage,
                method: "POST",
                body: docs,
                formData:true
              }),
    }),
    uploadSupportingNgoDocuments: builder.mutation({
              query: (docs:FormData) => ({
                url: ENDPOINTS.documents.uploadSupportingNgoDocuments,
                method: "POST",
                body: docs,
                formData:true
              }),
    }),
    uploadCampaignImages: builder.mutation({
              query: (docs:FormData) => ({
                url: ENDPOINTS.documents.uploadCampaignImages,
                method: "POST",
                body: docs,
                formData:true
              }),
    }),

  }),
});

export const { useUploadCompanyProfileImageMutation, useUploadSupportingNgoDocumentsMutation, useUploadCampaignImagesMutation } = documentApi;