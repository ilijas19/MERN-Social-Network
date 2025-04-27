import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoArrowBack, IoCalendarOutline } from "react-icons/io5";
import { useGetUserProfileQuery } from "../../redux/api/profileApiSlice";
import Loader from "../../components/Loader";
import { PROFILE_PICTURE_URL } from "../../redux/constants";
import { MdVerified } from "react-icons/md";
import { formatTimeAgo } from "../../utils/FormatTimeAgo";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useFollowUnfollowUserMutation } from "../../redux/api/usersApiSlice";
import { useGetUserPostsQuery } from "../../redux/api/postsApiSlice";
import { IoLockClosedOutline } from "react-icons/io5";
import PostElement from "../../components/user/Post";
import { Post } from "../../types";

const UserProfile = () => {
  const [page, setPage] = useState(1);
  const [showingPosts, setShowingPosts] = useState<Post[]>([]);

  const { username } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const {
    data: profile,
    isLoading,
    refetch,
  } = useGetUserProfileQuery(username ?? "", {
    skip: !username,
  });

  const {
    data: posts,
    isLoading: postsLoading,
    error,
  } = useGetUserPostsQuery(
    { userId: profile?._id ?? "", page },
    { skip: !profile }
  );

  const [followApiHandler, { isLoading: followLoading }] =
    useFollowUnfollowUserMutation();

  const handleFollow = async () => {
    try {
      await followApiHandler({ userId: profile!._id }).unwrap();
      refetch();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleShowMore = () => {
    if (posts?.nextPage) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (username && currentUser) {
      if (username === currentUser.username) {
        navigate("/myProfile");
      }
    }
  }, [currentUser, username, navigate]);

  useEffect(() => {
    if (posts?.posts) {
      setShowingPosts((prev) => [...prev, ...posts.posts]);
    }
  }, [posts]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section>
      {/* GO BACK HEADER */}
      <div className="flex items-center gap-6  px-3  py-2 top-0  bg-gray-800 h-fit  relative text-white">
        <IoArrowBack
          onClick={() => navigate(-1)}
          size={24}
          className="cursor-pointer"
        />
        <div className="h-full">
          <p className="text-lg font-semibold">{profile?.username}</p>
          <p className={"text-sm text-gray-400"}>
            {profile?.private ? "Private" : "Public"}
          </p>
        </div>
      </div>

      {/* PROFILE */}
      <img
        src={profile?.coverPhoto !== "" ? profile!.coverPhoto : undefined}
        alt=""
        className="bg-gray-700 h-40 w-full  object-cover"
      />
      <figure className="">
        <div className="flex">
          <img
            src={
              profile?.profilePicture === ""
                ? PROFILE_PICTURE_URL
                : profile?.profilePicture
            }
            alt=""
            className="w-28 h-28 rounded-full -translate-y-[50%] ml-4 shadow object-cover "
          />
          <button
            onClick={handleFollow}
            disabled={followLoading}
            className="h-fit ml-4 mr-4 mt-2 border border-gray-600 sm:py-1.5 py-1 px-4 text-sm rounded-full font-semibold cursor-pointer hover:bg-gray-700 transition-all duration-300 shadow-md"
          >
            {profile!.following.slice(0, 1).toUpperCase() +
              profile!.following.slice(1)}
          </button>
        </div>

        <div className="-translate-y-[50%] px-4 flex flex-col gap-0.5">
          <p className="font-semibold text-lg flex items-center gap-2">
            {profile?.username}
            <MdVerified className="text-base text-emerald-500" />
          </p>

          <p className="text-gray-500 text-sm flex items-center gap-2">
            <IoCalendarOutline /> Joined{" "}
            {formatTimeAgo(profile!.createdAt.toString())}
          </p>

          <div className="flex gap-3">
            <p
              onClick={() => {
                if (error) return;
                navigate(`/followList/${profile?.username}/following`);
              }}
              className={`${!error && "hover:underline cursor-pointer"} `}
            >
              {profile?.numFollowing}{" "}
              <span className="text-gray-400 text-sm">Following</span>
            </p>
            <p
              onClick={() => {
                if (error) return;
                navigate(`/followList/${profile?.username}/followers`);
              }}
              className={`${!error && "hover:underline cursor-pointer"} `}
            >
              {profile?.numFollowers}{" "}
              <span className="text-gray-400 text-sm">Followers</span>
            </p>
          </div>
        </div>
      </figure>

      {/* POSTS */}
      {error && isApiError(error) ? (
        <div className="flex flex-col items-center gap-4">
          <h2 className=" text-gray-300 text-lg">{error.data.msg}</h2>
          <IoLockClosedOutline size={30} />
        </div>
      ) : (
        <>
          {postsLoading && page === 1 ? (
            <Loader />
          ) : (
            <>
              <ul className="flex flex-col gap-4">
                {showingPosts.map((post) => (
                  <PostElement key={post._id} post={post} />
                ))}
              </ul>
              <div className="flex justify-center my-6">
                {posts?.nextPage && (
                  <button
                    onClick={handleShowMore}
                    className="bg-gray-600 text-white px-3 py-1 rounded-lg cursor-pointer"
                  >
                    Show More
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
};

export default UserProfile;
