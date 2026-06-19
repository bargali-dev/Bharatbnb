import React, { useEffect } from 'react'
import Nav from '../Component/Nav';
import { useContext } from 'react';
import { listingDataContext } from '../Context/ListingContext';
import Cart from '../Component/Cart';
import Footer from '../Component/Footer';
import { userDataContext } from '../Context/UserContext';
import { socket } from "../Context/Socket";


const Homes = () => {
  let {listingData,setListingData,newListData} = useContext(listingDataContext)
  let {userData} = useContext(userDataContext)
    useEffect(() => {
      if (userData?._id) {
        socket.emit("registerUser", userData._id);
      }
    }, [userData]);
  return (
    <div className="w-full px-6 md:px-10 ">
      <Nav />

      <div className="w-full mt-10 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {newListData.map((list) => (
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
            rating={list.rating}
            isBooked={list.isBooked}
            host={list.host}
            guest={list.guest}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default Homes;
