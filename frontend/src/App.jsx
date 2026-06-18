import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Homes from "./pages/Homes";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ListingPage1 from "./pages/ListingPage1";
import ListingPage2 from "./pages/ListingPage2";
import ListingPage3 from "./pages/ListingPage3";
import { userDataContext } from "./Context/UserContext";
import { useContext } from "react";
import MyListing from "./pages/MyListing";
import ViewCart from "./pages/ViewCart";
import MyBooking from "./pages/MyBooking";
import Booked from "./pages/Booked";
import { ToastContainer, toast } from "react-toastify";
import BuddiesForm from "./pages/BuddiesForm";
import Notification from "./pages/Notification";
import Accepted from "./pages/Accepted";

function App() {
  let { userData } = useContext(userDataContext);
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={userData !== null ? <Homes /> : <Navigate to={"/login"} />}
        ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/SignUp" element={<SignUp />}></Route>
        <Route
          path="/listingpage1"
          element={userData !== null ? <ListingPage1 /> : <Navigate to={"/"} />}
        />
        <Route
          path="/listingpage2"
          element={userData !== null ? <ListingPage2 /> : <Navigate to={"/"} />}
        />
        <Route
          path="/listingpage3"
          element={userData !== null ? <ListingPage3 /> : <Navigate to={"/"} />}
        />
        <Route
          path="/mylisting"
          element={userData !== null ? <MyListing /> : <Navigate to={"/"} />}
        />
        <Route
          path="/viewcard"
          element={userData !== null ? <ViewCart /> : <Navigate to={"/"} />}
        />
        <Route
          path="/mybooking"
          element={userData !== null ? <MyBooking /> : <Navigate to={"/"} />}
        />
        <Route
          path="/booked"
          element={userData !== null ? <Booked /> : <Navigate to={"/"} />}
        />
        <Route
          path="/buddies"
          element={userData !== null ? <BuddiesForm /> : <Navigate to={"/"} />}
        />
        <Route
          path="/notification"
          element={userData !== null ? <Notification /> : <Navigate to={"/"} />}
        />
        <Route
          path="/accepted"
          element={userData !== null ? <Accepted/> : <Navigate to={"/"} />}
        />
      </Routes>
    </>
  );
}

export default App;
