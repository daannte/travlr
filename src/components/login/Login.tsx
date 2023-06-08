import { auth, signInWithEmailAndPassword } from "../../backend/firebase";
import { useForm } from "react-hook-form";
import { useState } from "react";
import "./Login.css";

import mailIcon from "../../assets/mail.svg";
import lockIcon from "../../assets/lock.svg";

interface IFormInputs {
  email: string;
  password: string;
}

interface LoginProps {
  setLoginPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setSignupPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

function Login({ setLoginPopup, setSignupPopup }: LoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function onSubmit(data: IFormInputs) {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      setLoginPopup(false);
    } catch (error) {
      setErrorMessage("Invalid password or email!");
    }
  }

  return (
    <>
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="input-login-container">
          <img src={mailIcon} alt="Mail" className="login-input-icon" />
          <input
            className="login-input"
            type="email"
            placeholder="EMAIL"
            autoComplete="off"
            {...register("email", {
              required: true,
            })}
          />
        </div>
        <div className="input-login-container">
          <img src={lockIcon} alt="Lock" className="login-input-icon" />
          <input
            className="login-input"
            type="password"
            placeholder="PASSWORD"
            autoComplete="off"
            {...register("password", {
              required: true,
            })}
          />
        </div>
        <div className="login-submit-container">
          <button className="login-submit-button" type="submit">
            Login
          </button>
        </div>
        <span className="login-error">
          {errorMessage && errorMessage}
          {(errors.email || errors.password) &&
            !errorMessage &&
            "email and password required!"}
        </span>
      </form>
      <footer className="login-footer">
        Don't have an account?{" "}
        <span
          className="login-footer-span"
          onClick={() => {
            setLoginPopup(false);
            setSignupPopup(true);
          }}
        >
          Sign up
        </span>
      </footer>
    </>
  );
}

export default Login;
