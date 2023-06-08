import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, onAuthStateChanged, signOut } from "../../backend/firebase";
import "./Navbar.css";

import menuIcon from "../../assets/menu.svg";
import closeIcon from "../../assets/close.svg";
import Login from "../login/Login";
import Signup from "../signup/Signup";

function Navbar() {
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginPopup, setLoginPopup] = useState<boolean>(false);
  const [signupPopup, setSignupPopup] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  function handleMenuClick() {
    setIsMenuOpened(!isMenuOpened);
  }

  async function handleSignOut() {
    await signOut(auth);
  }

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Travlr</h1>
      <button className="nav-icon" onClick={handleMenuClick}>
        <img src={isMenuOpened ? closeIcon : menuIcon} alt="Menu" />
      </button>
      <ul className={`navbar-links ${isMenuOpened ? "active" : ""}`}>
        <NavLink
          end
          to="/"
          className="navbar-element"
          onClick={handleMenuClick}
        >
          Home
        </NavLink>
        {isLoggedIn && (
          <>
            <NavLink
              to="/saved"
              className="navbar-element"
              onClick={handleMenuClick}
            >
              Saved
            </NavLink>
            <button
              className="signout-button navbar-element"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </>
        )}
        {!isLoggedIn && (
          <button
            className="navbar-element login-button"
            onClick={() => {
              setLoginPopup(!loginPopup);
              handleMenuClick();
            }}
          >
            Login To Save
          </button>
        )}
      </ul>
      {(loginPopup || signupPopup) && (
        <>
          <div className="blur-around-popup" />
          <div className="login-signup-popup">
            <button
              className="close-popup"
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
