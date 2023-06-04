import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth, onAuthStateChanged, signOut } from "../../backend/firebase";
import "./Navbar.css";

import menuIcon from "../../assets/menu.svg";
import closeIcon from "../../assets/close.svg";

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
            <div className="navbar-element">
              <button className="signout-button" onClick={handleSignOut}>
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
