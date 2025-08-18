const socket = require("socket.io");
const crypto = require('crypto')
const { Chat } = require("../models/chat");

const getSecreatRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecreatRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName,lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecreatRoomId(userId, targetUserId);

          let chat = await Chat.findOne({
            participants:{$all :[userId,targetUserId]}
          });

          if(!chat){
            chat = new Chat({
                participants:[userId,targetUserId],
                messages:[]
            });
          };

          chat.messages.push({
            senderId:userId,
            text
          })

          await chat.save();

          io.to(roomId).emit("messageRecieved", { firstName,lastName, text });
        } catch (err) {
          console.error(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
