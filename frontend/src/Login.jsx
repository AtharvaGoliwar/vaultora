import React, { useContext, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./context/userContext";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { username, setUsername } = useContext(UserContext);

  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post("http://localhost:8080/auth", {
        username: formData.username,
        password: formData.password,
      });
      if (res.data.status === "Authenticated") {
        console.log("Form submitted:", formData);
        setUsername(formData.username);
        navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
    }
    // Add your authentication logic here
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: "", password: "" });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="brand-title">DataVault</h1>
          <h2 className="login-title">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>
        </div>

        <div className="login-form">
          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="login-input"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="login-input"
            />
          </div>

          <button onClick={handleSubmit} className="login-button">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </div>

        <div className="login-footer">
          <span className="toggle-text">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button onClick={toggleMode} className="toggle-button">
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
