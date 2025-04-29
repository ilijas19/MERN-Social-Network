import { useState } from "react";
import { PROFILE_PICTURE_URL } from "../../redux/constants";
import { Post } from "../../types";
import { useCreateCommentMutation } from "../../redux/api/commentsApiSlice";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";

type FormProps = {
  post: Post;
  refetchComments: () => void;
};

const CreateCommentForm = ({ post, refetchComments }: FormProps) => {
  const [commentInput, setCommentInput] = useState<string>("");

  const [createCommentApiHandler, { isLoading: createCommentLoading }] =
    useCreateCommentMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await createCommentApiHandler({
        text: commentInput,
        postId: post._id,
      }).unwrap();
      toast.success(res.msg);
      refetchComments();
      setCommentInput("");
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
      onSubmit={handleSubmit}
      className="shadow-lg  flex items-center gap-4 px-3 py-4 hover:bg-gray-700 border-t border-gray-700"
    >
      <img
        src={
          post.user.profilePicture === ""
            ? PROFILE_PICTURE_URL
            : post.user.profilePicture
        }
        className="min-h-11 min-w-11  max-h-11 max-w-11 object-cover rounded-full cursor-pointer"
        alt="Profile"
      />
      <input
        value={commentInput}
        onChange={(e) => setCommentInput(e.target.value)}
        type="text "
        placeholder="Write A Comment"
        className="outline-none grow "
      />
      <button
        disabled={createCommentLoading || commentInput === ""}
        className={`px-3 py-1 rounded-lg border transition-all duration-300
    ${
      commentInput !== ""
        ? "bg-emerald-600 text-white font-bold hover:bg-emerald-700 hover:scale-101 cursor-pointer"
        : "border-emerald-600 text-emerald-600 opacity-50"
    }
  `}
      >
        Submit
      </button>
    </form>
  );
};
export default CreateCommentForm;
