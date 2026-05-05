import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import "./register.css";

function Register() {
  const { isAuthenticated, setIsAuthenticated, setProfile } = useAuth();

  const navigateTo = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [education, setEducation] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");

  const changePhotoHandler = (e) => {
    console.log(e);
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setPhoto(file);
    };
  };

  const handleRegister = async (e) => {
  e.preventDefault();

  if (!name || !email || !password || !role) {
    toast.error("Please fill all required fields");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("password", password);
  formData.append("role", role);
  formData.append("education", education);
  formData.append("photo", photo);

  try {
    const { data } = await axios.post(
      "https://blog-website-1-akze.onrender.com/api/users/register",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    localStorage.setItem("token", data.token);

    toast.success(data.message);
    setProfile(data);
    setIsAuthenticated(true);

    navigateTo("/");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Registration failed");
  }
};
  return (
    <div className="register-page">
      <div className="register-box">
        <form onSubmit={handleRegister}>
          <div className="register-title">
            Cilli<span>Blog</span>
          </div>

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Select Role</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="number"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          >
            <option value="">Select Your Education</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
            <option value="MBA">MBA</option>
            <option value="BBA">BBA</option>
          </select>

          <div className="flex items-center mb-4">
            <div className="photo-preview">
              <img
                src={photoPreview || "https://via.placeholder.com/80"}
                alt="preview"
              />
            </div>
            <input type="file" onChange={changePhotoHandler} />
          </div>

          <p>
            Already registered? <Link to="/login">Login Now</Link>
          </p>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
