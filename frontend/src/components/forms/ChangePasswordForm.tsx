import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useUpdatePasswordMutation } from "../../redux/api/profileApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";

type FormProps = {
  onClose: () => void;
};

const ChangePasswordForm = ({ onClose }: FormProps) => {
  const [formProps, setFormProps] = useState({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const [changePasswordApiHandler, { isLoading }] = useUpdatePasswordMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await changePasswordApiHandler({ ...formProps }).unwrap();
      toast.success(res.msg);
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
      className="size-30 bg-gray-800 w-full max-w-[600px] rounded-lg my-2 sm:mt-20   relative sm:h-fit h-full  p-4 flex flex-col gap-0.5"
    >
      <IoArrowBack
        onClick={onClose}
        size={24}
        className="absolute cursor-pointer"
      />
      <h2 className="text-center sm:text-xl text-lg mb-3">Change Password</h2>
      <label>Current Password</label>
      <input
        value={formProps.currentPassword}
        onChange={(e) =>
          setFormProps({ ...formProps, currentPassword: e.target.value })
        }
        type="password"
        className="border border-gray-600 rounded-lg px-3 py-1 mb-1.5 outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
      />
      <label>New Password</label>
      <input
        value={formProps.newPassword}
        onChange={(e) =>
          setFormProps({ ...formProps, newPassword: e.target.value })
        }
        type="password"
        className="border border-gray-600 rounded-lg px-3 py-1 mb-1.5 outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
      />
      <label>Repeat Password</label>
      <input
        value={formProps.repeatPassword}
        onChange={(e) =>
          setFormProps({ ...formProps, repeatPassword: e.target.value })
        }
        type="password"
        className="border border-gray-600 rounded-lg px-3 py-1 mb-1.5 outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
      />
      <button
        disabled={isLoading}
        className="bg-emerald-700 font-semibold py-1 rounded-xl mt-2 cursor-pointer"
      >
        Change Password
      </button>
    </form>
  );
};
export default ChangePasswordForm;
