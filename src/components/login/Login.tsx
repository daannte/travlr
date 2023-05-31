import { useState } from "react";
import { useNavigate } from "react-router-dom";
import lockIcon from "../../assets/lock.svg";
import mailIcon from "../../assets/mail.svg";
import "./Login.css";

function Login() {
  const [currentInput, setCurrentInput] = useState<string>("");
  const navigate = useNavigate();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/");
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form-container" onSubmit={handleSubmit}>
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
      <footer className="footer-container">
        Don't have an account?{" "}
        <span className="signup-text" onClick={() => navigate("/signup")}>
          Sign up
        </span>
      </footer>
    </div>
  );
}

export default Login;
