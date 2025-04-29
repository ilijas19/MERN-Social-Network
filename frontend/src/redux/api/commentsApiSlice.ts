import {
  CreateCommentArgs,
  CreateReplyArgs,
  CreateReplyRes,
  DeleteReplyArgs,
  EditCommentType,
  GetPostCommentsRes,
  MessageRes,
} from "../../types";
import { COMMENT_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createComment: builder.mutation<MessageRes, CreateCommentArgs>({
      query: ({ text, postId }) => ({
        url: `${COMMENT_URL}`,
        method: "POST",
        body: { text, postId },
      }),
    }),
    deleteComment: builder.mutation<MessageRes, string>({
      query: (postId) => ({
        url: `${COMMENT_URL}/${postId}`,
        method: "DELETE",
      }),
    }),
    editComent: builder.mutation<MessageRes, EditCommentType>({
      query: ({ postId, text }) => ({
        url: `${COMMENT_URL}/${postId}`,
        method: "PATCH",
        body: { text },
      }),
    }),
    getPostComments: builder.query<GetPostCommentsRes, string>({
      query: (postId) => ({
        url: `${COMMENT_URL}/postComments/${postId}`,
      }),
    }),
    createReply: builder.mutation<CreateReplyRes, CreateReplyArgs>({
      query: ({ commentId, text }) => ({
        url: `${COMMENT_URL}/reply/${commentId}`,
        method: "POST",
        body: { text },
      }),
    }),
    deleteReply: builder.mutation<MessageRes, DeleteReplyArgs>({
      query: ({ commentId, replyId }) => ({
        url: `${COMMENT_URL}/reply`,
        method: "DELETE",
        body: { commentId, replyId },
      }),
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useEditComentMutation,
  useGetPostCommentsQuery,
  useCreateReplyMutation,
  useDeleteReplyMutation,
} = commentApiSlice;
