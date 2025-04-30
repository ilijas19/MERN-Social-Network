import { toast } from "react-toastify";
import { useLogoutMutation } from "../../redux/api/authApiSlice";
import { useDeleteProfileMutation } from "../../redux/api/profileApiSlice";
import { isApiError } from "../../utils/isApiError";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/features/auth/authSlice";
import { apiSlice } from "../../redux/api/apiSlice";
import { useNavigate } from "react-router-dom";

const DeleteProfileForm = () => {
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiHandler] = useLogoutMutation();
  const [deleteProfileApiHandler, { isLoading: deleteProfileLoading }] =
    useDeleteProfileMutation();

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await deleteProfileApiHandler({ password }).unwrap();
      toast.success(res.msg);

      const res2 = await logoutApiHandler().unwrap();
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      toast.success(res2.msg);
      navigate("/login");
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
      onSubmit={handleDelete}
      onClick={(e) => e.stopPropagation()}
      className="bg-gray-800 w-full max-w-[600px] rounded-lg my-2 sm:mt-20 p-6 flex flex-col gap-4 h-fit"
    >
      <h2 className="text-xl text-red-500 font-semibold">
        Delete Your Profile
      </h2>
      <p className="text-sm text-gray-300">
        Warning: This action is irreversible. All your data (posts, followers,
        likes) will be permanently deleted.
      </p>

      <label className="text-gray-200 text-sm font-medium">
        Confirm Password
        <input
          type="password"
          required
          className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button
        type="submit"
        disabled={deleteProfileLoading}
        className={`bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-all ${
          deleteProfileLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {deleteProfileLoading ? "Deleting..." : "Delete Profile"}
      </button>
    </form>
  );
};

export default DeleteProfileForm;
