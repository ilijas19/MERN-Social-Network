import React from "react";
import { useDeleteReplyMutation } from "../../redux/api/commentsApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";

type FormProps = {
  refetchComments: () => void;
  onClose: () => void;
  deletingReplyId: string;
  replyCommentId: string;
};

const DeleteReplyForm = ({
  refetchComments,
  deletingReplyId,
  onClose,
  replyCommentId,
}: FormProps) => {
  const [deleteReplyApiHandler, { isLoading }] = useDeleteReplyMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await deleteReplyApiHandler({
        commentId: replyCommentId,
        replyId: deletingReplyId,
      }).unwrap();
      toast.success(res.msg);
      refetchComments();
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
      className="bg-gray-800 w-full max-w-[500px] rounded-xl sm:mt-20 p-6 flex flex-col items-center gap-3 shadow-lg h-fit relative"
    >
      <IoArrowBack
        size={25}
        className="absolute top-3 left-3 cursor-pointer"
        onClick={onClose}
      />
      <h2 className="text-center text-lg font-semibold">Delete Reply ?</h2>
      <p className="text-gray-300">
        Are you sure that you want to{" "}
        <span className="text-red-600 font-semibold ">DELETE</span> this reply ?
      </p>
      <div className="flex justify-center gap-3 mt-2">
        <button
          onClick={onClose}
          type="button"
          className="bg-white text-black font-semibold px-3 py-1 rounded-lg cursor-pointer"
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          type="submit"
          className="bg-red-700 font-semibold px-3 py-1 rounded-lg cursor-pointer"
        >
          Delete
        </button>
      </div>
    </form>
  );
};
export default DeleteReplyForm;
