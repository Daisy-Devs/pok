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
    deleteDocument: builder.mutation({
      query: (docs) => ({
        body: docs,
        url: ENDPOINTS.documents.deleteDocument,
        method: "POST",
      }),
    }),
  }),
});

export const { useUploadCompanyProfileImageMutation, useUploadSupportingNgoDocumentsMutation, useUploadCampaignImagesMutation, useDeleteDocumentMutation } = documentApi;