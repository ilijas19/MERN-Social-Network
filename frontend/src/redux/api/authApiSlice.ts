import { apiSlice } from "./apiSlice";
import { AUTH_URL } from "../constants";
import {
  CurrentUser,
  LoginArgs,
  LoginRes,
  MessageRes,
  RegisterArgs,
} from "../../types";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<MessageRes, RegisterArgs>({
      query: ({ username, email, password }) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: { username, email, password },
      }),
    }),
    login: builder.mutation<LoginRes, LoginArgs>({
      query: ({ email, password }) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: { email, password },
      }),
    }),
    getCurrentUser: builder.query<{ currentUser: CurrentUser }, void>({
      query: () => ({
        url: `${AUTH_URL}/me`,
      }),
    }),
    logout: builder.mutation<MessageRes, void>({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = authApiSlice;
