import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { convertTo12Hour } from "../../utils/HelperFunctions";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BACKEND_URL + "auth" || "http://localhost:5000/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation({
      query: (c) => ({ url: "/signin", method: "POST", body: c }),
    }),

    signUpCustomer: builder.mutation({
      query: (formData) => {
        const customerData = {
          name: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          address: formData.address,
          zipcode: formData.zipcode,
        };

        return {
          url: "/signup-customer",
          method: "POST",
          body: customerData,
        };
      },
    }),
    signUpSaloonOwner: builder.mutation({
      query: ({ formData, files }) => {
        const startTime = convertTo12Hour(formData.startTime);
        const endTime = convertTo12Hour(formData.endTime);

        const salonOwnerData = {
          name: formData.fullName,
          email: formData.email,
          address: formData.address,
          zipcode: formData.zipcode,
          phoneNumber: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          salonName: formData.saloonName,
          salonAddress: formData.saloonAddress,
          salonZipcode: formData.saloonZipcode,
          phoneNumber: formData.phone,
          startTime: startTime,
          endTime: endTime,
          workingDays: formData.workingDays,
          description: formData.description,
          licenseDocument: "https://pdfobject.com/pdf/sample.pdf",
          profilePic:
            "https://static.wixstatic.com/media/e3c477_ea6d7ddfe1a04ed5b93e47155be95f0a~mv2.png",
          salonPhotos: [
            "https://static.wixstatic.com/media/e3c477_ea6d7ddfe1a04ed5b93e47155be95f0a~mv2.png",
          ],
        };

        return {
          url: "/signup-salonowner",
          method: "POST",
          body: salonOwnerData,
        };
      },
    }),
    getPresignedUrls: builder.mutation({
      query: (files) => ({
        url: "/presigned-urls",
        method: "POST",
        body: { files },
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => {
        return {
          url: "/change-password",
          method: "POST",
          body: data,
        };
      },
    }),
    resetPassword: builder.mutation({
      query: ({ token, ...body }) => ({
        url: `/reset-password/${token}`,
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    logout: builder.mutation({
      query: () => ({ url: "/logout", method: "POST" }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpCustomerMutation,
  useSignUpSaloonOwnerMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useGetPresignedUrlsMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
