import { apiSlice } from "./apiSlice";
import { NOTIFICATION_URL } from "../constants";
import {
  AllNotiRes,
  AllNotiArg,
  GetSingleNotiRes,
  MessageRes,
} from "../../types";

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query<AllNotiRes, AllNotiArg>({
      query: ({ page, type }) => ({
        url: `${NOTIFICATION_URL}?page=${page}&type=${type}`,
      }),
    }),
    getSingleNotification: builder.query<GetSingleNotiRes, string>({
      query: (id) => ({
        url: `${NOTIFICATION_URL}/${id}`,
      }),
    }),
    readAllNotifications: builder.mutation<MessageRes, void>({
      query: () => ({
        url: `${NOTIFICATION_URL}`,
        method: "PATCH",
      }),
    }),
    readSingleNotification: builder.mutation<MessageRes, void>({
      query: (id) => ({
        url: `${NOTIFICATION_URL}/${id}`,
        method: "PATCH",
      }),
    }),
    deleteAllNotification: builder.mutation<MessageRes, void>({
      query: () => ({
        url: `${NOTIFICATION_URL}`,
        method: "DELETE",
      }),
    }),
    deleteSingleNotification: builder.mutation<MessageRes, string>({
      query: (id) => ({
        url: `${NOTIFICATION_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useGetSingleNotificationQuery,
  useReadAllNotificationsMutation,
  useReadSingleNotificationMutation,
  useDeleteAllNotificationMutation,
  useDeleteSingleNotificationMutation,
} = notificationApiSlice;
