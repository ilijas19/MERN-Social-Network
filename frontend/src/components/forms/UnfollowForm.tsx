import React from "react";
import { IoClose } from "react-icons/io5";

type FormProps = {
  unfollowingId: string;
  unfollowHandler: (userId: string) => Promise<void>;
  onClose: () => void;
};

const UnfollowForm = ({
  unfollowingId,
  unfollowHandler,
  onClose,
}: FormProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await unfollowHandler(unfollowingId);
    onClose(); // Close after unfollow
  };

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className="bg-gray-800 w-full max-w-[400px] rounded-xl mt-24 p-6 shadow-xl relative text-center h-fit "
    >
      {/* Close icon */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition cursor-pointer"
      >
        <IoClose size={22} />
      </button>

      <p className="text-xl font-semibold text-white">Unfollow user?</p>
      <p className="text-gray-400 mt-2 text-sm">
        Are you sure you want to unfollow this user? You can always follow them
        again later.
      </p>

      <div className="flex justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition cursor-pointer"
        >
          Unfollow
        </button>
      </div>
    </form>
  );
};

export default UnfollowForm;
