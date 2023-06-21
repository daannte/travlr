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

interface Props {
  setLoginPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setSignupPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

function Login({ setLoginPopup, setSignupPopup }: Props) {
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
      <h2 className="login__title">Login</h2>
      <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
        <div className="login__input-container">
          <img src={mailIcon} alt="Mail" className="login__mail-icon" />
          <input
            className="login__input"
            type="email"
            placeholder="EMAIL"
            autoComplete="off"
            {...register("email", {
              required: true,
              onChange: () => setErrorMessage(""),
            })}
          />
        </div>
        <div className="login__input-container">
          <img src={lockIcon} alt="Lock" className="login__password-icon" />
          <input
            className="login__input-password"
            type="password"
            placeholder="PASSWORD"
            autoComplete="off"
            {...register("password", {
              required: true,
              onChange: () => setErrorMessage(""),
            })}
          />
        </div>
        <span className="login__error">
          {errorMessage && errorMessage}
          {(errors.email || errors.password) &&
            !errorMessage &&
            "email and password required!"}
        </span>
        <button className="login__submit-button" type="submit">
          Login
        </button>
      </form>
      <footer className="login__footer">
        Don't have an account?{" "}
        <span
          className="login__footer-span"
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
