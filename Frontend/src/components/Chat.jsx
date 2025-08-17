import { useEffect, useState } from "react";
import createSocketConnection from "../utils/socket"
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([{ text: "Hi World!" }]);
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const {targetUserId} = useParams();

  useEffect(() => {
    if(!userId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", { firstName:user.firstName,userId, targetUserId });

    return () => {
      socket.disconnect();
    };
  }, [userId,targetUserId]);

  return (
    <div className="justify-self-center my-5 border border-gray-600 w-1/2 flex flex-col">
      <h1 className="font-bold m-3 text-2xl">Chat</h1>
      <div className="flex-1 border-t border-gray-600 overflow-scroll-y p-5">
        {messages.map((msg, index) => {
          return (
            <div key={index} className="chat chat-start">
              <div className="chat-header">
                Shubham Sawant
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble">You were the Chosen One!</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>
      <div className="flex p-3 border-t border-gray-600">
        <input
          className="bg-gray-600 text-black flex-1 border-1 rounded p-2"
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
        ></input>
        <button className="btn btn-secondary mx-2 py-2">send</button>
      </div>
    </div>
  );
};

export default Chat;
