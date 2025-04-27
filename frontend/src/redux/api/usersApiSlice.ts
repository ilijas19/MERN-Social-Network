import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";
import {
  FolUnfArgs,
  GetFollowersRes,
  GetFollowingRes,
  GetFollowRequestsRes,
  MessageRes,
} from "../../types";

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
    followUnfollowUser: builder.mutation<MessageRes, FolUnfArgs>({
      query: ({ userId }) => ({
        url: `${USERS_URL}/followUnfollow`,
        method: "POST",
        body: { userId },
      }),
    }),
    getFollowRequests: builder.query<GetFollowRequestsRes, void>({
      query: () => ({
        url: `${USERS_URL}/requests`,
      }),
    }),
    acceptFollowRequest: builder.mutation<MessageRes, { userId: string }>({
      query: ({ userId }) => ({
        url: `${USERS_URL}/accept`,
        method: "POST",
        body: { userId },
      }),
    }),
    declineFollowRequest: builder.mutation<MessageRes, { userId: string }>({
      query: ({ userId }) => ({
        url: `${USERS_URL}/decline`,
        method: "DELETE",
        body: { userId },
      }),
    }),
    removeFollower: builder.mutation<MessageRes, { userId: string }>({
      query: ({ userId }) => ({
        url: `${USERS_URL}/removeFollower`,
        method: "POST",
        body: { userId },
      }),
    }),
    //todo: type this query
    searchForUser: builder.query({
      query: ({ username, page = 1 }) => ({
        url: `${USERS_URL}/search?username=${username}&page=${page}`,
      }),
    }),
  }),
});

export const {
  useGetFollowerListQuery,
  useGetFollowingListQuery,
  useFollowUnfollowUserMutation,
  useGetFollowRequestsQuery,
  useAcceptFollowRequestMutation,
  useDeclineFollowRequestMutation,
  useRemoveFollowerMutation,
  useSearchForUserQuery,
} = usersApiSlice;
