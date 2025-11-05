// // src/store/api/authApi.js
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const authApi = createApi({
//   reducerPath: 'authApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://localhost:5000/api/common',
//     credentials: 'include',
//   }),
//   endpoints: (builder) => ({
//     signIn: builder.mutation({
//       query: (credentials) => ({
//         url: '/signin',
//         method: 'POST',
//         body: credentials,
//       }),
//     }),
//     signUpCustomer: builder.mutation({
//       query: (data) => ({
//         url: '/signup/customer',
//         method: 'POST',
//         body: data,
//       }),
//     }),
//     signUpSaloonOwner: builder.mutation({
//       query: ({ formData, files }) => {
//         const body = new FormData();
//         Object.keys(formData).forEach(key => {
//           if (key === 'workingDays') {
//             body.append(key, JSON.stringify(formData[key]));
//           } else {
//             body.append(key, formData[key]);
//           }
//         });
//         files.licenseDocument && body.append('licenseDocument', files.licenseDocument[0]);
//         files.profilePic && body.append('profilePic', files.profilePic[0]);
//         files.saloonPhotos?.forEach(file => body.append('saloonPhotos', file));

//         return {
//           url: '/signup/saloonowner',
//           method: 'POST',
//           body,
//         };
//       },
//     }),
//   }),
// });

// export const {
//   useSignInMutation,
//   useSignUpCustomerMutation,
//   useSignUpSaloonOwnerMutation,
// } = authApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/common',
    credentials: 'include',              
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation({ query: (c) => ({ url: '/signin', method: 'POST', body: c }) }),
    signUpCustomer: builder.mutation({ query: (d) => ({ url: '/signup/customer', method: 'POST', body: d }) }),
    signUpSaloonOwner: builder.mutation({
      query: ({ formData, files }) => {
        const body = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
          if (k === 'workingDays') body.append(k, JSON.stringify(v));
          else body.append(k, v);
        });
        files.licenseDocument?.[0] && body.append('licenseDocument', files.licenseDocument[0]);
        files.profilePic?.[0] && body.append('profilePic', files.profilePic[0]);
        files.saloonPhotos?.forEach(f => body.append('saloonPhotos', f));
        return { url: '/signup/saloonowner', method: 'POST', body };
      },
    }),

    getMe: builder.query({ query: () => '/me' }),
    logout: builder.mutation({ query: () => ({ url: '/logout', method: 'POST' }) }),
  }),
});

export const {
  useSignInMutation,
  useSignUpCustomerMutation,
  useSignUpSaloonOwnerMutation,
  useGetMeQuery,
  useLogoutMutation
} = authApi;