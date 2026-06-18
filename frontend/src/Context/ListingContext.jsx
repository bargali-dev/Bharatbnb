import axios from "axios";
import React from "react";
import { useState } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { authDataContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const listingDataContext = createContext();

const ListingContext = ({ children }) => {
  let navigate = useNavigate();
  let [title, setTitle] = useState("");
  let [description, setdescription] = useState("");
  let [frontEndImage1, setFrontEndImage1] = useState(null);
  let [frontEndImage2, setFrontEndImage2] = useState(null);
  let [frontEndImage3, setFrontEndImage3] = useState(null);
  let [backEndImage1, setBackEndImage1] = useState(null);
  let [backEndImage2, setBackEndImage2] = useState(null);
  let [backEndImage3, setBackEndImage3] = useState(null);
  let [rent, setRent] = useState("");
  let [city, setCity] = useState("");
  let [landmark, setLandmark] = useState("");
  let [category, setCategory] = useState("");
  let [adding, setAdding] = useState(false);
  let [updating, setUpdating] = useState(false);
  let [deleting, setDeleting] = useState(false);
  let [listingData, setlistingData] = useState([]);
  let [newListData, setNewListData] = useState([]);
  let [cardDetails, setCardDetails] = useState(null);
  let [searchData , setSearchData] = useState([])
    let [ratings, setRatings] = useState("");

  let { serverUrl } = useContext(authDataContext);

  let handleAddListing = async () => {
    setAdding(true);
    try {
      let formData = new FormData();
      formData.append("title", title);
      if(backEndImage1){formData.append("image1", backEndImage1)};
      if(backEndImage2){formData.append("image2", backEndImage2)};
      if(backEndImage3){formData.append("image3", backEndImage3)};
      formData.append("description", description);
      formData.append("rent", rent);
      formData.append("city", city);
      formData.append("landMark", landmark);
      formData.append("category", category);
      // formData.append("ratings",ratings);
      console.log(serverUrl);
      let result = await axios.post(serverUrl+"/api/listing/add",formData, {
        withCredentials: true,
      });
      setAdding(false);
      console.log(result);
      navigate("/");
      toast.success("AddListing Successfully")
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
      setCategory("");
      setLandmark("");
      setRatings("");
    } catch (error) {
      setAdding(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const handleViewCard = async (id) => {
    try {
      let result = await axios.get(
        serverUrl+`/api/listing/findlistingbyid/${id}`,
        { withCredentials: true }
      );
      setCardDetails(result.data);
      navigate("/viewcard");
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = async (data) => {
    try {
      if (!data || data.trim() === "") return;

      const result = await axios.get(
        `${serverUrl}/api/listing/search?query=${data}`,
        { withCredentials: true },
      );

      setSearchData(result.data);
    } catch (error) {
      setSearchData(null);
      console.log(error);
    }
  };

  const getListing = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/listing/get", {
        withCredentials: true,
      });
      console.log(result.data);
      setlistingData(result.data);
      setNewListData(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getListing();
  }, [adding , updating,deleting]);

  let value = {
    title,
    setTitle,
    description,
    setdescription,
    frontEndImage1,
    setFrontEndImage1,
    frontEndImage2,
    setFrontEndImage2,
    frontEndImage3,
    setFrontEndImage3,
    backEndImage1,
    setBackEndImage1,
    backEndImage2,
    setBackEndImage2,
    backEndImage3,
    setBackEndImage3,
    rent,
    setRent,
    city,
    setCity,
    landmark,
    setLandmark,
    category,
    setCategory,
    handleAddListing,
    adding,
    setAdding,
    listingData,
    setlistingData,
    getListing,
    newListData,
    setNewListData,
    handleViewCard,
    cardDetails,
    setCardDetails,
    updating,
    setUpdating,
    deleting,
    setDeleting,
    handleSearch,
    searchData,
    setSearchData,
  };
  return (
    <div>
      <listingDataContext.Provider value={value}>
        {children}
      </listingDataContext.Provider>
    </div>
  );
};

export default ListingContext;
