import { useState } from "react";
import { PROFILE_PICTURE_URL } from "../../redux/constants";
import { Comment, CurrentUser } from "../../types";
import { formatTimeAgo } from "../../utils/FormatTimeAgo"; // if you have a time formatter
import { FaTrash } from "react-icons/fa";
import ReplyForm from "../forms/ReplyForm";
type CommentProps = {
  comment: Comment;
  setDelCommentId: (id: string) => void;
  setDelCommentModalOpen: (bol: boolean) => void;
  currentUser: CurrentUser | null;
  refetchComments: () => void;
  setDelReplyModalOpen: (bol: boolean) => void;
  setDelReplyId: (id: string) => void;
  setReplyCommentId: (id: string) => void;
};

const CommentEl = ({
  comment,
  setDelCommentId,
  setDelCommentModalOpen,
  currentUser,
  refetchComments,
  setDelReplyModalOpen,
  setDelReplyId,
  setReplyCommentId,
}: CommentProps) => {
  const [repliesOpen, setRepliesOpen] = useState(false);

  const handleCommentDelete = (id: string) => {
    setDelCommentId(id);
    setDelCommentModalOpen(true);
  };

  const handleReplyDelete = (id: string) => {
    setDelReplyId(id);
    setDelReplyModalOpen(true);
    setReplyCommentId(comment._id);
  };

  return (
    <figure className="flex gap-3 px-4 py-3 border-b border-gray-700 text-white  transition-colors duration-200 ">
      {/* trash icon */}
      {comment.myComment || comment.myPost ? (
        <FaTrash
          onClick={() => handleCommentDelete(comment._id)}
          className="text-red-800 absolute right-3 cursor-pointer"
        />
      ) : null}
      {/* Profile Image */}
      <img
        src={
          comment?.user.profilePicture === ""
            ? PROFILE_PICTURE_URL
            : comment?.user.profilePicture
        }
        className="min-h-11 min-w-11  max-h-11 max-w-11 object-cover rounded-full cursor-pointer"
        alt="Profile"
      />

      {/* Comment Content */}
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2">
          <p className="font-semibold  cursor-pointer hover:underline">
            {comment.user.username}
          </p>
          <span className="text-gray-400 text-xs">
            {formatTimeAgo(comment.createdAt.toString())}
          </span>
        </div>

        <p className="text-gray-300 sm:text-base text-sm mt-1 break-words max-w-[500px]">
          {comment.text}
        </p>

        <p
          className="text-emerald-600 text-sm font-semibold mt-auto pt-2 cursor-pointer hover:underline"
          onClick={() => setRepliesOpen(!repliesOpen)}
        >
          {repliesOpen
            ? "Hide Replies"
            : comment.replies.length > 0
            ? `Show Replies (${comment.replies.length})`
            : "Reply"}
        </p>
        {repliesOpen && (
          <div className="flex flex-col  mt-3">
            {/* Reply FORM */}
            <ReplyForm
              commentId={comment._id}
              refetchComments={refetchComments}
            />

            {/* Replies List */}
            {comment.replies.length === 0 ? (
              <p className="text-gray-400">Be First To Reply!</p>
            ) : (
              comment.replies.map((reply) => (
                // REPLY
                <div
                  key={reply._id}
                  className="text-gray-300  mt-2 flex gap-3 border border-gray-600 items-center py-1.5 rounded-lg px-2 relative"
                >
                  {reply.user._id === currentUser!.userId && (
                    <FaTrash
                      onClick={() => handleReplyDelete(reply._id)}
                      size={14}
                      className="absolute top-2 right-2 text-red-600 cursor-pointer"
                    />
                  )}
                  <img
                    src={
                      reply.user.profilePicture === ""
                        ? PROFILE_PICTURE_URL
                        : reply?.user.profilePicture
                    }
                    className="min-h-10 min-w-10  max-h-10 max-w-10 object-cover rounded-full cursor-pointer"
                    alt="Profile"
                  />
                  <div>
                    <p className="font-semibold hover:underline">
                      {reply.user.username}
                    </p>
                    <p className="text-sm text-gray-400">{reply.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </figure>
  );
};

export default CommentEl;
