import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import searchIcon from "../../assets/search.svg";
import calendarIcon from "../../assets/calendar.svg";
import phoneIll from "../../assets/phoneIll.svg";
import "./Home.css";

interface ActivityDetails {
  startTime: string;
  endTime: string;
  name: string;
}

interface ActivityList {
  date: string;
  activities: ActivityDetails[];
}

interface HomeProps {
  setDestination: React.Dispatch<React.SetStateAction<string>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  startDate: Date | null;
  endDate: Date | null;
  setActivityList: React.Dispatch<React.SetStateAction<ActivityList[]>>;
  destination: string;
  savedDests: string[];
}

function Home({
  setDestination,
  setStartDate,
  setEndDate,
  startDate,
  endDate,
  setActivityList,
  destination,
  savedDests,
}: HomeProps) {
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !savedDests.includes(destination) &&
      startDate !== null &&
      endDate !== null
    ) {
      const newActivityList: ActivityList[] = [];
      const currentDate = new Date(startDate);
      // Set the time to end of the day so the last day gets added
      endDate.setHours(23, 59, 59);

      while (currentDate <= endDate) {
        const date = currentDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        });

        const activities = [
          { startTime: "Start", endTime: "End", name: "Activity Name" },
        ];
        newActivityList.push({ date, activities });
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setActivityList(newActivityList);
    }
    navigate("/planner");
  };

  useEffect(() => {
    setStartDate(null);
    setEndDate(null);
  }, [setStartDate, setEndDate]);

  return (
    <div className="home-container">
      <div className="home-search-container">
        <h1 className="title">Plan your next vacation.</h1>
        <p>Enter your destination:</p>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="search-box-container">
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
          </div>
          <div className="date-select-container">
            <div className="calendar-button-container">
              <img
                src={calendarIcon}
                alt="calendar"
                className="calendar-icon"
              />
              <DatePicker
                className="calendar-button"
                selected={startDate}
                onChange={(date: Date) => setStartDate(date)}
                placeholderText="Start Date"
                startDate={startDate}
                endDate={endDate}
                monthsShown={2}
                dateFormat="MMMM d, yyyy"
                onKeyDown={(e) => e.preventDefault()}
                required
                selectsStart
              />
            </div>
            <div className="calendar-button-container">
              <img
                src={calendarIcon}
                alt="calendar"
                className="calendar-icon"
              />
              <DatePicker
                className="calendar-button"
                selected={endDate}
                onChange={(date: Date) => setEndDate(date)}
                placeholderText="End Date"
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                monthsShown={2}
                dateFormat="MMMM d, yyyy"
                onKeyDown={(e) => e.preventDefault()}
                required
                selectsEnd
              />
            </div>
          </div>
        </form>
      </div>
      <img src={phoneIll} alt="phone" className="phone-image" />
    </div>
  );
}

export default Home;
