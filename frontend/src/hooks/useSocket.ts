import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ORIGIN_URL } from "../redux/constants";

let socket: Socket;

const useSocket = () => {
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    socket = io(ORIGIN_URL);

    socket.on("connect", () => {
      setConnected(true);
      // console.log("Connected to Socket.IO server");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      // console.log("Disconnected from Socket.IO server");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { socket, connected };
};

export default useSocket;
