import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import searchIcon from "../../assets/search.svg";
import calendarIcon from "../../assets/calendar.svg";
import phoneIll from "../../assets/phoneIll.svg";
import "./Home.css";

interface HomeProps {
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  startDate: Date | null;
  endDate: Date | null;
}

function Home({
  setDestination,
  setStartDate,
  setEndDate,
  startDate,
  endDate,
}: HomeProps) {
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate("/planner");
  };

  return (
    <div className="home-container">
      <div className="home-search-container">
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
          <button type="submit" className="search-button">
            <img src={searchIcon} alt="Search" className="search-icon" />
          </button>
        </form>
        <div className="date-select-container">
          <div className="calendar-button-container">
            <img src={calendarIcon} alt="calendar" className="calendar-icon" />
            <DatePicker
              className="calendar-button"
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              placeholderText="Start Date"
              startDate={startDate}
              endDate={endDate}
              monthsShown={2}
              selectsStart
              dateFormat="MMMM d, yyyy"
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>

          <div className="calendar-button-container">
            <img src={calendarIcon} alt="calendar" className="calendar-icon" />
            <DatePicker
              className="calendar-button"
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              placeholderText="End Date"
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              monthsShown={2}
              selectsEnd
              dateFormat="MMMM d, yyyy"
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>
        </div>
      </div>

      <img src={phoneIll} alt="phone" className="phone-image" />
    </div>
  );
}

export default Home;
