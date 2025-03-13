import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent page reload
  
    try {
      const response = await fetch("http://localhost:5000/users"); // Fetch users data
      const users = await response.json();
  
      const user = users.find((u) => u.email === email && u.password === password);
  
      if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user)); // Store user session
        localStorage.setItem("isAuthenticated", "true"); // Persist authentication
  
        setIsAuthenticated(true); // Update authentication state
        navigate("/home"); // Redirect to homepage
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again later.");
    }  
  };

  return (
    <div className="login-body">
    <div className="login-page">
      <div className="modal is-open">
        <div className="modal-container">
          <div className="modal-left">
            <h1 className="modal-title">Welcome!</h1>
            <p className="modal-desc">
              Ready to test your vocabulary? Login to start playing Wordle!
            </p>
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
              <a href="#">Forgot your password?</a>
              <button className="input-button" onClick={handleLogin}>Login</button>
            </div>
            <p className="sign-up">
              Don't have an account? <a onClick={() => navigate("/register")}>Sign up now</a>
            </p>
          </div>

          <div className="modal-right">
            <img 
              src="https://media.istockphoto.com/id/1309055046/photo/wooden-cut-alphabet-letters-on-orange-background-spelling-the-word-hello.jpg?s=612x612&w=0&k=20&c=ZsuX77Y3MlCeqOJfEmZsrvTk8JvLIy_u9r73WYGY24M="
              alt="Login"
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
