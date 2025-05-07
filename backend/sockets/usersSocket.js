let onlineUsers = [];

function addUser(user) {
  if (!onlineUsers.some((u) => u.userId === user.userId)) {
    onlineUsers.push(user);
  }
}

function removeUser(socketId) {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
}

function getUser(userId) {
  return onlineUsers.find((user) => user.userId === userId);
}

function getAllUsers() {
  return onlineUsers;
}

export { addUser, removeUser, getUser, getAllUsers };
