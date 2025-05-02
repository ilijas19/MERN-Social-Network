import { IoMdClose } from "react-icons/io";
import { UserProfile } from "../../types";
import { useState } from "react";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useAcceptFollowRequestMutation } from "../../redux/api/usersApiSlice";

type PopupProps = {
  profile: UserProfile | undefined;
  refetch: () => void;
};

const WantsToFollowPopup = ({ profile, refetch }: PopupProps) => {
  const [followYouPopupOpen, setFollowYouPopupOpen] = useState(true);

  const [acceptRequestApiHandler, { isLoading: acceptRequestLoading }] =
    useAcceptFollowRequestMutation();

  const handleAccept = async (id: string) => {
    try {
      const res = await acceptRequestApiHandler({ userId: id }).unwrap();
      toast.success(res.msg);
      refetch();
      setFollowYouPopupOpen(false);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleDecline = async (id: string) => {
    try {
      console.log(id);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    profile?.wantsToFollowMe &&
    followYouPopupOpen && (
      <div className="fixed top-10 left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-gray-700 border border-gray-600  z-50 rounded-lg shadow-lg  max-h-[90vh] px-3 py-4">
        <IoMdClose
          onClick={() => setFollowYouPopupOpen(false)}
          size={20}
          className="absolute right-3 top-1 text-red-600 cursor-pointer"
        />
        <h2 className="text-center text-lg">
          {profile?.username} wants to{" "}
          <span className="text-emerald-600 font-semibold">follow you</span>
        </h2>
        <div className="flex justify-center gap-3 mt-3">
          <button
            disabled={acceptRequestLoading}
            onClick={() => handleAccept(profile._id)}
            className="bg-emerald-700 font-semibold px-3 py-1 rounded-lg cursor-pointer"
          >
            Accept
          </button>
          <button
            onClick={() => handleDecline(profile._id)}
            className="bg-red-700 font-semibold px-3 py-1 rounded-lg cursor-pointer"
          >
            Decline
          </button>
        </div>
      </div>
    )
  );
};
export default WantsToFollowPopup;
