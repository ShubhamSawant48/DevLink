import { useEffect, useState } from "react";
import createSocketConnection from "../utils/socket"
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessages,setNewMessages] = useState("")
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const {targetUserId} = useParams();

  useEffect(() => {
    if(!userId) return;

    const socket = createSocketConnection();
    socket.emit("joinChat", { userId, targetUserId });

    socket.on("messageRecieved",({firstName,text})=>{
      console.log(firstName,text);
      setMessages((message)=>[...message,{firstName,text}]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId,targetUserId]);

  const sendMessage = () => {
    const socket = createSocketConnection();
    socket.emit("sendMessage",{firstName:user.firstName,userId,targetUserId,text:newMessages});
    setNewMessages("");
  }

  return (
    <div className="justify-self-center my-5 border border-gray-600 w-1/2 flex flex-col">
      <h1 className="font-bold m-3 text-2xl">Chat</h1>
      <div className="flex-1 border-t border-gray-600 overflow-scroll-y p-5">
        {messages.map((msg, index) => {
          return (
            <div key={index} className="chat chat-start">
              <div className="chat-header">
                {msg.firstName}
                <time className="text-xs opacity-50">2 hours ago</time>
              </div>
              <div className="chat-bubble text-white">{msg.text}</div>
              <div className="chat-footer opacity-50">Seen</div>
            </div>
          );
        })}
      </div>
      <div className="flex p-3 border-t border-gray-600">
        <input
          className="bg-gray-600 text-black flex-1 border-1 rounded p-2"
          value={newMessages}
          onChange={(e) => setNewMessages(e.target.value)}
        ></input>
        <button className="btn btn-secondary mx-2 py-2" onClick={sendMessage}>send</button>
      </div>
    </div>
  );
};

export default Chat;
