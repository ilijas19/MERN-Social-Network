import { toast } from "react-toastify";
import { isApiError } from "../../utils/isApiError";
import { useDeleteCommentMutation } from "../../redux/api/commentsApiSlice";
import { IoArrowBack } from "react-icons/io5";

type FormProps = {
  deletingCommentId: string;
  onClose: () => void;
  refetchComments: () => void;
};

const DeleteCommentForm = ({
  deletingCommentId,
  onClose,
  refetchComments,
}: FormProps) => {
  const [deleteCommentApiHandler, { isLoading: deleteCommentLoading }] =
    useDeleteCommentMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await deleteCommentApiHandler(deletingCommentId).unwrap();
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
      <h2 className="text-center text-lg font-semibold">Delete Comment ?</h2>
      <p className="text-gray-300">
        Are you sure that you want to{" "}
        <span className="text-red-600 font-semibold ">DELETE</span> this comment
        ?
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
          disabled={deleteCommentLoading}
          type="submit"
          className="bg-red-700 font-semibold px-3 py-1 rounded-lg cursor-pointer"
        >
          Delete
        </button>
      </div>
    </form>
  );
};
export default DeleteCommentForm;
