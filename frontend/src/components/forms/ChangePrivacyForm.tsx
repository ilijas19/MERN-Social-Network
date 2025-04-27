import { useState } from "react";
import { Profile } from "../../types";
import { IoArrowBack } from "react-icons/io5";
import { useChangeProfilePrivacyMutation } from "../../redux/api/profileApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import Loader from "../Loader";

type FormProps = {
  refetch: () => void;
  onClose: () => void;
  profile: Profile | undefined;
};

const ChangePrivacyForm = ({ refetch, onClose, profile }: FormProps) => {
  const [profilePrivacy, setProfilePrivacy] = useState(
    profile?.private ?? false
  );

  const [updatePrivacyApiHandler, { isLoading: updatePrivacyLoading }] =
    useChangeProfilePrivacyMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await updatePrivacyApiHandler({
        privacy: profilePrivacy ?? false,
      }).unwrap();
      toast.success(res.msg);
      refetch();
      onClose();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        console.log(error);

        toast.error("Something went wrong");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className="size-30 bg-gray-800 w-full max-w-[600px] rounded-lg my-2 sm:mt-20   relative sm:h-fit h-full  p-4 flex flex-col"
    >
      <IoArrowBack
        onClick={onClose}
        size={30}
        className="absolute cursor-pointer"
      />
      <h2 className="sm:text-xl text-lg text-center">Change Privacy</h2>
      <div className="flex justify-center mt-6 mb-4 items-center gap-2">
        <p>{profilePrivacy ? "Private" : "Public"}</p>
        <button
          type="button"
          onClick={() => setProfilePrivacy(!profilePrivacy)}
          className={` px-5 py-1  rounded-2xl ${
            profilePrivacy ? "bg-emerald-600" : "bg-gray-700"
          } transition-all duration-300 cursor-pointer`}
        >
          <div
            className={`h-7 w-7 bg-white rounded-full ${
              !profilePrivacy ? "translate-x-[50%]" : "-translate-x-[50%]"
            } transition-all duration-300`}
          ></div>
        </button>
      </div>
      <button
        disabled={updatePrivacyLoading}
        className="bg-emerald-700 font-semibold self-center px-6 py-1 rounded-xl mt-1 cursor-pointer"
      >
        Save
      </button>
      {updatePrivacyLoading && <Loader size="small" />}
    </form>
  );
};
export default ChangePrivacyForm;
