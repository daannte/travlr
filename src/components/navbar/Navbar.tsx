import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { auth, onAuthStateChanged, signOut } from "../../backend/firebase";
import { PlannerContext } from "../../App";
import "./Navbar.css";

import closeIcon from "../../assets/close.svg";
import arrowLeftIcon from "../../assets/arrow-left.svg";
import mapIcon from "../../assets/map.svg";
import Login from "../login/Login";
import Signup from "../signup/Signup";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loginPopup, setLoginPopup] = useState<boolean>(false);
  const [signupPopup, setSignupPopup] = useState<boolean>(false);
  const location = useLocation();
  const { currentPlanner } = useContext(PlannerContext);

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
        <img src={mapIcon} />
      </NavLink>
      <ul className="navbar__links">
        {isLoggedIn && (
          <>
            {location.pathname !== "/trips" && (
              <>
                <NavLink to="/trips" className="navbar__trips-button">
                  <img src={arrowLeftIcon} alt="Arrow Left" width="13px" />
                  <span className="navbar__trips-button-name">Trips</span>
                </NavLink>
                {currentPlanner.destination &&
                  location.pathname === "/planner" && (
                    <span>{currentPlanner.destination}</span>
                  )}
              </>
            )}

            <NavLink
              to="/"
              className="navbar__signout-button"
              onClick={handleSignOut}
            >
              Sign out
            </NavLink>
          </>
        )}
        {!isLoggedIn && (
          <button
            className="navbar__login-button"
            onClick={() => {
              setLoginPopup(!loginPopup);
            }}
          >
            Login
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
