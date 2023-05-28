import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">Travlr</h1>
      <ul className="navbar-links">
        <NavLink to="/favourites" className="navbar-element">
          Favourites
        </NavLink>
        <NavLink end to="/" className="navbar-element">
          Home
        </NavLink>
        <NavLink to="/signin" className="navbar-element">
          Sign in
        </NavLink>
      </ul>
    </nav>
  );
}

export default Navbar;
