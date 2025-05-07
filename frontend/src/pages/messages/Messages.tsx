import { IoArrowBack } from "react-icons/io5";
import { LuMessageSquareShare } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import {
  useCreateChatMutation,
  useGetAllChatsQuery,
} from "../../redux/api/chatApiSlice";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";
import Chat from "../../components/messages/Chat";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import StartChat from "../../components/messages/StartChat";
import DeleteChatForm from "../../components/forms/DeleteChatForm";
import useSocket from "../../hooks/useSocket";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Messages = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [isStartChatModalOpen, setChatStartModalOpen] =
    useState<boolean>(false);
  const [isDeleteChatModalOpen, setDeleteChatModalOpen] =
    useState<boolean>(false);
  const [deletingChatId, setDeletingChatId] = useState<string>("");

  const navigate = useNavigate();

  const {
    data: chats,
    isLoading: chatsLoading,
    refetch: refetchChats,
    error: chatsError,
  } = useGetAllChatsQuery();

  const [startChatApiHandler, { isLoading: startChatLoading }] =
    useCreateChatMutation();

  const { socket, connected } = useSocket();

  const handleChatStart = async (userId: string) => {
    if (startChatLoading) return;
    try {
      const res = await startChatApiHandler(userId).unwrap();
      navigate(`chat/${res.chatId}`);
      refetchChats();
    } catch (error) {
      if (isApiError(error)) {
        toast.error(error.data.msg);
      } else {
        toast.error("Something Went Wrong");
      }
    }
  };

  const handleNotification = () => {
    refetchChats();
  };

  useEffect(() => {
    if (socket && connected) {
      socket.emit("joined", { currentUser, socketId: socket.id });
      socket.on("notification", handleNotification);
    }
  }, [socket, connected, currentUser]);

  useEffect(() => {
    refetchChats();
  }, []);

  if (chatsLoading) {
    return <Loader />;
  }
  if (chatsError) {
    if (isApiError(chatsError)) {
      return <h2 className="text-red-600">{chatsError.data.msg}</h2>;
    } else {
      return <h2 className="text-red-600">Something Went Wrong</h2>;
    }
  }

  return (
    <section>
      {/* go back */}
      <nav className="flex items-center gap-3 px-3 py-3 border-b border-gray-600">
        <IoArrowBack
          onClick={() => navigate(-1)}
          size={22}
          className="cursor-pointer"
        />
        <h2 className="font-semibold text-lg">Messages</h2>
        <LuMessageSquareShare
          onClick={() => setChatStartModalOpen(true)}
          size={22}
          className="ml-auto cursor-pointer"
        />
      </nav>
      {/* chat container */}
      <ul className="flex flex-col">
        {chats?.chats.map((chat) => (
          <Chat
            key={chat.chatId}
            chat={chat}
            setDeletingChatId={setDeletingChatId}
            setDeleteChatModalOpen={setDeleteChatModalOpen}
          />
        ))}
      </ul>

      <Modal
        isModalOpen={isStartChatModalOpen}
        onClose={() => setChatStartModalOpen(false)}
      >
        <StartChat
          onClose={() => setChatStartModalOpen(false)}
          handleChatStart={handleChatStart}
        />
      </Modal>
      <Modal
        isModalOpen={isDeleteChatModalOpen}
        onClose={() => setDeleteChatModalOpen(false)}
      >
        <DeleteChatForm
          onClose={() => setDeleteChatModalOpen(false)}
          refetchChats={refetchChats}
          deletingChatId={deletingChatId}
        />
      </Modal>
    </section>
  );
};
export default Messages;
