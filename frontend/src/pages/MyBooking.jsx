import React from 'react'
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../Context/UserContext';
import { FaArrowLeftLong } from 'react-icons/fa6';
import Cart from '../Component/Cart';
import { useContext } from 'react';

const MyBooking = () => {
  
 let navigate = useNavigate();
 let { userData } = useContext(userDataContext);
  console.log(userData);
 console.log(userData.booking)
 return (
   <div className=" flex items-center justify-center flex-col gap-[50px] relative">
     <div
       className="w-[50px] h-[50px] bg-[red] cursor-pointer absolute top-[120px] left-[80px]
 rounded-[50%] flex items-center justify-center "
       onClick={() => navigate("/")}
     >
       <FaArrowLeftLong className="w-[25px] h-[25px] text-[white]" />
     </div>
     <div className=" w-[50%] h-[10%] border-[2px] border-[#908c8c] p-[15px] flex items-center justify-center text-[30px] rounded-md text-[#613b3b] font-semibold mt-[30px] md:w-[600px] ">
       MY BOOKING
     </div>
     <div className="w-[100%] h-[90%] flex items-center justify-center gap-[0px] flex-wrap mt-[60px] ">
       {userData.booking.map((list) => (
         <Cart
           key={list._id}
           title={list.title}
           landmark={list.landmark}
           city={list.city}
           image1={list.image1}
           image2={list.image2}
           image3={list.image3}
           rent={list.rent}
           id={list._id}
           ratings={list.ratings}
           isBooked={list.isBooked}
           host={list.host}
         />
       ))}
     </div>
   </div>
 );
}

export default MyBooking
