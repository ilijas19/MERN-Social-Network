import { useNavigate, useParams } from "react-router-dom";
import { useGetChatMessagesQuery } from "../../redux/api/chatApiSlice";
import { useEffect, useState, useCallback, useRef } from "react";
import Loader from "../../components/Loader";
import { isApiError } from "../../utils/isApiError";
import { IoArrowBack } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { toast } from "react-toastify";
import useSocket from "../../hooks/useSocket";
import { Message } from "../../types";

const ChatPage = () => {
  const { id: chatId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { socket, connected } = useSocket();

  const [page, setPage] = useState<number>(1);
  const [messageInput, setMessageInput] = useState<string>("");
  const [showingMessages, setShowingMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError,
    refetch: refetchMessages,
  } = useGetChatMessagesQuery({ chatId: chatId ?? "", page });

  const loadPreviousMessages = useCallback(() => {
    if (!messagesLoading) {
      setPage((prev) => prev + 1);
    }
  }, [messagesLoading]);

  useEffect(() => {
    if (messages) {
      setShowingMessages((prev) => {
        const newMessages = messages.messages.filter(
          (msg) => !prev.some((m) => m._id === msg._id)
        );

        if (page === 1) {
          return [...prev, ...newMessages];
        } else {
          return [...newMessages, ...prev];
        }
      });
      setHasMore(messages.hasNextPage);
    }
  }, [messages]);

  const handleMessage = useCallback((data: Message) => {
    setShowingMessages((prev) => {
      const exists = prev.some((msg) => msg._id === data._id);
      return exists ? prev : [...prev, data];
    });
  }, []);

  useEffect(() => {
    if (page === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showingMessages, page]);

  const sendMessageHandler = useCallback(async () => {
    if (!messageInput.trim() || !socket || !connected) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage: Message = {
      _id: tempId,
      text: messageInput,
      sender: {
        _id: currentUser?.userId || "",
        username: currentUser?.username || "",
        profilePicture: "",
      },
      createdAt: new Date().toISOString(),
      chat: chatId || "",
      read: false,
    };

    setShowingMessages((prev) => [...prev, newMessage]);
    setMessageInput("");
    setIsSending(true);

    try {
      socket.emit("send-message", {
        newMessage: {
          ...newMessage,
          tempId,
        },
        chatId,
        recieverId: messages?.otherUser._id,
      });
    } catch (error) {
      toast.error("Failed to send message");
      // Rollback optimistic update
      setShowingMessages((prev) => prev.filter((msg) => msg._id !== tempId));
    } finally {
      setIsSending(false);
    }
  }, [messageInput, socket, connected, currentUser, chatId]);

  useEffect(() => {
    if (socket && connected && chatId) {
      refetchMessages();
      socket.emit("joined", { currentUser, socketId: socket.id });
      socket.emit("join-room", chatId);
      socket.on("receive-message", handleMessage);

      return () => {
        socket.off("receive-message", handleMessage);
      };
    }
  }, [socket, connected, chatId, currentUser, handleMessage]);

  // Initial data load
  useEffect(() => {
    // refetchMessages();
  }, [refetchMessages]);

  if (messagesLoading && page === 1) return <Loader />;

  if (messagesError) {
    return (
      <h2 className="text-red-500 text-center mt-5">
        {isApiError(messagesError)
          ? messagesError.data.msg
          : "Something went wrong."}
      </h2>
    );
  }

  return (
    <section className="flex flex-col h-screen bg-gray-800 text-white">
      {/* Header */}
      <nav className="flex items-center gap-3 px-4 py-4 border-b border-gray-600 bg-gray-800 shadow-sm">
        <IoArrowBack
          onClick={() => navigate(-1)}
          size={22}
          className="cursor-pointer text-white"
        />
        <h2 className="font-semibold text-lg">
          Chat with {messages?.otherUser.username}
        </h2>
      </nav>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar"
      >
        {hasMore && (
          <div className="flex justify-center mb-4">
            <button
              onClick={loadPreviousMessages}
              disabled={messagesLoading}
              className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50"
            >
              {messagesLoading ? "Loading..." : "Load Previous Messages"}
            </button>
          </div>
        )}

        {showingMessages.map((msg: Message) => {
          const isMine = msg.sender._id === currentUser?.userId;
          return (
            <div
              key={msg._id}
              className={`max-w-[70%] relative px-4 py-3 rounded-xl shadow-md text-sm ${
                isMine
                  ? "bg-emerald-700 text-white self-end ml-auto"
                  : "bg-gray-700 text-white self-start"
              }`}
            >
              <p className="font-semibold sm:text-lg">{msg.sender.username}</p>
              <p className="text-sm leading-snug">{msg.text}</p>
              <span className="absolute top-0 right-2 text-sm text-gray-300 mt-2 block text-right">
                {new Date(msg.createdAt.toString()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mx-2 rounded-full flex items-center gap-2 sm:mb-3 mb-12 border border-gray-700 overflow-hidden">
        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="grow placeholder-gray-100 outline-none px-3 py-2 not-sm:text-sm bg-transparent"
          onKeyDown={(e) => e.key === "Enter" && sendMessageHandler()}
          disabled={isSending}
        />
        <button
          onClick={sendMessageHandler}
          // disabled={!messageInput.trim() || isSending}
          className="bg-emerald-700 hover:bg-emerald-600 cursor-pointer text-white font-semibold transition h-full px-4 not-sm:text-sm disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </section>
  );
};

export default ChatPage;
