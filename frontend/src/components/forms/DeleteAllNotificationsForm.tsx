import { toast } from "react-toastify";
import { useDeleteAllNotificationMutation } from "../../redux/api/notificationsApiSlice";
import { isApiError } from "../../utils/isApiError";

type FormProps = {
  onClose: () => void;
  refetch: () => void;
};

const DeleteAllNotificationsForm = ({ onClose, refetch }: FormProps) => {
  const [deleteAllApiHandler, { isLoading: deleteAllLoading }] =
    useDeleteAllNotificationMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await deleteAllApiHandler().unwrap();
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
      onClick={(e) => e.stopPropagation()}
      onSubmit={handleSubmit}
      className="bg-gray-800 h-fit w-full max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-lg text-center"
    >
      <h2 className="text-xl font-semibold text-white mb-4">
        Confirm Deletion
      </h2>
      <p className="text-gray-300 mb-6">
        Are you absolutely sure you want to{" "}
        <span className="text-red-500 font-bold">DELETE</span> all
        notifications? This action{" "}
        <span className="font-semibold">cannot be undone.</span>
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onClose}
          type="button"
          className="px-5 py-2 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition cursor-pointer"
          disabled={deleteAllLoading}
        >
          {deleteAllLoading ? "Deleting..." : "Delete All"}
        </button>
      </div>
    </form>
  );
};
export default DeleteAllNotificationsForm;
