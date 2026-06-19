import React, { useState } from "react";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useContext } from "react";
import { authDataContext } from "../Context/AuthContext";
import axios from "axios";
import { userDataContext } from "../Context/UserContext";
import { toast } from "react-toastify";


const Login = () => {
   let [show, setShow] = useState(false);
   let {serverUrl} = useContext(authDataContext);
   let navigate = useNavigate();
   let [email,setEmail] = useState("");
   let [password,setPassword] = useState("");
   let {userData, setUserData} = useContext(userDataContext)
  let {loading,setLoading} = useContext(authDataContext);
    const handleLogin = async (e) => {
      setLoading(true)
      
      try {
        e.preventDefault();
        const res = await axios.post(
          `${serverUrl}/api/auth/login`,
          { email, password },
          { withCredentials: true }) ; 
          
          setUserData(res.data)
          setLoading(false);
          navigate('/')
          toast.success("Login Successfully")
          

        console.log("Login success:", res.data);
      } catch (err) {
        setLoading(false)
        console.log("login error:", err.response?.data || err.message);
        toast.error(err.response.data.message)
      }
    };
  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center px-4">
      <div
        className="w-[50px] h-[50px] bg-[red] cursor-pointer absolute top-[10%] left-[80px] rounded-[50%] flex items-center justify-center"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong className="w-[25px] h-[25px] text-[white]" />
      </div>
      <form
        action=""
        className="max-w-[900px] w-full h-[600px] flex items-center justify-center flex-col md:items-start gap-[10px]  "
        onSubmit={handleLogin}
      >
        <h1 className="text-[30px] text-[black]">Welcome to Bharatbnb</h1>

        {/* // email  */}
        <div className="w-full flex items-start justify-start flex-col gap-[10px]">
          <label htmlFor="email" className="text-[20px]">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] "
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* /// password  */}
        <div className="w-full flex items-start justify-start flex-col gap-[10px]  relative">
          <label htmlFor="password" className="text-[20px] ">
            Password
          </label>
          <input
            type={show ? "text" : "password"}
            id="password"
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px] "
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!show && (
            <IoMdEye
              className="w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            />
          )}
          {show && (
            <IoMdEyeOff
              className="w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer "
              onClick={() => setShow((prev) => !prev)}
            />
          )}
        </div>
        <button
          className="px-[50px] py-[10px] bg-[red] text-[white] text-[18px] rounded-lg md:px-[100px]"
          disabled={loading}
        >
          {loading ? "loading..." : "Login"}
        </button>
        <p>
          Create new account{" "}
          <span
            className="text-[19px] text-[red] cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            SignUp
          </span>
        </p>
      </form>
    </div>
  );
}

export default Login
