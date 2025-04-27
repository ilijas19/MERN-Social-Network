import { UploadRes } from "../../types";
import { UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const uploadApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadRes, FormData>({
      query: (formData) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadApiSlice;
