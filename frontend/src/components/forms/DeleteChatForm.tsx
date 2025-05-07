import { toast } from "react-toastify";
import { isApiError } from "../../utils/isApiError";
import { useDeleteChatMessagesMutation } from "../../redux/api/chatApiSlice";

type FormProps = {
  onClose: () => void;
  deletingChatId: string;
  refetchChats: () => void;
};

const DeleteChatForm = ({
  onClose,
  deletingChatId,
  refetchChats,
}: FormProps) => {
  const [deleteChatApiHandler, { isLoading: deleteChatLoading }] =
    useDeleteChatMessagesMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await deleteChatApiHandler(deletingChatId).unwrap();
      refetchChats();
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
      className="size-30 bg-gray-800 w-full max-w-[600px] rounded-lg my-2 sm:mt-20   relative sm:h-fit h-full  p-4 flex flex-col gap-3"
    >
      <h2 className="text-center font-semibold text-xl">Delete Chat ?</h2>
      <p className="text-center text-gray-300 ">
        Are you sure that you want to delete this chat all messagess will be{" "}
        <span className="text-red-600 font-semibold">DELETED</span>
      </p>
      <div className="flex justify-center gap-3 mt-2">
        <button
          onClick={onClose}
          type="button"
          className="px-3 py-1 bg-gray-600 rounded-lg font-medium hover:bg-gray-700 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          disabled={deleteChatLoading}
          type="submit"
          className="px-3 py-1 bg-red-600 rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
        >
          Delete
        </button>
      </div>
    </form>
  );
};
export default DeleteChatForm;
