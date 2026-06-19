import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { authDataContext } from "../Context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {loading,setLoading} = useContext(authDataContext);

  const handleSignUp = async (e) => {
    setLoading(true)
    try {
      e.preventDefault(); 
      const res = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true } 
      );
      
      setLoading(false)
       navigate("/");
       toast.success("SignUp Successfully")
      console.log("Signup success:", res.data);
     
      
    } catch (err) {
      setLoading(false);
      console.log("Signup error:", err.response?.data || err.message);
      toast.error("Soomthing Went Wrong");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center px-4">
      {/* Back button */}
      <div
        className="w-[50px] h-[50px] bg-[red] cursor-pointer absolute top-[10%] left-[80px] rounded-[50%] flex items-center justify-center"
        onClick={() => navigate("/")}
      >
        <FaArrowLeftLong className="w-[25px] h-[25px] text-[white]" />
      </div>

      <form
        className="max-w-[900px] w-[90%] h-[600px] flex items-center justify-center flex-col md:items-start gap-[10px]"
        onSubmit={handleSignUp}
      >
        <h1 className="text-[30px] text-[black]">Welcome to Bharatbnb</h1>

        {/* Name */}
        <div className="w-[90%] flex items-start justify-start flex-col gap-[10px]">
          <label htmlFor="name" className="text-[20px]">
            UserName
          </label>
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            className="w-full h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="w-full flex items-start justify-start flex-col gap-[10px]">
          <label htmlFor="email" className="text-[20px]">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="w-full flex items-start justify-start flex-col gap-[10px]">
          <label htmlFor="password" className="text-[20px]">
            Password
          </label>
          <input
            type={show ? "text" : "password"}
            id="password"
            name="password"
            autoComplete="new-password"
            className="w-[90%] h-[40px] border-[2px] border-[#555656] rounded-lg text-[18px] px-[20px]"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!show && (
            <IoMdEye
              className="w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            />
          )}
          {show && (
            <IoMdEyeOff
              className="w-[22px] h-[22px] absolute right-[12%] bottom-[10px] cursor-pointer"
              onClick={() => setShow((prev) => !prev)}
            />
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="px-[50px] py-[10px] bg-[red] text-[white] text-[18px] rounded-lg md:px-[100px]"
          disabled={loading}
        >
          {loading ? "loading..." : "SignUp"}
        </button>

        <p>
          Already have an account?{" "}
          <span
            className="text-[19px] text-[red] cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
