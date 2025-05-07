import { FaTrash } from "react-icons/fa";
import { PROFILE_PICTURE_URL } from "../../redux/constants";
import { Chat as ChatType } from "../../types";
import { useNavigate } from "react-router-dom";

type ChatProps = {
  chat: ChatType;
  setDeletingChatId: (id: string) => void;
  setDeleteChatModalOpen: (bol: boolean) => void;
};
const Chat = ({
  chat,
  setDeletingChatId,
  setDeleteChatModalOpen,
}: ChatProps) => {
  const navigate = useNavigate();

  return (
    <li
      onClick={() => navigate(`chat/${chat.chatId}`)}
      className="px-4 py-4 hover:bg-gray-700 cursor-pointer border-b border-gray-700 flex gap-2 items-center"
    >
      <img
        src={
          chat.otherUser.profilePicture === ""
            ? PROFILE_PICTURE_URL
            : chat.otherUser.profilePicture
        }
        alt=""
        className="h-11 w-11 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <p className="font-semibold flex items-center gap-2">
          {chat.otherUser.username}{" "}
          {chat.lastMessage &&
            chat.lastMessage.sender.username === chat.otherUser.username &&
            !chat.lastMessage.read && (
              <span className="h-2 w-2 rounded-full bg-red-600"></span>
            )}
        </p>
        <p className="text-sm text-gray-400">
          {chat.lastMessage && chat.lastMessage.text}
        </p>
      </div>
      <FaTrash
        onClick={(e) => {
          e.stopPropagation();
          setDeletingChatId(chat.chatId);
          setDeleteChatModalOpen(true);
        }}
        className="ml-auto text-red-600 cursor-pointer hover:text-red-500"
      />
    </li>
  );
};
export default Chat;
