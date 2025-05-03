import { IoArrowBack } from "react-icons/io5";
import Loader from "../../components/Loader";
import {
  useAcceptFollowRequestMutation,
  useDeclineFollowRequestMutation,
  useGetFollowRequestsQuery,
} from "../../redux/api/usersApiSlice";
import { isApiError } from "../../utils/isApiError";
import { useNavigate } from "react-router-dom";
import { PROFILE_PICTURE_URL } from "../../redux/constants";
import { toast } from "react-toastify";

const FollowingRequests = () => {
  const navigate = useNavigate();

  const {
    data: followingRequests,
    isLoading,
    error,
    refetch: refetchRequests,
  } = useGetFollowRequestsQuery();
  console.log(followingRequests);

  const [acceptApiHandler, { isLoading: acceptLoading }] =
    useAcceptFollowRequestMutation();

  const [declineApiHandler, { isLoading: declineLoading }] =
    useDeclineFollowRequestMutation();

  const handleAccept = async (userId: string) => {
    try {
      const res = await acceptApiHandler({ userId }).unwrap();
      refetchRequests();
      toast.success(res.msg);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleDecline = async (userId: string) => {
    try {
      const res = await declineApiHandler({ userId }).unwrap();
      refetchRequests();
      toast.success(res.msg);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    if (isApiError(error)) {
      return <h2 className="text-red-600">{error.data.msg}</h2>;
    } else {
      return <h2 className="text-red-600">Something Went Wrong</h2>;
    }
  }

  return (
    <section>
      {/* go back */}
      <nav className="flex items-center gap-3 px-3 py-3 border-b border-gray-600">
        <IoArrowBack onClick={() => navigate(-1)} size={22} />
        <h2 className="font-semibold">Following Requests</h2>
      </nav>

      {/* request container */}
      <ul>
        {followingRequests?.followingRequests.length === 0 && (
          <h2 className="text-center mt-4 text-gray-400">
            You have no following Requests
          </h2>
        )}
        {followingRequests?.followingRequests.map((request) => (
          <li
            key={request._id}
            className="flex items-center justify-between gap-4 px-4 py-3 border-b border-gray-700 hover:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  request.profilePicture === ""
                    ? PROFILE_PICTURE_URL
                    : request?.profilePicture
                }
                alt={request.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p
                  onClick={() => navigate(`/profile/${request.username}`)}
                  className="font-medium text-white cursor-pointer hover:underline"
                >
                  {request.username}
                </p>
                <p className="text-sm text-gray-400 not-sm:hidden">
                  wants to follow you
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                disabled={acceptLoading}
                onClick={() => handleAccept(request._id)}
                className="text-sm px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors"
              >
                Accept
              </button>
              <button
                disabled={declineLoading}
                onClick={() => handleDecline(request._id)}
                className="text-sm px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors"
              >
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
export default FollowingRequests;
