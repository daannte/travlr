import {
  auth,
  fetchSignInMethodsForEmail,
  createUserWithEmailAndPassword,
} from "../../backend/firebase";
import { useForm } from "react-hook-form";
import { useState } from "react";
import "./Signup.css";

import mailIcon from "../../assets/mail.svg";
import lockIcon from "../../assets/lock.svg";
import { AuthErrorCodes } from "firebase/auth";

interface IFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginProps {
  setLoginPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setSignupPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

function Signup({ setLoginPopup, setSignupPopup }: LoginProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInputs>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function createAccount(email: string, password: string) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      if (error === AuthErrorCodes.WEAK_PASSWORD) {
        setErrorMessage("Password must be longer than 6 characters!");
      }
    }
  }

  async function onSubmit(data: IFormInputs) {
    const methods = await fetchSignInMethodsForEmail(auth, data.email);
    if (data.password === data.confirmPassword && methods.length === 0) {
      createAccount(data.email, data.password);
      setSignupPopup(false);
    } else if (methods.length > 0) {
      setErrorMessage("Email already exists!");
    }
  }

  return (
    <>
      <h2 className="signup-title">Create Account</h2>
      <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-signup-container">
          <img src={mailIcon} alt="Mail" className="signup-input-icon" />
          <input
            className="signup-input"
            type="email"
            placeholder="EMAIL"
            autoComplete="off"
            {...register("email", {
              required: true,
              onChange: () => setErrorMessage(""),
            })}
          />
        </div>
        <div className="input-signup-container">
          <img src={lockIcon} alt="Lock" className="signup-input-icon" />
          <input
            className="signup-input-password"
            type="password"
            placeholder="PASSWORD"
            autoComplete="off"
            {...register("password", {
              required: true,
            })}
          />
        </div>
        <div className="input-signup-container">
          <img src={lockIcon} alt="Lock" className="signup-input-icon" />
          <input
            className="signup-input-confirm"
            type="password"
            placeholder="CONFIRM PASSWORD"
            autoComplete="off"
            {...register("confirmPassword", {
              required: true,
              validate: (val: string) => {
                if (watch("password") !== val) {
                  return "Passwords don't match!";
                }
              },
            })}
          />
        </div>
        <span className="login-error">
          {errorMessage
            ? errorMessage
            : (errors.confirmPassword && errors.confirmPassword.message) ||
              ((errors.email || errors.password || errors.confirmPassword) &&
                "email and password required!")}
        </span>
        <button className="signup-submit-button" type="submit">
          Sign up
        </button>
      </form>
      <footer className="signup-footer">
        Already have an account?{" "}
        <span
          className="signup-footer-span"
          onClick={() => {
            setLoginPopup(true);
            setSignupPopup(false);
          }}
        >
          Login
        </span>
      </footer>
    </>
  );
}

export default Signup;
