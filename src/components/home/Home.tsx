import { useNavigate } from "react-router-dom";
import searchIcon from "../../assets/search.svg";
import "./Home.css";

interface HomeProps {
  setDestination: React.Dispatch<React.SetStateAction<string>>;
}

function Home({ setDestination }: HomeProps) {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/planner");
  };

  return (
    <div className="home-container">
      <h1 className="title">Plan your next vacation.</h1>
      <p>Enter your destination:</p>
      <form onSubmit={handleSubmit} className="form-container">
        <input
          className="search-box"
          name="destination"
          type="text"
          placeholder="e.g Barcelona"
          onChange={(e) => setDestination(e.target.value)}
          required
          autoComplete="off"
        />
        <button type="submit" className="search-icon">
          <img src={searchIcon} alt="Search" />
        </button>
      </form>
    </div>
  );
}

export default Home;
