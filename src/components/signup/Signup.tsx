import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "../../backend/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import "./Signup.css";

import lockIcon from "../../assets/lock.svg";
import mailIcon from "../../assets/mail.svg";
import { useState } from "react";

interface IFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  date: string;
  activities: ActivityDetails[];
}

interface SigninProps {
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  activityList: ActivityList[];
}

function Signin({ setUserId, activityList }: SigninProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInputs>();
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function createAccount(email: string, password: string) {
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

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    const methods = await fetchSignInMethodsForEmail(auth, data.email);
    if (data.password === data.confirmPassword && methods.length === 0) {
      createAccount(data.email, data.password);
      activityList.length !== 0 ? navigate("/planner") : navigate("/");
    } else if (methods.length > 0) {
      setErrorMessage("Email already exists!");
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Create Account</h2>
      <form className="signup-form-container" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <img src={mailIcon} className="input-icon" />
          <input
            className="info-input"
            type="text"
            placeholder="EMAIL"
            autoComplete="off"
            {...register("email", {
              required: true,
              onChange: () => setErrorMessage(""),
            })}
          />
        </div>
        <div className="input-container">
          <img src={lockIcon} className="input-icon" />
          <input
            className="info-input"
            type="password"
            placeholder="PASSWORD"
            autoComplete="off"
            {...register("password", {
              required: true,
            })}
          />
        </div>
        <div className="input-container">
          <img src={lockIcon} className="input-icon" />
          <input
            className="info-input"
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
              ((errors.email || errors.password) &&
                "email and password required!")}{" "}
        </span>
        <div className="submit-container">
          <button className="submit-button" type="submit">
            Signup
          </button>
        </div>
      </form>
      <footer className="footer-container">
        Already have an account?{" "}
        <Link to="/login" className="signup-text">
          Login
        </Link>
      </footer>
    </div>
  );
}

export default Signin;
