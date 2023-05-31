import { NavLink } from "react-router-dom";
import menuIcon from "../../assets/menu.svg";
import closeIcon from "../../assets/close.svg";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);

  function handleMenuClick() {
    setIsMenuOpened(!isMenuOpened);
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
        <NavLink
          to="/saved"
          className="navbar-element"
          onClick={handleMenuClick}
        >
          Saved
        </NavLink>
        <NavLink
          to="/login"
          className="navbar-element"
          onClick={handleMenuClick}
        >
          Login
        </NavLink>
      </ul>
    </nav>
  );
}

export default Navbar;
