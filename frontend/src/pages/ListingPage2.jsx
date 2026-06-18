import React, { useContext } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { GiFamilyHouse } from "react-icons/gi";
import { FaTreeCity } from "react-icons/fa6";
import { MdOutlinePool } from "react-icons/md";
import { MdBedroomParent } from "react-icons/md";
import { GiWoodCabin } from "react-icons/gi";
import { IoBedOutline } from "react-icons/io5";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { BiBuildingHouse } from "react-icons/bi";
import { listingDataContext } from '../Context/ListingContext';
import ListingPage3 from './ListingPage3';
const ListingPage2 = () => {
   let navigate = useNavigate();
   let {category,setCategory }= useContext(listingDataContext)
  return (
    <div className="w-[100%] h-[100vh] bg-white flex items-center justify-center overflow-auto relative">
      <div
        className="w-[50px] h-[50px] bg-[red] cursor-pointer absolute top-[5%] left-[80px] rounded-[50%] flex items-center justify-center"
        onClick={() => navigate("/listingpage1")}
      >
        <FaArrowLeftLong className="w-[25px] h-[25px] text-[white]" />
      </div>
      <div className="w-[220px] h-[50px] text-[20px] bg-[#f14242] text-[white] flex items-center justify-center rounded-[30px] absolute top-[5%] right-[10px] shadow-lg">
        Set Your Category
      </div>
      <div className="max-w-[900px] w-[100%] h-[550px] overflow-autobg-white flex items-center justify-start flex-col gap-[40px] mt-[30px] ">
        <h1 className="text-[18px] text-[black] md:text-[30px]">
          Which of these best describes your place?
        </h1>

        <div className="max-w-[900px] w-[100%] h-[100%] flex flex-wrap items-center justify-center  gap-[20px] mid:w-[70%]">
          <div
            className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a5a5a5] text-[16px] rounded-lg ${
              category === "Family Homes" ? "border-3 border-[#8b8b8b]" : " "
            } `}
            onClick={() => {
              setCategory("Family Homes");
            }}
          >
            <GiFamilyHouse className="w-[30px] h-[30px] text-[black]" />
            <h3>Family Homes</h3>
          </div>

          <div
            className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a5a5a5] text-[16px] rounded-lg ${
              category === "Budget Stays" ? "border-3 border-[#8b8b8b]" : " "
            } `}
            onClick={() => {
              setCategory("Budget Stays");
            }}
          >
            <FaTreeCity className="w-[30px] h-[30px] text-[black]" />
            <h3>Budget Stays</h3>
          </div>

          <div
            className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a5a5a5] text-[16px] rounded-lg ${
              category === "Luxury Villas" ? "border-3 border-[#8b8b8b]" : " "
            } `}
            onClick={() => {
              setCategory("Luxury Villas");
            }}
          >
            <MdOutlinePool className="w-[30px] h-[30px] text-[black]" />
            <h3>Luxury Villas</h3>
          </div>

          <div
            className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a5a5a5] text-[16px] rounded-lg ${
              category === "Apartments" ? "border-3 border-[#8b8b8b]" : " "
            } `}
            onClick={() => {
              setCategory("Apartments");
            }}
          >
            <MdBedroomParent className="w-[30px] h-[30px] text-[black]" />
            <h3>Apartments</h3>
          </div>

          <div
            className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a5a5a5] text-[16px] rounded-lg ${
              category === "Pilgrimage" ? "border-3 border-[#8b8b8b]" : " "
            } `}
            onClick={() => {
              setCategory("Pilgrimage");
            }}
          >
            <BiBuildingHouse className="w-[30px] h-[30px] text-[black]" />
            <h3>Pilgrimage</h3>
          </div>

          <div
            className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a5a5a5] text-[16px] rounded-lg ${
              category === "Student Stays" ? "border-3 border-[#8b8b8b]" : " "
            } `}
            onClick={() => {
              setCategory("Student Stays");
            }}
          >
            <IoBedOutline className="w-[30px] h-[30px] text-[black]" />
            <h3>Student Stays</h3>
          </div>

          <div
            className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a5a5a5] text-[16px] rounded-lg ${
              category === "Farm House" ? "border-3 border-[#8b8b8b]" : " "
            } `}
            onClick={() => {
              setCategory("Farm House");
            }}
          >
            <GiWoodCabin className="w-[30px] h-[30px] text-[black]" />
            <h3>Farm House</h3>
          </div>

          <div
            className={`w-[180px] h-[100px] flex justify-center items-center flex-col cursor-pointer border-[2px] hover:border-[#a5a5a5] text-[16px] rounded-lg ${
              category === "Workcation" ? "border-3 border-[#8b8b8b]" : " "
            } `}
            onClick={() => {
              setCategory("Workcation");
            }}
          >
            <SiHomeassistantcommunitystore className="w-[30px] h-[30px] text-[black]" />
            <h3>Workcation</h3>
          </div>
          <button
            className="px-[50px] py-[10px] bg-[red] text-[white] text-[18px] rounded-lg md:px[100px] absolute right-[5%] bottom-[10%] "
            disabled={!category}
            onClick={() => navigate("/listingpage3")}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListingPage2
