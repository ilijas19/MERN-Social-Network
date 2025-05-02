import { useNavigate } from "react-router-dom";
import { CurrentUser, UserInfo } from "../../types";
import { PROFILE_PICTURE_URL } from "../../redux/constants";
import { IoPersonRemove } from "react-icons/io5";
import {
  useFollowUnfollowUserMutation,
  useRemoveFollowerMutation,
} from "../../redux/api/usersApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useState } from "react";
import Modal from "../Modal";
import UnfollowForm from "../forms/UnfollowForm";
import RemoveUserForm from "../forms/RemoveUserForm";
type ListProps = {
  showingUsers: UserInfo[] | [];
  myProfile: boolean;
  selectedPage: "following" | "followers";
  refetchFollowing: () => void;
  refetchFollowers: () => void;
  currentUser: CurrentUser | null;
};
const UserList = ({
  showingUsers,
  myProfile,
  selectedPage,
  refetchFollowing,
  refetchFollowers,
  currentUser,
}: ListProps) => {
  const [isUnfollowModalOpen, setUnfollowModalOpen] = useState<boolean>(false);
  const [unfollowingId, setUnfollowingId] = useState<string>("");
  const [isRemoveModalOpen, setRemoveModalOpen] = useState<boolean>(false);
  const [removingId, setRemoveId] = useState<string>("");

  const navigate = useNavigate();

  const [followApiHandler, { isLoading: followLoading }] =
    useFollowUnfollowUserMutation();
  const [removeApiHandler, { isLoading: removeLoading }] =
    useRemoveFollowerMutation();

  const handleFollow = async (userId: string) => {
    try {
      const res = await followApiHandler({ userId }).unwrap();
      toast.success(res.msg);
      if (selectedPage === "following") {
        refetchFollowing();
      } else {
        refetchFollowers();
      }
      setUnfollowModalOpen(false);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      const res = await removeApiHandler({ userId }).unwrap();
      toast.success(res.msg);
      if (selectedPage === "following") {
        refetchFollowing();
      } else {
        refetchFollowers();
      }
      setRemoveModalOpen(false);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleUnfollowClick = (user: UserInfo) => {
    if (user.currentUserFollowing === "following") {
      setUnfollowModalOpen(true);
      setUnfollowingId(user._id);
    } else {
      return;
    }
  };

  const handleRemoveClick = (user: UserInfo) => {
    if (removeLoading) return;
    setRemoveModalOpen(true);
    setRemoveId(user._id);
  };

  return (
    <ul className="">
      {showingUsers.map((user) => (
        <li
          key={user._id}
          className="flex items-center  py-3 px-3  gap-3 border-b border-gray-700 "
        >
          <img
            src={
              user?.profilePicture === ""
                ? PROFILE_PICTURE_URL
                : user?.profilePicture
            }
            alt=""
            className="size-12 rounded-full object-cover"
          />
          <p
            className="font-semibold hover:underline cursor-pointer "
            onClick={() => navigate(`/profile/${user.username}`)}
          >
            {user.username}
          </p>
          {myProfile &&
            (selectedPage === "followers" ? (
              <IoPersonRemove
                onClick={() => handleRemoveClick(user)}
                className="ml-auto mr-1 text-red-600 cursor-pointer"
              />
            ) : (
              <button
                disabled={followLoading}
                onClick={() => handleUnfollowClick(user)}
                className="border border-gray-600 sm:py-1.5 py-1 px-4 text-sm rounded-full font-semibold cursor-pointer hover:bg-gray-700 transition-all duration-300 shadow-md ml-auto"
              >
                {user.currentUserFollowing.slice(0, 1).toUpperCase() +
                  user.currentUserFollowing.slice(1)}
              </button>
            ))}
          {!myProfile && currentUser?.username !== user.username && (
            <button
              disabled={followLoading}
              onClick={() => handleFollow(user._id)}
              className="border border-gray-600 sm:py-1.5 py-1 px-4 text-sm rounded-full font-semibold cursor-pointer hover:bg-gray-700 transition-all duration-300 shadow-md ml-auto"
            >
              {user.currentUserFollowing.slice(0, 1).toUpperCase() +
                user.currentUserFollowing.slice(1)}
            </button>
          )}
        </li>
      ))}
      <Modal
        isModalOpen={isUnfollowModalOpen}
        onClose={() => setUnfollowModalOpen(false)}
      >
        <UnfollowForm
          unfollowHandler={handleFollow}
          unfollowingId={unfollowingId}
          onClose={() => setUnfollowModalOpen(false)}
        />
      </Modal>

      <Modal
        isModalOpen={isRemoveModalOpen}
        onClose={() => setRemoveModalOpen(false)}
      >
        <RemoveUserForm
          onClose={() => setRemoveModalOpen(false)}
          unfollowHandler={handleRemove}
          removingId={removingId}
        />
      </Modal>
    </ul>
  );
};
export default UserList;
//check whitch section is selected following/followers
// display buttons accordingly
