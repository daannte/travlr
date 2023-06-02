import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, onAuthStateChanged, signOut } from "../../backend/firebase";
import menuIcon from "../../assets/menu.svg";
import closeIcon from "../../assets/close.svg";
import userIcon from "../../assets/user.svg";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            <button className="loggedin-user-button navbar-element">
              <img src={userIcon} alt="User" className="loggedin-user-icon" />
            </button>
            <div className="signout-container">
              <button
                className="navbar-element signout-button"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </div>
          </>
        )}
        {!isLoggedIn && (
          <NavLink
            to="/login"
            className="navbar-element"
            onClick={handleMenuClick}
          >
            Login
          </NavLink>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
