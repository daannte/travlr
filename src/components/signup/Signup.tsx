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

interface IFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

interface Props {
  setLoginPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setSignupPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

function Signup({ setLoginPopup, setSignupPopup }: Props) {
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
      console.log(error);
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
      <h2 className="signup__title">Create Account</h2>
      <form className="signup__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="signup__input-container">
          <img src={mailIcon} alt="Mail" className="signup__mail-icon" />
          <input
            className="signup__input"
            type="email"
            placeholder="EMAIL"
            autoComplete="off"
            {...register("email", {
              required: true,
              onChange: () => setErrorMessage(""),
            })}
          />
        </div>
        {(errorMessage || errors.email) && (
          <span className="signup__error">
            {errorMessage ? errorMessage : errors.email && "Email is required"}
          </span>
        )}
        <div className="signup__input-container">
          <img src={lockIcon} alt="Lock" className="signup__password-icon" />
          <input
            className="signup__input-password"
            type="password"
            placeholder="PASSWORD"
            autoComplete="off"
            {...register("password", {
              required: true,
              validate: (val: string) => {
                if (val.length < 6) {
                  return "Password must be longer than 6 characters";
                }
              },
            })}
          />
        </div>
        <div className="signup__input-container">
          <img src={lockIcon} alt="Lock" className="signup__password-icon" />
          <input
            className="signup__input-confirm"
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
        <span className="signup__error">
          {errors.password
            ? errors.password.message || "Password is required"
            : errors.confirmPassword
            ? errors.confirmPassword.message || "Confirm password is required"
            : ""}
        </span>
        <button className="signup__submit-button" type="submit">
          Sign up
        </button>
      </form>
      <footer className="signup__footer">
        Already have an account?{" "}
        <span
          className="signup__footer-span"
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
