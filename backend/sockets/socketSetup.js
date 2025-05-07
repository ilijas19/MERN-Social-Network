import { createMessage } from "../controllers/chatController.js";
import { addUser, removeUser, getAllUsers, getUser } from "./usersSocket.js";

const socketSetup = (io, socket) => {
  socket.on("joined", (data) => {
    const joinedUser = { ...data.currentUser, socketId: data.socketId };
    // console.log(joinedUser);
    addUser(joinedUser);
  });

  socket.on("join-room", (roomName) => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
    socket.join(roomName);
  });

  socket.on("send-message", async ({ chatId, newMessage, recieverId }) => {
    io.to(chatId).emit("receive-message", newMessage);
    await createMessage({
      chatId,
      text: newMessage.text,
      senderId: newMessage.sender._id,
    });
    const reciever = getUser(recieverId);
    if (reciever) {
      io.to(reciever.socketId).emit("notification", newMessage.sender.username);
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
};

export default socketSetup;
