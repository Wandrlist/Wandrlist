import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import wandrlist_logo from '../../Images/wandrlist_logo.png'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkCookie = async () => {
    const response =  await axios.get("api/login");
    console.log(response);
    if (response.data !== 'NOT A USER') {
      if (response) navigate("/welcome", { replace: true, state: { email: response.data.email, itineraries: response.data.itineraries } });
    }
  };
  
  useEffect(() => {
    checkCookie();
  }, [])


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
      if (response.data !== 'NOT A USER') {
        if (response) navigate("/welcome", { replace: true, state: { email: response.data.email, itineraries: response.data.itineraries } });
      };
    } catch (error) {
      setError("Invalid Email or Password");
      console.log("error: ", error);
    }
  };

  return (
    <div className="loginPage">
      {/* <div>WandrList</div> */}
      <img src={wandrlist_logo} alt="wandrlist-logo"/>

      <div className="loginContainer">
        <div>
          <div className="errorLogin">{error}</div>
          <form className="loginForm" onSubmit={handleLogin}>
            <input
              type="email"
              id="inputStyle"
              placeholder="Enter Email: "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              type="password"
              id="inputStyle"
              placeholder="Enterr Password: "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button>Login</button>
          </form>
          <div className="noAccount">
            Don't have an account?
            <br />
            <Link to="/signup" className="underline text-tertiary-500">
              Sign up!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}