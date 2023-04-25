import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <h1 className="navbar-title">Travlr</h1>
            <ul className="navbar-links">
                <li className="navbar-element">Home</li>
                <li className="navbar-element">Sign in</li>
            </ul>
        </nav>
    );
}

export default Navbar;
