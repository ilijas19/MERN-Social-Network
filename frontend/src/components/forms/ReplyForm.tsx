import { IoSend } from "react-icons/io5";
import { isApiError } from "../../utils/isApiError";
import { toast } from "react-toastify";
import { useCreateReplyMutation } from "../../redux/api/commentsApiSlice";
import { useState } from "react";

type FormProps = {
  commentId: string;
  refetchComments: () => void;
};

const ReplyForm = ({ commentId, refetchComments }: FormProps) => {
  const [text, setText] = useState<string>("");

  const [createReplyApiHandler, { isLoading: createReplyLoading }] =
    useCreateReplyMutation();

  const handleReply = async () => {
    if (createReplyLoading) return;
    if (text === "") return;
    try {
      const res = await createReplyApiHandler({ commentId, text }).unwrap();
      setText("");
      refetchComments();
      toast.success(res.msg);
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };
  return (
    <form className="border border-gray-400 flex rounded-lg overflow-hidden px-3 py-1 items-center focus-within:ring focus-within:ring-emerald-600 focus-within:border-emerald-600 mb-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        type="text"
        placeholder="Enter Reply"
        className="w-full outline-none border-gray-700"
      />
      <IoSend
        onClick={handleReply}
        size={19}
        className="text-emerald-600 cursor-pointer"
      />
    </form>
  );
};
export default ReplyForm;
