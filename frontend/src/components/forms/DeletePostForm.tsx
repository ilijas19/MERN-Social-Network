import React from "react";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useDeletePostMutation } from "../../redux/api/postsApiSlice";

type FormProps = {
  deletingPostId: string;
  refetch: () => void;
  onClose: () => void;
};

const DeletePostForm = ({ deletingPostId, refetch, onClose }: FormProps) => {
  const [deleteApiHandler, { isLoading }] = useDeletePostMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await deleteApiHandler(deletingPostId).unwrap();
      toast.success(res.msg);
      refetch();
      onClose();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className="bg-gray-800 w-full max-w-[500px] rounded-xl sm:mt-20 p-6 flex flex-col items-center gap-6 shadow-lg h-fit"
    >
      <h2 className="text-center text-2xl font-semibold text-white">
        Are you sure?
      </h2>

      <p className="text-center text-gray-300">
        Are you sure you want to{" "}
        <span className="text-red-500 font-bold">DELETE</span> this post?
      </p>

      <div className="flex gap-4 w-full justify-center">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1 rounded-lg border border-gray-400 text-gray-300 hover:bg-gray-700 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          type="submit"
          className="px-4 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
        >
          Delete
        </button>
      </div>
    </form>
  );
};

export default DeletePostForm;
