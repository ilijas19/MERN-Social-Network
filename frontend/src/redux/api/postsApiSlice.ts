import {
  CreatePostArg,
  GetMyPostsRes,
  GetPostsRes,
  GetSavedPostsRes,
  GetUserPostsArg,
  GetUserPostsRes,
  MessageRes,
  Post,
} from "../../types";
import { POST_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation<MessageRes, CreatePostArg>({
      query: (data) => ({
        url: `${POST_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    getMyPosts: builder.query<GetMyPostsRes, { page: number }>({
      query: ({ page = 1 }) => ({
        url: `${POST_URL}?page=${page}`,
      }),
    }),
    getSinglePost: builder.query<Post, string>({
      query: (id) => ({
        url: `${POST_URL}/${id}`,
      }),
    }),
    editPost: builder.mutation<MessageRes, { id: string; text: string }>({
      query: ({ id, text }) => ({
        url: `${POST_URL}/${id}`,
        method: "PATCH",
        body: { text },
      }),
    }),
    deletePost: builder.mutation<MessageRes, string>({
      query: (id) => ({
        url: `${POST_URL}/${id}`,
        method: "DELETE",
      }),
    }),
    saveUnsavePost: builder.mutation<MessageRes, { postId: string }>({
      query: ({ postId }) => ({
        url: `${POST_URL}/save`,
        method: "POST",
        body: { postId },
      }),
    }),
    likeUnlikePost: builder.mutation<MessageRes, { postId: string }>({
      query: ({ postId }) => ({
        url: `${POST_URL}/like`,
        method: "POST",
        body: { postId },
      }),
    }),
    getSavedPosts: builder.query<GetSavedPostsRes, void>({
      query: () => ({
        url: `${POST_URL}/saved`,
      }),
    }),
    getPostLikes: builder.query<GetMyPostsRes, { postId: string }>({
      query: ({ postId }) => ({
        url: `${POST_URL}/likes/${postId}`,
      }),
    }),
    getFollowingUserPosts: builder.query<GetPostsRes, { page: number }>({
      query: ({ page = 1 }) => ({
        url: `${POST_URL}/following?page=${page}`,
      }),
    }),
    getExploreSectionPosts: builder.query<GetPostsRes, { page: number }>({
      query: ({ page = 1 }) => ({
        url: `${POST_URL}/explore?page=${page}`,
      }),
    }),
    getUserPosts: builder.query<GetUserPostsRes, GetUserPostsArg>({
      query: ({ userId, page = 1 }) => ({
        url: `${POST_URL}/posts/${userId}?page=${page}`,
      }),
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetMyPostsQuery,
  useGetSinglePostQuery,
  useEditPostMutation,
  useDeletePostMutation,
  useSaveUnsavePostMutation,
  useLikeUnlikePostMutation,
  useGetSavedPostsQuery,
  useGetPostLikesQuery,
  useGetFollowingUserPostsQuery,
  useGetExploreSectionPostsQuery,
  useGetUserPostsQuery,
} = postsApiSlice;
