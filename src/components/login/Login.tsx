import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "../../backend/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import "./Login.css";

import lockIcon from "../../assets/lock.svg";
import mailIcon from "../../assets/mail.svg";

interface IFormInputs {
  email: string;
  password: string;
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

interface LoginProps {
  setUserId: React.Dispatch<React.SetStateAction<string>>;
  activityList: ActivityList[];
}

function Login({ setUserId, activityList }: LoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        if (activityList.length !== 0) {
          navigate("/planner");
        } else {
          navigate("/");
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate, setUserId, activityList]);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      const userInfo = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      setUserId(userInfo.user.uid);
    } catch (error: unknown) {
      setErrorMessage("Invalid password or email!");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form-container" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <img src={mailIcon} className="input-icon" />
          <input
            className="info-input"
            type="email"
            placeholder="EMAIL"
            autoComplete="off"
            {...register("email", {
              required: true,
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
        <span className="login-error">
          {errorMessage && errorMessage}
          {(errors.email || errors.password) &&
            !errorMessage &&
            "email and password required!"}
        </span>
        <div className="submit-container">
          <button className="submit-button" type="submit">
            Login
          </button>
        </div>
      </form>
      <footer className="footer-container">
        Don't have an account?{" "}
        <Link to="/signup" className="login-text">
          Sign up
        </Link>
      </footer>
    </div>
  );
}

export default Login;
