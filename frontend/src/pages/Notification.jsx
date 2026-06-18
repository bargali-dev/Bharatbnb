import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { authDataContext } from "../Context/AuthContext";
import { userDataContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

// ✅ SOCKET OUTSIDE COMPONENT
const socket = io("http://localhost:8000", { withCredentials: true });

const Notification = () => {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);

  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  // ==============================
  // 📥 FETCH REQUESTS
  // ==============================
  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/buddies/requests`, {
        withCredentials: true,
      });

      setRequests(res.data.requests || []);
      console.log(res.data.requests);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // ==============================
  // ✅ ACCEPT
  // ==============================
  const handleAccept = async (req) => {
    try {
      await axios.post(
        `${serverUrl}/api/buddies/accept`,
        { requestId: req._id },
        { withCredentials: true },
      );

      toast.success("Accepted ✅");

      setRequests((prev) =>
        prev.map((r) => (r._id === req._id ? { ...r, status: "accepted" } : r)),
      );

      navigate("/accepted", { state: { buddy: req } });
    } catch (err) {
      console.log(err);
    }
  };

  // ==============================
  // ❌ REJECT
  // ==============================
  const handleReject = async (req) => {
    try {
      await axios.post(
        `${serverUrl}/api/buddies/reject`,
        { requestId: req._id },
        { withCredentials: true },
      );

      toast.error("Rejected ❌");

      setRequests((prev) =>
        prev.map((r) => (r._id === req._id ? { ...r, status: "rejected" } : r)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ==============================
  // 🔥 SOCKET LISTENERS
  // ==============================
  useEffect(() => {
    socket.on("requestAccepted", (data) => {
      setRequests((prev) =>
        prev.map((r) =>
          r._id === data.requestId
            ? { ...r, status: "accepted", buddy: data.buddy }
            : r,
        ),
      );
    });

    socket.on("requestRejected", (data) => {
      setRequests((prev) =>
        prev.map((r) =>
          r._id === data.requestId ? { ...r, status: "rejected" } : r,
        ),
      );
    });

    return () => {
      socket.off("requestAccepted");
      socket.off("requestRejected");
    };
  }, []);

  useEffect(() => {
    socket.on("buddyRequest", (data) => {
      console.log("New Request:", data);

      setRequests((prev) => [...prev, data]);

      toast.info("New Buddy Request Received 🔔");
    });

    return () => socket.off("buddyRequest");
  }, []);

  // ==============================
  // 🎨 UI
  // ==============================
  return (
    <div className="w-full min-h-screen flex flex-col items-center mt-20">
      <button
        className="px-[30px] py-[10px] bg-[red] text-[white] text-[18px] md:px-[100px] rounded-lg text-nowrap absolute top-[20px] right-[35px]"
        onClick={() => navigate("/")}
      >
        Back To Home
      </button>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {requests.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <div className="w-[90%] md:w-[60%] flex flex-col gap-4">
          {requests.map((req) => {
            const currentUserId = userData?._id?.toString();

            return (
              <div
                key={req._id}
                className="border p-4 rounded-lg shadow-md bg-white"
              >
                {/* 👤 USER */}
                <p className="font-semibold text-lg">
                  {req.user?.name || req.fromUser?.name}
                </p>

                {/* 🏠 PROPERTY */}
                <p className="text-gray-600">{req.property?.title}</p>

                {/* 📅 DATES */}
                <p className="text-sm text-gray-500">
                  {req.checkIn} → {req.checkOut}
                </p>

                {/* ================= STATUS UI ================= */}

                {/* ⏳ PENDING → ONLY RECEIVER */}
                {req.status === "searching" &&
                  req.selectedUser?._id?.toString() === currentUserId && (
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => handleAccept(req)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Accept
                      </button>

                      <button
                        onClick={() => handleReject(req)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                {/* ❌ REJECTED → USER A */}
                {req.status === "rejected" &&
                  req.user?._id?.toString() === currentUserId && (
                    <p className="text-red-500 mt-3 font-medium">
                      ❌ Your request was rejected
                    </p>
                  )}

                {/* ✅ ACCEPTED → USER A */}
                {req.status === "accepted" &&
                  req.user?._id?.toString() === currentUserId && (
                    <div className="mt-3">
                      <p className="text-green-600 font-medium">
                        ✅ Your request was accepted
                      </p>

                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() =>
                            navigate("/accepted", { state: { buddy:req } })
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Chat
                        </button>

                        <button
                          onClick={() =>
                            navigate("/booked", { state: { req } })
                          }
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notification;
