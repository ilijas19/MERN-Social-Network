import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSinglePostQuery } from "../../redux/api/postsApiSlice";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";
import PostElement from "../../components/user/Post";
import { useGetPostCommentsQuery } from "../../redux/api/commentsApiSlice";
import CommentEl from "../../components/user/CommentEl";
import CreateCommentForm from "../../components/forms/CreateCommentForm";
import { useState } from "react";
import Modal from "../../components/Modal";
import DeleteCommentForm from "../../components/forms/DeleteCommentForm";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import DeleteReplyForm from "../../components/forms/DeleteReplyForm";

const PostPage = () => {
  // const isAllowed = sessionStorage.getItem("allowedToView") === "true";

  // useEffect(() => {
  //   return () => {
  //     // This runs when user leaves PostPage
  //     sessionStorage.removeItem("allowedToView");
  //   };
  // }, []);

  // if (!isAllowed) {
  //   return <Navigate to="/" />;
  // }
  // ///////////////////////////////////////////////////////////

  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [isDelCommentModalOpen, setDelCommentModalOpen] =
    useState<boolean>(false);
  const [delCommentId, setDelCommentId] = useState<string>("");

  const [isDelReplyModalOpen, setDelReplyModalOpen] = useState(false);
  const [delReplyId, setDelReplyId] = useState<string>("");
  const [replyCommentId, setReplyCommentId] = useState<string>("");

  const {
    data: post,
    isLoading: postLoading,
    error,
  } = useGetSinglePostQuery(id ?? "", { skip: !id });

  const {
    data: comments,
    isLoading: commentsLoading,
    refetch: refetchComments,
  } = useGetPostCommentsQuery(post?._id ?? "", { skip: !post });

  if (postLoading) {
    return <Loader />;
  }

  if (error) {
    if (isApiError(error)) {
      return (
        <h2 className="text-center mt-4 text-red-600 text-lg font-semibold">
          {error.data.msg}
        </h2>
      );
    } else {
      <h2 className="text-center mt-4 text-red-600 text-lg font-semibold">
        Something Went Wrong
      </h2>;
    }
  }

  return (
    <section>
      {/* HEADER */}
      <nav className="flex items-center py-2 px-3 gap-3 border-b border-gray-600">
        <IoArrowBack
          onClick={() => navigate(-1)}
          size={24}
          className="cursor-pointer"
        />
        <h2 className="text-xl font-semibold">Post</h2>
      </nav>
      {/* POST */}
      {post && (
        <>
          <PostElement post={post} singlePost={true} />
          {/* COMMENT SECTION */}
          <h2 className="p-2 text-center font-semibold ">Comments</h2>

          <CreateCommentForm post={post} refetchComments={refetchComments} />

          {commentsLoading && <Loader />}
          <ul className="border-t border-gray-700 pb-15">
            {comments?.comments.map((comment) => (
              <CommentEl
                refetchComments={refetchComments}
                currentUser={currentUser}
                comment={comment}
                setDelCommentId={setDelCommentId}
                setDelCommentModalOpen={setDelCommentModalOpen}
                setDelReplyId={setDelReplyId}
                setDelReplyModalOpen={setDelReplyModalOpen}
                setReplyCommentId={setReplyCommentId}
              />
            ))}
          </ul>
        </>
      )}

      <Modal
        isModalOpen={isDelCommentModalOpen}
        onClose={() => setDelCommentModalOpen(false)}
      >
        <DeleteCommentForm
          deletingCommentId={delCommentId}
          refetchComments={refetchComments}
          onClose={() => setDelCommentModalOpen(false)}
        />
      </Modal>

      <Modal
        isModalOpen={isDelReplyModalOpen}
        onClose={() => setDelReplyModalOpen(false)}
      >
        <DeleteReplyForm
          refetchComments={refetchComments}
          deletingReplyId={delReplyId}
          onClose={() => setDelReplyModalOpen(false)}
          replyCommentId={replyCommentId}
        />
      </Modal>
    </section>
  );
};

export default PostPage;
