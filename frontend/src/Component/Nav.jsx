import React, { useContext, useEffect, useState  } from "react";
import { useNavigate } from "react-router-dom";
import BharatBnb from "../assets/BharatBnB.png";
import { FiSearch } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { MdWhatshot } from "react-icons/md";
import { GiFamilyHouse } from "react-icons/gi";
import { MdBedroomParent } from "react-icons/md";
import { MdOutlinePool } from "react-icons/md";
import { GiWoodCabin } from "react-icons/gi";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { IoBedOutline } from "react-icons/io5";
import { FaTreeCity } from "react-icons/fa6";
import { BiBuildingHouse } from "react-icons/bi";
import axios from "axios";
import {authDataContext} from "../Context/AuthContext";
import { userDataContext } from "../Context/UserContext";
import { listingDataContext } from "../Context/ListingContext";
// import { io } from "socket.io-client";
import { socket } from "../Context/Socket";




const Nav = () => {
  // const socket = io("http://localhost:8000", { withCredentials: true });
  let [showpopup, setShowpopup] = useState(false);
  let navigate = useNavigate();
  let {serverUrl} = useContext(authDataContext);
  let {userData, setUserData} = useContext(userDataContext);
  let [cate,setCate] = useState('')
  let { listingData, setListingData, newListData, setNewListData,searchData,handleSearch,handleViewCard } = useContext(listingDataContext);
  let [input,setInput] = useState("")
  const [notifications, setNotifications] = useState([]);
  const handleLogOut = async () => {
    try {
      let result = await axios.post(serverUrl + "/api/auth/logout",{}, {withCredentials : true})
      setUserData(null);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
  const handleClick = (id) => {
    if (userData) {
      handleViewCard(id);
    } else {
      navigate("/login");
    }
  };

  const handleCategory = (category) => {
    setCate(category);
    if(category=="Trending"){
      setNewListData(listingData);
    }else{
    setNewListData(listingData.filter((list)=>list.category==category))
    }
    
  }
   useEffect(()=>{
     console.log(input)
    handleSearch(input)
  },[input])
  
useEffect(() => {
  socket.on("newMessageNotification", (data) => {
    console.log("Notification:", data);

    setNotifications((prev) => [...prev, data]);
  });

  return () => socket.off("newMessageNotification");
}, []);

 



  return (
    <div className="mb-[0px]">
      <div className=" w-full bg-[white] z-[20]">
        {/* TOP NAV */}
        <div className="w-full min-h-[80px] border-b-[1px] border-[#dcdcdc] flex items-center justify-between px-[20px] md:px-[40px] ">
          {/* Logo */}
          <div className="flex items-center mr-[0px]">
            <img src={BharatBnb} alt="logo" className="w-[250px] " />
          </div>

          {/* Search */}
          <div className="w-[72%] relative hidden md:block ">
            <input
              type="text"
              className="w-full px-[30px] py-[10px] border-2 border-[#bdbaba] outline-none rounded-[30px] text-[17px]  "
              placeholder="Any Where  |   Any Location   |   Any City   "
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <button className="absolute right-[7px] top-[5px] p-[9px] rounded-full bg-red-500">
              <FiSearch className="w-[20px] h-[20px] text-[white]" />
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-[10px] relative">
            <span
              className="text-[18px] cursor-pointer rounded-full hover:bg-[#ded9d9] px-[8px] py-[5px] hidden md:block"
              onClick={() => navigate("/listingpage1")}
            >
              List your home
            </span>

            <button
              className="px-[20px] py-[10px] flex items-center gap-[5px] border border-[#8d8c8c] rounded-full hover:shadow-lg "
              onClick={() => setShowpopup((prev) => !prev)}
            >
              <span>
                <GiHamburgerMenu className="w-[20px] h-[20px]" />
              </span>
              {userData === null && (
                <span>
                  <CgProfile className="w-[23px] h-[23px]" />
                </span>
              )}
              {userData !== null && (
                <span className="w-[30px] h-[30px] bg-[#080808] text-[white] rounded-full  flex items-center justify-center ">
                  {userData?.name.slice(0, 1)}
                </span>
              )}
            </button>
            {notifications.length > 0 && (
              <div className="fixed top-5 right-5 bg-white shadow p-3 rounded">
                <p>New message 💬</p>
                <button
                  onClick={() =>
                    navigate("/accepted", {
                      state: { buddy: notifications[0]?.buddy },
                    })
                  }
                >
                  Open Chat
                </button>
              </div>
            )}
            {showpopup && (
              <div className="w-[220px] h-[250px] absolute bg-slate-50 top-[110%] right-[5%] border border-[#aaa9a9] z-10 rounded-lg md:right0[10%] cursor-pointer">
                <ul className="w-full h-full text-[17px] flex flex-col justify-around py-[10px]">
                  {!userData && (
                    <li
                      className="w-full px-[15px] py-[10px] hover:bg-[#f4f3f3]"
                      onClick={() => {
                        navigate("/login");
                        setShowpopup(false);
                      }}
                    >
                      Login
                    </li>
                  )}
                  {userData && (
                    <li
                      className="w-full px-[15px] py-[10px] hover:bg-[#f4f3f3]"
                      onClick={() => {
                        (handleLogOut(), setShowpopup(false));
                      }}
                    >
                      Logout
                    </li>
                  )}
                  <div className="w-full h-[1px] bg-[#c1c0c0]"></div>
                  <li
                    className="w-full px-[15px] py-[10px] hover:bg-[#f4f3f3]"
                    onClick={() => {
                      (navigate("/listingpage1"), setShowpopup(false));
                    }}
                  >
                    List your Home
                  </li>
                  <li
                    className="w-full px-[15px] py-[10px] hover:bg-[#f4f3f3]"
                    onClick={() => {
                      (navigate("/mylisting"), setShowpopup(false));
                    }}
                  >
                    My Listing
                  </li>
                  <li
                    className="w-full px-[15px] py-[10px] hover:bg-[#f4f3f3]"
                    onClick={() => {
                      (navigate("/mybooking"), setShowpopup(false));
                    }}
                  >
                    My Booking
                  </li>
                  <li
                    className="w-full px-[15px] py-[10px] hover:bg-[#f4f3f3]"
                    onClick={() => {
                      (navigate("/notification"), setShowpopup(false));
                    }}
                  >
                    Notification
                  </li>
                </ul>
              </div>
            )}
          </div>
          {searchData?.length > 0 && (
            <div className="w-[100vw] h-[450px] flex flex-col gap-[20px] absolute top-[50%] overflow-auto left-[0] justify-start items-center">
              <div className="max-w-[700px] w-[100vw] h-[300px] overflow-hidden flex flex-col bg-[#fefdfd] p-[20px] rounded-lg border-[1px] border-[#a2a1a1] cursor-pointer">
                {searchData.map((search) => (
                  <div
                    className="border-b border-[black] p-[10px]"
                    onClick={() => handleClick(search._id)}
                  >
                    {search.title} in {search.landmark},{search.city}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* // Search BAR  */}
        <div className="w-full h-[60px] flex items-center justify-center md:hidden">
          <div className="w-[80%] relative ">
            <input
              type="text"
              placeholder="Anywhere | Any Location | Any City"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-[30px] py-[10px] border-2 border-[#bdbaba] outline-none rounded-[30px] text-[17px]"
            />

            <button className="absolute right-[6px] top-[5px] p-[10px] rounded-full bg-red-500">
              <FiSearch className="w-[20px] h-[20px] text-white" />
            </button>
          </div>
        </div>

        {/* CATEGORY BAR */}
        <div className="w-full h-[100px] bg-white flex items-center justify-center cursor-pointer gap-[80px] overflow-auto md:justify-center px-[15px] mt-[15px]">
          <div
            className="flex flex-col items-center justify-center hover:border-b-[1px]  border-[rgb(166,165,165)] text-[13px]"
            onClick={() => {
              handleCategory("Trending");
              setCate(" ");
            }}
          >
            <MdWhatshot className="w-[30px] h-[30px]" />
            <h3>Trending</h3>
          </div>
          <div
            className={`flex flex-col items-center hover:border-b border-[#a6a5a5] text-[13px] ${
              cate == "Villa" ? "border-b-[1px] border-[#a6a5a5]" : ""
            }`}
            onClick={() => handleCategory("Family Homes")}
          >
            <GiFamilyHouse className="w-[30px] h-[30px]" />
            <h3>Family Homes</h3>
          </div>
          <div
            className={`flex flex-col items-center hover:border-b border-[#a6a5a5] text-[13px] ${
              cate == "BedRooms" ? "border-b-[1px] border-[#a6a5a5]" : ""
            }`}
            onClick={() => handleCategory("Budget Stays")}
          >
            <MdBedroomParent className="w-[30px] h-[30px]" />
            <h3>Budget Stays</h3>
          </div>
          <div
            className={`flex flex-col items-center hover:border-b border-[#a6a5a5] text-[13px] ${
              cate == "Pool House" ? "border-b-[1px] border-[#a6a5a5]" : ""
            }`}
            onClick={() => handleCategory("Luxury Villas")}
          >
            <MdOutlinePool className="w-[30px] h-[30px]" />
            <h3>Luxury Villas</h3>
          </div>
          <div
            className={`flex flex-col items-center hover:border-b border-[#a6a5a5] text-[13px] ${
              cate == "Cabin" ? "border-b-[1px] border-[#a6a5a5]" : ""
            }`}
            onClick={() => handleCategory("Apartments")}
          >
            <GiWoodCabin className="w-[30px] h-[30px]" />
            <h3>Apartments</h3>
          </div>
          <div
            className={`flex flex-col items-center hover:border-b border-[#a6a5a5] text-[13px] ${
              cate == "Shops" ? "border-b-[1px] border-[#a6a5a5]" : ""
            }`}
            onClick={() => handleCategory("Pilgrimage")}
          >
            <SiHomeassistantcommunitystore className="w-[30px] h-[30px]" />
            <h3>Pilgrimage</h3>
          </div>
          <div
            className={`flex flex-col items-center hover:border-b border-[#a6a5a5] text-[13px] ${
              cate == "PG" ? "border-b-[1px] border-[#a6a5a5]" : ""
            }`}
            onClick={() => handleCategory("Student Stays")}
          >
            <IoBedOutline className="w-[30px] h-[30px]" />
            <h3>Student Stays</h3>
          </div>
          <div
            className={`flex flex-col items-center hover:border-b border-[#a6a5a5] text-[13px] ${
              cate == "Farm House" ? "border-b-[1px] border-[#a6a5a5]" : ""
            }`}
            onClick={() => handleCategory("Farm House")}
          >
            <FaTreeCity className="w-[30px] h-[30px]" />
            <h3>Farm House</h3>
          </div>
          <div
            className={`flex flex-col items-center hover:border-b border-[#a6a5a5] text-[13px] ${
              cate == "Flat" ? "border-b-[1px] border-[#a6a5a5]" : ""
            }`}
            onClick={() => handleCategory("Workcation")}
          >
            <BiBuildingHouse className="w-[30px] h-[30px]" />
            <h3>Workcation</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
