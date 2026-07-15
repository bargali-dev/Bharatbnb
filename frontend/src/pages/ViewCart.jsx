import React, { useContext, useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { listingDataContext } from "../Context/ListingContext";
import { userDataContext } from "../Context/UserContext";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { FaStar } from "react-icons/fa6";
import { authDataContext } from "../Context/AuthContext";
import { bookingDataContext } from "../Context/BookingContext";
import { toast } from "react-toastify";
const ViewCart = () => {
  let navigate = useNavigate();
  let { cardDetails } = useContext(listingDataContext);
  let { userData } = useContext(userDataContext);
  let [updatePopUp, setUpadatePopUp] = useState(false);
  let [bookingPopUp, setBookingPopUp] = useState(false);
  let [title, setTitle] = useState(cardDetails.title);
  let [description, setdescription] = useState(cardDetails.description || " ");
  let [backEndImage1, setBackEndImage1] = useState(null);
  let [backEndImage2, setBackEndImage2] = useState(null);
  let [backEndImage3, setBackEndImage3] = useState(null);
  let [rent, setRent] = useState(cardDetails.rent);
  let [city, setCity] = useState(cardDetails.city);
  let [category, setCategory] = useState(cardDetails.category);
  let [landmark, setLandmark] = useState(cardDetails.landMark);
  let {serverUrl} = useContext(authDataContext);
  let {updating, setUpdating} = useContext(listingDataContext);
  let {deleting, setDeleting} = useContext(listingDataContext);
  let [minDate, setMinDate] = useState("")
  let {checkIn, setCheckIn} = useContext(bookingDataContext)
  let { checkOut, setCheckOut } = useContext(bookingDataContext);
  let { total, setTotal } = useContext(bookingDataContext);
  let { night, setNight, handleBooking,booking } = useContext(bookingDataContext);
  
  
  useEffect(()=>{
    if(checkIn && checkOut){
      let InDate = new Date(checkIn);
      let OutDate = new Date(checkOut);
      let n = (OutDate-InDate)/(24*60*60*1000)
      setNight(n);
      let airbnbCharge = (cardDetails.rent*(7/100))
       let tax = cardDetails.rent * (7 / 100);
       if(n>0){
        setTotal((cardDetails.rent*n) + airbnbCharge+tax)
       }else{
        setTotal(0)
       }
    }
  },[checkIn,checkOut,cardDetails.rent,total])

  const handleUpdateListing = async () => {
    setUpdating(true)
    try {
      let formData = new FormData();
      formData.append("title", title);
      formData.append("image1", backEndImage1);
      formData.append("image2", backEndImage2);
      formData.append("image3", backEndImage3);
      formData.append("description", description);
      formData.append("rent", rent);
      formData.append("city", city);
      formData.append("landMark", landmark);
      console.log(serverUrl);
     let result = await axios.post(
       `${serverUrl}/api/listing/update/${cardDetails._id}`,
       formData,
       {
         withCredentials: true,
       }
     );

      setUpdating(false);

      
      console.log(result);
      toast.success("Listing Updated")
      navigate("/");
      setTitle("");
      setdescription("");
      setFrontEndImage1(null);
      setFrontEndImage2(null);
      setFrontEndImage1(null);
      setBackEndImage1(null);
      setBackEndImage2(null);
      setBackEndImage3(null);
      setRent("");
      setCity("");
      setLandmark("");
    } catch (error) {
      setUpdating(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const handleDelteListing = async () => {
   setDeleting(true)
    try {

      console.log(serverUrl);
      let result = await axios.delete(
        `${serverUrl}/api/listing/delete/${cardDetails._id}`,
       { withCredentials: true}  );
       console.log(result.data)
      setDeleting(false);
      console.log(result);
       navigate("/");
       toast.success("Listing Delete")
       
      
    } catch (error) {
      setDeleting(false)
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
   const handleImage1 = (e) => {
     let file = e.target.files[0];
     setBackEndImage1(file);
   };
   const handleImage2 = (e) => {
     let file = e.target.files[0];
     setBackEndImage2(file);
   };
   const handleImage3 = (e) => {
     let file = e.target.files[0];
     setBackEndImage3(file);
   };
   useEffect(() =>{
    let today = new Date().toISOString().split('T')[0];
    setMinDate(today)
   },[])

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center relative overflow-auto">
      <div
        className="w-[50px] h-[50px] bg-red-500 cursor-pointer absolute top-[30px] left-[40px] rounded-full flex items-center justify-center"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong className="w-[25px] h-[25px] text-white" />
      </div>

      {/* Title */}
      <div className="w-[95%] md:w-[80%] mt-[80px] mb-[15px]">
        <h1 className="text-[22px] md:text-[32px] font-semibold text-[#272727] truncate px-[30px] md:px[0px]">
          {`In ${cardDetails.landmark?.toUpperCase()}, ${cardDetails.city?.toUpperCase()}`}
        </h1>
      </div>

      {/* Image Section */}
      <div className="w-[95%] md:w-[80%] flex flex-col md:flex-row gap-[10px]">
        {/* Big Image */}
        <div className="w-full md:w-[70%] h-[310px] md:h-[600px] overflow-hidden rounded-[14px]">
          <img
            src={cardDetails.image1}
            alt="Main property"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Small Images */}
        <div className="w-full md:w-[30%] h-[170px] md:h-[600px] flex flex-row md:flex-col gap-[10px]">
          <div className="w-[50%] md:w-full h-full md:h-[50%] overflow-hidden rounded-[14px]">
            <img
              src={cardDetails.image2}
              alt="Property view 1"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="w-[50%] md:w-full h-full md:h-[50%] overflow-hidden rounded-[14px]">
            <img
              src={cardDetails.image3}
              alt="Property view 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px]">
        {`${cardDetails.title?.toUpperCase()} , ${cardDetails?.landmark?.toUpperCase()}`}
      </div>

      <div className="w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px] text-gray-800 ">{`${cardDetails.description?.toUpperCase()}`}</div>

      <div className="w-[95%] flex items-start justify-start text-[18px] md:w-[80%] md:text-[25px] ">{`${cardDetails.rent}/day`}</div>

      <div className="w-[95%] h-[50px] flex items-center justify-start px-[110px] ">
        {cardDetails.host == userData._id && (
          <button
            className="px-[30px] py-[10px] bg-[red] text-[white] text-[18px] md:px-[100px] rounded-lg "
            onClick={() => setUpadatePopUp((prev) => !prev)}
          >
            Edit Listing
          </button>
        )}
      </div>
      <div className="flex items-center justify mt-0px ml-0px  gap-14">
        {cardDetails.host != userData._id && (
          <button
            className="px-[30px] py-[10px] bg-[red] text-[white] text-[18px] md:px-[100px] rounded-lg "
            onClick={() => setBookingPopUp(true)}
          >
            Private Stay
          </button>
        )}
        {cardDetails.host != userData._id && (
          <button
            className="px-[30px] py-[10px] bg-[red] text-[white] text-[18px] md:px-[100px] rounded-lg "
            onClick={() =>
              navigate("/buddies", {
                state: { propertyId: cardDetails._id }, 
              })
            }
          >
            Travel Buddies
          </button>
        )}
      </div>

      {/* Update Listing Page */}

      {updatePopUp && (
        <div className="w-[100%] h-[100%] flex items-center justify-center bg-[#000000a9] absolute top-[0px] z-[100] backdrop-blur-sm">
          <RxCross2
            className="w-[50px] h-[50px] bg-red-500 cursor-pointer absolute top-[20px] left-[20px] rounded-full flex items-center justify-center"
            onClick={() => setBookingPopUp(false)}
          />

          <form
            action=""
            className="max-w-[900px] w-[90%] h-[550px] flex items-center justify-start flex-col  gap-[10px] overflow-auto mt-[50px] ml-[10px] text-white bg-[#272727] p-[10px] rounded-lg"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="w-[200px] h-[50px] text-[20px] bg-[#f14242] text-[white] flex items-center justify-center rounded-[30px] absolute top-[5%] right-[10px] shadow-lg">
              Update Your Details
            </div>
            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px] ">
              <label htmlFor="title" className="text-[20px]">
                Title
              </label>
              <input
                type="text"
                id="title"
                className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]"
                placeholder="_bhk house or best title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </div>
            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px] ">
              <label htmlFor="des" className="text-[20px]">
                description
              </label>
              <textarea
                name="description"
                id="dis"
                className="w-[90%] h-[80px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]"
                onChange={(e) => setdescription(e.target.value)}
                value={description}
              ></textarea>
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px] ">
              <label htmlFor="img1" className="text-[20px]">
                Image1
              </label>
              <div className="flex items-center justify-start w-[90%] h-[40px] border-[#444656] border-2 rounded-[10px]  ">
                <input
                  type="file"
                  id="img1"
                  className="w-[100%]  text-[15px] px-[10px] "
                  onChange={handleImage1}
                />
              </div>
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px] ">
              <label htmlFor="img2" className="text-[20px]">
                Image2
              </label>
              <div className="flex items-center justify-start w-[90%] h-[40px] border-[#444656] border-2 rounded-[10px]  ">
                <input
                  type="file"
                  id="img2"
                  className="w-[100%]  text-[15px] px-[10px] "
                  onChange={handleImage2}
                />
              </div>
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px] ">
              <label htmlFor="img3" className="text-[20px]">
                Image3
              </label>
              <div className="flex items-center justify-start w-[90%] h-[40px] border-[#444656] border-2 rounded-[10px]  ">
                <input
                  type="file"
                  id="img3"
                  className="w-[100%]  text-[15px] px-[10px] "
                  onChange={handleImage3}
                />
              </div>
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px] ">
              <label htmlFor="rent" className="text-[20px]">
                Rent
              </label>
              <input
                type="text"
                id="rent"
                className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]"
                placeholder="_________/day"
                onChange={(e) => setRent(e.target.value)}
                value={rent}
              />
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px] ">
              <label htmlFor="city" className="text-[20px]">
                City
              </label>
              <input
                type="text"
                id="city"
                className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]"
                placeholder="City,Country"
                onChange={(e) => setCity(e.target.value)}
                value={city}
              />
            </div>

            <div className="w-[90%] flex items-start justify-start flex-col gap-[10px] ">
              <label htmlFor="landmark" className="text-[20px]">
                Landmark
              </label>
              <input
                type="text"
                id="landmark"
                className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] text-[black]"
                onChange={(e) => setLandmark(e.target.value)}
                value={landmark}
              />
            </div>
            <div className="w-[100%]  flex items-center justify-center gap-[30px] mt-[20px] ">
              <button
                className="px-[10px] py-[10px] text-nowrap bg-[red] text-[white] text-[15px] rounded-lg md:px-[100px] md:text-[18px]"
                onClick={handleUpdateListing}
              >
                {updating ? "updating" : "Update Listing"}
              </button>
              <button
                className="px-[10px] py-[10px] text-nowrap bg-[red] text-[white] text-[15px] rounded-lg md:px-[100px] md:text-[18px]"
                onClick={handleDelteListing}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Listing"}
              </button>
            </div>
          </form>
        </div>
      )}
      {bookingPopUp && (
        <div className="w-[100%] h-[100%] flex items-center justify-center flex-col gap-[30px]  bg-[white] absolute top-[0px] z-[100] px-[20px]  backdrop-blur-sm md:flex-row md:gap-[100px]">
          {" "}
          <RxCross2
            className="w-[50px] h-[50px] bg-red-500 cursor-pointer absolute top-[20px] left-[20px] rounded-full flex items-center justify-center"
            onClick={() => setBookingPopUp(false)}
          />
          <div className=""></div>
          <form
            className="max-w-[450px] w-[90%] h-[450px] overflow-auto bg-[#f7fbfcfe] p-[20px] rounded-lg flex items-center justify-center flex-col gap-[10px] border-[1px] border-[#dedddd]"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <h1 className="w-[100%] flex items-center justify-center  py-[10px] text-[25px] border-b-[1px] border-[#a3a3a3]">
              Confirm & Book
            </h1>
            <div className="w-[100%] h-[70%]  mt-[10px] rounded-lg flex items-center justify-center flex-col ">
              <h3 className="text-[19px] font-semibold">Your Trip -</h3>
              <div className="w-[90%] flex items-center justify-start mt-[25px] md:justify-center flex-col md:flex-row gap-[24px] md:items-start">
                <label htmlFor="checkIn" className="text-[15px] md:text-[20px]">
                  CheckIn
                </label>
                <input
                  type="date"
                  min={minDate}
                  id="checkIn"
                  className="border-[#555656] border-2 w-[200px] h-[40px] rounded-[10px] text-[18px] px-[10px] bg-transparent  md:text-[18px]"
                  required
                  onChange={(e) => setCheckIn(e.target.value)}
                  value={checkIn}
                />
              </div>

              <div className="w-[90%] flex items-center justify-start mt-[40px] md:justify-center flex-col md:flex-row gap-[10px] md:items-start">
                <label
                  htmlFor="checkOut"
                  className="text-[15px] md:text-[20px]"
                >
                  CheckOut
                </label>
                <input
                  type="date"
                  min={minDate}
                  id="checkOut"
                  className="border-[#555656] border-2 w-[200px] h-[40px] rounded-[10px] text-[18px] px-[10px] bg-transparent  md:text-[18px]"
                  required
                  onChange={(e) => setCheckOut(e.target.value)}
                  value={checkOut}
                />
              </div>
              <div className="w-[100%] flex items-center justify-center">
                <button
                  className="px-[80px] py-[10px] text-nowrap bg-[red] text-[white] text-[15px] rounded-lg md:px-[100px] md:text-[18px] mt-[30px]"
                  onClick={() =>  handleBooking(cardDetails._id
  )}
                  disabled={booking}
                >
                  {booking ? "...Booking" : "Book Now"}
                </button>
              </div>
            </div>
          </form>
          <div className="max-w-[450px] w-[90%] h-[450px] bg-[#f7fbfcfe] p-[20px] rounded-lg flex items-center justify-center flex-col gap-[10px] border-[1px] border-[#e2e1e1]">
            <div className="w-[95%] h-[30%] border-[1px] border-[#dedddd] rounded-lg flex items-center justify-center gap-[8px] p-[20px] overflow-hidden ">
              <div className="w-[70px] h-[90px] flex items-center justify-center flex-shrink-0 rounded-lg md:w-[100px] md:h-[100px] ">
                {" "}
                <img
                  className="w-[100%] h-[100%] rounded-lg"
                  src={cardDetails.image1}
                  alt=""
                />
              </div>
              <div className="w-[80%] h-[100px] gap-[5px]">
                <h1 className="w-[90%] flex items-center justify-center truncate">{`IN ${cardDetails.landmark.toUpperCase()},${cardDetails.city.toUpperCase()}`}</h1>
                <h1>{cardDetails.title.toUpperCase()}</h1>
                <h1>{cardDetails.category.toUpperCase()}</h1>
                <h1 className="flex itemes-center justify-start gap-[5px] ">
                  <FaStar className="text-[#FFA500]" />
                  {cardDetails.ratings}
                </h1>
              </div>
            </div>
            <div className="w-[95%] h-[60%] border-[1px] border-[#dedddd] rounded-lg flex items-start justify-start p-[20px] gap-[15px] flex-col">
              <h1 className="text-[22px] font-semibold">Booking Price - </h1>
              <p className="w-[100%] flex justify-between items-center px-[20px]">
                <span className="font-semibold">{`₹${cardDetails.rent} X ${night} nights`}</span>
                <span>{cardDetails.rent * night}</span>
              </p>
              <p className="w-[100%] flex justify-between items-center px-[20px]">
                <span className="font-semibold"> Tax</span>
                <span>{(cardDetails.rent * 7) / 100}</span>
              </p>
              <p className="w-[100%] flex justify-between items-center px-[20px] border-b-[1px] border-gray-500 pb-[10px]">
                <span className="font-semibold">Airbnb Charge</span>
                <span>{(cardDetails.rent * 7) / 100}</span>
              </p>
              <p className="w-[100%] flex justify-between items-center px-[20px]">
                <span className="font-semibold"> Total Price</span>
                <span>{total}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCart;
