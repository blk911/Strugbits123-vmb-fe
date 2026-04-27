import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { buildApiBaseUrl } from "./baseUrl";

export const templateApi = createApi({
  reducerPath: "templateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: buildApiBaseUrl("template"),
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token =
        getState().user?.token || localStorage.getItem("auth_token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Template", "SalonTemplates"],
  endpoints: (builder) => ({
    getTemplates: builder.query({
      query: ({ page = 1, limit = 12, search = "", sort = "Newest" } = {}) => ({
        url: "/get-templates",
        params: { page, limit, search, sort },
      }),
      providesTags: ["Template"],
    }),
    createTemplate: builder.mutation({
      query: (data) => ({
        url: "/create-template",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Template"],
    }),
    updateTemplate: builder.mutation({
      query: ({ templateId, ...data }) => ({
        url: `/update-template/${templateId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Template"],
    }),
    deleteTemplate: builder.mutation({
      query: (templateId) => ({
        url: `/delete-template/${templateId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Template"],
    }),
    assignTemplates: builder.mutation({
      query: ({ salonId, templateIds }) => ({
        url: `/assign-templates/${salonId}`,
        method: "POST",
        body: { templateIds },
      }),
      invalidatesTags: ["SalonTemplates"],
    }),
    getSalonAssignedTemplates: builder.query({
      query: (salonId) => ({
        url:
          salonId ?
            `/get-assigned-templates/${salonId}`
          : "/get-assigned-templates",
      }),
      providesTags: ["SalonTemplates"],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  useAssignTemplatesMutation,
  useGetSalonAssignedTemplatesQuery,
} = templateApi;
