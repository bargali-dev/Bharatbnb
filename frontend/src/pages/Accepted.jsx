import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";
import { socket } from "../Context/Socket";
import axios from "axios";
import { useContext } from "react";
import { authDataContext } from "../Context/AuthContext";
import { userDataContext } from "../Context/UserContext";
import {  bookingDataContext } from "../Context/BookingContext";
 const Accepted = () => {
  // const socket = io("http://localhost:8000", { withCredentials: true });
     const { serverUrl } = useContext(authDataContext);
     const location = useLocation();
     const navigate = useNavigate();
      const {userData, setUserData} = useContext(userDataContext);
     const buddy = location.state?.buddy;

     const [showChat, setShowChat] = useState(false);
     const [messages, setMessages] = useState([])
     const [message, setMessage] = useState("");
     const {handleBooking} = useContext(bookingDataContext);
     const sendMessage = () => {
       if (!message.trim()) return;

       const room = `${buddy.property._id}-${buddy.checkIn}-${buddy.checkOut}`;

       // 👇 IMPORTANT: decide receiver
       const receiverId =
         buddy.user._id === userData._id
           ? buddy.selectedUser._id
           : buddy.user._id;

       socket.emit("sendMessage", {
         room,
         message,
         sender: userData._id,
         receiverId, // ✅ FIX
       });

       setMessage("");
     };
     useEffect(() => {
       socket.on("receiveMessage", (data) => {
         setMessages((prev) => [...prev, data]);
       });

       return () => socket.off("receiveMessage");
     }, []);

  useEffect(() => {
    if (!buddy) return;

    socket.emit("joinBuddyRoom", {
      city: buddy.city,
      checkIn: buddy.checkIn,
      checkOut: buddy.checkOut,
      propertyId: buddy.property._id,
    });
  }, [buddy]);

  useEffect(() => {
    const fetchMessages = async () => {
      const room = `${buddy.property._id}-${buddy.checkIn}-${buddy.checkOut}`;

      const res = await axios.get(`${serverUrl}/api/messages?room=${room}`);

      setMessages(res.data.messages);
    };

    fetchMessages();
  }, [buddy]);

    if (!buddy) {
      return <p className="text-center mt-20">No data found</p>;
    }


    return (
      <div className="w-full min-h-screen flex flex-col items-center mt-20">
        {/* 🏠 PROPERTY CARD */}
        <div className="w-full min-h-screen bg-white flex flex-col items-center relative overflow-auto">
          <div
            className="w-[50px] h-[50px] bg-red-500 cursor-pointer absolute top-[20px] left-[20px] rounded-full flex items-center justify-center"
            onClick={() => navigate("/")}
          >
            <FaArrowLeftLong className="w-[25px] h-[25px] text-white" />
          </div>

          {/* Title */}
          <div className="w-[95%] md:w-[80%] mt-[80px] mb-[15px]">
            <h1 className="text-[22px] md:text-[32px] font-semibold text-[#272727] truncate px-[30px] md:px[0px]">
              {`In ${buddy.property?.landmark?.toUpperCase()}, ${buddy.property?.city?.toUpperCase()}`}
            </h1>
          </div>

          {/* Image Section */}
          <div className="w-[95%] md:w-[80%] flex flex-col md:flex-row gap-[10px]">
            {/* Big Image */}
            <div className="w-full md:w-[70%] h-[310px] md:h-[600px] overflow-hidden rounded-[14px]">
              <img
                src={buddy.property?.image1}
                alt="Main property"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Small Images */}
            <div className="w-full md:w-[30%] h-[170px] md:h-[600px] flex flex-row md:flex-col gap-[10px]">
              <div className="w-[50%] md:w-full h-full md:h-[50%] overflow-hidden rounded-[14px]">
                <img
                  src={buddy.property?.image2}
                  alt="Property view 1"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-[50%] md:w-full h-full md:h-[50%] overflow-hidden rounded-[14px]">
                <img
                  src={buddy.property?.image3}
                  alt="Property view 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px]">
            {`${buddy.property?.title?.toUpperCase()} , ${buddy?.property?.landmark?.toUpperCase()}`}
          </div>

          <div className="w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px] text-gray-800 ">{`${buddy.property?.description?.toUpperCase()}`}</div>

          <div className="w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px] ">{`${buddy.property?.rent}/day`}</div>
          {/* 👤 BUDDY INFO */}

          <div className="mt-4 border-t pt-3 w-[1200px]">
            <h1 className="text-2xl font-bold mb-6">Accepted Buddy </h1>
            <p className="font-medium">Buddy: {buddy.user?.name}</p>
            <p className="text-sm text-gray-500">{buddy.user?.email}</p>
          </div>

          {/* 🔥 ACTION BUTTONS */}
          <div className="flex gap-4 mt-8 mr-[1000px]">
            {/* 💬 CHAT BUTTON */}
            <button
              onClick={() => setShowChat(!showChat)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              {showChat ? "Close Chat" : "Chat"}
            </button>

            {/* 📦 BOOK BUTTON */}
            <button
              onClick={() =>
                handleBooking(
                  buddy.property._id,
                  buddy.user._id,
                  buddy.checkIn,
                  buddy.checkOut,
                )
              }
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              Book Now
            </button>
          </div>

          {/* 💬 CHAT BOX */}
          {showChat && (
            <div className="mt-5 border rounded p-3 w-[550px]">
              <div className="h-40 overflow-y-auto border p-2 mb-2 bg-gray-50">
                {messages.map((msg, i) => (
                  <p
                    key={i}
                    className={`text-sm ${
                      msg.sender === userData._id ? "text-right" : "text-left"
                    }`}
                  >
                    <span className="bg-gray-200 px-2 py-1 rounded inline-block">
                      {msg.message}
                    </span>
                  </p>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type message..."
                  className="flex-1 border px-2 py-1 rounded"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 text-white px-3 rounded"
                >
                  <IoSend size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

export default Accepted;
