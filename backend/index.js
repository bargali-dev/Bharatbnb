import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

import connectDb from "./Config/db.js";
import authRouter from "./Routes/auth.Routes.js";
import userRouter from "./Routes/user.Routes.js";
import listingRouter from "./Routes/listing.Routes.js";
import bookingRouter from "./Routes/booking.Routes.js";
import buddiesRouter from "./Routes/buddies.Routes.js";
import Buddy from "./Modules/buddies.Modules.js";
import Message from "./Modules/message.Modules.js";
import messageRouter from "./Routes/message.Routes.js";

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
global.onlineUsers = {};
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

   socket.on("registerUser", (userId) => {
     global.onlineUsers[userId] = socket.id;
     console.log("User Registered:", userId);
   });
  // ✅ FIXED: correct payload + correct room format
  socket.on(
    "joinBuddyRoom",
    async ({ city, checkIn, checkOut, propertyId }) => {
      try {
        // 🔥 SAME ROOM FORMAT AS CONTROLLER
        const room = `${propertyId}-${checkIn}-${checkOut}`;
        socket.join(room);

        console.log("Joined Room:", room);

        // ✅ FIND MATCHED USERS ONLY
        const matchedUsers = await Buddy.find({
          city,
          checkIn,
          checkOut,
          property: propertyId,
          status: "matched", // 🔥 IMPORTANT
        })
          .populate("user", "name email")
          .populate("property");

        // 🔥 EMIT ONLY IF 2 USERS
        if (matchedUsers.length >= 2) {
          io.to(room).emit("buddyFound", matchedUsers);
        }
      } catch (err) {
        console.log(err);
      }
    },
  );
 socket.on("sendMessage", async ({ room, message, sender, receiverId }) => {
   try {
     // ✅ SAVE MESSAGE
     const newMessage = await Message.create({
       room,
       sender,
       message,
     });

     // ✅ REAL-TIME CHAT
     io.to(room).emit("receiveMessage", newMessage);

     // ✅ 🔔 SEND NOTIFICATION (IMPORTANT)
     const receiverSocketId = global.onlineUsers?.[receiverId];

     if (receiverSocketId) {
       io.to(receiverSocketId).emit("newMessageNotification", {
         message: "New message received 💬",
         room,
       });
     }
   } catch (err) {
     console.log(err);
   }
 });

  socket.on("disconnect", () => {
    for (let userId in global.onlineUsers) {
      if (global.onlineUsers[userId] === socket.id) {
        delete global.onlineUsers[userId];
      }
    }
    console.log("Disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/listing", listingRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/buddies", buddiesRouter);
app.use("/api/messages", messageRouter);

connectDb();

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
