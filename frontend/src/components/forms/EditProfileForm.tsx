import { IoArrowBackOutline } from "react-icons/io5";
import { Profile } from "../../types";
import { IoMdImage } from "react-icons/io";
import { PROFILE_PICTURE_URL } from "../../redux/constants";
import { useState } from "react";
import { useUploadImageMutation } from "../../redux/api/uploadApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useUpdateProfileMutation } from "../../redux/api/profileApiSlice";
type FormProps = {
  onClose: () => void;
  profile: Profile | undefined;
  refetch: () => void;
};

const EditProfileForm = ({ profile, onClose, refetch }: FormProps) => {
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(profile?.coverPhoto);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(
    profile?.profilePicture
  );
  const [username, setUsername] = useState(profile?.username);
  const [bio, setBio] = useState(profile?.bio);

  const [uploadingPicture, setUploadingPicture] = useState<"cover" | "profile">(
    "profile"
  );
  const [uploadApiHandler, { isLoading: uploadLoading }] =
    useUploadImageMutation();

  const [editProfileApiHandler, { isLoading: editLoading }] =
    useUpdateProfileMutation();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        const res = await uploadApiHandler(formData).unwrap();
        toast.success(res.msg);
        if (uploadingPicture === "cover") {
          setCoverPhotoUrl(res.url);
        }
        if (uploadingPicture === "profile") {
          setProfilePhotoUrl(res.url);
        }
      }
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await editProfileApiHandler({
        username,
        bio,
        coverPhoto: coverPhotoUrl,
        profilePicture: profilePhotoUrl,
      }).unwrap();
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
      onSubmit={handleSave}
      onClick={(e) => e.stopPropagation()}
      className="size-30 bg-gray-900 w-full max-w-[600px] rounded-lg my-2 sm:mt-20   relative sm:h-fit h-full overflow-y-scroll custom-scrollbar"
    >
      <IoArrowBackOutline
        onClick={onClose}
        size={24}
        className="absolute top-3 left-3 cursor-pointer"
      />
      <h2 className="text-center my-2 font-semibold sm:text-xl text-lg ">
        Edit Profile
      </h2>
      {/* cover photo */}
      <div className="relative">
        <img
          src={coverPhotoUrl !== "" ? coverPhotoUrl : undefined}
          alt=""
          className="bg-gray-800 w-full h-50 object-cover"
        />
        <div
          // style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          className="absolute  top-[50%] right-[50%] -translate-y-[50%] translate-x-[50%] p-2 rounded-full z-50 bg-black"
        >
          <label htmlFor="fileUpload" className="">
            <IoMdImage size={32} className="cursor-pointer  rounded-full" />
          </label>
          <input
            disabled={uploadLoading}
            onClick={() => setUploadingPicture("cover")}
            onChange={handleImageUpload}
            id="fileUpload"
            type="file"
            hidden
          />
        </div>
      </div>
      {/* profile picture*/}
      <div className="relative w-fit mx-5 -translate-y-[50%] ">
        <img
          src={profilePhotoUrl !== "" ? profilePhotoUrl : PROFILE_PICTURE_URL}
          alt=""
          className="bg-gray-700 h-30 w-30 rounded-full object-cover p-1"
        />
        <label
          htmlFor="profileUpload"
          className="absolute  left-1/2 -translate-x-1/2 -bottom-4 cursor-pointer bg-black p-2 rounded-full"
        >
          <IoMdImage size={28} className="text-white" />
        </label>
        <input
          disabled={uploadLoading}
          onClick={() => setUploadingPicture("profile")}
          onChange={handleImageUpload}
          id="profileUpload"
          type="file"
          hidden
        />
      </div>
      {/* INFO */}
      <div className="px-5 -translate-y-[30%] flex flex-col gap-5 mt-10">
        {/* Username */}
        <div className="flex flex-col">
          <label htmlFor="username" className="text-gray-400 mb-1 text-sm">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-800 text-white rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600 placeholder-gray-500"
          />
        </div>

        {/* Bio */}
        <div className="flex flex-col">
          <label htmlFor="bio" className="text-gray-400 mb-1 text-sm">
            Bio
          </label>
          <textarea
            id="bio"
            placeholder="Tell us something about you..."
            defaultValue={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bg-gray-800 text-white rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-600 placeholder-gray-500 resize-none h-24"
          />
        </div>
        {/* savebtn */}

        <div className="flex justify-center">
          <button
            disabled={editLoading}
            className="w-full bg-emerald-600 rounded-lg py-1.5 font-semibold cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};
export default EditProfileForm;
