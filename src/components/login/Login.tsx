import { useState } from "react";
import lockIcon from "../../assets/lock.svg";
import mailIcon from "../../assets/mail.svg";
import "./Login.css";

function Login() {
  const [currentInput, setCurrentInput] = useState<string>("");

  return (
    <div className="login-container">
      <div className="login-title-container">
        <h2 className="login-title">Login</h2>
        <p>Sign in to continue.</p>
      </div>
      <form className="login-form-container">
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
        <div className="submit-container">
          <button className="submit-button" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
