import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, onAuthStateChanged, signOut } from "../../backend/firebase";
import "./Navbar.css";

import closeIcon from "../../assets/close.svg";
import Login from "../login/Login";
import Signup from "../signup/Signup";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginPopup, setLoginPopup] = useState<boolean>(false);
  const [signupPopup, setSignupPopup] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  async function handleSignOut() {
    await signOut(auth);
  }

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__title">
        Travlr
      </NavLink>
      <ul className="navbar__links">
        {isLoggedIn && (
          <>
            <NavLink to="/saved" className="navbar__element">
              Saved
            </NavLink>
            <button
              className="navbar__element navbar__signout-button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </>
        )}
        {!isLoggedIn && (
          <button
            className="navbar__element navbar__login-button"
            onClick={() => {
              setLoginPopup(!loginPopup);
            }}
          >
            Login to Save
          </button>
        )}
      </ul>
      {(loginPopup || signupPopup) && (
        <>
          <div className="login-signup-modal__blur" />
          <div className="login-signup-modal">
            <button
              className="login-signup-modal__close-button"
              onClick={() => {
                setSignupPopup(false);
                setLoginPopup(false);
              }}
            >
              <img src={closeIcon} alt="Close" />
            </button>
            {loginPopup && (
              <Login
                setLoginPopup={setLoginPopup}
                setSignupPopup={setSignupPopup}
              />
            )}
            {signupPopup && (
              <Signup
                setLoginPopup={setLoginPopup}
                setSignupPopup={setSignupPopup}
              />
            )}
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
