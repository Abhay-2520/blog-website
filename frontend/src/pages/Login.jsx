import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import "./login.css";

function Login() {
  const { isAuthenticated, setIsAuthenticated, setProfile } = useAuth();

  const navigateTo = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:4001/api/users/login",
        { email, password, role },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      // Store the token in localStorage
      localStorage.setItem("jwt", data.token); // storing token in localStorage so that if user refreshed the page it will not redirect again in login
      toast.success(data.message || "User Logined successfully", {
        duration: 3000,
      });
      setProfile(data);
      setIsAuthenticated(true);
      setEmail("");
      setPassword("");
      setRole("");
      navigateTo("/");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message || "Please fill the required fields",
        {
          duration: 3000,
        }
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <form onSubmit={handleLogin}>
          <div className="logo-title">
            Cilli<span>Blog</span>
          </div>

          <h1>Login</h1>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-field"
          >
            <option value="">Select Role</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>

          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />

          <input
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />

          <p>
            New User? <Link to="/register">Register Now</Link>
          </p>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
