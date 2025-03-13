import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css"; 

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();

      if (users.find((u) => u.email === email)) {
        setError("User already exists.");
        return;
      }

      const newUser = { email, password };
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      navigate("/"); // Redirect to login page after signup
    } catch (err) {
      console.error("Register error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="login-body">
    <div className="login-page">
      <div className="modal is-open">
        <div className="modal-container">
          <div className="modal-left">
            <h1 className="modal-title">Sign Up</h1>
            <p className="modal-desc">Create an account to play Wordle!</p>
            <div className="input-block">
              <label htmlFor="email" className="input-label">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-block">
              <label htmlFor="password" className="input-label">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="modal-buttons">
              <button className="input-button" onClick={handleRegister}>Sign Up</button>
            </div>
            <p className="sign-up">
              Already have an account? <a onClick={() => navigate("/")}>Login</a>
            </p>
          </div>

          <div className="modal-right">
            <img 
              src="https://media.istockphoto.com/id/1309055046/photo/wooden-cut-alphabet-letters-on-orange-background-spelling-the-word-hello.jpg?s=612x612&w=0&k=20&c=ZsuX77Y3MlCeqOJfEmZsrvTk8JvLIy_u9r73WYGY24M="
              alt="Sign Up"
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default RegisterPage;
