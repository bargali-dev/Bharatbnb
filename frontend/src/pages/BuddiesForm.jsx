import React, { useState, useContext, useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { userDataContext } from "../Context/UserContext";
import { authDataContext } from "../Context/AuthContext";

const socket = io("http://localhost:8000", { withCredentials: true });

const BuddiesForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serverUrl } = useContext(authDataContext);

  // 🔥 PROPERTY ID FROM PREVIOUS PAGE
  const propertyId = location.state?.propertyId;

  // ✅ STATES
  const [city, setCity] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [gender, setGender] = useState("");

  const [buddies, setBuddies] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState(null);

  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [night, setNight] = useState(0);
  const [total, setTotal] = useState(0);
  const { userData } = useContext(userDataContext);
      const [requests, setRequests] = useState([])

    const [sendingId, setSendingId] = useState(null);

  // 🔍 SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!propertyId) {
      toast.error("Property not selected");
      return;
    }

    const payload = { city, checkIn, checkOut, gender, propertyId };
    setSearchData(payload);

    try {
      setLoading(true);
      const res = await axios.post(`${serverUrl}/api/buddies/find`, payload, {
        withCredentials: true,
      });

      setBuddies(res.data.buddies || []);
      setSearched(true);

      // 🔥 JOIN SOCKET ROOM
      socket.emit("joinBuddyRoom", payload);

      toast.success("Searching for buddies...");
      // setCity = " ";
      // setCheckIn = " ";
      // setCheckOut = " ";
      // setGender=" ";
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 👤 SELECT BUDDY
  const handleSelect = (buddy) => {
    setSelectedBuddy(buddy);
    setSelectedProperty(buddy.property);
    toast.success(`Selected ${buddy.user?.name}`);
  };
  const handleConfirms = async () => {
    try {
      await axios.post(
        `${serverUrl}/api/buddies/confirm`,
        { buddyId: selectedBuddy._id },
        { withCredentials: true },
      );

      toast.success("Confirmed ");
    } catch (err) {
      console.error(err);
    }
  };


  const handleConfirm = async (buddy) => {
    try {
      setSendingId(buddy?._id);

      await axios.post(`${serverUrl}/api/buddies/send-request`,
        {
          receiverId: buddy?.user?._id,
          propertyId: buddy?.property?._id,
          checkIn,
          checkOut,
        },
        { withCredentials: true },
      );
      
      toast.success(`Request sent to ${buddy?.user?.name} `);
    } catch (err) {
      toast.error("Failed to send request");
    } finally {
      setSendingId(null);
    }
  };

 
  // 💳 PAYMENT
  const handlePayment = () => {
    if (!selectedProperty) return;
    const amount = total / 2;
    alert(`Proceeding to payment ₹${amount}`);
  };

  // 🔥 SOCKET LISTENER
  useEffect(() => {
    socket.on("buddyFound", (data) => {
      setBuddies(data);
      toast.success("Buddy Found ");
    });

    return () => socket.off("buddyFound");
  }, []);

  // 🔁 FALLBACK CHECK
  useEffect(() => {
    if (!searched || buddies.length > 0 || !searchData) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.post(
          `${serverUrl}/api/buddies/check`,
          searchData,
          { withCredentials: true },
        );

        if (res.data.buddies.length > 0) {
          setBuddies(res.data.buddies);
          toast.success("Buddy Found");
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [searched, buddies, searchData]);

  // 🔢 CALCULATE TOTAL AND NIGHT STAY
  useEffect(() => {
    if (checkIn && checkOut && selectedProperty) {
      const InDate = new Date(checkIn);
      const OutDate = new Date(checkOut);
      const nights = Math.max((OutDate - InDate) / (24 * 60 * 60 * 1000), 0);
      setNight(nights);

      const rent = selectedProperty.rent || 0;
      const airbnbCharge = rent * 0.07;
      const tax = rent * 0.07;
      const totalPrice = nights > 0 ? rent * nights + airbnbCharge + tax : 0;
      setTotal(totalPrice);
    }
  }, [checkIn, checkOut, selectedProperty]);
  useEffect(() => {
    socket.on("confirmUpdate", (data) => {
      toast.info("Buddy confirmed ");
    });

    socket.on("bothConfirmed", () => {
      toast.success("Both confirmed  Now you can chat & book");
    });

    return () => {
      socket.off("confirmUpdate");
      socket.off("bothConfirmed");
    };
  }, []);
useEffect(() => {
  if (userData?._id) {
    socket.emit("registerUser", userData?._id);
  }
}, [userData]);
  // useEffect(() => {
  //   socket.on("buddyRequest", (data) => {
  //     console.log("New Request:", data);

  //     // store request
  //     setRequests((prev) => [...prev, data]);

  //     toast.info("New Buddy Request Received 🔔");
  //   });

  //   return () => socket.off("buddyRequest");
  // }, []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      {/* 🔙 BACK */}
      <div
        className="w-[50px] h-[50px] bg-red-500 absolute top-5 left-5 rounded-full flex items-center justify-center cursor-pointer ml-[60px] t0p-[30px]"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeftLong className="text-white" />
      </div>

      {/* 📄 FORM */}
      <form
        onSubmit={handleSubmit}
        className="mt-40 w-[550px] h-[500px] border p-6 rounded-xl shadow-md flex flex-col gap-10"
      >
        <h2 className="text-xl font-semibold text-center">Find Travel Buddy</h2>

        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border p-2 rounded"
          required
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="any">Any</option>
        </select>
        <button
          className="bg-red-500 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Searching..." : "Find Buddy"}
        </button>
      </form>

      {/* 🔍 RESULTS */}
      {searched && (
        <div className="mt-6 w-[550px] h-11">
          {buddies.length > 0 ? (
            <>
              <h3 className="font-semibold text-green-600 mb-3">
                Buddies Found
              </h3>
              {buddies
                .filter((b) => b.user?._id !== userData?._id)
                .map((b, i) => (
                  <div
                    key={i}
                    className="border p-3 rounded mb-3 flex justify-between items-center"
                  >
                    <span>{b.user?.name}</span>
                    <span>{b.city}</span>

                    <button
                      onClick={() => handleSelect(b)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      See Details
                    </button>
                    <button
                      onClick={() => handleConfirm(b)}
                      disabled={sendingId === b?._id}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      {sendingId === b?._id ? "Sending..." : "Confirm"}
                    </button>
                  </div>
                ))}
            </>
          ) : (
            <p className="text-gray-500 text-center">Waiting for buddy...</p>
          )}
        </div>
      )}

      {/* 🎯 SELECTED PROPERTY + BUDDY */}
      {selectedBuddy && selectedProperty && (
        <div className="w-full flex flex-col items-center mt-10 gap-6">
          {/* 🔥 PROPERTY HEADER */}
          <div className="w-[95%] md:w-[80%] mt-[80px] mb-[15px]">
            <h1 className="text-[22px] md:text-[32px] font-semibold text-[#272727] truncate px-[30px] md:px-0">
              {`In ${selectedProperty.landmark?.toUpperCase()}, ${selectedProperty.city?.toUpperCase()}`}
            </h1>
          </div>

          {/* 🔥 IMAGES */}
          <div className="w-[95%] md:w-[80%] flex flex-col md:flex-row gap-[10px]">
            <div className="w-full md:w-[70%] h-[310px] md:h-[600px] overflow-hidden rounded-[14px]">
              <img
                src={selectedProperty.image1}
                alt="Main property"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-[30%] h-[170px] md:h-[600px] flex flex-row md:flex-col gap-[10px]">
              <div className="w-[50%] md:w-full h-full md:h-[50%] overflow-hidden rounded-[14px]">
                <img
                  src={selectedProperty.image2}
                  alt="Property view 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[50%] md:w-full h-full md:h-[50%] overflow-hidden rounded-[14px]">
                <img
                  src={selectedProperty.image3}
                  alt="Property view 2"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 🔥 TITLE */}
          <div className="w-[95%] md:w-[80%] text-[18px] md:text-[25px] font-semibold">
            {`${selectedProperty.title?.toUpperCase()} , ${selectedProperty.landmark?.toUpperCase()}`}
          </div>

          {/* 🔥 DESCRIPTION */}
          <div className="w-[95%] md:w-[80%] text-[16px] md:text-[20px] text-gray-700">
            {selectedProperty.description}
          </div>

          {/* 🔥 PRICE */}
          <div className="w-[95%] md:w-[80%] text-[18px] md:text-[24px] font-bold text-green-600">
            ₹{selectedProperty.rent}/day
          </div>

          {/* 👤 BUDDY */}
          <div className="w-[97%] md:w-[85%] border p-4 rounded-lg shadow-md bg-gray-50">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Travel Buddy
            </h3>
            <p>
              <strong>Name:</strong> {selectedBuddy.user?.name}
            </p>
            <p>
              <strong>City:</strong> {selectedBuddy.city}
            </p>
            <p>
              <strong>Gender:</strong> {selectedBuddy.gender}
            </p>
          </div>

          {/* 💰 PAYMENT SPLIT */}
          <div className="w-[97%] md:w-[85%]  border-[1px] border-[#dedddd] rounded-lg flex items-start justify-start p-[20px] gap-[15px] flex-col">
            <h1 className="text-[22px] font-semibold">Booking Price - </h1>
            <p className="w-full flex justify-between items-center px-[20px]">
              <span className="font-semibold">{`₹${selectedProperty.rent} X ${night} nights`}</span>
              <span>{selectedProperty.rent * night}</span>
            </p>
            <p className="w-full flex justify-between items-center px-[20px]">
              <span className="font-semibold">Tax</span>
              <span>{(selectedProperty.rent * 7) / 100}</span>
            </p>
            <p className="w-full flex justify-between items-center px-[20px] border-b-[1px] border-gray-500 pb-[10px]">
              <span className="font-semibold">Airbnb Charge</span>
              <span>{(selectedProperty.rent * 7) / 100}</span>
            </p>
            <p className="w-full flex justify-between items-center px-[20px]">
              <span className="font-semibold">Total Price</span>
              <span>For You: ₹{total / 2}</span>
              <span>For Buddy: ₹{total / 2}</span>
            </p>
          </div>

          <button
            onClick={handleConfirms}
            className="bg-[red] text-[white] text-[18px] px-4 py-2 rounded "
          >
            Confirm and Go to notification for Book Now
          </button>

          {/* 💳 PAYMENT BUTTON */}
          {/* <button
            onClick={handlePayment}
            className="w-[95%] md:w-[80%] bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600"
          >
            Proceed to Payment 💳
          </button> */}
        </div>
      )}
    </div>
  );
};

export default BuddiesForm;
