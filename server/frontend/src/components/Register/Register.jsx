import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering...", { userName, firstName, lastName, email });
  };

  return (
    <div className="register_container">
      <div className="header" style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
          <span className="text" style={{flexGrow:"1"}}>Sign Up</span>
      </div>
      <form onSubmit={handleRegister}>
        <div className="inputs">
          <div className="input">
            <input type="text" name="username" placeholder="Username" onChange={(e) => setUserName(e.target.value)} required />
          </div>
          <div className="input">
            <input type="text" name="first_name" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="input">
            <input type="text" name="last_name" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div className="input">
            <input type="email" name="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input">
            <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>
        <div className="submit_panel">
          <button className="submit" type="submit">Register</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
