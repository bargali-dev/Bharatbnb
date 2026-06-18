import React, { useContext, useState } from 'react'
import { GiConfirmed } from 'react-icons/gi'
import { bookingDataContext } from '../Context/BookingContext';
import { FaStar } from 'react-icons/fa6';
import { Navigate, useNavigate } from 'react-router-dom';
import Star from '../Component/Star';
import axios from 'axios';
import { authDataContext } from '../Context/AuthContext';
import { userDataContext } from '../Context/UserContext';
import { listingDataContext } from '../Context/ListingContext';

const Booked = () => {
  let {serverUrl} = useContext(authDataContext);
  let {getCurrentUser} = useContext(userDataContext);
  let {getListing} = useContext(listingDataContext);
  let {cardDetails} = useContext(listingDataContext)
  let navigate = useNavigate();
  let {bookingData} = useContext(bookingDataContext);
  let [star,setStar] = useState(null)

 const handleRating = async (id) => {
   try {
     const result = await axios.post(
       `${serverUrl}/api/listing/ratings/${id}`,
       { rating: star },
       { withCredentials: true },
     );

     await getListing();
     await getCurrentUser();

     console.log(result.data);
     navigate("/");
   } catch (error) {
     console.log(error.response?.data || error.message);
   }
 };

  const handleStar = async(value) =>{
    setStar(value)
    console.log("you rated" , value)
  }
  return (
    <div className="w-[100vw] min-h-[100vh] flex items-center justify-center gap-[10px] bg-slate-200 flex-col">
      <div className="w-[95%] max-w-[500px] h-[400px] bg-[white] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[20px] p-[20px] min:w-[80%] rounded-lg ">
        <div className="w-[100%] h-[50%] text-[20px] flex items-center justify-center flex-col gap-[20px] font-semibold ">
          <GiConfirmed className="w-[100px] h-[100px] text-[green]" /> Booking
          Confirmed
        </div>
        <div className="w-[100%] flex items-center justify-between text-[10px] md:text-[18px]">
          <span>Booking Id:</span>
          <span>{bookingData._id}</span>
        </div>
        <div className="w-[100%] flex items-center justify-between text-[10px] md:text-[18px]">
          <span>Owner Details:</span>
          <span>{bookingData.host?.email}</span>
        </div>
        <div className="w-[100%] flex items-center justify-between text-[10px] md:text-[18px]">
          <span>Total Rent:</span>
          <span>{bookingData.totalRent}</span>
        </div>
      </div>
      <div className="w-[95%] max-w-[600px] bg-yellow-100 border border-yellow-400 rounded-lg p-4">
        <h2 className="font-bold text-lg mb-2">⚠️ Buddy Booking Notice</h2>

        <p>Only one buddy needs to complete the booking.</p>

        <p>The booking holder will make the payment.</p>

        <p>Please coordinate with your buddy through chat before proceeding to payment.</p>

        <p className="text-red-600 font-semibold mt-2">
          This booking cannot be cancelled individually.
        </p>
      </div>
      <button
        // onClick={handlePayment}
        className="w-[75%] md:w-[35%] bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600"
      >
        Proceed to Payment
      </button>
      <div className="w-[95%] max-w-[600px] h-[200px] bg-[white] flex items-center justify-center border-[1px] border-[#b5b5b5] flex-col gap-[20px] p-[20px] md:w-[80%] rounded-lg">
        <h1 className="text-[18px]">{star} out of 5 Rating</h1>

        <Star onRate={handleStar} />
        <button
          className="px-[30px] py-[10px] bg-[red] text-[white] text-[18px] md:px-[100px] rounded-lg text-nowrap"
          onClick={() => handleRating(cardDetails._id)}
        >
          Submit
        </button>
      </div>
      <button
        className="px-[30px] py-[10px] bg-[red] text-[white] text-[18px] md:px-[100px] rounded-lg text-nowrap absolute top-[10px] right-[20px]"
        onClick={() => navigate("/")}
      >
        Back To Home
      </button>
    </div>
  );
}

export default Booked
