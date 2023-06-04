import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword } from "../../backend/firebase";
import "./Login.css";

import lockIcon from "../../assets/lock.svg";
import mailIcon from "../../assets/mail.svg";

interface LoginProps {
  setUserId: React.Dispatch<React.SetStateAction<string>>;
}

function Login({ setUserId }: LoginProps) {
  const [currentInput, setCurrentInput] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  async function loginAccount() {
    try {
      const userInfo = await signInWithEmailAndPassword(auth, email, password);
      setUserId(userInfo.user.uid);
    } catch (error) {
      console.log(error);
    }
  }

  function handleSubmit() {
    loginAccount();
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
        <div className="submit-container">
          <button className="submit-button" type="submit">
            Login
          </button>
        </div>
      </form>
      <footer className="footer-container">
        Don't have an account?{" "}
        <span className="login-text" onClick={() => navigate("/signup")}>
          Sign up
        </span>
      </footer>
    </div>
  );
}

export default Login;
