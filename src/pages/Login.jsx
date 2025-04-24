import React, { useState } from "react";
import Navbar from "../components/UiBars/Navbar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/Input/PasswordInput";
import { validateEmail } from "../utils/helpers";
// import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import { BACKENDS_URL } from "../utils/constants";

const Login = () => {
  // const [email, setEmail] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    // if (!validateEmail(email)) {
    //   setError("Please enter a valid email address or username.");
    //   return;
    // }

    if (!emailOrUsername) {
      setError("Please enter a valid email address or username.");
      return;
    }

    if (!password) {
      setError("Please enter a valid password.");
      return;
    }
    setError("");

    try {
      const validation = {
        email: validateEmail(emailOrUsername) ? emailOrUsername : "",
        username: !validateEmail(emailOrUsername) ? emailOrUsername : "",
        password: password,
      };
      const response = await axios.post(
        `${BACKENDS_URL}/api/auth/login`,
        validation,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);
        setSuccessMsg(response.data.message);
        // console.log("1212: ", response.data.userInfo, "1313: ", response.data.message);

        setTimeout(() => {
          navigate("/dashboard");

        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else if (error.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else {
        setError("An unexpected error occured. Please try some time later.");
      }
    }
  };

  return (
    <div style={{
      // backgroundImage: `url('https://images.pexels.com/photos/2736499/pexels-photo-2736499.jpeg?auto=compress&cs=tinysrgb&w=1400')`,
      backgroundImage: `url('https://images.pexels.com/photos/5546909/pexels-photo-5546909.jpeg?auto=compress&cs=tinysrgb&w=1400')`,

      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh"
    }} >
      <Navbar />
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border-[3.5px] rounded-xl bg-white px-7 py-10 border-gray-200">
          <form onSubmit={loginHandler}>
            <h4 className="text-3xl text-center mb-7 font-bold">Login</h4>
            {successMsg && <p className="text-green-700 text-base mb-3">{successMsg}</p>}
            <input
              type="text"
              placeholder="Email or Username"
              className="input-box"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            />
            {/* <input type='text' placeholder='Password' className='input-box' /> */}
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link
                to="/signUp"
                className="font-medium text-blue-600 underline"
              >
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
