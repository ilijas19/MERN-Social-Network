import { toast } from "react-toastify";
import { useFollowUnfollowUserMutation } from "../../redux/api/usersApiSlice";
import { PROFILE_PICTURE_URL } from "../../redux/constants";
import { UserInfo } from "../../types";
import { isApiError } from "../../utils/isApiError";

type UserProps = {
  user: UserInfo;
  currentUserId: string;
  openUser: (username: string) => void;
  refetchUsers: () => void;
};

const SearchedUserEl = ({
  user,
  currentUserId,
  openUser,
  refetchUsers,
}: UserProps) => {
  const [followApiHandler, { isLoading: followLoading }] =
    useFollowUnfollowUserMutation();

  const handleFollow = async (id: string) => {
    try {
      await followApiHandler({ userId: id }).unwrap();
      refetchUsers();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  return (
    <li
      key={user._id}
      className="border-b border-gray-700 px-3 py-2 flex items-center gap-3 font-semibold"
    >
      <img
        src={
          user?.profilePicture === ""
            ? PROFILE_PICTURE_URL
            : user?.profilePicture
        }
        alt=""
        className="w-11 h-11 rounded-full shadow object-cover "
      />
      <p
        onClick={() => openUser(user.username)}
        className="hover:underline cursor-pointer"
      >
        {user.username}
      </p>
      {currentUserId !== user._id && (
        <button
          onClick={() => handleFollow(user._id)}
          disabled={followLoading}
          className="ml-auto    border border-gray-600   px-3 py-1 text-sm rounded-full font-semibold cursor-pointer hover:bg-gray-700 transition-all duration-300 shadow-md"
        >
          {user.currentUserFollowing.slice(0, 1).toUpperCase() +
            user.currentUserFollowing.slice(1)}
        </button>
      )}
    </li>
  );
};
export default SearchedUserEl;
