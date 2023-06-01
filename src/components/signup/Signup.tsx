import { useState } from "react";
import { useNavigate } from "react-router-dom";
import lockIcon from "../../assets/lock.svg";
import mailIcon from "../../assets/mail.svg";
import "./Signup.css";

function Signin() {
  const [currentInput, setCurrentInput] = useState<string>("");
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/");
  }

  return (
    <div className="signup-container">
      <h2 className="signup-title">Create Account</h2>
      <form className="signup-form-container" onSubmit={handleSubmit}>
        <div className="input-container">
          <img src={mailIcon} className="input-icon" />
          <input
            className={`info-input ${currentInput === "email" ? "active" : ""}`}
            type="text"
            name="username"
            placeholder="EMAIL"
            required
            autoComplete="off"
            onFocus={() => setCurrentInput("email")}
            onBlur={() => setCurrentInput("")}
          />
        </div>
        <div className="input-container">
          <img src={lockIcon} className="input-icon" />
          <input
            className={`info-input ${
              currentInput === "password" ? "active" : ""
            }`}
            type="password"
            name="password"
            placeholder="PASSWORD"
            required
            autoComplete="off"
            onFocus={() => setCurrentInput("password")}
            onBlur={() => setCurrentInput("")}
          />
        </div>
        <div className="input-container">
          <img src={lockIcon} className="input-icon" />
          <input
            className={`info-input ${
              currentInput === "confirmPassword" ? "active" : ""
            }`}
            type="password"
            name="password"
            placeholder="CONFIRM PASSWORD"
            required
            autoComplete="off"
            onFocus={() => setCurrentInput("confirmPassword")}
            onBlur={() => setCurrentInput("")}
          />
        </div>
        <div className="submit-container">
          <button className="submit-button" type="submit">
            Signup
          </button>
        </div>
      </form>
      <footer className="footer-container">
        Already have an account?{" "}
        <span className="signup-text" onClick={() => navigate("/login")}>
          Login
        </span>
      </footer>
    </div>
  );
}

export default Signin;
