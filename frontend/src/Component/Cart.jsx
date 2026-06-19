import React, { useContext } from 'react'
import { userDataContext } from '../Context/UserContext';
import { listingDataContext } from '../Context/ListingContext';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa6';
import { GiConfirmed } from 'react-icons/gi';
import { FcCancel} from "react-icons/fc";
import { useState } from 'react';
import { bookingDataContext } from '../Context/BookingContext';
// import { propertyDataContext } from '../pages/BuddiesForm';

const Cart = ({title,landmark,image1,image2,image3,rent,city,id,rating,isBooked,host,guest}) => {
  let navigate = useNavigate()
  let {userData} = useContext(userDataContext);
  let {handleViewCard} = useContext(listingDataContext);
  let [popUp,setPopUp] = useState(false);
  let {cancelBooking} = useContext(bookingDataContext)
  // let { propertyIds } = useContext(propertyDataContext);
  const handleClick = () => {
    if(userData){
      handleViewCard(id)
      // propertyIds(id)
    }
    else{
      navigate('/login')
    }
  }

  return (
    <div
      className="w-full h-[500px] rounded-lg cursor-pointer relative "
      onClick={() => (!isBooked ? handleClick() : null)}
    >
      {/* BOOKED BADGE */}
      {isBooked &&  (
        <div className="absolute top-2 right-2 bg-white text-green-600 px-2 py-1 rounded flex gap-1 items-center z-20">
          <GiConfirmed /> Booked
        </div>
      )}

      {/* CANCEL BUTTON (ONLY HOST) */}
      {isBooked && String(guest) === String(userData?._id) && (
        <div
          className="absolute top-12 right-2 bg-white text-red-600 px-2 py-1 rounded flex gap-1 items-center z-20"
          onClick={(e) => {
            e.stopPropagation();
            setPopUp(true);
          }}
        >
          <FcCancel /> Cancel
        </div>
      )}

      {/* CONFIRM POPUP */}
      {popUp && (
        <div className="absolute top-28 left-4 w-[260px] bg-white rounded shadow-lg z-30">
          <p className="p-3 font-semibold text-center">Cancel booking?</p>
          <div className="flex justify-around pb-3">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={async (e) => {
                e.stopPropagation();
                await cancelBooking(id);
                setPopUp(false);
              }}
            >
              Yes
            </button>
            <button
              className="px-3 py-1 bg-gray-400 text-white rounded"
              onClick={(e) => {
                e.stopPropagation();
                setPopUp(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      )}
      <div className="w-[100%] h-[67%] bg-[#2e2d2d] rounded-lg overflow-auto flex ">
        <img src={image1} alt="" className="w-[100%] flex-shrink-0" />
        <img src={image2} alt="" className="w-[100%] flex-shrink-0" />
        <img src={image3} alt="" className="w-[100%] flex-shrink-0" />
      </div>
      <div className="w-full p-4 flex flex-col gap-2 text-left ">
        <div className="flex items-center justify-between text-[18px]">
          <span className="w-[80%] text-ellipsis overflow-hidden font-semibold text-nowrap text-[#4a3434]">
            {`In ${landmark?.toUpperCase() || ""}, ${
              city?.toUpperCase() || ""
            }`}
          </span>
          <span className="flex items-center justify-center">
            <FaStar className="text-[#FFA500]" />
            {rating ?? 0}
          </span>
        </div>
        <span className="text-[15px] w-[80%] text-ellipsis overflow-hidden text-nowrap">
          {title?.toUpperCase()}
        </span>
        <span className="text-[16px] font-semibold text-[#986b6b]">
          ₹{rent}/day
        </span>
      </div>
    </div>
  );
}

export default Cart
