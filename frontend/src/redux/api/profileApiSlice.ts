import {
  ChangeProfilePrivacyArg,
  MessageRes,
  Profile,
  UpdatePasswordArgs,
  UpdateProfileArgs,
  UserProfile,
} from "../../types";
import { PROFILE_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<Profile, void>({
      query: () => ({
        url: `${PROFILE_URL}`,
      }),
    }),
    getUserProfile: builder.query<UserProfile, string>({
      query: (username) => ({
        url: `${PROFILE_URL}/${username}`,
      }),
    }),
    deleteProfile: builder.mutation<MessageRes, void>({
      query: () => ({
        url: `${PROFILE_URL}`,
        method: "DELETE",
      }),
    }),
    updateProfile: builder.mutation<MessageRes, UpdateProfileArgs>({
      query: (data) => ({
        url: `${PROFILE_URL}`,
        method: "PATCH",
        body: data,
      }),
    }),
    updatePassword: builder.mutation<MessageRes, UpdatePasswordArgs>({
      query: (data) => ({
        url: `${PROFILE_URL}/updatePassword`,
        method: "PATCH",
        body: data,
      }),
    }),
    changeProfilePrivacy: builder.mutation<MessageRes, ChangeProfilePrivacyArg>(
      {
        query: ({ privacy }) => ({
          url: `${PROFILE_URL}/updatePrivacy`,
          method: "PATCH",
          body: { privacy },
        }),
      }
    ),
  }),
});

export const {
  useGetMyProfileQuery,
  useGetUserProfileQuery,
  useDeleteProfileMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useChangeProfilePrivacyMutation,
} = profileApiSlice;
