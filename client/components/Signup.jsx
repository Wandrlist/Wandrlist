import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/signup", {
        email,
        password,
      });
      console.log(response);
      if (response.data) navigate("/welcome", { replace: true, state: { email, itineraries: [] }});
    } catch (error) {
      setError("Can't Signup");
      console.log("error: ", error);
    }
  };

  return (
    <div className="signupPage">
      <div className="signupContainer">
        <div>
          <div className="errorSignup">{error}</div>
          <form className="signupForm" onSubmit={handleSignup}>
            <input
              type="email"
              id="inputStyle"
              placeholder="Enter New Email: "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              type="password"
              id="inputStyle"
              placeholder="Enter New Password: "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button>Signup</button>
          </form>
          <div className="goBackLogin">
            Have an existing account? <br />
            <Link to="/" className="underline text-tertiary-500">
              Login!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
