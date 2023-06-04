import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, createUserWithEmailAndPassword } from "../../backend/firebase";
import "./Signup.css";

import lockIcon from "../../assets/lock.svg";
import mailIcon from "../../assets/mail.svg";

interface SigninProps {
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}

function Signin({ setUserId }: SigninProps) {
  const [currentInput, setCurrentInput] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const navigate = useNavigate();

  async function createAccount() {
    try {
      const userInfo = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUserId(userInfo.user.uid);
    } catch (error) {
      console.log(error);
    }
  }

  function handleSubmit() {
    if (password === confirmPassword) {
      createAccount();
    }
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
            onChange={(event) => setEmail(event.target.value)}
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
            onChange={(event) => setPassword(event.target.value)}
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
            onChange={(event) => setConfirmPassword(event.target.value)}
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
