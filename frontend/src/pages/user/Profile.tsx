import Loader from "../../components/Loader";
import { useGetMyProfileQuery } from "../../redux/api/profileApiSlice";
import { useGetMyPostsQuery } from "../../redux/api/postsApiSlice";
import { useEffect, useState } from "react";
import PostElement from "../../components/user/Post";
import { Post } from "../../types";
import { MdVerified } from "react-icons/md";
import { IoArrowBack, IoCalendarOutline } from "react-icons/io5";
import { formatTimeAgo } from "../../utils/FormatTimeAgo";
import Modal from "../../components/Modal";
import EditProfileForm from "../../components/forms/EditProfileForm";
import { PROFILE_PICTURE_URL } from "../../redux/constants";
import { useLogoutMutation } from "../../redux/api/authApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/features/auth/authSlice";
import { apiSlice } from "../../redux/api/apiSlice";
import { BsThreeDots } from "react-icons/bs";
import ChangePrivacyForm from "../../components/forms/ChangePrivacyForm";
import ChangePasswordForm from "../../components/forms/ChangePasswordForm";
import DeletePostForm from "../../components/forms/DeletePostForm";
import CreatePostForm from "../../components/user/CreatePostForm";

const Profile = () => {
  const [showingPosts, setShowingPosts] = useState<Post[] | []>([]);
  const [page, setPage] = useState(1);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);

  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [isDeletePostModalOpen, setDeletePostModalOpen] = useState(false);

  const [deletingPostId, setDeletingPostId] = useState<string>("");

  const { data: profile, isLoading, refetch } = useGetMyProfileQuery();
  const {
    data: posts,
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useGetMyPostsQuery({ page });
  const [logoutApiHandler, { isLoading: logoutLoading }] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleShowMore = () => {
    setPage(page + 1);
  };

  const handleLogout = async () => {
    try {
      const res = await logoutApiHandler().unwrap();
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      toast.success(res.msg);
      navigate("/login");
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  useEffect(() => {
    if (posts) {
      setShowingPosts((prevPosts) =>
        page === 1 ? posts.posts : [...prevPosts, ...posts.posts]
      );
    }
  }, [posts, page]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="text-white">
      {/* GO BACK HEADER */}
      <div className="flex items-center gap-6  px-3  py-2 top-0  bg-gray-800 h-fit  relative">
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

        <BsThreeDots
          onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
          size={25}
          className="ml-auto cursor-pointer"
        />
        {isProfileMenuOpen && (
          <ul className="rounded-lg overflow-hidden  bg-gray-800 border border-gray-600 absolute right-4 top-10 ">
            <li className="py-2 px-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700">
              Verify Profile
            </li>
            <li
              onClick={() => setPrivacyModalOpen(true)}
              className="py-2 px-3 hover:bg-gray-700 cursor-pointer  border-b border-gray-700"
            >
              Change Profile Privacy
            </li>
            <li
              onClick={() => setPasswordModalOpen(true)}
              className="py-2 px-3 hover:bg-gray-700 cursor-pointer  border-b border-gray-700"
            >
              Change Password
            </li>
            <li className="py-2 px-3 hover:bg-red-800 cursor-pointer ">
              Delete Profile
            </li>
          </ul>
        )}
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
            onClick={() => setEditModalOpen(true)}
            className="h-fit ml-2 mt-2 border border-gray-600 sm:py-1.5 py-1 px-4 text-sm rounded-full font-semibold cursor-pointer hover:bg-gray-700 transition-all duration-300 shadow-md"
          >
            Edit Profile
          </button>
          <button
            disabled={logoutLoading}
            onClick={handleLogout}
            className="h-fit ml-auto sm:mr-4 mr-1 mt-2 shadow-md bg-red-700  sm:py-1.5 py-1 px-3 rounded-full font-semibold cursor-pointer hover:bg-red-800 transition-all duration-300 text-sm"
          >
            Logout
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
              onClick={() =>
                navigate(`/followList/${profile?.username}/following`)
              }
              className="hover:underline cursor-pointer"
            >
              {profile?.numFollowing}{" "}
              <span className="text-gray-400 text-sm">Following</span>
            </p>
            <p
              onClick={() =>
                navigate(`/followList/${profile?.username}/followers`)
              }
              className="hover:underline cursor-pointer"
            >
              {profile?.numFollowers}{" "}
              <span className="text-gray-400 text-sm">Followers</span>
            </p>
          </div>
        </div>
      </figure>
      {/* POST CONTAINER */}
      <div className="-mt-5">
        <CreatePostForm />
      </div>
      {posts?.posts.length === 0 && (
        <h2 className="text-center text-gray-300 font-semibold mt-16">
          No Posts To Show
        </h2>
      )}

      <ul className="flex flex-col gap-4">
        {profile && postsLoading && <Loader />}
        {showingPosts.map((post) => (
          <PostElement
            key={post._id}
            post={post}
            setDeletingPostId={setDeletingPostId}
            setModalOpen={() => setDeletePostModalOpen(true)}
          />
        ))}
      </ul>

      <div className="flex justify-center my-6">
        <button
          hidden={posts?.nextPage === null}
          onClick={handleShowMore}
          className="bg-gray-600 text-white px-3 py-1 rounded-lg cursor-pointer"
        >
          Show More
        </button>
      </div>
      {/* EDIT PROFILE MODAL */}
      <Modal
        isModalOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
      >
        <EditProfileForm
          onClose={() => setEditModalOpen(false)}
          profile={profile}
          refetch={refetch}
        />
      </Modal>
      {/* PROFILE PRIVACY MODAL */}
      <Modal
        isModalOpen={isPrivacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      >
        <ChangePrivacyForm
          refetch={refetch}
          onClose={() => setPrivacyModalOpen(false)}
          profile={profile}
        />
      </Modal>
      {/* CHANGE PASSWORD MODAL */}
      <Modal
        isModalOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      >
        <ChangePasswordForm onClose={() => setPasswordModalOpen(false)} />
      </Modal>
      {/* DELETE POST MODAL */}
      <Modal
        isModalOpen={isDeletePostModalOpen}
        onClose={() => setDeletePostModalOpen(false)}
      >
        <DeletePostForm
          deletingPostId={deletingPostId}
          refetch={refetchPosts}
          onClose={() => setDeletePostModalOpen(false)}
        />
      </Modal>
    </section>
  );
};
export default Profile;
