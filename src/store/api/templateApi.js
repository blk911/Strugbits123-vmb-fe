import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const templateApi = createApi({
  reducerPath: "templateApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL + "template" || "http://localhost:5000/template",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user?.token || localStorage.getItem("auth_token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Template", "SalonTemplates"],
  endpoints: (builder) => ({
    getTemplates: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) => ({
        url: "/get-templates",
        params: { page, limit, search },
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
        url: salonId ? `/get-assigned-templates/${salonId}` : "/get-assigned-templates",
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
