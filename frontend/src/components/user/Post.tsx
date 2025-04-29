import { FaRegBookmark, FaRegHeart, FaTrash } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { Post } from "../../types";
import { formatTimeAgo } from "../../utils/FormatTimeAgo";
import {
  useLikeUnlikePostMutation,
  useSaveUnsavePostMutation,
} from "../../redux/api/postsApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type PostProps = {
  post: Post;
  setDeletingPostId?: (str: string) => void;
  setModalOpen?: (bol: boolean) => void;
  singlePost?: boolean;
};

const PostElement = ({
  post,
  setDeletingPostId,
  setModalOpen,
  singlePost,
}: PostProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [numLikes, setNumLikes] = useState(post.numLikes);

  const [isSaved, setIsSaved] = useState(post.isSaved);

  const [likeUnlikeApiHandler, { isLoading: likeLoading }] =
    useLikeUnlikePostMutation();

  const [saveApiHandler, { isLoading: saveLoading }] =
    useSaveUnsavePostMutation();

  const handleLike = async () => {
    if (likeLoading) return;
    try {
      // const res =
      await likeUnlikeApiHandler({ postId: post._id }).unwrap();
      // toast.success(res.msg);
      setIsLiked((prev) => !prev);
      setNumLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      toast.error(isApiError(error) ? error.data.msg : "Something Went Wrong");
    }
  };

  const handleSave = async () => {
    if (saveLoading) return;
    try {
      const res = await saveApiHandler({ postId: post._id }).unwrap();
      setIsSaved(!isSaved);
      toast.success(res.msg);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };
  const openUser = (username: string) => {
    navigate(`/profile/${username}`);
  };
  return (
    <figure className="text-white p-4 pb-2 shadow-md   px-9 w-full mx-auto ">
      {/* userinfo */}
      <div className="flex items-center gap-3">
        <img
          onClick={() => openUser(post.user.username)}
          src={
            post.user.profilePicture === ""
              ? "https://res.cloudinary.com/dnn2nis25/image/upload/v1743597100/gym-system/ya0hva63onpxyzyexfpn.jpg"
              : post.user.profilePicture
          }
          className="h-12 w-12  rounded-full object-cover cursor-pointer"
        ></img>
        <div className="flex flex-col  justify-center">
          <p
            onClick={() => openUser(post.user.username)}
            className="font-semibold cursor-pointer"
          >
            {post.user.username}
          </p>
          <p className="text-gray-400 text-sm">
            {formatTimeAgo(post.createdAt.toString())}
          </p>
        </div>

        {location.pathname === "/myProfile" &&
          setDeletingPostId &&
          setModalOpen && (
            <FaTrash
              onClick={() => {
                setDeletingPostId(post._id);
                setModalOpen(true);
              }}
              size={18}
              className="self-start ml-auto text-red-600 cursor-pointer transition-all duration-100 rounded-full"
            />
          )}
      </div>
      {/* TEXT */}
      <p className="text-gray-300 mt-4 mb-4">{post.text}</p>
      {/* IMAGE */}
      <img
        hidden={post.type === "text"}
        src={post.image && post.image !== "" ? post.image : undefined}
        className="bg-gray-700 h-90 mt-3 rounded w-full object-contain  "
      ></img>
      {/* POST INTERACTIONS */}
      <ul className="py-2 px-2 flex gap-4">
        <li className="flex items-center gap-1">
          <FaRegHeart
            onClick={handleLike}
            size={18}
            className={`hover:fill-red-600 cursor-pointer ${
              isLiked ? "fill-red-600" : ""
            }`}
          />
          <p className="text-sm text-gray-300">{numLikes}</p>
        </li>
        {singlePost ?? (
          <Link
            onClick={() => {
              sessionStorage.setItem("allowedToView", "true");
            }}
            to={`/post/${post._id}`}
            className="flex items-center gap-1"
          >
            <FaRegComment
              size={18}
              className={`hover:fill-orange-600 cursor-pointer `}
            />
            <p className="text-sm text-gray-300">{post.numComments}</p>
          </Link>
        )}
        <li className="flex items-center gap-1 ml-auto">
          <FaRegBookmark
            onClick={handleSave}
            size={18}
            className={`hover:fill-emerald-600 cursor-pointer ${
              isSaved ? "fill-emerald-600" : ""
            }`}
          />
        </li>
      </ul>
    </figure>
  );
};
export default PostElement;
