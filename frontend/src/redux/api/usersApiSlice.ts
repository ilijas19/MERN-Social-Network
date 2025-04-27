import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
import { GetFollowersRes, GetFollowingRes } from "../../types";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFollowerList: builder.query<GetFollowersRes, string>({
      query: (username) => ({
        url: `${USERS_URL}/followers?username=${username}`,
      }),
    }),
    getFollowingList: builder.query<GetFollowingRes, string>({
      query: (username) => ({
        url: `${USERS_URL}/following?username=${username}`,
      }),
    }),
  }),
});

export const { useGetFollowerListQuery, useGetFollowingListQuery } =
  usersApiSlice;
