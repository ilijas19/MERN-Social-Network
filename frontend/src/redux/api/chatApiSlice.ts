import { apiSlice } from "./apiSlice";
import { CHAT_URL } from "../constants";
import {
  AllChatsRes,
  ChatMessagesArg,
  ChatMessagesRes,
  CreateChatRes,
  MessageRes,
  SendMessageArg,
  SendMessagesRes,
} from "../../types";

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation<CreateChatRes, string>({
      query: (userId) => ({
        url: `${CHAT_URL}`,
        method: "POST",
        body: { userId },
      }),
    }),
    getAllChats: builder.query<AllChatsRes, void>({
      query: () => ({
        url: `${CHAT_URL}`,
      }),
    }),
    getChatMessages: builder.query<ChatMessagesRes, ChatMessagesArg>({
      query: ({ chatId, page = 1 }) => ({
        url: `${CHAT_URL}/${chatId}?page=${page}`,
      }),
    }),
    deleteChatMessages: builder.mutation<MessageRes, string>({
      query: (chatId) => ({
        url: `${CHAT_URL}/${chatId}`,
        method: "DELETE",
      }),
    }),
    sendMessage: builder.mutation<SendMessagesRes, SendMessageArg>({
      query: ({ chatId, text }) => ({
        url: `${CHAT_URL}/message`,
        method: "POST",
        body: { chatId, text },
      }),
    }),
  }),
});

export const {
  useCreateChatMutation,
  useGetAllChatsQuery,
  useGetChatMessagesQuery,
  useDeleteChatMessagesMutation,
  useSendMessageMutation,
} = chatApiSlice;
