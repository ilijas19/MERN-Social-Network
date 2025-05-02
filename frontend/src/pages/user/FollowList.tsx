import { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetFollowerListQuery,
  useGetFollowingListQuery,
} from "../../redux/api/usersApiSlice";
import Loader from "../../components/Loader";
import { UserInfo } from "../../types";
import UserList from "../../components/user/UserList";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const FollowList = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const { user, list } = useParams();
  const [selectedPage, setSelectedPage] = useState<"following" | "followers">(
    list === "following" || list === "followers" ? list : "following"
  );
  const [showingUsers, setShowingUsers] = useState<UserInfo[] | []>([]);
  const [isMyProfile, setMyProfile] = useState<boolean>(false);

  const navigate = useNavigate();

  const {
    data: followingList,
    isLoading: followingLoading,
    refetch: refetchFollowing,
  } = useGetFollowingListQuery(user ?? "", {
    skip: selectedPage === "followers",
  });

  const {
    data: followersList,
    isLoading: followersLoading,
    refetch: refetchFollowers,
  } = useGetFollowerListQuery(user ?? "", {
    skip: selectedPage === "following",
  });

  useEffect(() => {
    if (currentUser?.username === user) {
      setMyProfile(true);
    }
    if (selectedPage === "following" && followingList?.following) {
      setShowingUsers(followingList?.following);
    }
    if (selectedPage === "followers" && followersList?.followers) {
      setShowingUsers(followersList?.followers);
    }
  }, [selectedPage, followersList, followingList, list, currentUser]);

  if (followersLoading || followingLoading) {
    return <Loader />;
  }

  return (
    <section className="text-white">
      {/* GO BACK HEADER */}
      <div className="flex items-center gap-6  px-3  py-2 top-0  bg-gray-800 h-fit  relative border-b border-b-gray-700">
        <IoArrowBack
          onClick={() => navigate(-1)}
          size={24}
          className="cursor-pointer"
        />

        <div className="h-full">
          <p className="text-lg font-semibold">username</p>
          <p className={"text-sm text-gray-400"}>
            {selectedPage === "followers"
              ? `${followersList?.nbHits} ${
                  followersList?.nbHits === 1 ? "Follower" : "Followers"
                }`
              : `${followingList?.nbHits} Following`}
          </p>
        </div>
      </div>
      {/* NAV */}
      <nav className="flex justify-around text-white font-semibold border-b border-gray-700">
        <div
          onClick={() => setSelectedPage("following")}
          className={`hover:bg-gray-600 cursor-pointer h-full w-full flex justify-center py-2 ${
            selectedPage === "following" && "bg-gray-600 text-emerald-500"
          }`}
        >
          Following
        </div>
        <div
          onClick={() => setSelectedPage("followers")}
          className={`hover:bg-gray-600 cursor-pointer h-full w-full flex justify-center py-2 ${
            selectedPage === "followers" && "bg-gray-600 text-emerald-500"
          }`}
        >
          Followers
        </div>
      </nav>
      {/* user container */}
      <UserList
        currentUser={currentUser}
        showingUsers={showingUsers}
        myProfile={isMyProfile}
        selectedPage={selectedPage}
        refetchFollowers={refetchFollowers}
        refetchFollowing={refetchFollowing}
      />
    </section>
  );
};
export default FollowList;
