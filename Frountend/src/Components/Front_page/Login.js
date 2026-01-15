import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { jwtDecode } from "jwt-decode";
import {
  PersonFill,
  UnlockFill,
  Eye,
  EyeSlash,
  BoxArrowInRight,
  InfoCircle,
} from "react-bootstrap-icons";
import LoginErrorModal from "./loginerrormodal";

const Login = ({ onLogin }) => {
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const [logoImageLoaded, setLogoImageLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const { roleName } = jwtDecode(token);
        onLogin(true);

        switch (roleName) {
          case "HR":
            navigate("/HrDashboard");
            break;
          case "IT":
            navigate("/ItDashboard");
            break;
          case "Admin":
            navigate("/Dashboard");
            break;
          default:
            setError("Unauthorized role");
            onLogin(false);
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        onLogin(false);
      }
    }
  }, [navigate, onLogin]);

  useEffect(() => {
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);

    return () => {
      window.removeEventListener("popstate", preventBack);
    };
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    localStorage.setItem("currentPath", currentPath);
  }, [location.pathname]);

  useEffect(() => {
    const savedPath = localStorage.getItem("currentPath");
    if (savedPath) {
      navigate(savedPath);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login attempt:", { employeeCode, password });

    try {
      const response = await axios.post(
        "https://cuguat.midlandmicrofin.co.in/api/auth/login",
        // https://cuguat.midlandmicrofin.co.in/
        // http://localhost:4000
        { employeeCode, password }
      );
      console.log("Response from backend:", response.data);

      if (response.data.token) {
        const { token } = response.data;
        localStorage.setItem("token", token);

        const { employeeCode, roleName, regionName,employeeName } = jwtDecode(token);
        localStorage.setItem("employeeCode", employeeCode);
        localStorage.setItem("region", regionName);
        localStorage.setItem("roleName", roleName);
        localStorage.setItem("name", employeeName);
        // fill the local storage with the data from the token 
        


       

        onLogin(true);

        switch (roleName) {
          case "HR":
            console.log("Navigating to HR Dashboard");
            navigate("/HrDashboard");
            break;
          case "IT":
            console.log("Navigating to IT Dashboard");
            navigate("/ItDashboard");
            break;
          case "Admin":
            console.log("Navigating to Admin Dashboard");
            navigate("/Dashboard");
            break;
          default:
            setError("Unauthorized role");
            onLogin(false);
        }
      } else {
        setError(response.data.message);
        setShowErrorModal(true);
        onLogin(false);
      }
    } catch (error) {
      console.error("Login error:", error.response || error.message);
      setError("Login failed. Please check your credentials.");
      setShowErrorModal(true);
      onLogin(false);
    }
  };

  const handleImageLoad = () => {
    setBackgroundImageLoaded(true);
    setLogoImageLoaded(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="Login-container">
      <div
        className="left-ppanel"
        style={{
          backgroundImage: `url(${backgroundImageLoaded ? `${process.env.PUBLIC_URL}/images/Login.webp` : `${process.env.PUBLIC_URL}/images/Login.webp`})`,
        }}
      ></div>
      <div className="right-ppanel">
        <img
          src={`${process.env.PUBLIC_URL}/images/logo.webp`}
          alt="Midland Logo"
          className="logo-img"
          onLoad={handleImageLoad}
          loading="lazy"
        />
        <h2 className="cug-title border-bottom">CUG MANAGEMENT SYSTEM</h2>
        <h3 className="h-2 mb-3">
          <i className="bi bi-person-check"></i> User Login
        </h3>
        <form onSubmit={handleLogin} className="form-cs">
          <label className="my-lebel">
            <PersonFill className="m-1" />
            User Code
            <input
              className="my-input"
              type="text"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              required
              placeholder="Enter User Code"
            />
          </label>
       
          <label className="my-lebel">
            <UnlockFill className="m-1" />
            Password
            <input
              className="my-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter Password"
            
            />
            <span
              className="password-toggle-icon"
              onClick={togglePasswordVisibility}
            >
              {showPassword ?<Eye />  : <EyeSlash />}
            </span>
          </label>


          <button type="submit" className="login-btn pe-3">
            Login <BoxArrowInRight />
          </button>
          <a href="/forget-password" className="forgetpas">
            <InfoCircle className="m-1" />
            Forgot password?
          </a>
        </form>
      </div>

      <LoginErrorModal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
};

export default Login;