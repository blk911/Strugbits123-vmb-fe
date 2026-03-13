import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_BACKEND_URL + "appointment" ||
      "http://localhost:5000/",
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
  tagTypes: ["Appointment"],
  endpoints: (builder) => ({
    createAppointment: builder.mutation({
      query: (data) => ({
        url: "/create-appointment",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointment"],
    }),
    getUserAppointments: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sort = "newest",
        search = "",
        status = "",
      } = {}) => ({
        url: "/get-user-appointment",
        params: { page, limit, sort, search, status },
      }),
      providesTags: ["Appointment"],
    }),

    getSalonAppointments: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sort = "newest",
        search = "",
        status = "",
      } = {}) => ({
        url: "/get-salon-appointment",
        params: { page, limit, sort, search, status },
      }),
      providesTags: ["Appointment"],
    }),
    scheduleAppointment: builder.mutation({
      query: ({ id, data }) => ({
        url: `/schedule-appointment/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Appointment"],
    }),

    requestAppointmentRescheduling: builder.mutation({
      query: ({ id, data }) => ({
        url: `/request-appointment-reschedule/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Appointment"],
    }),

    holdAppointment: builder.mutation({
      query: (id) => ({
        url: `/hold-appointment/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Appointment"],
    }),
    declineAppointment: builder.mutation({
      query: (id) => ({
        url: `/decline-appointment/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Appointment"],
    }),

    confirmAppointment: builder.mutation({
      query: (id) => ({
        url: `/confirm-appointment/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Appointment"],
    }),

    getAdminAppointments: builder.query({
      query: ({
        page = 1,
        limit = 10,
        sort = "newest",
        search = "",
        status = "",
      } = {}) => ({
        url: "/get-admin-appointment",
        params: { page, limit, sort, search, status },
      }),
      providesTags: ["Appointment"],
    }),
  }),
});

export const {
  useGetUserAppointmentsQuery,
  useGetSalonAppointmentsQuery,
  useScheduleAppointmentMutation,
  useRequestAppointmentReschedulingMutation,
  useHoldAppointmentMutation,
  useDeclineAppointmentMutation,
  useConfirmAppointmentMutation,
  useCreateAppointmentMutation,
  useGetAdminAppointmentsQuery,
} = appointmentApi;
